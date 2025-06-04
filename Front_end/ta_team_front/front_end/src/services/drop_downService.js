import axios from "axios";
const baseurl = import.meta.env.VITE_API_BASE_URL;

const fetchDropdownData = async (endpoint) => {
  const response = await axios.get(`${baseurl}/ta_team/${endpoint}`);
  return response.data.results;
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
export const getFilteredJobs = (from_date, to_date) => fetchFilteredJobs(from_date, to_date);

  const fetchFilteredJobs = async(fromDate,toDate) =>
  {
    const response = await axios.get(`${baseurl}/ta_team/requirements/`, {
    params: { from_date: fromDate, to_date: toDate }
  });
    console.log(response.data);
  return response.data.results;
  }
const FilteredfetchDropdownData = async (endpoint, filter) => {
  const query = Object.keys(filter)
    .map((key) => `${key}=${encodeURIComponent(filter[key])}`)
    .join("&");
  const response = await axios.get(`${baseurl}/ta_team/${endpoint}/?${query}`);
  console.log(response.data);
  return response.data.results;
};

export const getfilteredEmployees = (filter) =>
  FilteredfetchDropdownData("employees", filter);
