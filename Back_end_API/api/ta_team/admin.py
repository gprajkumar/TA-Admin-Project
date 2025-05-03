from django.contrib import admin
from .models.models import Account, AccountManager, AccountHead, AccountCoordinator, EndClient, Client, JobStatus, Screening_Status, Feedback, Holiday, Recruiter, Source, Role_Type, Sourcer, Tech_Screener, HiringManager # This imports everything from models.py and requirement.py

# Register your models here.
class TAAdmin(admin.AdminSite):
    site_header = "Talent Acquisition Admin"
    site_title = "TA Admin Portal"
    index_title = "Welcome to TA Management Portal"

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
admin.site.register(Recruiter)
admin.site.register(Source)
admin.site.register(Role_Type)
admin.site.register(Sourcer)
admin.site.register(Tech_Screener)
admin.site.register(HiringManager)
