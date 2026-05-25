import React from "react";
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

  return (
    <div style={{ padding: isLogin ? 0 : 20 }}>
      {!isLogin && (
        <header>
          <h1>ESG Admin</h1>
          <nav>
            <Link to="/">Login</Link> | <Link to="/records">Records</Link> | <Link to="/audit">Audit</Link> | <Link to="/designs">Designs</Link>
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
      <main style={{ marginTop: isLogin ? 0 : 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
