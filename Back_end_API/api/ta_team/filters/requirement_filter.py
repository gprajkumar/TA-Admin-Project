import django_filters
from ..models.requirement import Requirements
from ..models.submission import Submissions

class RequirementFilter(django_filters.FilterSet):
    from_date = django_filters.DateFilter(field_name="req_opened_date",lookup_expr='gte')
    to_date = django_filters.DateFilter(field_name="req_opened_date",lookup_expr='lte')
    
    class Meta:
        model = Requirements
        fields = ["from_date","to_date","assigned_recruiter","assigned_sourcer","requirement_id","end_client","client","job_status","role_type"]


class SubmissionFilter(django_filters.FilterSet):
    from_sub_date = django_filters.DateFilter(field_name="submission_date", lookup_expr='gte')
    to_sub_date = django_filters.DateFilter(field_name="submission_date", lookup_expr='lte')



    # Filter by Job → Client → client_id (foreign key chaining)
    client = django_filters.BaseInFilter(field_name="Job__client__client_id", lookup_expr='in')
    # Filter by Job → End Client → end_client_id
    end_client = django_filters.BaseInFilter(field_name="Job__end_client__end_client_id", lookup_expr='in')
    # Filter by Job → Account → account_id
    account = django_filters.BaseInFilter(field_name="Job__account__account_id", lookup_expr='in')
    candidate_name = django_filters.CharFilter(field_name="candidate_name", lookup_expr='icontains')
    current_status = django_filters.BaseInFilter(field_name="current_status", lookup_expr='in')
    current_new_status = django_filters.BaseInFilter(field_name="current_new_status", lookup_expr='in')
    class Meta:
        model = Submissions
        fields = ['from_sub_date','to_sub_date','Job', 'recruiter', 'sourcer','source','candidate_name','current_status','current_new_status','account','end_client','client']
        

