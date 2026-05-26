import React from "react";
import { Link } from "react-router-dom";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard", to: "/dashboard" },
  { key: "ingestion", label: "Ingestion", icon: "upload_file", to: "/ingestion" },
  { key: "review", label: "Review Queue", icon: "fact_check", to: "/review" },
  { key: "reports", label: "Reports", icon: "analytics", to: "/reports" },
  { key: "settings", label: "Settings", icon: "settings", to: "/settings" },
];

type AppShellProps = {
  active: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
  searchPlaceholder?: string;
};

export default function AppShell({
  active,
  title,
  subtitle,
  children,
  rightSlot,
  searchPlaceholder,
}: AppShellProps) {
  return (
    <div className="bg-background text-on-surface min-h-screen selection:bg-primary/30">
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container border-r border-outline-variant hidden lg:flex flex-col py-[24px] gap-[16px] z-50">
        <div className="px-[24px] mb-[24px]">
          <h1 className="text-headline-md font-headline-md font-black tracking-tight text-primary">CARBON.OS</h1>
        </div>
        <nav className="flex flex-col flex-grow">
          {navItems.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                className={`flex items-center gap-3 px-[24px] py-3 transition-colors ${
                  isActive
                    ? "text-primary font-bold border-r-2 border-primary bg-primary-container/10 opacity-90"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
                to={item.to}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="text-label-md font-label-md">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="fixed top-0 right-0 h-[64px] z-40 bg-surface border-b border-outline-variant flex justify-between items-center px-[20px] lg:px-[32px] lg:ml-[260px] w-full lg:w-[calc(100%-260px)]">
        <div className="flex items-center gap-3 text-primary">
          <span className="material-symbols-outlined text-xl">domain</span>
          <span className="text-headline-sm font-headline-sm">Global Logistics Corp</span>
        </div>
        <div className="flex items-center gap-4">
          {searchPlaceholder && (
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                className="bg-surface-container-low border border-outline-variant rounded py-1.5 pl-9 pr-4 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all w-64 placeholder:text-on-surface-variant"
                placeholder={searchPlaceholder}
                type="text"
              />
            </div>
          )}
          <button className="text-on-surface-variant hover:bg-surface-variant p-2 rounded-full transition-colors active:scale-[0.98]">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          {rightSlot}
        </div>
      </header>

      <main className="lg:ml-[260px] mt-[64px] p-[24px] lg:p-[32px] max-w-[1600px] mx-auto flex flex-col gap-[24px] min-h-[calc(100vh-64px)]">
        <header className="flex flex-col gap-[8px]">
          <h2 className="text-headline-lg font-headline-lg text-on-surface font-['Space_Grotesk']">
            {title}
          </h2>
          {subtitle && <p className="text-body-lg font-body-lg text-on-surface-variant">{subtitle}</p>}
        </header>
        {children}
      </main>
    </div>
  );
}
