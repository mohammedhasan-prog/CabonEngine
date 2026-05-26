import React from "react";
import { useNavigate } from "react-router-dom";

const workspaces = [
  { id: "demo-tenant", name: "Global Logistics Corp", region: "US" },
  { id: "glc-eu", name: "Global Logistics EU", region: "EU" },
  { id: "glc-apac", name: "Global Logistics APAC", region: "APAC" },
];

export default function WorkspaceSelection() {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-gutter antialiased text-on-surface relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-surface-container-high rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-surface-container rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[520px] bg-surface-container-low border border-outline-variant rounded-lg shadow-2xl">
        <header className="p-8 border-b border-outline-variant text-center">
          <h1 className="text-headline-lg text-on-surface font-['Space_Grotesk']">Select Workspace</h1>
          <p className="text-body-md text-on-surface-variant">Choose an active tenant to continue.</p>
        </header>
        <div className="p-8 space-y-4">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              className="w-full flex items-center justify-between border border-outline-variant rounded p-4 text-left hover:bg-surface-container-high transition-colors"
              onClick={() => navigate("/dashboard")}
            >
              <div>
                <div className="text-body-lg text-on-surface">{ws.name}</div>
                <div className="text-body-sm text-on-surface-variant">Region: {ws.region}</div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">arrow_forward</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
