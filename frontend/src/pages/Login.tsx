import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("glc");
  const [role, setRole] = useState("analyst");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await auth.login(email, password, tenant || undefined);
      navigate("/records");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-surface-container-high rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-surface-container rounded-full blur-[100px]"></div>
      </div>
      <main className="relative z-10 w-full max-w-[420px] bg-surface-container-low border border-outline-variant rounded-lg flex flex-col shadow-2xl shadow-background/50 backdrop-blur-sm">
      <header className="p-8 border-b border-outline-variant flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded bg-surface-container border border-outline flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 tracking-tight">CarbonEngine</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Secure Global Telemetry Access</p>
      </header>

      <form className="p-8 flex flex-col gap-6" onSubmit={submit}>
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2 uppercase tracking-wider" htmlFor="email">
            <span className="material-symbols-outlined text-[16px]">mail</span>
            Operator ID / Email
          </label>
          <div className="relative">
            <input className="w-full bg-surface-dim border border-outline-variant rounded font-body-md text-body-md text-on-surface px-4 py-3 outline-none transition-colors industrial-input placeholder:text-outline-variant" id="email" name="email" placeholder="operator@domain.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2 uppercase tracking-wider" htmlFor="password">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              Passkey
            </label>
            <a className="font-label-md text-label-md text-primary hover:text-primary-fixed transition-colors" href="#">Recover</a>
          </div>
          <div className="relative">
            <input className="w-full bg-surface-dim border border-outline-variant rounded font-body-md text-body-md text-on-surface px-4 py-3 outline-none transition-colors industrial-input placeholder:text-outline-variant" id="password" name="password" placeholder="••••••••" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2 uppercase tracking-wider" htmlFor="tenant">
            <span className="material-symbols-outlined text-[16px]">domain</span>
            Target Tenant Workspace
          </label>
          <div className="relative">
            <select className="w-full appearance-none bg-surface-dim border border-outline-variant rounded font-body-md text-body-md text-on-surface px-4 py-3 pr-10 outline-none transition-colors industrial-input" id="tenant" name="tenant" required value={tenant} onChange={(e) => setTenant(e.target.value)}>
              <option value="glc">Global Logistics Corp</option>
              <option value="tim">Tesla India Mfg</option>
              <option value="ere">EcoRetail Europe</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Access Clearance Level</label>
          <div className="flex gap-2">
            <label className="cursor-pointer flex-1">
              <input className="peer sr-only radio-chip-input" name="role" type="radio" value="analyst" checked={role === "analyst"} onChange={() => setRole("analyst")} />
              <div className="py-2 px-1 border border-outline-variant text-center rounded transition-all font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-highest">Analyst</div>
            </label>
            <label className="cursor-pointer flex-1">
              <input className="peer sr-only radio-chip-input" name="role" type="radio" value="admin" checked={role === "admin"} onChange={() => setRole("admin")} />
              <div className="py-2 px-1 border border-outline-variant text-center rounded transition-all font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-highest">Admin</div>
            </label>
            <label className="cursor-pointer flex-1">
              <input className="peer sr-only radio-chip-input" name="role" type="radio" value="viewer" checked={role === "viewer"} onChange={() => setRole("viewer")} />
              <div className="py-2 px-1 border border-outline-variant text-center rounded transition-all font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-highest flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[14px]">visibility</span>
                Read-Only
              </div>
            </label>
          </div>
        </div>

        {error && <div className="text-error text-label-md">{error}</div>}

        <button className="mt-4 w-full bg-primary text-on-primary font-title-lg text-title-lg py-3 rounded flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98]" type="submit" disabled={loading}>
          {loading ? "Initializing..." : "Initialize Session"}
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </form>

      <footer className="p-4 border-t border-outline-variant text-center bg-surface-container-lowest rounded-b-lg">
        <p className="font-label-md text-label-md text-outline">
          <span className="material-symbols-outlined text-[12px] align-middle mr-1">encrypted</span>
          End-to-end encrypted telemetry connection
        </p>
      </footer>
      </main>
    </>
  );
}
