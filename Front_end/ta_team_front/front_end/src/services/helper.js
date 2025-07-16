import axiosInstance from "./axiosInstance";


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
  export const getCompleteEndClientData = async (filters) => {
  try {
    const response = await axiosInstance.post('ta_team/accountdata/filter/',filters);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return [];
  }
};