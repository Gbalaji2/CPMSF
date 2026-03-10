import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("studentToken") ||
      localStorage.getItem("companyToken") ||
      localStorage.getItem("adminToken");

    console.log("TOKEN USED:", token);   // DEBUG

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.log("401 Unauthorized – token rejected");

      localStorage.removeItem("studentToken");
      localStorage.removeItem("companyToken");
      localStorage.removeItem("adminToken");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;