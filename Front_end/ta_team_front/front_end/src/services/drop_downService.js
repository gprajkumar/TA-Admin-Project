import axios from "axios";
const baseurl = import.meta.env.VITE_API_BASE_URL;

const fetchDropdownData = async (endpoint) => {
  const response = await axios.get(`${baseurl}/ta_team/${endpoint}`);
  const data= response.data;
  return Array.isArray(data) ? data : data.results || [];
};

export const getClients = () => fetchDropdownData("clients");
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
export const getFilteredJobs = (from_date, to_date) => fetchFilteredJobs(from_date, to_date);
export const getFilteredSubmissions = (filterParams) => fetchFilteredSubmissions(filterParams);
export const getSubmissionsbyReqid =(reqid) => fetcchSubmissionsbyReq(reqid);
export const getCurrentCandidateStatus = () => fetchDropdownasArray("candidate_status")
const fetchDropdownasArray = async (endpoint) => {
  const response = await axios.get(`${baseurl}/ta_team/${endpoint}`);
  const data = response.data;

  // Return `data.results` if paginated, otherwise return `data` directly
  return Array.isArray(data) ? data : data.results || [];
};
const fetcchSubmissionsbyReq = async (reqid) =>
  {
    const response = await axios.get(`${baseurl}/ta_team/submissions/`, {
    params: { Job: reqid}
  });
    console.log(response.data);
    const data = response.data
  return Array.isArray(data)? data: data.results || [];
  }
  const fetchFilteredJobs = async(fromDate,toDate) =>
  {
    const response = await axios.get(`${baseurl}/ta_team/requirements/`, {
    params: { from_date: fromDate, to_date: toDate }
  });
    console.log(response.data);
 const data = response.data
  return Array.isArray(data)? data: data.results || [];
  }
const FilteredfetchDropdownData = async (endpoint, filter) => {
  const query = Object.keys(filter)
    .map((key) => `${key}=${encodeURIComponent(filter[key])}`)
    .join("&");
  const response = await axios.get(`${baseurl}/ta_team/${endpoint}/?${query}`);
 const data=response.data;
  return Array.isArray(data)? data: data.results || [];
};

export const getfilteredEmployees = (filter) =>
  FilteredfetchDropdownData("employees", filter);

  const fetchFilteredSubmissions = async(filterParams) =>
  {
    const response = await axios.get(`${baseurl}/ta_team/submissions/`, {
    params: { filterParams}
  });
}