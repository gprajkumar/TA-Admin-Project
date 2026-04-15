# app/permissions.py

from rest_framework.permissions import BasePermission
from .rbac import can_view, can_edit, can_delete


class ModuleRBACPermission(BasePermission):
    """
    Reusable permission class.

    Override in subclasses:
    - module_code
    - owner_field (optional)
    - owner_check(employee, obj) (optional)
    """
    module_code = None
    owner_field = None

    def owner_check(self, employee, obj):
        return False

    def _has_owner_check(self):
        return (
            self.owner_field is not None
            or self.__class__.owner_check is not ModuleRBACPermission.owner_check
        )

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if not self.module_code:
            return False

        method = request.method.upper()

        if method == "GET":
            return can_view(request.user, self.module_code)

        if method == "POST":
            return (
                can_edit(request.user, self.module_code)
                or can_edit(
                    request.user,
                    self.module_code,
                    obj=object(),  # placeholder: check edit_own_data permission exists
                    owner_check=lambda employee, obj: True,
                )
            )

        if method in ("PUT", "PATCH"):
            # allow through if user has edit or edit_own_data;
            # object-level check happens later
            return (
                can_edit(request.user, self.module_code)
                or can_edit(
                    request.user,
                    self.module_code,
                    obj=object(),  # placeholder path only for permission gate
                    owner_check=lambda employee, obj: True,
                )
            )

        if method == "DELETE":
            return (
                can_delete(request.user, self.module_code)
                or can_delete(
                    request.user,
                    self.module_code,
                    obj=object(),
                    owner_check=lambda employee, obj: True,
                )
            )

        return False

    def has_object_permission(self, request, view, obj):
        method = request.method.upper()

        if method == "GET":
            return can_view(request.user, self.module_code)

        if method in ("PUT", "PATCH"):
            return can_edit(
                request.user,
                self.module_code,
                obj=obj,
                owner_field=self.owner_field,
                owner_check=self.owner_check if self._has_owner_check() else None,
            )

        if method == "DELETE":
            return can_delete(
                request.user,
                self.module_code,
                obj=obj,
                owner_field=self.owner_field,
                owner_check=self.owner_check if self._has_owner_check() else None,
            )

        return False