
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Employee

@receiver(post_save, sender=Employee)
def create_user_for_employee(sender, instance, created, **kwargs):
    if created and instance.user is None:
        # Create User with email as username, inactive by default
        existing_user = User.objects.filter(username=instance.email_id).first()
        if existing_user:
            instance.user = existing_user
        else:
            user = User.objects.create(
            username=instance.email_id,
            first_name=instance.emp_fName,
            last_name=instance.emp_lName,
            email=instance.email_id,
            is_active=False  # inactive initially
        )
        instance.user = user
        instance.save()

