const ACCESS_KEY = "esg_access_token";
const REFRESH_KEY = "esg_refresh_token";

const tokenStore = {
  setTokens(access: string, refresh: string) {
    try {
      localStorage.setItem(ACCESS_KEY, access);
      localStorage.setItem(REFRESH_KEY, refresh);
    } catch (e) {
      console.warn("Failed to persist tokens", e);
    }
  },
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },
  setAccessToken(token: string) {
    try {
      localStorage.setItem(ACCESS_KEY, token);
    } catch (e) {
      console.warn("Failed to set access token", e);
    }
  },
  clear() {
    try {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
    } catch (e) {
      console.warn("Failed to clear tokens", e);
    }
  },
};

export default tokenStore;
