import axios, {type AxiosInstance, AxiosError } from "axios";
import { API_BASE_URL, AUTH_ROUTES } from "@/constants/apiRoutes";

const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

// ----------------------------
// REQUEST INTERCEPTOR
// ----------------------------
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------
// RESPONSE INTERCEPTOR
// ----------------------------
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config;

    if (error.response?.status === 401) {
      return handleUnauthorized(error, original);
    }

    return Promise.reject(error);
  }
);

// ----------------------------
// REFRESH TOKEN LOGIC
// ----------------------------
let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

const handleUnauthorized = async (error: AxiosError, original: any) => {
  if (!original || original._retry) {
    return Promise.reject(error);
  }

  original._retry = true;

  if (isRefreshing) {
    await new Promise<void>((resolve) => refreshQueue.push(resolve));
    return httpClient(original);
  }

  try {
    isRefreshing = true;

    const response = await axios.post(
      AUTH_ROUTES.REFRESH,
      {},
      { withCredentials: true }
    );

    const newToken = response?.data?.accessToken;

    if (newToken) {
      localStorage.setItem("auth_token", newToken);
      original.headers.Authorization = `Bearer ${newToken}`;

      refreshQueue.forEach((resolve) => resolve());
      refreshQueue = [];

      return httpClient(original);
    }
  } catch (err) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.href = "/login";
  } finally {
    isRefreshing = false;
  }

  return Promise.reject(error);
};

export default httpClient;
