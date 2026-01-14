import requests
import jwt
from jwt import PyJWKClient
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from django.contrib.auth import get_user_model

User = get_user_model()

class AzureADJWTAuthentication(BaseAuthentication):

    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth_header.startswith("Bearer "):
            return None  # no/malformed auth -> DRF treats as unauthenticated

        token = auth_header.split(" ", 1)[1].strip()
        if not token:
            return None

        user, claims = self._validate_token(token)
        return (user, claims)

    def _validate_token(self, token):
        config = settings.AZURE_AD_CONFIG
        tenant_id = config["TENANT_ID"]
        audience = config["AUDIENCE"]
     
        # 1. Fetch OpenID configuration
        openid_config_url = (
            f"https://login.microsoftonline.com/{tenant_id}/v2.0/.well-known/openid-configuration"
        )
        try:
            openid_config = requests.get(openid_config_url).json()
     
        except Exception as e:
            raise exceptions.AuthenticationFailed(
                f"Failed to fetch OpenID configuration: {e}"
            )

        jwks_uri = openid_config["jwks_uri"]

        # 2. Get signing key from JWKS
        try:
            jwk_client = PyJWKClient(jwks_uri)

            signing_key = jwk_client.get_signing_key_from_jwt(token)
        except Exception as e:
            raise exceptions.AuthenticationFailed(f"Invalid token (key error): {e}")

        # 3. Decode and verify JWT  (NO issuer check)
        try:
            claims = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience=audience,
                # issuer=issuer,  # <-- REMOVE THIS LINE
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError as e:
            raise exceptions.AuthenticationFailed(f"Invalid token: {e}")

        # 4. Check scope
        scopes = claims.get("scp", "")
        if isinstance(scopes, str):
            scopes_list = scopes.split()
        else:
            scopes_list = scopes or []

        required_scopes = {"access_as_user"}
        if not required_scopes.intersection(scopes_list):
            raise exceptions.AuthenticationFailed(
                f"Required scope not present. Got scopes: {scopes_list}"
            )

        # 5. Build a simple user object
        username = (
            claims.get("preferred_username")
            or claims.get("upn")
            or claims.get("oid")
            or "azure_user"
        )

        email = claims.get("email") or claims.get("preferred_username") or username
        print("Authenticated username:", username)

        #  # Get or create the user in the local database
        # user, created = User.objects.get_or_create(
        #     username=username,
        #     defaults={"email": email},
        # )
        # Get existing user ONLY — do NOT create
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed(
                "Your Microsoft account is not registered in the TA system. Please contact HR or the administrator."
            )   
    

        return user, claims