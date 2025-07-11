import axiosInstance from "./axiosInstance";


export const getCompleteAccountData = async () => {
  try {
    const response = await axiosInstance.get('ta_team/accountdata');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return [];
  }
};