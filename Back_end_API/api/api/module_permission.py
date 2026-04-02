# app/module_permissions.py

from .permissions import ModuleRBACPermission
from .rbac import get_user_permission_set


class RequirementsPermission(ModuleRBACPermission):
    module_code = "requirements"

    def owner_check(self, employee, obj):
        # own data = assigned recruiter OR assigned sourcer
        return (
            getattr(obj, "assigned_recruiter_id", None) == employee.employee_id
            or getattr(obj, "assigned_sourcer_id", None) == employee.employee_id
        )


class SubmissionsPermission(ModuleRBACPermission):
    module_code = "submissions"

    def owner_check(self, employee, obj):
        return (
            getattr(obj, "recruiter_id", None) == employee.employee_id
            or getattr(obj, "sourcer_id", None) == employee.employee_id
        )


class ClientDashboardPermission(ModuleRBACPermission):
    module_code = "client_dashboard"
    def has_permission(self, request, view):
        perms = get_user_permission_set(request.user)

        if view.action in ["filter_dashboard", "filter_monthly_dashboard","filter_carryforwardroles_dashboard","get_Pipeline_CancelledCount",]:
            return (
                "client_dashboard:view" in perms or
                "client_dashboard:full_access" in perms
            )

        return "client_dashboard:full_access" in perms    


class RecruiterDashboardPermission(ModuleRBACPermission):
    module_code = "recruiter_dashboard"
    def has_permission(self, request, view):
        perms = get_user_permission_set(request.user)

        if view.action in ["recruiterDashboard", "AssignedRecruiterDetails"]:
            return (
                "recruiter_dashboard:view" in perms or
                "recruiter_dashboard:full_access" in perms
            )

        return "recruiter_dashboard:full_access" in perms    


class SourcerDashboardPermission(ModuleRBACPermission):
    module_code = "sourcer_dashboard"
    def has_permission(self, request, view):
        perms = get_user_permission_set(request.user)

        if view.action in ["sourcerdashboard", "AssignedRecruiterDetails"]:
            return (
                "sourcer_dashboard:view" in perms or
                "sourcer_dashboard:full_access" in perms
            )

        return "sourcer_dashboard:full_access" in perms    