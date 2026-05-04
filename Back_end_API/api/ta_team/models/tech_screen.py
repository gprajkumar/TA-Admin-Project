from django.db import models
from .models import Screening_Status, Tech_Screener, Employee
from .requirement import Requirements
from .submission import Submissions


class Tech_Screen(models.Model):
    tech_screen_id = models.AutoField(primary_key=True)
    job = models.ForeignKey(Requirements, on_delete=models.CASCADE, verbose_name="Job Code")
    submission = models.ForeignKey(Submissions, on_delete=models.CASCADE, verbose_name="Submission")
    screening_status = models.ForeignKey(Screening_Status, on_delete=models.CASCADE, verbose_name="Screening Status")
    feedback = models.CharField(max_length=2000, blank=True, null=True, verbose_name="Feedback")
    tech_screener = models.ForeignKey(Tech_Screener, on_delete=models.CASCADE, verbose_name="Tech Screener")
    screening_date = models.DateField(verbose_name="Screening Date")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")
    updated_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Updated By")

    class Meta:
        unique_together = ('job', 'submission', 'tech_screen_id')

    def __str__(self):
        return f"{self.submission.candidate_name} - {self.job.job_code} - {self.screening_status.screening_status}"
