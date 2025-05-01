from django.db import models
from .models import *

class Requirements(models.Model):
    requirement_id = models.AutoField(primary_key=True)
    job_code = models.CharField(max_length=20)
    job_title = models.CharField(max_length=200)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, verbose_name="Client Name")
    end_client = models.ForeignKey(EndClient, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    job_status = models.ForeignKey(JobStatus, on_delete=models.CASCADE)
    
    # Foreign keys with unique related names
    assigned_recruiter = models.ForeignKey(
        Recruiter, on_delete=models.CASCADE, related_name='assigned_recruiter'
    )
    assigned_sourcer = models.ForeignKey(
        Sourcer, on_delete=models.CASCADE, related_name='assigned_sourcer'
    )
    offer_date = models.DateField(blank=True, null=True)
    
    # Foreign keys with unique related names for filled_by
    filled_by_recruiter = models.ForeignKey(
        Recruiter, on_delete=models.CASCADE, related_name='filled_recruiter'
    )
    filled_by_sourcer = models.ForeignKey(
        Sourcer, on_delete=models.CASCADE, related_name='filled_sourcer'
    )
    
    filled_source = models.ForeignKey(Source, on_delete=models.CASCADE)
    notes = models.CharField(max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)
    
    def __str__(self):
        return self.job_title