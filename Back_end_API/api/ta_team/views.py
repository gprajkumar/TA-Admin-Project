from django.shortcuts import render
from rest_framework import status
from .models.models import (
    Client, EndClient, Account, AccountManager, HiringManager,
    AccountHead, AccountCoordinator, Feedback, JobStatus,
    Recruiter, Role_Type, Sourcer, Source, Tech_Screener, Screening_Status, Employee
)
from django_filters.rest_framework import DjangoFilterBackend
from .models.requirement import Requirements
from .models.submission import Submissions
from .serializers import ( RequirementsSerializer,  ClientSerializer, EndClientSerializer, AccountSerializer,
    AccountManagerSerializer, HiringManagerSerializer, AccountHeadSerializer,
    AccountCoordinatorSerializer, FeedbackSerializer, JobStatusSerializer,
    RecruiterSerializer, RoleTypeSerializer, SourcerSerializer,
    SourceSerializer, TechScreenerSerializer, ScreeningStatusSerializer, SubmissionSerializer,EmployeeSerializer)
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
# Create your views here.

class RequirementsViewSet(ModelViewSet):
   queryset = Requirements.objects.select_related(  'client', 'end_client', 'account', 'job_status', 
        'assigned_recruiter', 'assigned_sourcer', 
        'filled_by_recruiter', 'filled_by_sourcer', 
        'accountManager', 'hiringManager', 
        'filled_source', 'role_type').all()
   serializer_class = RequirementsSerializer
   
class ClientViewSet(ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class EndClientViewSet(ModelViewSet):
    queryset = EndClient.objects.all()
    serializer_class = EndClientSerializer

class AccountViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class AccountManagerViewSet(ModelViewSet):
    queryset = AccountManager.objects.all()
    serializer_class = AccountManagerSerializer

class HiringManagerViewSet(ModelViewSet):
    queryset = HiringManager.objects.all()
    serializer_class = HiringManagerSerializer

class AccountHeadViewSet(ModelViewSet):
    queryset = AccountHead.objects.all()
    serializer_class = AccountHeadSerializer

class AccountCoordinatorViewSet(ModelViewSet):
    queryset = AccountCoordinator.objects.all()
    serializer_class = AccountCoordinatorSerializer

class FeedbackViewSet(ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

class JobStatusViewSet(ModelViewSet):
    queryset = JobStatus.objects.all()
    serializer_class = JobStatusSerializer

class RecruiterViewSet(ModelViewSet):
    queryset = Recruiter.objects.all()
    serializer_class = RecruiterSerializer

class RoleTypeViewSet(ModelViewSet):
    queryset = Role_Type.objects.all()
    serializer_class = RoleTypeSerializer

class SourcerViewSet(ModelViewSet):
    queryset = Sourcer.objects.all()
    serializer_class = SourcerSerializer

class SourceViewSet(ModelViewSet):
    queryset = Source.objects.all()
    serializer_class = SourceSerializer

class TechScreenerViewSet(ModelViewSet):
    queryset = Tech_Screener.objects.all()
    serializer_class = TechScreenerSerializer

class ScreeningStatusViewSet(ModelViewSet):
    queryset = Screening_Status.objects.all()
    serializer_class = ScreeningStatusSerializer

class SubmisionViewSet(ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionSerializer

class EmployeeViewSet(ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['can_recruit','department','is_active','can_source']