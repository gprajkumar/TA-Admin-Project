from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny

from .ceipal_client import ceipalClient
from .exceptions import CeipalAuthenticationError

class JobDetailsView(APIView):
    def get(self, request, job_id):
        try:
            print( "job_id in view:", job_id)
            client = ceipalClient()
            job_details = client.get_job_byID(job_id)
            return Response(job_details)
        except CeipalAuthenticationError as e:
            return Response(
                {
                    "error": "Ceipal Authentication Error",
                    "details": str(e)
                },
                status=401
            )

class SubmissionsView(APIView):
    def get(self, request, job_id):
        try:
            client = ceipalClient()
            submissions = client.get_submissions_by_jobID(job_id)
            return Response(submissions)
        except CeipalAuthenticationError as e:
            return Response({"error": str(e)}, status=401)