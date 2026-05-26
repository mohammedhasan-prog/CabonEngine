import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";
import tokenStore from "./tokenStore";

type User = { id: string; email: string; name?: string } | null;

const AuthContext = createContext<{
  user: User;
  isLoading: boolean;
  login: (username: string, password: string, tenant?: string) => Promise<void>;
  logout: () => void;
} | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const access = tokenStore.getAccessToken();
    if (access) {
      api
        .get("/auth/me/")
        .then((r) => setUser(r.data))
        .catch(() => tokenStore.clear())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string, tenant?: string) => {
    const payload: any = { username, email: username, password };
    if (tenant) payload.tenant = tenant;
    const resp = await api.post("/auth/login/", payload);
    const { access, refresh } = resp.data;
    tokenStore.setTokens(access, refresh);
    const profile = await api.get("/auth/me/");
    setUser(profile.data);
  };

  const logout = () => {
    api.post("/auth/logout/").catch(() => undefined);
    tokenStore.clear();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
