from rest_framework import serializers
from .models.models import Client,EndClient,Account,AccountManager,HiringManager, AccountHead, AccountCoordinator, Feedback, JobStatus, Recruiter, Role_Type, Sourcer, Source, Tech_Screener, Screening_Status, Employee
from .models.requirement import Requirements
from .models.submission import Submissions

class RequirementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requirements
        fields = '__all__'
        
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
    class Meta:
        model = Submissions
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model= Employee
        fields='__all__'