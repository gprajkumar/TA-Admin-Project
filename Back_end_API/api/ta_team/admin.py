from django.contrib import admin
from . import models
# Register your models here.
class TAAdmin(admin.AdminSite):
    site_header = "Talent Acquistion Admin"
    site_title = "TA Admin Portal"
    index_title = "Welcome to TA Management Portal"

admin.site.register(models.Account)
admin.site.register(models.AccountManager)
admin.site.register(models.AccountHead)
admin.site.register(models.AccountCoordinator)
admin.site.register(models.EndClient)
admin.site.register(models.Client)
admin.site.register(models.JobStatus)
admin.site.register(models.Screening_Status)
admin.site.register(models.Feedback)
admin.site.register(models.Holiday)
admin.site.register(models.Recruiter)
admin.site.register(models.Source)
admin.site.register(models.Role_Type)
admin.site.register(models.Sourcer)
admin.site.register(models.Tech_Screener)


