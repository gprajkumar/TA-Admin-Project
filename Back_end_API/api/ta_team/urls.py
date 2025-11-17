from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'requirements', RequirementsViewSet,basename='requirements')
router.register(r'clients',ClientViewSet)
router.register(r'endclients', EndClientViewSet)
router.register(r'accounts', AccountViewSet)
router.register(r'accountmanagers', AccountManagerViewSet)
router.register(r'hiringmanagers', HiringManagerViewSet)
router.register(r'accountheads', AccountHeadViewSet)
router.register(r'accountcoordinators', AccountCoordinatorViewSet)
router.register(r'feedbacks', FeedbackViewSet)
router.register(r'jobstatuses', JobStatusViewSet)
router.register(r'roletypes', RoleTypeViewSet)
router.register(r'sources', SourceViewSet)
router.register(r'techscreeners', TechScreenerViewSet)
router.register(r'screeningstatuses', ScreeningStatusViewSet)
router.register(r'submissions', SubmisionViewSet, basename='submissions')
router.register(r'employees',EmployeeViewSet)
router.register(r'accountdata',ClientDashboardView)
router.register(r'placements',PlacementViewSet)

router.register(r'candidate_status',UniqueCandidate_Status_ViewSet,basename='candidate_status')
urlpatterns = [
    path('', include(router.urls)),
    path('refresh-client-dashboard/', RefreshClientDashboardView.as_view()), 
    path('requirement-search/', RequirementSearchDropdownAPI.as_view(), name='requirement-search'),
    path('clientdashboard-updated-date/', get_client_update_date.as_view(), name='clientdashboard-updated-date'),
    path('debug-auth/', debug_auth, name='debug-auth')
  
]
