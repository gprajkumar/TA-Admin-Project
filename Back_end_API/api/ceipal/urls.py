from django.urls import path
from .views import JobDetailsView, SubmissionsView


urlpatterns = [
    # Include other URL patterns related to Ceipal app here
    path('getjobposting/<str:job_id>/',JobDetailsView.as_view(), name='get_job_posting'),
    path('getsubmissions/<str:job_id>/',SubmissionsView.as_view(), name='get_submissions'),
]
