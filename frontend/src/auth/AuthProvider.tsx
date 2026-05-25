import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";
import tokenStore from "./tokenStore";

type User = { id: string; email: string; name?: string } | null;

const AuthContext = createContext<{
  user: User;
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

  useEffect(() => {
    // Optionally fetch profile if token exists
    const access = tokenStore.getAccessToken();
    if (access) {
      api
        .get("/auth/me/")
        .then((r) => setUser(r.data))
        .catch(() => tokenStore.clear());
    }
  }, []);

  const login = async (username: string, password: string, tenant?: string) => {
    const payload: any = { username, password };
    if (tenant) payload.tenant = tenant;
    const resp = await api.post("/auth/token/", payload);
    const { access, refresh } = resp.data;
    tokenStore.setTokens(access, refresh);
    const profile = await api.get("/auth/me/");
    setUser(profile.data);
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
