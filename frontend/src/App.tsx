import React, { useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";

export default function App() {
  const auth = (() => {
    try {
      return useAuth();
    } catch (e) {
      return null;
    }
  })();

  const location = useLocation();
  const isLogin = location.pathname === "/";
  const isIngestion = location.pathname.startsWith("/ingestion");

  useEffect(() => {
    const loginClass =
      "bg-background min-h-screen flex items-start justify-center p-gutter py-10 antialiased text-on-surface relative overflow-y-auto";
    const appClass =
      "bg-background text-on-surface antialiased min-h-screen overflow-x-hidden";
    document.body.className = isLogin ? loginClass : appClass;
  }, [isLogin]);

  return (
    <div style={{ padding: isLogin || isIngestion ? 0 : 20 }}>
      {!isLogin && !isIngestion && (
        <header>
          <h1>ESG Admin</h1>
          <nav>
            <Link to="/">Login</Link> | <Link to="/records">Records</Link> | <Link to="/ingestion">Ingestion</Link> | <Link to="/audit">Audit</Link> | <Link to="/designs">Designs</Link>
          </nav>
          <div style={{ float: "right" }}>
            {auth && auth.user ? (
              <>
                <span style={{ marginRight: 8 }}>{auth.user.email}</span>
                <button onClick={() => auth.logout()}>Logout</button>
              </>
            ) : null}
          </div>
        </header>
      )}
      <main style={{ marginTop: isLogin || isIngestion ? 0 : 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
