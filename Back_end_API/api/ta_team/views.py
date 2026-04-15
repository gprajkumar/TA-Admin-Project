from urllib import request

from django.shortcuts import render
from rest_framework import status
from .models.models import (
    Client, EndClient, Account, AccountManager, HiringManager,
    AccountHead, AccountCoordinator, Feedback, JobStatus,
     Role_Type, Source, Tech_Screener, Screening_Status, Employee, DashboardJobData, RolePermission, Holiday,TargetforTeam, SubmissionStatus
)
from django.http import JsonResponse
from django.views import View
from rest_framework.views import APIView
from django.db import connection
from django_filters.rest_framework import DjangoFilterBackend
from .models.requirement import Requirements
from .models.submission import Placement, Submissions, SubmissionStatusLog
from .serializers import ( RequirementsSerializer,  ClientSerializer, EndClientSerializer, AccountSerializer,
    AccountManagerSerializer, HiringManagerSerializer, AccountHeadSerializer,
    AccountCoordinatorSerializer, FeedbackSerializer, JobStatusSerializer,RolePermissionSerializer,
     RoleTypeSerializer, EmployeeSerializer,
    SourceSerializer, TechScreenerSerializer, ScreeningStatusSerializer, SubmissionSerializer,EmployeeSerializer, PlacementSerializer,CustomTokenObtainPairSerializer,DashboardDataSerializer, SubmissionStatusSerializer, StatuslogSerializer)
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.response import Response
from .filters.requirement_filter import RequirementFilter,SubmissionFilter
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from django.db.models import F, Count, IntegerField, OuterRef, Subquery, Sum, Avg, Value, Window
from django.db.models.functions import Coalesce, RowNumber, Round, TruncMonth
import traceback
from django.db.models import Q
from datetime import datetime, timedelta, timezone
from .filters.pagination import RequirementPagination
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from api.module_permission import RequirementsPermission, SubmissionsPermission, ClientDashboardPermission, RecruiterDashboardPermission, SourcerDashboardPermission

import logging

logger = logging.getLogger(__name__)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def debug_auth(request):
    claims = request.auth or {}
    logger.debug("AUTH OK. user: %s", request.user.username)
    logger.debug("claims scp: %s", claims.get("scp"))
    return Response({"user": request.user.username, "scp": claims.get("scp")})

class RequirementsViewSet(ModelViewSet):
    serializer_class = RequirementsSerializer
    pagination_class = RequirementPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = RequirementFilter
    permission_classes = [RequirementsPermission]

    def get_queryset(self):
        queryset = Requirements.objects.select_related(
            'client', 'end_client', 'account', 'job_status',
            'assigned_recruiter', 'assigned_sourcer',
            'accountManager', 'hiringManager', 'role_type'
        ).only(
            # Requirements own fields
            'requirement_id', 'job_code', 'job_title', 'req_opened_date',
            'notes', 'created_at', 'updated_at', 'no_of_positions',
            'no_of_positions_filled', 'filled_date', 'created_by_id',
            # FK ids (needed by DRF to serialise the FK integer fields)
            'client_id', 'end_client_id', 'account_id', 'job_status_id',
            'assigned_recruiter_id', 'assigned_sourcer_id',
            'accountManager_id', 'hiringManager_id', 'role_type_id',
            # Related fields read by the serializer
            'client__client_name',
            'end_client__end_client_name',
            'account__account_name',
            'job_status__job_status',
            'assigned_recruiter__emp_fName',
            'assigned_sourcer__emp_fName',
            'accountManager__account_manager',
            'hiringManager__hiring_manager',
            'role_type__role_type',
        ).order_by('-req_opened_date')

        empcode = self.request.query_params.get("empcode")
        logger.debug("Empcode: %s", empcode)
        if empcode:
            queryset = queryset.filter(
                Q(assigned_recruiter_id=empcode) | 
                Q(assigned_sourcer_id=empcode)
            )

        return queryset
   
