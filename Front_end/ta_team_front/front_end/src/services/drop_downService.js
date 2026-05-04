import axiosInstance from "./axiosInstance";


const fetchDropdownData = async (endpoint) => {
  const response = await axiosInstance.get(`/ta_team/${endpoint}/`);
  const data= response.data;
  return Array.isArray(data) ? data : data.results || [];
};
export const getPaginatedJobReqs = async() =>{
  const response = await axiosInstance.get('/ta_team/requirements/');
  return response.data;
}
export const tatCount = async (submission_date,opened_date) => {
  const response = await axiosInstance.get('/ta_team/tatcount/', {
    params: {
      submission_date: submission_date, 
      opened_date: opened_date
    }
  });
  return response.data;
}

export const fetchCurrentEmployee = async () => {

  const res = await axiosInstance.get("/api/login/");

  return res.data;
};

export const authdebug = async() =>{
  const response = await axiosInstance.get('/ta_team/debug-auth/');
  return response.data;
}



export const getClients = () => fetchDropdownData("clients");
export const getEmployees = () => fetchDropdownData("employees");
export const getEndClients = () => fetchDropdownData("endclients");
export const getAccounts = () => fetchDropdownData("accounts");
export const getJobStatuses = () => fetchDropdownData("jobstatuses");
export const getRecruiters = () => fetchDropdownData("recruiters");
export const getSourcers = () => fetchDropdownData("sourcers");
export const getSubmissionStatuses = () => fetchDropdownData("submissionstatuses");
export const getAccountManagers = () => fetchDropdownData("accountmanagers");
export const getHiringManagers = () => fetchDropdownData("hiringmanagers");
export const getSources = () => fetchDropdownData("sources");
export const getScreeningStatuses = () => fetchDropdownData("screeningstatuses");
export const getTechScreeners = () => fetchDropdownData("techscreeners");
export const getTechScreens = () => fetchDropdownData("tech-screens");
export const getRoleTypes = () => fetchDropdownData("roletypes");
export const getCurrentPermissions = (designation_id) => fetchPermissionData(designation_id);
export const getJobreqs = () => fetchDropdownData("requirements");
export const getSubmissions = () => fetchDropdownData("submissions");
export const getFilteredJobs = (filterParams) => fetchFilteredJobs(filterParams);
export const getFilteredSubmissions = (filterParams) => fetchFilteredSubmissions(filterParams);
export const getFilteredTechScreens = async (filterParams = {}) => {
  const response = await axiosInstance.get('/ta_team/tech-screens/', {
    params: {
      job: filterParams.job || undefined,
      candidate_name: filterParams.candidate_name || undefined,
      tech_screener: filterParams.tech_screener?.length ? filterParams.tech_screener.join(',') : undefined,
      screening_status: filterParams.screening_status?.length ? filterParams.screening_status.join(',') : undefined,
      from_date: filterParams.from_date || undefined,
      to_date: filterParams.to_date || undefined,
      empcode: filterParams.empcode || undefined,
      page: filterParams.page || 1,
    },
  });
  return response.data;
};
export const getSubmissionsbyReqid =(reqid) => fetcchSubmissionsbyReq(reqid);
export const getCurrentCandidateStatus = () => fetchDropdownasArray("candidate_status")
const fetchDropdownasArray = async (endpoint) => {
  const response = await axiosInstance.get(`/ta_team/${endpoint}/`);
  const data = response.data;

  // Return `data.results` if paginated, otherwise return `data` directly
  return Array.isArray(data) ? data : data.results || [];
};
const fetchPermissionData = async (designation_id) => {
    try {
      const response = await axiosInstance.get(`/ta_team/role-permissions/`, {
        params: { id: designation_id || "" }
      });
      const permissions = response.data;
      console.log("Fetched role permissions:", permissions);
      return permissions;
    }
    catch (error) {
      console.error("Error fetching role permissions:", error); 
    }
  }
const fetcchSubmissionsbyReq = async (reqid) =>
  {
    const response = await axiosInstance.get(`/ta_team/submissions/`, {
    params: { Job: reqid,page_size:1000  // to get all submissions for the reqid
    }
  });
    const data = response.data
  return Array.isArray(data)? data: data.results || [];
  }
  const fetchFilteredJobs = async(filterParams) =>
  {

    const response = await axiosInstance.get(`/ta_team/requirements/`,{
      params: {
        from_date: filterParams.from_date,
        to_date: filterParams.to_date,
        end_client: filterParams.end_client,
        client: filterParams.client,
        job_status: filterParams.job_status,
        role_type: filterParams.role_type,
        account: filterParams.account,
        assigned_recruiter: filterParams.assigned_recruiter,
        assigned_sourcer: filterParams.assigned_sourcer,
        requirement_id: filterParams.Job,
        empcode:filterParams.empcode,
        page: filterParams.page || 1
      }
  });
 const data = response.data
  //return Array.isArray(data)? data: data.results || [];
  return data;
  }
const FilteredfetchDropdownData = async (endpoint, filter) => {
  const query = Object.keys(filter)
    .map((key) => `${key}=${encodeURIComponent(filter[key])}`)
    .join("&");
  const response = await axiosInstance.get(`/ta_team/${endpoint}/?${query}`);
 const data=response.data;
  return Array.isArray(data)? data: data.results || [];
};

export const getfilteredEmployees = (filter) =>
  FilteredfetchDropdownData("employees", filter);

  const fetchFilteredSubmissions = async(filterParams) =>
  {
    const response = await axiosInstance.get(`/ta_team/submissions/`, {
    params: { 
       Job: filterParams.Job,
    account: filterParams.account,
    end_client: filterParams.end_client,
    client: filterParams.client,
    recruiter: filterParams.recruiter,
    sourcer: filterParams.sourcer,
    from_sub_date: filterParams.from_sub_date,
    to_sub_date: filterParams.to_sub_date,
    candidate_name: filterParams.candidate_name,
    current_status: filterParams.current_status,
    current_new_status: filterParams.current_new_status,
    source: filterParams.source,
    empcode:filterParams.empcode,
    page: filterParams.page || 1 
    }
  });
  return response.data;
  
}