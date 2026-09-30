import { Link } from "@tanstack/react-router";

interface DashboardHeaderProps {
  active: "spline" | "environment" | "connection" | "app-dashboard";
}

const navLinks = [
  { id: "app-dashboard", label: "App Dashboard", href: "/app-dashboard" },
  { id: "spline", label: "Spline", href: "/dashboard" },
  { id: "environment", label: "3D Environment", href: "/environment" },
  { id: "connection", label: "Connection", href: "/connection" },
] as const;

export function DashboardHeader({ active }: DashboardHeaderProps) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-4 sm:px-8">
      {/* Brand logo back to landing page */}
      <Link
        to="/"
        className="pointer-events-auto flex items-center gap-2.5 group cursor-pointer"
        aria-label="Back to home"
      >
        <img
          src="/favicon.ico"
          alt="Opsight Logo"
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform group-hover:scale-105"
        />
        <span className="text-lg font-medium tracking-tight text-white">Opsight</span>
      </Link>

      {/* Page Navigation Bar */}
      <div className="pointer-events-auto flex items-center">
        <nav
          className="flex items-center gap-1 rounded-full p-1 glass-hairline max-w-full overflow-x-auto"
          style={{ borderRadius: 9999 }}
          aria-label="Dashboard pages"
        >
          {navLinks.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.id}
                to={item.href}
                preload="intent"
                className={`rounded-full px-3 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-white/15 text-white shadow-sm font-medium"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default DashboardHeader;
