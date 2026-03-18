import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("TOKEN USED:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization; // ✅ valid now
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

      // ✅ Clean properly
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;