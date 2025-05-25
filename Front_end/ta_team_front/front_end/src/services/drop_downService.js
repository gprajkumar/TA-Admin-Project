import axios from "axios";
 const baseurl = import.meta.env.VITE_API_BASE_URL

const fetchDropdownData = async (endpoint) =>
    {
        const response = await axios.get(`${baseurl}/ta_team/${endpoint}`);
        return response.data;
    } 

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