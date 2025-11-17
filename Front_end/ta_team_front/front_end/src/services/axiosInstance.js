import axios from 'axios';
import { msalInstance } from "./utilities/msalInstance";
import { loginRequest } from "./utilities/authConfig";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       const refreshToken = localStorage.getItem("refreshToken");
//       try {
//         const res = await axios.post(`${baseURL}/api/token/refresh/`, {
//           refresh: refreshToken,
//         });

//         const newAccess = res.data.access;
//         localStorage.setItem("accessToken", newAccess);

//         // Retry the original request with new token
//         originalRequest.headers.Authorization = `Bearer ${newAccess}`;
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, force logout
//         localStorage.clear();
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );


const getToken = async () => {
  try {
    const accounts = msalInstance.getAllAccounts();
    console.log("[axiosInstance] MSAL accounts:", accounts);

    if (!accounts || accounts.length === 0) {
      // Not logged in -> no token
      return null;
    }

    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    const response = await msalInstance.acquireTokenSilent(request);
    console.log("[axiosInstance] Got token (exp):", response.expiresOn);
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