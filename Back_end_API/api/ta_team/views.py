from django.shortcuts import render
from rest_framework import status
from .models.models import *
from .models.requirement import *
from .serializers import RequirementsSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
# Create your views here.

class RequirementsViewSet(ModelViewSet):
   queryset = Requirements.objects.all()
   serializer_class = RequirementsSerializer