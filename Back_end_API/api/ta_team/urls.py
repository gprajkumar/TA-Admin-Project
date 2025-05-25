from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'requirements', RequirementsViewSet)
router.register(r'clients',ClientViewSet)
router.register(r'endclients', EndClientViewSet)
router.register(r'accounts', AccountViewSet)
router.register(r'accountmanagers', AccountManagerViewSet)
router.register(r'hiringmanagers', HiringManagerViewSet)
router.register(r'accountheads', AccountHeadViewSet)
router.register(r'accountcoordinators', AccountCoordinatorViewSet)
router.register(r'feedbacks', FeedbackViewSet)
router.register(r'jobstatuses', JobStatusViewSet)
router.register(r'recruiters', RecruiterViewSet)
router.register(r'roletypes', RoleTypeViewSet)
router.register(r'sourcers', SourcerViewSet)
router.register(r'sources', SourceViewSet)
router.register(r'techscreeners', TechScreenerViewSet)
router.register(r'screeningstatuses', ScreeningStatusViewSet)
router.register(r'submissions', SubmisionViewSet)
router.register(r'employees',EmployeeViewSet)
urlpatterns = [
    path('', include(router.urls))
  
]
