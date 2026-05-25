import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  try {
    const { user } = (useAuth() as any);
    const location = useLocation();
    if (!user) {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
    return children;
  } catch (e) {
    return <Navigate to="/" replace />;
  }
};

export default RequireAuth;
