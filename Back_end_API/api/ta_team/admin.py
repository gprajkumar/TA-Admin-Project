from django.contrib import admin
from .models.models import ReasonForLeaving,Account, AccountManager, AccountHead, AccountCoordinator, EndClient, Client, JobStatus, Screening_Status, Feedback, Holiday, Source, Role_Type, Tech_Screener, HiringManager, Designation, Department, Employee, RolePermission, Module, PermissionType # This imports everything from models.py and requirement.py
from django.contrib.auth.models import User
from .admin_form import CustomUserCreationForm
from django.contrib.auth.admin import UserAdmin
admin.site.site_header = "Talent Acquisition Admin"
admin.site.site_title = "TA Admin Portal"
admin.site.index_title = "Welcome to TA Management Portal"
    
class EmployeeAdmin(admin.ModelAdmin):
    exclude = ('user',)
    list_display = ('emp_code', 'emp_fName', 'email_id', 'department', 'designation', 'is_active')

# Register models

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "username",
                "email",
                "first_name",
                "last_name",
                "password1",
                "password2",
                "designation",
                "department"  # 👈 visible in admin
            ),
        }),
    )

    def save_model(self, request, obj, form, change):
        # attach designation temporarily for signal
        obj._designation = form.cleaned_data.get("designation")
        obj._department = form.cleaned_data.get("department")
        super().save_model(request, obj, form, change)
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

admin.site.register(Account)
admin.site.register(AccountManager)
admin.site.register(AccountHead)
admin.site.register(AccountCoordinator)
admin.site.register(EndClient)
admin.site.register(Client)
admin.site.register(JobStatus)
admin.site.register(Screening_Status)
admin.site.register(Feedback)
admin.site.register(Holiday)

admin.site.register(Source)
admin.site.register(Role_Type)

admin.site.register(Tech_Screener)
admin.site.register(HiringManager)
admin.site.register(Employee,EmployeeAdmin)
admin.site.register(Designation)
admin.site.register(Department)
admin.site.register(ReasonForLeaving)
admin.site.register(RolePermission)
admin.site.register(Module)
admin.site.register(PermissionType)