import django_filters
from ..models.requirement import Requirements
from ..models.submission import Submissions

class RequirementFilter(django_filters.FilterSet):
    from_date = django_filters.DateFilter(field_name="req_opened_date",lookup_expr='gte')
    to_date = django_filters.DateFilter(field_name="req_opened_date",lookup_expr='lte')
    
    class Meta:
        model = Requirements
        fields = ["from_date","to_date"]


class SubmissionFilter(django_filters.FilterSet):
    from_sub_date = django_filters.DateFilter(field_name="submission_date", lookup_expr='gte')
    to_sub_date = django_filters.DateFilter(field_name="submission_date", lookup_expr='lte')

    from_client_sub_date = django_filters.DateFilter(field_name="client_sub_date", lookup_expr='gte')
    to_client_sub_date = django_filters.DateFilter(field_name="client_sub_date", lookup_expr='lte')

    from_client_interview_date = django_filters.DateFilter(field_name="client_interview_date", lookup_expr='gte')
    to_client_interview_date = django_filters.DateFilter(field_name="client_interview_date", lookup_expr='lte')

    from_offer_date = django_filters.DateFilter(field_name="offer_date", lookup_expr='gte')
    to_offer_date = django_filters.DateFilter(field_name="offer_date", lookup_expr='lte')

    from_start_date = django_filters.DateFilter(field_name="start_date", lookup_expr='gte')
    to_start_date = django_filters.DateFilter(field_name="start_date", lookup_expr='lte')

    class Meta:
        model = Submissions
        fields = ['submission_date', 'client_sub_date', 'client_interview_date', 'offer_date', 'start_date', 'Job', 'recruiter', 'sourcer']
        

