from django.db import models
from .models import *
from .requirement import Requirements


class Submissions(models.Model):
    submission_id = models.AutoField(primary_key=True)
    Job = models.ForeignKey(Requirements, on_delete=models.CASCADE)
    submission_date = models.DateField()
    candidate_name = models.CharField(max_length=100)
    payrate = models.IntegerField(null=True, blank=True)
    w2_C2C = models.CharField(null=True, blank=True)
    
    recruiter = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="submission_recruiter")
    sourcer = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="submission_sourcer")
    source = models.ForeignKey(Source, on_delete=models.CASCADE)

    am_sub_date = models.DateField()
    am_screen_date = models.DateField(blank=True, null=True)
    tech_screen_date = models.DateField(blank=True, null=True)
    client_sub_date = models.DateField(blank=True, null=True)
    client_interview_date = models.DateField(blank=True, null=True)
    offer_date = models.DateField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)

    current_status = models.CharField(blank=True, max_length=50)
    created_by = models.ForeignKey(Employee, related_name='submissions_created_by', on_delete=models.CASCADE, null=True)

    class Meta:
        indexes = [
            models.Index(fields=["Job"]),
            models.Index(fields=["recruiter"]),
            models.Index(fields=["sourcer"]),
            models.Index(fields=["submission_date"]),
            models.Index(fields=["client_sub_date"]),
            models.Index(fields=["current_status"]),
        ]

    def __str__(self):
        return self.candidate_name

    def save(self, *args, **kwargs):
        self.update_status()
        super().save(*args, **kwargs)

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
    
class Placement(models.Model):
    placment_id = models.AutoField(primary_key=True)
    Job = models.ForeignKey(Requirements,on_delete=models.CASCADE)
    submission = models.ForeignKey(Submissions,on_delete=models.CASCADE)
    reason_for_leaving = models.ForeignKey(ReasonForLeaving,on_delete=models.CASCADE,blank=True,null=True)
    Contract_end_close_date= models.DateField(null=True,blank=True)
    is_Active = models.BooleanField(default=True)
    class Meta:
        indexes = [
            models.Index(fields=["Job"]),
                ]
    def __str__(self):
        return self.submission.candidate_name