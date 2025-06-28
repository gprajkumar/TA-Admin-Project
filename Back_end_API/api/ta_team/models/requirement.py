from django.db import models
from .models import *

class Requirements(models.Model):
    requirement_id = models.AutoField(primary_key=True)
    job_code = models.CharField(max_length=20,unique=True)
    job_title = models.CharField(max_length=200)
    req_opened_date = models.DateField()
    client = models.ForeignKey(Client, on_delete=models.CASCADE, verbose_name="Client Name")
    end_client = models.ForeignKey(EndClient, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    job_status = models.ForeignKey(JobStatus, on_delete=models.CASCADE)
    
    # Foreign keys with unique related names
    assigned_recruiter = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name='assigned_recruiter'
    )
    assigned_sourcer = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name='assigned_sourcer'
    )
    filled_date = models.DateField(blank=True, null=True)
    
    # Foreign keys with unique related names for filled_by
    filled_by_recruiter = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name='filled_recruiter',blank=True,null=True
    )
    filled_by_sourcer = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name='filled_sourcer',blank=True,null=True
    )
    accountManager = models.ForeignKey(AccountManager,on_delete=models.CASCADE)
    hiringManager = models.ForeignKey(HiringManager,on_delete=models.CASCADE,blank=True,null=True)
    filled_source = models.ForeignKey(Source, on_delete=models.CASCADE,blank=True,null=True)
    notes = models.CharField(max_length=2000,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)
    role_type = models.ForeignKey(Role_Type,on_delete=models.CASCADE,default=1)
    no_of_positions= models.IntegerField(default=1)
    no_of_positions_filled = models.IntegerField(blank=True,null=True)
    created_by = models.ForeignKey(Employee,  related_name='req_created_by', on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return self.job_code+" "+self.job_title