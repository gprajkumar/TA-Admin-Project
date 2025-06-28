from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class AccountManager(models.Model):
    account_manager_id = models.AutoField(primary_key=True)
    account_manager = models.CharField(max_length=100,verbose_name="Account Manager")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)
    account_manager_status = models.BooleanField(default=True, verbose_name="Active")
    class Meta:
        verbose_name = "Account Manager"            # Singular name in Admin
        verbose_name_plural = "Account Managers" 

    def __str__(self):
        return self.account_manager
    
class HiringManager(models.Model):
    hiring_manager_id = models.AutoField(primary_key=True)
    hiring_manager = models.CharField(max_length=100,verbose_name="Hiring Manager")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)
    hiring_manager_status = models.BooleanField(default=True, verbose_name="Active")
    class Meta:
        verbose_name = "Hiring Manager"            # Singular name in Admin
        verbose_name_plural = "Hiring Managers" 

    def __str__(self):
        return self.hiring_manager
    
class AccountHead(models.Model):
    account_head_id = models.AutoField(primary_key=True)
    account_head = models.CharField(max_length=100,verbose_name="Account Head")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)
    account_head_status = models.BooleanField(default=True, verbose_name="Active")
    class Meta:
        verbose_name = "Account Head"            # Singular name in Admin
        verbose_name_plural = "Account Heads" 

    def __str__(self):
        return self.account_head

class AccountCoordinator(models.Model):
    account_coordinator_id = models.AutoField(primary_key=True)
    account_coordinator = models.CharField(max_length=100,verbose_name="Account Coordinator")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)
    account_head_status = models.BooleanField(default=True, verbose_name="Active")
    class Meta:
        verbose_name = "Account Coordinator"            # Singular name in Admin
        verbose_name_plural = "Account Coordinators" 

    def __str__(self):
        return self.account_coordinator
        
class Account(models.Model):
    account_id = models.AutoField(primary_key=True)
    account_name = models.CharField(max_length=100, verbose_name="Account Name")
    account_coordinator = models.ForeignKey(AccountCoordinator, on_delete=models.CASCADE,verbose_name="Account Coordinator")
    # account_manager= models.CharField(AccountManager, on_delete=models.CASCADE)
    account_manager = models.ForeignKey(AccountManager, on_delete=models.CASCADE,verbose_name="Account Manager")
    account_head = models.ForeignKey(AccountHead, on_delete=models.CASCADE,verbose_name="Account Head")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)
    account_status = models.BooleanField(default=True, verbose_name="Active")
    class Meta:
        verbose_name = "Account Name"            # Singular name in Admin
        verbose_name_plural = "Account Names" 
    def __str__(self):
        return self.account_name

class EndClient(models.Model):
    end_client_id = models.AutoField(primary_key=True)
    end_client_name = models.CharField(max_length=100, verbose_name="End Client Name")
    account = models.ForeignKey(Account, on_delete=models.CASCADE,verbose_name="Account Name")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)
    end_client_status = models.BooleanField(default=True, verbose_name="Active")

    def __str__(self):
        return self.end_client_name
    
class Client(models.Model):
    client_id = models.AutoField(primary_key=True)
    client_name = models.CharField(max_length=100, verbose_name="Client Name")
    end_client = models.ForeignKey(EndClient, on_delete=models.CASCADE,verbose_name="End Client Name")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)
    client_status = models.BooleanField(default=True, verbose_name="Active")

    def __str__(self):
        return self.client_name

class JobStatus(models.Model):
    job_status_id = models.AutoField(primary_key=True)
    job_status = models.CharField(max_length=100, verbose_name="Job Status")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.job_status
    
class Source(models.Model):
    source_id = models.AutoField(primary_key=True)
    source = models.CharField(max_length=100, verbose_name="Source")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.source

class Feedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    feedback = models.CharField(max_length=100, verbose_name="Feedback")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.feedback

class Holiday(models.Model):
    holiday_id = models.AutoField(primary_key=True)
    holiday_date = models.DateField(verbose_name="Holiday Date")
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.holiday_date.strftime("%m-%d-%y")   
    


class Tech_Screener(models.Model):
    tech_screener_id = models.AutoField(primary_key=True)
    tech_screener_name = models.CharField(max_length=100, verbose_name="Tech Screener Name")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)
    tech_screener_status = models.BooleanField(default=True, verbose_name="Active")

    def __str__(self):
        return self.tech_screener_name

class Screening_Status(models.Model):
    screening_status_id = models.AutoField(primary_key=True)
    screening_status = models.CharField(max_length=100, verbose_name="Screening Status")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.screening_status

class Role_Type(models.Model):
    role_type_id = models.AutoField(primary_key=True)
    role_type = models.CharField(max_length=100, verbose_name="Role Type")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.role_type
    

class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    department_name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.department_name
    
class Designation(models.Model):
    designation_id = models.AutoField(primary_key= True)
    designation_name = models.CharField(max_length=50)
    complete_access = models.BooleanField(default=False)
    edit_own_data = models.BooleanField(default=False)
    delete_own_data = models.BooleanField(default=False)
    edit_data =models.BooleanField(default=False)
    delete_data = models.BooleanField(default=False)
    access_Analytics = models.BooleanField(default=True)
    only_client_Analytics = models.BooleanField(default=False)
    only_Recruiter_Analytics = models.BooleanField(default=False)
    only_sourcer_Analytics = models.BooleanField(default=False)
    only_submission_Analytics = models.BooleanField(default=False)
    
    def __str__(self):
        return self.designation_name
    
class ReasonForLeaving(models.Model):
    reason_id=models.AutoField(primary_key=True)
    reason_name = models.CharField(max_length = 100)
    
    def __str__(self):
        return self.reason_name

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='employee')
    employee_id = models.AutoField(primary_key=True)
    emp_code = models.CharField(max_length=10,unique=True)
    emp_fName = models.CharField(max_length=50, blank=True,null=True)
    emp_lName = models.CharField(max_length=50,blank=True,null= True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    can_recruit = models.BooleanField(default=True)
    can_source = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    email_id = models.EmailField(unique=True, max_length=254)
    designation = models.ForeignKey(Designation, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.emp_fName} {self.emp_lName}"
    

    
