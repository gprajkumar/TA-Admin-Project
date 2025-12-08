from django.shortcuts import render
from rest_framework import status
from .models.models import (
    Client, EndClient, Account, AccountManager, HiringManager,
    AccountHead, AccountCoordinator, Feedback, JobStatus,
     Role_Type, Source, Tech_Screener, Screening_Status, Employee, DashboardJobData
)
from django.http import JsonResponse
from django.views import View
from rest_framework.views import APIView
from django.db import connection
from django_filters.rest_framework import DjangoFilterBackend
from .models.requirement import Requirements
from .models.submission import Placement,Submissions
from .serializers import ( RequirementsSerializer,  ClientSerializer, EndClientSerializer, AccountSerializer,
    AccountManagerSerializer, HiringManagerSerializer, AccountHeadSerializer,
    AccountCoordinatorSerializer, FeedbackSerializer, JobStatusSerializer,
     RoleTypeSerializer, EmployeeSerializer,
    SourceSerializer, TechScreenerSerializer, ScreeningStatusSerializer, SubmissionSerializer,EmployeeSerializer, PlacementSerializer,CustomTokenObtainPairSerializer,DashboardDataSerializer)
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.response import Response
from .filters.requirement_filter import RequirementFilter,SubmissionFilter
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from django.db.models import Count, Sum, Avg
from django.db.models.functions import TruncMonth
import traceback
from django.db.models import Q
from datetime import datetime
from .filters.pagination import RequirementPagination
from rest_framework.permissions import AllowAny
# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def debug_auth(request):
    claims = request.auth or {}
    print("AUTH OK. user:", request.user.username)
    print("claims scp:", claims.get("scp"))
    return Response({"user": request.user.username, "scp": claims.get("scp")})

class RequirementsViewSet(ModelViewSet):
    serializer_class = RequirementsSerializer
    pagination_class = RequirementPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = RequirementFilter

    def get_queryset(self):
        queryset = Requirements.objects.select_related(
            'client', 'end_client', 'account', 'job_status', 
            'assigned_recruiter', 'assigned_sourcer',
            'accountManager', 'hiringManager', 'role_type'
        ).all()

        empcode = self.request.query_params.get("empcode")
        print("Empcode:", empcode)
        if empcode:
            queryset = queryset.filter(
                Q(assigned_recruiter_id=empcode) | 
                Q(assigned_sourcer_id=empcode)
            )

        return queryset
   
