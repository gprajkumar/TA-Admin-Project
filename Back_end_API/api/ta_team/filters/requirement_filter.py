import django_filters
from ..models.requirement import Requirements

class RequirementFilter(django_filters.FilterSet):
    from_date = django_filters.DateFilter(field_name="req_opened_date",lookup_expr='gte')
    to_date = django_filters.DateFilter(field_name="req_opened_date",lookup_expr='lte')
    
    class Meta:
        model = Requirements
        fields = ["from_date","to_date"]