import axios from "axios";
import tokenStore from "../auth/tokenStore";

const baseURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// On 401 try refresh once
let isRefreshing = false;
let refreshQueue: Array<(token?: string) => void> = [];

function processQueue(error: any, token: string | null = null) {
  refreshQueue.forEach((cb) => cb(token || null));
  refreshQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;
    if (err.response && err.response.status === 401 && !originalReq._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token: string | null) => {
            if (token) {
              originalReq.headers["Authorization"] = `Bearer ${token}`;
              resolve(axios(originalReq));
            } else {
              reject(err);
            }
          });
        });
      }

      originalReq._retry = true;
      isRefreshing = true;
      const refresh = tokenStore.getRefreshToken();
      if (!refresh) {
        tokenStore.clear();
        isRefreshing = false;
        return Promise.reject(err);
      }

      try {
        const resp = await axios.post(`${api.defaults.baseURL}/auth/refresh/`, { refresh });
        const newAccess = resp.data.access;
        tokenStore.setAccessToken(newAccess);
        originalReq.headers["Authorization"] = `Bearer ${newAccess}`;
        processQueue(null, newAccess);
        return axios(originalReq);
      } catch (e) {
        processQueue(e, null);
        tokenStore.clear();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