class ClientViewSet(ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    
class RequirementSearchDropdownAPI(APIView):
    def get(self, request):
        q = request.query_params.get("q", "")
        queryset = Requirements.objects.filter(
           Q(job_title__icontains=q) | Q(job_code__icontains=q)
        ).values("requirement_id","job_code", "job_title","req_opened_date")[:20]  # Limit result
        return Response(queryset)

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
    serializer_class = SubmissionSerializer
    pagination_class = RequirementPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = SubmissionFilter

    def get_queryset(self):
        queryset = Submissions.objects.select_related(
            'Job', 'recruiter', 'sourcer', 'source'
        ).all()

        empcode = self.request.query_params.get("empcode")
        
    

        if empcode:
            queryset = queryset.filter(
                Q(recruiter_id=empcode) | Q(sourcer_id=empcode)
            )
       
       

        return queryset
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

class CurrentEmployeeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
       
        username = request.user.username
        try:
            user = Employee.objects.get(email_id=username)
            emp_detail = EmployeeSerializer(user).data
            
            return Response(
                {
                    "user": username,
                    "emp_details": emp_detail,
                    "is_active": user.is_active,
                },
                status=status.HTTP_200_OK,
            )
            
           

        except Employee.DoesNotExist:
            # User is valid in Azure AD but not in your TA system
            return Response(
                {
                    "user": username,
                    "emp_details": None,
                    "is_active": None,
                    "detail": "User is authenticated via Azure AD but not registered in TA system.",
                },
                status=status.HTTP_200_OK,
            )
               
        
class RefreshClientDashboardView(View):
    def get(self,request):
        try:
            with connection.cursor() as cursor:
                cursor.execute('CALL refresh_client_dashboard_data();') 
            return JsonResponse({'status':'success', 'message':'Data refreshed Succesfully'})
        except Exception as e:
            import traceback
            print("Error while refreshing client dashboard:")
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

class get_client_update_date(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT MAX(client_dashboard_data_updated) FROM ta_team_analytics_update;')
                result = cursor.fetchone()
                if result and result[0]:
                    last_updated = result[0].strftime('%m/%d/%Y')
                    return JsonResponse({'last_updated': last_updated})
                else:
                    return JsonResponse({'last_updated': 'No data available'})
        except Exception as e:
            print(traceback.format_exc())
            return JsonResponse({'error': str(e)}, status=500)
        
class ClientDashboardView(ReadOnlyModelViewSet):
    queryset = DashboardJobData.objects.all()
    serializer_class = DashboardDataSerializer
    @staticmethod
    def build_filters(data):
        filters = {}
        end_clients = data.get('endclients', [])
        accounts = data.get('accounts', [])
        start_date = data.get('from_date')
        end_date = data.get('to_date')
        
        if end_clients and end_clients[0] != 0:
            filters['end_client_id__in'] = end_clients
        if accounts and accounts[0] != 0:
            filters['account_id__in'] = accounts
        if start_date:
            filters['req_opened_date__gte'] = start_date
        if end_date:
            filters['req_opened_date__lte'] = end_date
        return filters

    @action(detail=False, methods=['post'], url_path='filter')
    def filter_dashboard(self, request):
        try:
            filter_type = request.data.get('filter_type')
            print(request.data)
            print("Filter type:", filter_type)
            filters = self.build_filters(request.data)
            print("Filters applied:", filters)
            queryset = DashboardJobData.objects.filter(**filters)

            overall_calculations = queryset.aggregate(
                roles_opened=Count('job_code'),
                amsubs=Sum('amsubs'),
                csubs=Sum('csubs'),
                interviews=Sum('interviews'),
                offers=Sum('offers'),
                starts=Sum('starts'),
                avg_turnaround_time=Avg('avg_turnaround_time') 
            )

            if filter_type == "endclient":
                grouped_data = queryset.values('end_client_id', 'end_client_name').annotate(
                    roles_opened=Count('job_code'),
                    amsubs=Sum('amsubs'),
                    csubs=Sum('csubs'),
                    interviews=Sum('interviews'),
                    offers=Sum('offers'),
                    starts=Sum('starts'),
                    avg_turnaround_time=Avg('avg_turnaround_time') 
                ).order_by('end_client_id')
            else:
                grouped_data = queryset.values('account_id', 'account_name').annotate(
                    roles_opened=Count('job_code'),
                    amsubs=Sum('amsubs'),
                    csubs=Sum('csubs'),
                    interviews=Sum('interviews'),
                    offers=Sum('offers'),
                    starts=Sum('starts'),
                    avg_turnaround_time=Avg('avg_turnaround_time')
                ).order_by('account_name')

            for item in grouped_data:
                item['avg_turnaround_time'] = round(item['avg_turnaround_time'], 2) if item['avg_turnaround_time'] is not None else None
            return Response({
                "grouped_data": list(grouped_data),
                "total_data": overall_calculations,
            })

        except Exception as e:
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)
    
    @action(detail=False, methods=['post'], url_path='filter/monthdata')
    def filter_monthly_dashboard(self, request):
        try:
           filters = self.build_filters(request.data)
           queryset = DashboardJobData.objects.filter(**filters)
           grouped_data = queryset.annotate(month=TruncMonth('req_opened_date')).values('month').annotate(
                 roles_opened=Count('job_code'),
                amsubs=Sum('amsubs'),
                csubs=Sum('csubs'),
                interviews=Sum('interviews'),
                offers=Sum('offers'),
                starts=Sum('starts')
            ).order_by('month')
            
           for item in grouped_data:
                item['month'] = item['month'].strftime("%b %Y")
                
           print("month aggregation", grouped_data)

           return Response({
                "grouped_data": list(grouped_data),
            })

        except Exception as e:
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=['post'], url_path='filter/jobroletypes')
    def filter_roletypes_dashboard(self, request):
        try:
            filters = self.build_filters(request.data)
            queryset = DashboardJobData.objects.filter(**filters)

            

            grouped_data = queryset.values('role_type_id','role_type').annotate(
                no_of_roles_opened=Count('job_code'),
            ).order_by('role_type_id')
           
           
            print("type aggregation", grouped_data)

            return Response({
                "grouped_data": list(grouped_data),
            })

        except Exception as e:
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)
        
    @action(detail=False, methods=['post'], url_path='filter/jobstatuses')
    def filter_jobstatus_dashboard(self, request):
        try:
            filters = self.build_filters(request.data)

            queryset = DashboardJobData.objects.filter(**filters)

            

            grouped_data = queryset.values('job_status_id','job_status').annotate(
                no_of_roles_opened=Count('job_code'),
            ).order_by('job_status_id')
           
           
            print("type aggregation", grouped_data)

            return Response({
                "grouped_data": list(grouped_data),
            })

        except Exception as e:
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)
    
    @action(detail=False, methods=['post'], url_path='filter/carryforwardroles')
    def filter_carryforwardroles_dashboard(self, request):
        try:
            filters = self.build_filters(request.data)

            queryset = DashboardJobData.objects.filter(**filters)

            current_month = datetime.today().replace(day=1)

        
            grouped_data = queryset.annotate(
            month=TruncMonth('req_opened_date')
            ).filter(
                job_status="Active"
            ).exclude(
                month=TruncMonth(current_month)
            ).values(
                'month'
            ).annotate(
                roles_opened=Count('job_code')
            ).order_by('month')

            # Format month to readable string
            for item in grouped_data:
                item['month'] = item['month'].strftime("%b %Y")

            print("month aggregation", grouped_data)

            return Response({
                "grouped_data": list(grouped_data),
            })
        except Exception as e:
         print(traceback.format_exc())
        return Response({"error": str(e)}, status=500)
  