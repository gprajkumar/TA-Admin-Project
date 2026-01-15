import time
import requests
import jwt
from jwt import PyJWKClient
from django.conf import settings
from django.core.cache import cache
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from django.contrib.auth import get_user_model

User = get_user_model()


class AzureADJWTAuthentication(BaseAuthentication):
    OPENID_CACHE_KEY = "azuread_openid_config"
    JWKS_CLIENT_CACHE_KEY = "azuread_jwks_client"
    CACHE_TTL_SECONDS = 60 * 60  # 1 hour

    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")

        if not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ", 1)[1].strip()
        if not token:
            return None

        user, claims = self._validate_token(token)
        return (user, claims)

    # --------------------------------------------------

    def _get_openid_config(self, tenant_id):
        cached = cache.get(self.OPENID_CACHE_KEY)
        if cached:
            return cached

        url = f"https://login.microsoftonline.com/{tenant_id}/v2.0/.well-known/openid-configuration"

        try:
            resp = requests.get(url, timeout=5)
            resp.raise_for_status()
            data = resp.json()
            cache.set(self.OPENID_CACHE_KEY, data, timeout=self.CACHE_TTL_SECONDS)
            return data
        except Exception:
            raise exceptions.AuthenticationFailed("OpenID config fetch failed")

    # --------------------------------------------------

    def _get_jwk_client(self, jwks_uri):
        client = cache.get(self.JWKS_CLIENT_CACHE_KEY)
        if client:
            return client

        client = PyJWKClient(jwks_uri)
        try:
            cache.set(self.JWKS_CLIENT_CACHE_KEY, client, timeout=self.CACHE_TTL_SECONDS)
        except Exception:
            pass

        return client

    # --------------------------------------------------

    def _validate_token(self, token):
        config = settings.AZURE_AD_CONFIG
        tenant_id = config["TENANT_ID"]
        audience = config["AUDIENCE"]

        # Decode unverified claims (used implicitly for validation flow)
        unverified = jwt.decode(token, options={"verify_signature": False})

        openid = self._get_openid_config(tenant_id)
        jwks_uri = openid["jwks_uri"]

        # Resolve signing key
        try:
            jwk_client = self._get_jwk_client(jwks_uri)
            signing_key = jwk_client.get_signing_key_from_jwt(token)
        except Exception:
            raise exceptions.AuthenticationFailed("Invalid token signing key")

        # Decode token (audience verified, issuer checked manually)
        try:
            claims = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience=audience,
                options={
                    "require": ["exp", "iat"],
                    "verify_iss": False,
                },
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token expired")
        except jwt.InvalidAudienceError:
            raise exceptions.AuthenticationFailed("Invalid audience")
        except jwt.InvalidTokenError as e:
            raise exceptions.AuthenticationFailed(f"Invalid token: {e}")

        # --------------------------------------------------
        # Manual issuer validation (Azure v1 + v2)
        token_iss = (claims.get("iss") or "").rstrip("/")
        expected_v2 = f"https://login.microsoftonline.com/{tenant_id}/v2.0".rstrip("/")
        expected_v1 = f"https://sts.windows.net/{tenant_id}".rstrip("/")

        if token_iss not in {expected_v1, expected_v2}:
            raise exceptions.AuthenticationFailed(
                f"Invalid token issuer: {token_iss}"
            )

        # --------------------------------------------------
        # Scope check
        scopes = claims.get("scp", "")
        scopes_list = scopes.split() if isinstance(scopes, str) else []

        if "access_as_user" not in scopes_list:
            raise exceptions.AuthenticationFailed(
                "Missing required scope: access_as_user"
            )

        # --------------------------------------------------
        # User lookup (NO creation)
        username = (
            claims.get("preferred_username")
            or claims.get("upn")
            or claims.get("oid")
        )

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed(
                "Your Account not registered in the TA Team System. Please contact Admin."
            )

        return user, claims
