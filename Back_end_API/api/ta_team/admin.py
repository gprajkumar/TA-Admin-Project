from django.contrib import admin
from .models.models import ReasonForLeaving,Account, AccountManager, AccountHead, AccountCoordinator, EndClient, Client, JobStatus, Screening_Status, Feedback, Holiday, Source, Role_Type, Tech_Screener, HiringManager, Designation, Department, Employee # This imports everything from models.py and requirement.py

admin.site.site_header = "Talent Acquisition Admin"
admin.site.site_title = "TA Admin Portal"
admin.site.index_title = "Welcome to TA Management Portal"
    
class EmployeeAdmin(admin.ModelAdmin):
    exclude = ('user',)
    list_display = ('emp_code', 'emp_fName', 'email_id', 'department', 'designation', 'is_active')

# Register models
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
