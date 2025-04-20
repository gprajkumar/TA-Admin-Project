from django.db import models

# Create your models here.

class createAccount(models.Model):
    account_id = models.AutoField(primary_key=True)
    account_name = models.CharField(max_length=100)
    account_coordinator = models.CharField(max_length=100)
    account_manager= models.CharField(max_length=100)
    account_head = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    account_status = models.CharField(max_length=100, default='Active')

    def __str__(self):
        return self.account_name