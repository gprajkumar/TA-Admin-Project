from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, NotAuthenticated

def custom_exception_handler(exc, context):
    resp = exception_handler(exc, context)

    # If DRF can't handle it, return default
    if resp is None:
        return resp

    # Normalize auth errors into a frontend-friendly JSON response
    if isinstance(exc, (AuthenticationFailed, NotAuthenticated)):
        # DRF stores message under "detail"
        message = resp.data.get("detail", "Authentication failed.")

        return Response(
            {
                "ok": False,
                "code": "AUTH_FAILED",
                "message": message
            },
            status=status.HTTP_401_UNAUTHORIZED,  # ✅ return 401 not 403
        )

    return resp