class ClientViewSet(ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    
class RolePermissionViewSet(APIView):
   def get(self, request):
        designation_id = request.query_params.get("id")

        queryset = RolePermission.objects.filter(
            designation_id=designation_id
        ).select_related("module", "permission_type")

        serializer = RolePermissionSerializer(queryset, many=True)
        return Response(serializer.data)
    
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

class SubmissionStatusViewSet(ReadOnlyModelViewSet):
    queryset = SubmissionStatus.objects.filter(is_active=True).order_by('order')
    serializer_class = SubmissionStatusSerializer
    permission_classes = [IsAuthenticated]

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
    permission_classes = [SubmissionsPermission]

    def get_queryset(self):
        queryset = Submissions.objects.select_related(
            'Job', 'recruiter', 'sourcer', 'source'
        ).all().order_by('-submission_date')

        empcode = self.request.query_params.get("empcode")

        if empcode:
            queryset = queryset.filter(
                Q(recruiter_id=empcode) | Q(sourcer_id=empcode)
            )

        return queryset

    def _sync_status_log(self, submission, status_date_override=None, updated_by=None):
        """Write a SubmissionStatusLog entry for the current status.

        Date resolution order:
          1. status_date_override  — from request field 'status_update_submission_date'
          2. submission.<main_table_field>  — if the status maps to a column
        If neither yields a date, the log entry is skipped.
        """
        status = submission.current_new_status
        if not status:
            return

        # Try to resolve a date
        status_date = status_date_override
        if not status_date and status.main_table_field:
            status_date = getattr(submission, status.main_table_field, None)

        if not status_date:
            return

        SubmissionStatusLog.objects.update_or_create(
            submission=submission,
            status=status,
            defaults={"status_date": status_date, "updated_by": updated_by},
        )

    def perform_create(self, serializer):
        employee = getattr(self.request.user, 'employee', None)
        status_date_override = self.request.data.get('status_update_submission_date') or None
        submission = serializer.save(created_by=employee)
        self._sync_status_log(submission, status_date_override=status_date_override, updated_by=employee)

    def perform_update(self, serializer):
        employee = getattr(self.request.user, 'employee', None)
        status_date_override = self.request.data.get('status_update_submission_date') or None
        submission = serializer.save()
        self._sync_status_log(submission, status_date_override=status_date_override, updated_by=employee)

class SubmissionHistoryViewSet(ReadOnlyModelViewSet):
    serializer_class = StatuslogSerializer
    permission_classes = [SubmissionsPermission]

    def get_queryset(self):
        submission_id = self.request.query_params.get("submission_id")
        if not submission_id:
            return SubmissionStatusLog.objects.none()
        return (
            SubmissionStatusLog.objects
            .filter(submission_id=submission_id)
            .select_related("status", "submission", "updated_by")
            .order_by("-status_date")
        )

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

    def get(self, request):
        
        username = request.user.username
        try:
            employee = Employee.objects.get(email_id=username)
        except Employee.DoesNotExist:
                return Response(
                {
                    "user": username,
                    "emp_details": None,
                    "is_active": None,
                    "detail": "Employee record not found in TA system.  Please contact admin.",
                },
                status=status.HTTP_200_OK,
            )
        emp_detail = EmployeeSerializer(employee).data
        logger.debug("emp_detail %s", emp_detail)
        return Response(
                    {
                        "user": username,
                        "emp_details": emp_detail,
                        "is_active": emp_detail.get("is_active"),
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
            logger.error(traceback.format_exc())
            return JsonResponse({'error': str(e)}, status=500)
        
class ClientDashboardView(ReadOnlyModelViewSet):
    permission_classes = [ClientDashboardPermission]
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
            filters = self.build_filters(request.data)
            queryset = DashboardJobData.objects.filter(**filters)

            avg_fields = dict(
                avg_turnaround_time=Round(Avg('avg_turnaround_time'), 2),
                avg_days_am_to_csub=Round(Avg('avg_days_am_to_csub'), 2),
                avg_days_time_to_fill=Round(Avg('avg_days_time_to_fill'), 2),
                avg_days_time_to_hire=Round(Avg('avg_days_time_to_hire'), 2),
                avg_days_csub_to_offer=Round(Avg('avg_days_csub_to_offer'), 2),
                avg_days_time_to_interview=Round(Avg('avg_days_time_to_interview'), 2),
            )

            overall_calculations = queryset.aggregate(
                roles_opened=Count('job_code'),
                amsubs=Sum('amsubs'),
                csubs=Sum('csubs'),
                interviews=Sum('interviews'),
                offers=Sum('offers'),
                starts=Sum('starts'),
                techscreens=Sum('techscreens'),
                techscreen_csubs=Sum('techscreen_csubs'),
                **avg_fields,
            )

            count_fields = dict(
                roles_opened=Count('job_code'),
                amsubs=Sum('amsubs'),
                csubs=Sum('csubs'),
                interviews=Sum('interviews'),
                offers=Sum('offers'),
                starts=Sum('starts'),
                techscreens=Sum('techscreens'),
                techscreen_csubs=Sum('techscreen_csubs'),
                **avg_fields,
            )

            if filter_type == "endclient":
                grouped_data = queryset.values('end_client_id', 'end_client_name').annotate(
                    **count_fields
                ).order_by('end_client_id')
            else:
                grouped_data = queryset.values('account_id', 'account_name').annotate(
                    **count_fields
                ).order_by('account_name')
            
            return Response({
                "grouped_data": list(grouped_data),
                "total_data": overall_calculations,
            })

        except Exception as e:
            logger.error(traceback.format_exc())
            return Response({"error": str(e)}, status=500)
    
    @action(detail=False, methods=['post'], url_path='filter/all')
    def filter_all_dashboard(self, request):
        try:
            filter_type = request.data.get('filter_type')
            filters = self.build_filters(request.data)
            qs = DashboardJobData.objects.filter(**filters)

            # Reusable rounded avg expressions
            avg_fields = dict(
                avg_turnaround_time=Round(Avg('avg_turnaround_time'), 2),
                avg_days_am_to_csub=Round(Avg('avg_days_am_to_csub'), 2),
                avg_days_time_to_fill=Round(Avg('avg_days_time_to_fill'), 2),
                avg_days_time_to_hire=Round(Avg('avg_days_time_to_hire'), 2),
                avg_days_csub_to_offer=Round(Avg('avg_days_csub_to_offer'), 2),
                avg_days_time_to_interview=Round(Avg('avg_days_time_to_interview'), 2),
            )
            count_fields = dict(
                roles_opened=Count('job_code'),
                amsubs=Sum('amsubs'),
                csubs=Sum('csubs'),
                interviews=Sum('interviews'),
                offers=Sum('offers'),
                starts=Sum('starts'),
                techscreens=Sum('techscreens'),
                techscreen_csubs=Sum('techscreen_csubs'),
                **avg_fields,
            )

            # 1. Overall totals
            total_data = qs.aggregate(**count_fields)

            # 2. Grouped by account or end client
            if filter_type == 'endclient':
                grouped_data = list(
                    qs.values('end_client_id', 'end_client_name')
                    .annotate(**count_fields)
                    .order_by('end_client_id')
                )
            else:
                grouped_data = list(
                    qs.values('account_id', 'account_name')
                    .annotate(**count_fields)
                    .order_by('account_name')
                )

            # 3. Monthly submissions
            monthly_qs = (
                qs.annotate(month=TruncMonth('req_opened_date'))
                .values('month')
                .annotate(
                    roles_opened=Count('job_code'),
                    amsubs=Sum('amsubs'),
                    csubs=Sum('csubs'),
                    interviews=Sum('interviews'),
                    offers=Sum('offers'),
                    starts=Sum('starts'),
                )
                .order_by('month')
            )
            monthly_data = [
                {**item, 'month': item['month'].strftime('%b %Y')}
                for item in monthly_qs
            ]

            # 4. Role types
            role_type_data = list(
                qs.values('role_type_id', 'role_type')
                .annotate(no_of_roles_opened=Count('job_code'))
                .order_by('role_type_id')
            )

            # 5. Job statuses
            job_status_data = list(
                qs.values('job_status_id', 'job_status')
                .annotate(no_of_roles_opened=Count('job_code'))
                .order_by('job_status_id')
            )

            # 6. Carry-forward active roles (excluding current month)
            current_month = datetime.today().replace(day=1)
            carry_qs = (
                qs.annotate(month=TruncMonth('req_opened_date'))
                .filter(job_status='Active')
                .exclude(month=TruncMonth(current_month))
                .values('month')
                .annotate(roles_opened=Count('job_code'))
                .order_by('month')
            )
            carry_forward_data = [
                {**item, 'month': item['month'].strftime('%b %Y')}
                for item in carry_qs
            ]

            # 7. Pipeline and cancelled count
            pipeline_cancel_data = qs.aggregate(
                pipelineorCancelCount=Count('job_code', filter=Q(job_status_id=8) | Q(role_type_id=2)),
                cancelCount=Count('job_code', filter=Q(job_status_id=8)),
                pipelinecount=Count('job_code', filter=Q(role_type_id=2)),
            )

            return Response({
                'total_data': total_data,
                'grouped_data': grouped_data,
                'monthly_data': monthly_data,
                'role_type_data': role_type_data,
                'job_status_data': job_status_data,
                'carry_forward_data': carry_forward_data,
                'pipeline_cancel_data': pipeline_cancel_data,
            })

        except Exception as e:
            logger.error(traceback.format_exc())
            return Response({'error': str(e)}, status=500)

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
                

           return Response({
                "grouped_data": list(grouped_data),
            })

        except Exception as e:
            logger.error(traceback.format_exc())
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=['post'], url_path='filter/jobroletypes')
    def filter_roletypes_dashboard(self, request):
        try:
            filters = self.build_filters(request.data)
            queryset = DashboardJobData.objects.filter(**filters)
            grouped_data = queryset.values('role_type_id','role_type').annotate(
                no_of_roles_opened=Count('job_code'),
            ).order_by('role_type_id')
           
           
   

            return Response({
                "grouped_data": list(grouped_data),
            })

        except Exception as e:
            logger.error(traceback.format_exc())
            return Response({"error": str(e)}, status=500)
        
    @action(detail=False, methods=['post'], url_path='filter/jobstatuses')
    def filter_jobstatus_dashboard(self, request):
        try:
            filters = self.build_filters(request.data)

            queryset = DashboardJobData.objects.filter(**filters)

            

            grouped_data = queryset.values('job_status_id','job_status').annotate(
                no_of_roles_opened=Count('job_code'),
            ).order_by('job_status_id')
           
           


            return Response({
                "grouped_data": list(grouped_data),
            })

        except Exception as e:
            logger.error(traceback.format_exc())
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



            return Response({
                "grouped_data": list(grouped_data),
            })
        except Exception as e:
         logger.error(traceback.format_exc())
        return Response({"error": str(e)}, status=500)
    
    @action(detail=False,methods=['post'], url_path='filter/pipelineAndCancelledCount')
    def get_Pipeline_CancelledCount(self,request):
        try:
            filters = self.build_filters(request.data)
            queryset = DashboardJobData.objects.filter(**filters)
            pipelineCancelCount = queryset.aggregate(
            pipelineorCancelCount=Count('job_code', filter=Q(job_status_id=8) | Q(role_type_id=2)),
            cancelCount=Count('job_code', filter=Q(job_status_id=8)),
            pipelinecount=Count('job_code', filter=Q(role_type_id=2)) #server data

            # pipelineorCancelCount=Count('job_code', filter=Q(job_status_id=4) | Q(role_type_id=6)),
            # cancelCount=Count('job_code', filter=Q(job_status_id=4)),
            # pipelinecount=Count('job_code', filter=Q(role_type_id=6)) #local data

            )

            return Response(
            {
                "pipelineCancelCount": pipelineCancelCount
            }
            )
        except Exception as e:
            logger.error(traceback.format_exc())
            return Response({"error": str(e)}, status=500)
  
class TATCountAPIView(APIView):
    def get(self, request):
        submission_date = request.query_params.get("submission_date")
        opened_date = request.query_params.get("opened_date")

        if not submission_date or not opened_date:
            return Response(
                {"error": "start_date and end_date are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            opened_date = datetime.strptime(opened_date, "%Y-%m-%d").date()
            submission_date = datetime.strptime(submission_date, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )
        working_days = 0
        current_date = opened_date
        while current_date <= submission_date:  # 5 = Saturday, 6 = Sunday
            if current_date.weekday() < 5:
                working_days += 1
            current_date += timedelta(days=1)
        holiday_count = Holiday.objects.filter(
            holiday_date__range=(opened_date, submission_date)
        ).count()
    
        tat = max(working_days - holiday_count, 0)
        return Response({
            "opened_date": opened_date,
            "submission_date": submission_date,
            "working_days": working_days,
            "holiday_count": holiday_count,
            "tat": tat
        })
    
class RecruiterDashboardAPIView(ReadOnlyModelViewSet):
    permission_classes = [RecruiterDashboardPermission]
    @staticmethod
    def setFilters(data,type="submission"):
        filters = {}
        end_clients = data.get('endclients', [])
        accounts = data.get('accounts', [])
        recruiters = data.get('recruiters',[])
        # start_date = data.get('from_date')
        # end_date = data.get('to_date')
     
        if end_clients and end_clients[0] != 0:
                filters['Job__end_client_id__in'] = end_clients
        if accounts and accounts[0] != 0:
                filters['Job__account_id__in'] = accounts
        if recruiters and recruiters[0] !=0:
            if type=="submission":
                filters['recruiter__in']=recruiters
            else:
                filters['assigned_recruiter__in']=recruiters
        return filters

    @action(detail=False, methods=['post'], url_path='filter/recruiterdashboard')
    def recruiterDashboard(self,request):
        filter_type = request.data.get('filter_type')
        logger.debug("data we are getting is %s", request.data)
        start_date = request.data.get('from_date')
        end_date = request.data.get('to_date')
        filters = self.setFilters(request.data)
        current_year = datetime.now().year
        target_qs = TargetforTeam.objects.filter(employee_id=OuterRef('recruiter'),year=current_year)
        try:
            overall_data = Submissions.objects.select_related(
                'Job','recruiter').filter(**filters).aggregate(
                  
                    amsubs = Count('submission_id', filter=Q(am_sub_date__range=(start_date, end_date))),
                    csubs = Count('submission_id', filter=Q(client_sub_date__range=(start_date, end_date))),
                    techscreens = Count('submission_id', filter=Q(tech_screen_date__range=(start_date, end_date))),
                    interviews = Count('submission_id', filter=Q(client_interview_date__range=(start_date, end_date))),
                    offers = Count('submission_id', filter=Q(offer_date__range=(start_date, end_date))),
                    starts = Count('submission_id', filter=Q(start_date__range=(start_date, end_date))),
                    tat=Avg('turn_around_time')
                )
            recruiter_group_data = Submissions.objects.select_related(
                'Job','recruiter').filter(**filters).values('recruiter','recruiter__emp_fName').annotate(
                  
                    amsubs = Count('submission_id', filter=Q(am_sub_date__range=(start_date, end_date))),
                    csubs = Count('submission_id', filter=Q(client_sub_date__range=(start_date, end_date))),
                    techscreens = Count('submission_id', filter=Q(tech_screen_date__range=(start_date, end_date))),
                    interviews = Count('submission_id', filter=Q(client_interview_date__range=(start_date, end_date))),
                    offers = Count('submission_id', filter=Q(offer_date__range=(start_date, end_date))),
                    starts = Count('submission_id', filter=Q(start_date__range=(start_date, end_date))),
                    tat=Avg('turn_around_time'),
                     
                    target_am_submissions=Coalesce(
            Subquery(target_qs.values('target_am_submissions')[:1]),
            Value(0),
            output_field=IntegerField()
        ),
                    target_c_submissions=Coalesce(
            Subquery(target_qs.values('target_c_submissions')[:1]),
            Value(0),
            output_field=IntegerField()
        ),
                    target_offers=Coalesce(
            Subquery(target_qs.values('target_offers')[:1]),
            Value(0),
            output_field=IntegerField()
        )
                    ).order_by('-amsubs') 
            
            for item in recruiter_group_data:
                item['tat'] = round(item['tat'], 2) if item['tat'] is not None else None

            return Response({
              "grouped_data": list(recruiter_group_data),
              "overall_data":   overall_data
            }
            )
        except Exception as e:
            logger.error(traceback.format_exc())
            return Response({"error": str(e)}, status=500)
    @action(detail=False, methods=['post'], url_path='filter/recruiter_assigned_tat')
    def AssignedRecruiterDetails(self,request):
        start_date = request.data.get('from_date')
        end_date = request.data.get('to_date')
        filters = self.setFilters(request.data,type="Requirement")

# Step 1: Rank submissions made only by assigned recruiter
        try:
            job_recruiter_top2_avg_tat = (
    Submissions.objects
    .filter(
        Job_id=OuterRef('requirement_id'),                      # correlate to Requirements.Job_id
        recruiter_id=OuterRef('assigned_recruiter_id'), # correlate to Requirements.assigned_recruiter_id
        am_sub_date__range=(start_date, end_date),
    )
    .annotate(
        rn=Window(
            expression=RowNumber(),
            partition_by=[F('Job_id'), F('recruiter_id')],   # rank per job + recruiter
            order_by=F('client_sub_date').asc(),
        )
    )
    .filter(rn__lte=2)
    .values('Job_id', 'recruiter_id')
    .annotate(avg_tat=Avg('turn_around_time'))
    .values('avg_tat')[:1]
)

# Outer: annotate each requirement/job row with job_avg_tat, then group by recruiter
            overall_roles_tat_details = (
    Requirements.objects
    .filter(**filters)
    .annotate(
        job_avg_tat=Subquery(job_recruiter_top2_avg_tat),
    )
    .values(
        'assigned_recruiter_id',
        'assigned_recruiter__emp_fName',   # recruiter_name (adjust field)
    )
    .annotate(
        roles_assigned=Count(
            'requirement_id',
            filter=Q(req_opened_date__range=(start_date, end_date)),
            dristinct=True,
        ),
        active_roles=Count(
            'requirement_id',
            filter=Q(req_opened_date__range=(start_date, end_date)) &
                   Q(job_status__job_status="Active"),
            distinct=True,
        ),
        avg_tat=Avg('job_avg_tat'),  # recruiter-level avg of per-job avg tat
    ).order_by('-roles_assigned')
)
            for item in overall_roles_tat_details:
                item['avg_tat'] = round(item['avg_tat'], 2) if item['avg_tat'] is not None else None
            
            return Response({
                "overall_roles_tat_details": list(overall_roles_tat_details),
            })
        
        except Exception as e:
            logger.error(traceback.format_exc())    
            return Response({"error": str(e)}, status=500)

        

class SourcerDashboardView(ReadOnlyModelViewSet):
    permission_classes = [SourcerDashboardPermission]
    @staticmethod
    def setFilters(data,type="submission"):
        filters = {}
        end_clients = data.get('endclients', [])
        accounts = data.get('accounts', [])
        sourcers = data.get('recruiters',[])
     
        if end_clients and end_clients[0] != 0:
                filters['Job__end_client_id__in'] = end_clients
        if accounts and accounts[0] != 0:
                filters['Job__account_id__in'] = accounts
        if sourcers and sourcers[0] !=0:
            if type=="submission":
                filters['sourcer__in']=sourcers
            else:
                filters['assigned_sourcer__in']=sourcers
        if type=="submission":        
            filters['sourcer__department'] = 1
        else:
            filters['assigned_sourcer__department'] = 1
        return filters

    @action(detail=False, methods=['post'], url_path='filter/sourcerdashboard')
    def sourcerdashboard(self,request):
        filter_type = request.data.get('filter_type')
        logger.debug("data we are getting is %s", request.data)
        filters = self.setFilters(request.data)
        start_date = request.data.get('from_date')
        end_date = request.data.get('to_date')
        current_year = datetime.now().year
        target_qs = TargetforTeam.objects.filter(employee_id=OuterRef('sourcer'),year=current_year)
        try:
            overall_data = Submissions.objects.select_related(
                'Job','sourcer').filter(**filters).aggregate(
                    amsubs = Count('submission_id', filter=Q(am_sub_date__range=(start_date, end_date))),
                    csubs = Count('submission_id', filter=Q(client_sub_date__range=(start_date, end_date))),
                    techscreens=Count('submission_id', filter=Q(tech_screen_date__range=(start_date, end_date))),
                    interviews=Count('submission_id', filter=Q(client_interview_date__range=(start_date, end_date))),
                    offers=Count('submission_id', filter=Q(offer_date__range=(start_date, end_date))),
                    starts=Count('submission_id', filter=Q(start_date__range=(start_date, end_date))),
                    tat=Avg('turn_around_time')
                )
            recruiter_group_data = Submissions.objects.select_related(
                'Job','sourcer').filter(**filters).values('sourcer','sourcer__emp_fName').annotate(
                    amsubs = Count('submission_id', filter=Q(am_sub_date__range=(start_date, end_date))),
                    csubs = Count('submission_id', filter=Q(client_sub_date__range=(start_date, end_date))),
                    techscreens=Count('submission_id', filter=Q(tech_screen_date__range=(start_date, end_date))),
                    interviews=Count('submission_id', filter=Q(client_interview_date__range=(start_date, end_date))),
                    offers=Count('submission_id', filter=Q(offer_date__range=(start_date, end_date))),
                    starts=Count('submission_id', filter=Q(start_date__range=(start_date, end_date))),
                    tat=Avg('turn_around_time'),
                     
                    target_am_submissions=Coalesce(
            Subquery(target_qs.values('target_am_submissions')[:1]),
            Value(0),
            output_field=IntegerField()
        ),
                    target_c_submissions=Coalesce(
            Subquery(target_qs.values('target_c_submissions')[:1]),
            Value(0),
            output_field=IntegerField()
        ),
                    target_offers=Coalesce(
            Subquery(target_qs.values('target_offers')[:1]),
            Value(0),
            output_field=IntegerField()
        )
                    ).order_by().order_by('-amsubs')
            logger.debug(recruiter_group_data.query)
            for item in recruiter_group_data:
                item['tat'] = round(item['tat'], 2) if item['tat'] is not None else None
           
            return Response({
              "grouped_data": list(recruiter_group_data),
              "overall_data":   overall_data
            }
            )
        
        except Exception as e:
            logger.error(traceback.format_exc())
            return Response({"error": str(e)}, status=500)
        
    @action(detail=False, methods=['post'], url_path='filter/sourcer_assigned_tat')
    def AssignedRecruiterDetails(self,request):
        start_date = request.data.get('from_date')
        end_date = request.data.get('to_date')
        filters = self.setFilters(request.data,type="Requirement")
# Step 1: Rank submissions made only by assigned recruiter
        try:
            job_recruiter_top2_avg_tat = (
    Submissions.objects
    .filter(
        Job_id=OuterRef('requirement_id'),                      # correlate to Requirements.Job_id
        sourcer_id=OuterRef('assigned_sourcer_id'), # correlate to Requirements.assigned_recruiter_id
        am_sub_date__range=(start_date, end_date),
    )
    .annotate(
        rn=Window(
            expression=RowNumber(),
            partition_by=[F('Job_id'), F('sourcer_id')],   # rank per job + recruiter
            order_by=F('client_sub_date').asc(),
        )
    )
    .filter(rn__lte=2)
    .values('Job_id', 'sourcer_id')
    .annotate(avg_tat=Avg('turn_around_time'))
    .values('avg_tat')[:1]
)

# Outer: annotate each requirement/job row with job_avg_tat, then group by recruiter
            overall_roles_tat_details = (
    Requirements.objects
    .filter(**filters)
    .annotate(
        job_avg_tat=Subquery(job_recruiter_top2_avg_tat),
    )
    .values(
        'assigned_sourcer_id',
        'assigned_sourcer__emp_fName',   # sourcer_name (adjust field)
    )
    .annotate(
        roles_assigned=Count(
            'requirement_id',
            filter=Q(req_opened_date__range=(start_date, end_date)),
            distinct=True,
        ),
        active_roles=Count(
            'requirement_id',
            filter=Q(req_opened_date__range=(start_date, end_date)) &
                   Q(job_status__job_status="Active"),
            distinct=True,
        ),
        avg_tat=Avg('job_avg_tat'),  # recruiter-level avg of per-job avg tat
    ).order_by('-roles_assigned')
)
            for item in overall_roles_tat_details:
                item['avg_tat'] = round(item['avg_tat'], 2) if item['avg_tat'] is not None else None
            
            return Response({
                "overall_roles_tat_details": list(overall_roles_tat_details),
            })
        
        except Exception as e:
            logger.error(traceback.format_exc())    
            return Response({"error": str(e)}, status=500)