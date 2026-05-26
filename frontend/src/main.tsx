import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import { Navigate } from "react-router-dom";
import AuditViewer from "./pages/AuditViewer";
import Designs from "./pages/Designs";
import Ingestion from "./pages/Ingestion";
import ReviewQueue from "./pages/ReviewQueue";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import RecordDetail from "./pages/RecordDetail";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import { AuthProvider } from "./auth/AuthProvider";
import RequireAuth from "./auth/RequireAuth";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}> 
              <Route index element={<Login />} />
              <Route path="records" element={<RequireAuth><Navigate to="/review" replace /></RequireAuth>} />
              <Route path="ingestion" element={<RequireAuth><Ingestion /></RequireAuth>} />
              <Route path="review" element={<RequireAuth><ReviewQueue /></RequireAuth>} />
              <Route path="reports" element={<RequireAuth><Reports /></RequireAuth>} />
              <Route path="settings" element={<RequireAuth><Settings /></RequireAuth>} />
              <Route path="record/:id" element={<RequireAuth><RecordDetail /></RequireAuth>} />
              <Route path="dashboard" element={<RequireAuth><ExecutiveDashboard /></RequireAuth>} />
              <Route path="audit" element={<RequireAuth><AuditViewer /></RequireAuth>} />
              <Route path="designs" element={<Designs />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
