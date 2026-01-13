from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Designation, Department

class CustomUserCreationForm(UserCreationForm):
    designation = forms.ModelChoiceField(
        queryset=Designation.objects.all(),
        required=True,
        label="Designation"
    )
    department = forms.ModelChoiceField(queryset=Department.objects.all(),required=True,label="Department")

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "designation",
        )