from django.db import models
from .models import *
from .requirement import Requirements


class Submissions(models.Model):
    submission_id = models.AutoField(primary_key= True)
    Job = models.ForeignKey(Requirements, on_delete=models.CASCADE)
    submission_date = models.DateField( auto_now=False, auto_now_add=False)
    candidate_name = models.CharField(max_length=100)
    payrate = models.IntegerField(null=True,blank=True)
    w2_C2C = models.CharField(null=True,blank=True)
    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE)
    sourcer = models.ForeignKey(Sourcer, on_delete=models.CASCADE)
    source = models.ForeignKey(Source, on_delete=models.CASCADE)
    am_sub_date = models.DateField(auto_now=False, auto_now_add=False)
    am_screen_date = models.DateField(auto_now=False, auto_now_add=False,blank = True,null=True)
    tech_screen_date = models.DateField(auto_now=False, auto_now_add=False,blank = True,null=True)
    client_sub_date = models.DateField(auto_now=False, auto_now_add=False,blank = True,null=True)
    client_interview_date = models.DateField(auto_now=False, auto_now_add=False,blank = True,null=True)
    offer_date = models.DateField(auto_now=False, auto_now_add=False,blank = True,null=True)
    start_date = models.DateField(auto_now=False, auto_now_add=False,blank = True,null=True)
    current_status = models.CharField(blank=True, max_length=50)
   
    def __str__(self):
       return self.candidate_name
    
    def save(self,*args, **kwargs):
        self.update_status()
        super.save(*args, **kwargs)
        
    def update_status(self):
        if self.start_date:
            self.current_status = "Started"
        elif self.offer_date:
            self.current_status = "Offered"
        elif self.client_interview_date:
            self.current_status = "Interviewed"
        elif self.client_sub_date:
            self.current_status = "Submitted to Client"
        elif self.tech_screen_date:
            self.current_status = "Technical Screened"
        elif self.am_screen_date:
            self.current_status = "AM Screened"
        else:
            self.current_status = "Submitted to AM"
    