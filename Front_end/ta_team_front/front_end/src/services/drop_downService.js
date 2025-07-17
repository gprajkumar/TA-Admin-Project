import axiosInstance from "./axiosInstance";
const baseurl = import.meta.env.VITE_API_BASE_URL;

const fetchDropdownData = async (endpoint) => {
  const response = await axiosInstance.get(`/ta_team/${endpoint}`);
  const data= response.data;
  console.log(data);
  return Array.isArray(data) ? data : data.results || [];
};
export const getPaginatedJobReqs = async() =>{
  const response = await axiosInstance.get('/ta_team/requirements');
  return response.data;
}
export const getClients = () => fetchDropdownData("clients");
export const getEmployees = () => fetchDropdownData("employees");
export const getEndClients = () => fetchDropdownData("endclients");
export const getAccounts = () => fetchDropdownData("accounts");
export const getJobStatuses = () => fetchDropdownData("jobstatuses");
export const getRecruiters = () => fetchDropdownData("recruiters");
export const getSourcers = () => fetchDropdownData("sourcers");
export const getAccountManagers = () => fetchDropdownData("accountmanagers");
export const getHiringManagers = () => fetchDropdownData("hiringmanagers");
export const getSources = () => fetchDropdownData("sources");
export const getRoleTypes = () => fetchDropdownData("roletypes");

export const getJobreqs = () => fetchDropdownData("requirements");
export const getSubmissions = () => fetchDropdownData("submissions");
export const getFilteredJobs = (filterParams) => fetchFilteredJobs(filterParams);
export const getFilteredSubmissions = (filterParams) => fetchFilteredSubmissions(filterParams);
export const getSubmissionsbyReqid =(reqid) => fetcchSubmissionsbyReq(reqid);
export const getCurrentCandidateStatus = () => fetchDropdownasArray("candidate_status")
const fetchDropdownasArray = async (endpoint) => {
  const response = await axiosInstance.get(`/ta_team/${endpoint}`);
  const data = response.data;

  // Return `data.results` if paginated, otherwise return `data` directly
  return Array.isArray(data) ? data : data.results || [];
};
const fetcchSubmissionsbyReq = async (reqid) =>
  {
    const response = await axiosInstance.get(`/ta_team/submissions/`, {
    params: { Job: reqid}
  });
    console.log(response.data);
    const data = response.data
  return Array.isArray(data)? data: data.results || [];
  }
  const fetchFilteredJobs = async(filterParams) =>
  {
    console.log("filteredParams",filterParams);
    const response = await axiosInstance.get(`/ta_team/requirements/`,{
      params: {
        from_date: filterParams.from_date,
        to_date: filterParams.to_date,
        end_client: filterParams.end_client,
        client: filterParams.client,
        job_status: filterParams.job_status,
        role_type: filterParams.role_type,
        assigned_recruiter: filterParams.assigned_recruiter,
        assigned_sourcer: filterParams.assigned_sourcer,
        requirement_id: filterParams.Job,
        empcode:filterParams.empcode,
        page: filterParams.page || 1  // if using pagination
      }
  });
    console.log(response.data);
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
    params: { filterParams}
  });
}