# app/rbac.py

from functools import lru_cache
from ta_team.models.models import Employee, RolePermission


def get_employee(user):
    """
    Map authenticated Django user -> Employee.
    Your auth sets request.user.username from Azure token identity.
    """
    if not user or not user.is_authenticated:
        return None

    try:
        return Employee.objects.only("employee_id", "designation_id", "email_id").get(
            email_id=user.username
        )
    except Employee.DoesNotExist:
        return None


def _normalize_permission_name(name: str) -> str:
    return (name or "").strip().lower()


def _normalize_module_code(code: str) -> str:
    return (code or "").strip().lower()


def get_permission_set_for_employee(employee):
    """
    Returns a set like:
    {
        'requirements:view',
        'requirements:edit_own_data',
        'submissions:full_access',
    }
    """
    if not employee or not employee.designation_id:
        return set()

    qs = (
        RolePermission.objects
        .filter(designation_id=employee.designation_id)
        .select_related("module", "permission_type")
        .only(
            "designation_id",
            "module__module_code",
            "permission_type__permission_type_name",
        )
    )

    perms = set()
    for rp in qs:
        module_code = _normalize_module_code(rp.module.module_code)
        permission_name = _normalize_permission_name(rp.permission_type.permission_type_name)

        if module_code and permission_name:
            perms.add(f"{module_code}:{permission_name}")
    print(f'Permissions for employee_id={employee.employee_id}: {perms}')
    return perms


def get_user_permission_set(user):
    employee = get_employee(user)
    return get_permission_set_for_employee(employee)


def has_module_permission(user, module_code, action):
    """
    Checks:
    - module:full_access
    - module:action
    """
    if not user or not user.is_authenticated:
        return False

    module_code = _normalize_module_code(module_code)
    action = _normalize_permission_name(action)

    perms = get_user_permission_set(user)

    if f"{module_code}:full_access" in perms:
        return True

    return f"{module_code}:{action}" in perms


def has_own_permission(user, module_code, own_action, obj, owner_field=None, owner_check=None):
    """
    Supports either:
    - owner_field='assigned_recruiter_id'
    or
    - owner_check callable for custom logic
    """
    if not user or not user.is_authenticated:
        return False

    module_code = _normalize_module_code(module_code)
    own_action = _normalize_permission_name(own_action)

    if not has_module_permission(user, module_code, own_action):
        return False

    employee = get_employee(user)
    if not employee:
        return False

    if obj is None:
        return False

    if callable(owner_check):
        return bool(owner_check(employee, obj))

    if owner_field:
        return getattr(obj, owner_field, None) == employee.employee_id


    return False


def can_view(user, module_code):
    return has_module_permission(user, module_code, "view")


def can_edit(user, module_code, obj=None, owner_field=None, owner_check=None):
    if has_module_permission(user, module_code, "edit"):
        return True

    return has_own_permission(
        user=user,
        module_code=module_code,
        own_action="edit_own_data",
        obj=obj,
        owner_field=owner_field,
        owner_check=owner_check,
    )


def can_delete(user, module_code, obj=None, owner_field=None, owner_check=None):
    if has_module_permission(user, module_code, "delete"):
        return True

    return has_own_permission(
        user=user,
        module_code=module_code,
        own_action="delete_own_data",
        obj=obj,
        owner_field=owner_field,
        owner_check=owner_check,
    )