import axios, { AxiosError } from "axios";
import cookie from "./utils/cookie";

const axiosClient = axios.create({
  // TODO: base url goes here
  baseURL: process.env.API_URL || "http://localhost:3000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=utf-8",
  },
});

// Interceptors
// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = cookie.get("accessToken");

    if (accessToken) {
      config.headers["Authorization"] = accessToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      cookie.delete("accessToken");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
