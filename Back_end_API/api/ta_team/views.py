from django.shortcuts import render
from rest_framework import status
from .models.models import (
    Client, EndClient, Account, AccountManager, HiringManager,
    AccountHead, AccountCoordinator, Feedback, JobStatus,
     Role_Type, Source, Tech_Screener, Screening_Status, Employee, DashboardJobData
)
from django.http import JsonResponse
from django.views import View
from django.db import connection
from django_filters.rest_framework import DjangoFilterBackend
from .models.requirement import Requirements
from .models.submission import Placement,Submissions
from .serializers import ( RequirementsSerializer,  ClientSerializer, EndClientSerializer, AccountSerializer,
    AccountManagerSerializer, HiringManagerSerializer, AccountHeadSerializer,
    AccountCoordinatorSerializer, FeedbackSerializer, JobStatusSerializer,
     RoleTypeSerializer, 
    SourceSerializer, TechScreenerSerializer, ScreeningStatusSerializer, SubmissionSerializer,EmployeeSerializer, PlacementSerializer,CustomTokenObtainPairSerializer,DashboardDataSerializer)
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.response import Response
from .filters.requirement_filter import RequirementFilter,SubmissionFilter
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from django.db.models import Count, Sum, Avg
import traceback
# Create your views here.

class RequirementsViewSet(ModelViewSet):
   queryset = Requirements.objects.select_related(  'client', 'end_client', 'account', 'job_status', 
        'assigned_recruiter', 'assigned_sourcer',
        'accountManager', 'hiringManager', 
         'role_type').all()
   serializer_class = RequirementsSerializer
   filter_backends = [DjangoFilterBackend]
   filterset_class = RequirementFilter
   
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

class RoleTypeViewSet(ModelViewSet):
    queryset = Role_Type.objects.all()
    serializer_class = RoleTypeSerializer



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
    queryset = Submissions.objects.all().select_related('Job', 'recruiter', 'sourcer', 'source')
    serializer_class = SubmissionSerializer
    filter_backends =[DjangoFilterBackend]
    filterset_class = SubmissionFilter

class PlacementViewSet(ModelViewSet):
    queryset = Placement.objects.all()
    serializer_class = PlacementSerializer

class EmployeeViewSet(ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['can_recruit','department','is_active','can_source']
    
class UniqueCandidate_Status_ViewSet(ReadOnlyModelViewSet):
    queryset = Submissions.objects.none() 
    def list(self, request):
        unique_status = Submissions.objects.values_list('current_status', flat=True).distinct()
        return Response(unique_status)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    

class RefreshClientDashboardView(View):
    def get(self,request):
        try:
            with connection.cursor() as cursor:
                cursor.execute('CALL refresh_client_dashboard_data();') 
            return JsonResponse({'status':'success', 'message':'Data refreshed Succesfully'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
        
class ClientDashboardView(ReadOnlyModelViewSet):
    queryset = DashboardJobData.objects.all()
    serializer_class = DashboardDataSerializer

    @action(detail=False, methods=['post'], url_path='filter')
    def filter_dashboard(self, request):
        try:
            end_clients = request.data.get('end_clients', [])
            accounts = request.data.get('accounts', [])
            start_date = request.data.get('from_date')
            end_date = request.data.get('to_date')
            filter_type = request.data.get('filter_type')
            print(end_clients,accounts,start_date,end_date,filter_type)
            filters = {}
            if end_clients and end_clients[0] != 0:
                filters['end_client_id__in'] = end_clients
            if accounts and accounts[0] != 0:
                filters['account_id__in'] = accounts
            if start_date:
                filters['req_opened_date__gte'] = start_date
            if end_date:
                filters['req_opened_date__lte'] = end_date

            queryset = DashboardJobData.objects.filter(**filters)

            overall_calculations = queryset.aggregate(
                roles_opened=Count('job_code'),
                amsubs=Sum('amsubs'),
                csubs=Sum('csubs'),
                interviews=Sum('interviews'),
                offers=Sum('offers'),
                starts=Sum('starts')
            )

            if filter_type == "endclient":
                grouped_data = queryset.values('end_client_id', 'end_client_name').annotate(
                    roles_opened=Count('job_code'),
                    amsubs=Sum('amsubs'),
                    csubs=Sum('csubs'),
                    interviews=Sum('interviews'),
                    offers=Sum('offers'),
                    starts=Sum('starts')
                ).order_by('end_client_id')
            else:
                grouped_data = queryset.values('account_id', 'account_name').annotate(
                    roles_opened=Count('job_code'),
                    amsubs=Sum('amsubs'),
                    csubs=Sum('csubs'),
                    interviews=Sum('interviews'),
                    offers=Sum('offers'),
                    starts=Sum('starts')
                ).order_by('account_name')

            return Response({
                "grouped_data": list(grouped_data),
                "total_data": overall_calculations,
            })

        except Exception as e:
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)