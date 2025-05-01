from django.urls import path,include
from .views import RequirementsViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'requirements', RequirementsViewSet)

urlpatterns = [
    path('', include(router.urls))
  
]
