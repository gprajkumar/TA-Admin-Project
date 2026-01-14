import axios from 'axios';
import { msalInstance } from "./utilities/msalInstance";
import { loginRequest } from "./utilities/authConfig";

const baseURL = import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create({
  baseURL: baseURL,
});




export const getToken = async () => {
  try {
    const accounts = msalInstance.getAllAccounts();
   

    if (!accounts || accounts.length === 0) {
      // Not logged in -> no token
      return null;
    }

    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    const response = await msalInstance.acquireTokenSilent(request);
  
    return response.accessToken;
  } catch (e) {
    console.error("[axiosInstance] acquireTokenSilent error:", e);
    // If you want, you could detect interaction_required and redirect to login here
    return null;
  }
};

/**
 * Request interceptor: attach Bearer token if we have one.
 */
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("[axiosInstance] No token available, sending request without Authorization header");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: basic 401 handling.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.warn("[axiosInstance] 401 from API, user may need to login again.");
      // Optionally:
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;