from django.db import models
from datetime import timedelta
from django.utils import timezone
# Create your models here.
class Ceipal_Token(models.Model):
    access_token = models.CharField(max_length=512)
    refresh_token = models.CharField(max_length=512)
    access_token_issued_at = models.DateTimeField(auto_now_add=True)
    access_token_updated_at = models.DateTimeField(auto_now=True)
    refresh_token_issued_at = models.DateTimeField(auto_now_add=True)
    refresh_token_updated_at = models.DateTimeField(auto_now=True)

    def is_expired(self, ttl_seconds: int = 3600, buffer_seconds: int = 120) -> bool:
        # token valid for 1 hour; refresh a bit early (buffer)
        expires_at = self.access_token_issued_at + timedelta(seconds=ttl_seconds)
        return timezone.now() >= (expires_at - timedelta(seconds=buffer_seconds))
    
    def refresh_is_expired(self, ttl_seconds: int = 604800, buffer_seconds: int = 120) -> bool:
        # refresh token valid for 7 days; refresh a bit early (buffer)
        expires_at = self.refresh_token_issued_at + timedelta(seconds=ttl_seconds)
        return timezone.now() >= (expires_at - timedelta(seconds=buffer_seconds))
