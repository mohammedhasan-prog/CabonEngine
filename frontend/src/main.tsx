import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Records from "./pages/Records";
import AuditViewer from "./pages/AuditViewer";
import Designs from "./pages/Designs";
import Ingestion from "./pages/Ingestion";
import { AuthProvider } from "./auth/AuthProvider";
import RequireAuth from "./auth/RequireAuth";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}> 
              <Route index element={<Login />} />
              <Route path="records" element={<RequireAuth><Records /></RequireAuth>} />
                <Route path="ingestion" element={<RequireAuth><Ingestion /></RequireAuth>} />
              <Route path="audit" element={<RequireAuth><AuditViewer /></RequireAuth>} />
              <Route path="designs" element={<Designs />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
