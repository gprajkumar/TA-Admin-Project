from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Employee

@receiver(post_save, sender=Employee)
def create_user_for_employee(sender, instance, created, **kwargs):
    if created and instance.user is None:
        existing_user = User.objects.filter(username=instance.email_id).first()
        if existing_user:
            instance.user = existing_user
            instance.save(update_fields=["user"])  # safer update
        else:
            user = User.objects.create(
                username=instance.email_id,
                first_name=instance.emp_fName,
                last_name=instance.emp_lName,
                email=instance.email_id,
                is_active=False
            )
            instance.user = user
            instance.save(update_fields=["user"])  # safer update

@receiver(post_save, sender=User)
def create_employee_for_user(sender, instance, created, **kwargs):
    if created:
        existing_employee = Employee.objects.filter(email_id=instance.email).first()
        if existing_employee:
            if not existing_employee.user:
                existing_employee.user = instance
                existing_employee.save(update_fields=["user"])
        else:
            Employee.objects.create(
                emp_fName=instance.first_name,
                emp_lName=instance.last_name,
                email_id=instance.email,
                is_active=True,
                designation=9,
                user=instance
            )
