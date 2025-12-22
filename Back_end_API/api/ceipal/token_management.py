import requests
from django.conf import settings
from .models import Ceipal_Token
from .exceptions import CeipalAuthenticationError
from django.db import transaction
from django.utils import timezone
import json

class CeipalTokenManager:
    def __init__(self):
        self.base_url = settings.CEIPAL_BASE_URL
        self.api_key = settings.CEIPAL_API_KEY
        self.username = settings.CEIPAL_EMAIL
        self.password = settings.CEIPAL_PASSWORD
    
    def create_token(self):
        url = f"{self.base_url}/createAuthtoken"
        headers = {
            'Content-Type': 'application/json',
            "Accept": "application/json"
            }
        payload = json.dumps({
            "email": f"{self.username}" ,
            "password": f"{self.password}",
            "api_key": f"{self.api_key}"
        })
        token = {};
        response = requests.request("POST", url, headers=headers, data=payload)
        print("Response Details:", response.text)
        if response.status_code == 200:
            try:
                data = response.json()
            except ValueError:
                raise CeipalAuthenticationError(f"Invalid JSON response: {response.text}")
            token["access_token"] = data.get("access_token")
            token["refresh_token"] = data.get("refresh_token")
        else:
            raise CeipalAuthenticationError("Access token not found in response.")
        return token
    
    def get_new_token(self, refresh_token):
        url = f"{self.base_url}/refresh_token"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {refresh_token}",
            "Accept": "application/json"
        }
        payload = {}
        response = requests.post(url, json=payload, headers=headers)
        print("Response Status Code for refresh token:", response.text)
        if response.status_code == 200:
            data = response.json()
            new_access_token = data.get("access_token")
        else:
            raise CeipalAuthenticationError("New access token not found in response.")
        return new_access_token
    
    def get_token(self):
        try:
            row = Ceipal_Token.objects.first()

            if row:
                if row.is_expired():
                    if row.refresh_is_expired():
                        token = self.create_token()
                        with transaction.atomic():
                            row.access_token = token["access_token"]
                            row.refresh_token = token["refresh_token"]
                            row.access_token_issued_at = timezone.now()
                            row.refresh_token_issued_at = timezone.now()
                            row.save()
                        return token["access_token"]
                    else:
                        new_token = self.get_new_token(row.refresh_token)
                        with transaction.atomic():
                            row.access_token = new_token
                            row.access_token_issued_at = timezone.now()
                            row.access_token_updated_at = timezone.now()
                            row.save()
                        return new_token
                else:
                    return row.access_token
            else:
                token = self.create_token()
                with transaction.atomic():
                    Ceipal_Token.objects.create(
                        access_token=token["access_token"],
                        refresh_token=token["refresh_token"],
                        access_token_issued_at=timezone.now(),
                        refresh_token_issued_at=timezone.now()
                    )
                access_token = token["access_token"]
                return access_token
        except CeipalAuthenticationError as e:
            raise e

