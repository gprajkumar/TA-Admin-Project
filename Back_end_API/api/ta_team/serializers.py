from rest_framework import serializers
from .models.models import Client,EndClient,Account,AccountManager,HiringManager, AccountHead, AccountCoordinator, Feedback, JobStatus, Recruiter, Role_Type, Sourcer, Source, Tech_Screener, Screening_Status, Employee
from .models.requirement import Requirements
from .models.submission import Placement,Submissions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

class RequirementsSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.client_name', read_only=True)
    end_client_name = serializers.CharField(source='end_client.end_client_name', read_only=True)
    account_name = serializers.CharField(source='account.account_name', read_only=True)
    job_status_name = serializers.CharField(source='job_status.job_status', read_only=True)
    account_manager_name = serializers.CharField(source='accountManager.account_manager', read_only=True)
    hiring_manager_name = serializers.CharField(source='hiringManager.hiring_manager', read_only=True)
    role_type_name = serializers.CharField(source='role_type.role_type', read_only=True)
    filled_source_name = serializers.CharField(source='filled_source.source', read_only=True)

    assigned_recruiter_name = serializers.SerializerMethodField()
    assigned_sourcer_name = serializers.SerializerMethodField()
    filled_by_recruiter_name = serializers.SerializerMethodField()
    filled_by_sourcer_name = serializers.SerializerMethodField()

    class Meta:
        model = Requirements
        fields = [
            'requirement_id', 'job_code', 'job_title', 'req_opened_date',
            'client', 'client_name', 'end_client', 'end_client_name',
            'account', 'account_name', 'job_status', 'job_status_name',
            'assigned_recruiter', 'assigned_recruiter_name',
            'assigned_sourcer', 'assigned_sourcer_name',
            'filled_by_recruiter', 'filled_by_recruiter_name',
            'filled_by_sourcer', 'filled_by_sourcer_name',
            'accountManager', 'account_manager_name',
            'hiringManager', 'hiring_manager_name',
            'filled_source', 'filled_source_name',
            'notes', 'created_at', 'updated_at', 'role_type', 'role_type_name','no_of_positions','no_of_positions_filled','filled_date'
        ]

    def get_assigned_recruiter_name(self, obj):
        return obj.assigned_recruiter.emp_fName if obj.assigned_recruiter else None

    def get_assigned_sourcer_name(self, obj):
        return obj.assigned_sourcer.emp_fName if obj.assigned_sourcer else None

    def get_filled_by_recruiter_name(self, obj):
        return obj.filled_by_recruiter.emp_fName if obj.filled_by_recruiter else None

    def get_filled_by_sourcer_name(self, obj):
        return obj.filled_by_sourcer.emp_fName if obj.filled_by_sourcer else None


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class EndClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = EndClient
        fields = '__all__'

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

class AccountManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountManager
        fields = '__all__'

class HiringManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HiringManager
        fields = '__all__'

class AccountHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountHead
        fields = '__all__'

class AccountCoordinatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountCoordinator
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

class JobStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobStatus
        fields = '__all__'

class RecruiterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recruiter
        fields = '__all__'

class RoleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role_Type
        fields = '__all__'

class SourcerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sourcer
        fields = '__all__'

class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = '__all__'

class TechScreenerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tech_Screener
        fields = '__all__'

class ScreeningStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screening_Status
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    Job = serializers.PrimaryKeyRelatedField(queryset=Requirements.objects.all())
    job_details = RequirementsSerializer(source='Job', read_only=True)
    recruiter_name = serializers.CharField(source="recruiter.emp_fName", read_only=True)
    sourcer_name = serializers.CharField(source="sourcer.emp_fName", read_only=True)
    source_name = serializers.CharField(source="source.source", read_only=True)

    class Meta:
        model = Submissions
        fields = [
            'submission_id',
            'Job',
            'job_details',
            'submission_date',
            'candidate_name',
            'payrate',
            'w2_C2C',
            'recruiter',
            'recruiter_name',
            'sourcer',
            'sourcer_name',
            'source',
            'source_name',
            'am_sub_date',
            'am_screen_date',
            'tech_screen_date',
            'client_sub_date',
            'client_interview_date',
            'offer_date',
            'start_date',
            'current_status'
        ]



class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model= Employee
        fields='__all__'
        
class PlacementSerializer(serializers.ModelSerializer):
    class Meta:
       model= Placement
       fields='__all__'
       
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
     def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid username or password.")
        

      
        if not user.check_password(password):
            raise serializers.ValidationError("Password is Wrong")

     
        if not user.is_active:
            raise serializers.ValidationError("User account is inactive. Please contact Administrator.")

        data = super().validate(attrs)
        data['is_active'] = user.is_active
        return data