import axiosInstance from "./axiosInstance";


export const getDashboardAllData = async (filters) => {
  try {
    const response = await axiosInstance.post('ta_team/accountdata/filter/all/', filters);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {};
  }
};

export const getCompleteAccountData = async (filters) => {
  try {
    const response = await axiosInstance.post('ta_team/accountdata/filter/',filters);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return [];
  }

};
export const getMonthlySubsData = async(filters) =>{
  try{
    const response = await axiosInstance.post('ta_team/accountdata/filter/monthdata/',filters);
    return response.data;
  }
  catch(error){
    console.error('Error fetching dashboard data:', error);
    return [];
  }
};
export const getRecruiterSubmissions = async(filters) =>{
  try{
const response = await axiosInstance.post('ta_team/recruitersdata/filter/recruiterdashboard/',filters);
return response.data;
  }
  catch(error)
  {
  console.error('Error fetching dashboard data:', error);
    return [];
  }
};
export const getRecruitertatAssigned = async(filters) =>{
  try{
const response = await axiosInstance.post('ta_team/recruitersdata/filter/recruiter_assigned_tat/',filters);
return response.data;
  }
  catch(error)
  {
  console.error('Error fetching dashboard data:', error);
    return [];
  }
};
export const getSourcertatAssigned = async(filters) =>{
  try{
const response = await axiosInstance.post('ta_team/sourcersdata/filter/sourcer_assigned_tat/',filters);
return response.data;
  }
  catch(error)
  {
  console.error('Error fetching dashboard data:', error);
    return [];
  }
};
export const getSourcerSubmissions = async(filters) =>{
  try{
const response = await axiosInstance.post('ta_team/sourcersdata/filter/sourcerdashboard/',filters);
return response.data;
  }
  catch(error)
  {
  console.error('Error fetching dashboard data:', error);
    return [];
  }
};
  export const getCompleteEndClientData = async (filters) => {
  try {
    const response = await axiosInstance.post('ta_team/accountdata/filter/',filters);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return [];
  }
};
export const getRoleTypeGroupbyData = async(filters) =>{
  try{
    const response = await axiosInstance.post('ta_team/accountdata/filter/jobroletypes/',filters);
    return response.data;
  }
  catch(error){
    console.error('Error fetching dashboard data:', error);
    return [];
  }
};
export const getPipelineorCancelledData = async(filters) =>{
  try{
    const response = await axiosInstance.post('ta_team/accountdata/filter/pipelineAndCancelledCount/',filters);
    return response.data;
  }
  catch(error){
    console.error('Error fetching dashboard data:', error);
    return [];
  }
};

export const getJobStatusGroupbyData = async(filters) =>{
  try{
   
    const response = await axiosInstance.post('ta_team/accountdata/filter/jobstatuses/',filters);
    return response.data;
  }
  catch(error){
    console.error('Error fetching dashboard data:', error);
    return [];
  }
};
export const formatDateMMDDYYYY = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${month}/${day}/${year}`;
};
export const getcarryforwardActiveData = async(filters) =>{
  try{
    const response = await axiosInstance.post('ta_team/accountdata/filter/carryforwardroles/',filters);
    return response.data;
  }
  catch(error){
    console.error('Error fetching dashboard data:', error);
    return [];
  }
};
export const getdashboardUpdateData = async() =>{
  try{
    const response = await axiosInstance.get("ta_team/clientdashboard-updated-date/");
    return response.data;
  }
  catch(error){
    console.error('Error fetching dashboard data:', error);
    return [];
  }
};