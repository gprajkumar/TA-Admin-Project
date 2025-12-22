import requests
from .token_management import CeipalTokenManager
from .exceptions import CeipalAuthenticationError

class ceipalClient:
    def __init__(self):
        self.token_manager = CeipalTokenManager()
        self.base_url = self.token_manager.base_url
        self.access_token = self.token_manager.get_token()
    
    def get_headers(self):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.access_token}",
            "Accept": "application/json"
        }
        return headers
    
    def get_job_byID(self,job_id):
        url = f"{self.base_url}/getJobPostingsList?limit=5&searchkey=TTS104"
        headers = self.get_headers()
        payload = {}
        response = requests.request("GET", url, headers=headers, data=payload)
        print("Response Status Code for get job by ID:", response.text)
        if response.status_code == 200:
            return response.json()
        else:
            raise CeipalAuthenticationError("Failed to fetch job details.")
    
    def get_submissions_by_jobID(self,job_id):
        headers = self.get_headers()
        url = f"{self.base_url}/getSubmissionsList?bearer token={self.access_token}&job_id={job_id}"
        
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise CeipalAuthenticationError("Failed to fetch submissions for the job.")