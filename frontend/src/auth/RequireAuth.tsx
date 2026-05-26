import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  try {
    const { user, isLoading } = (useAuth() as any);
    const location = useLocation();

    if (isLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
    return children;
  } catch (e) {
    return <Navigate to="/" replace />;
  }
};

export default RequireAuth;
