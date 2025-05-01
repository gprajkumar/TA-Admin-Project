from rest_framework import serializers
from .models.models import *
from .models.requirement import *

class RequirementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requirements
        fields = '__all__'