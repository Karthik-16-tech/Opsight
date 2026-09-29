import { Activity, Box, Crosshair, Database } from "lucide-react";

function Sparkline({ critical = true }: { critical?: boolean }) {
  const stroke = critical ? "var(--color-critical)" : "rgba(255,255,255,0.45)";
  return (
    <svg viewBox="0 0 100 24" className="h-3.5 w-16 sm:w-20" preserveAspectRatio="none">
      <path
        d="M0,20 L14,18 L26,19 L38,14 L50,15 L62,9 L74,10 L86,4 L100,2"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function IncidentPanel() {
  return (
    <section
      className="glass-surface p-3.5 sm:p-4"
      style={{ animation: "rise 0.6s ease-out both" }}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "var(--color-critical)",
              boxShadow: "0 0 10px var(--color-critical)",
              animation: "breathe 2s ease-in-out infinite",
            }}
          />
          <span className="text-xs sm:text-[13px] text-foreground/85 font-medium">Live Incident</span>
        </div>
        <span className="text-[10px] text-muted-foreground">2 min ago</span>
      </header>

      <div className="mt-2.5 flex items-start justify-between gap-2">
        <h2 className="text-sm sm:text-[15px] font-semibold tracking-tight text-white leading-tight">
          PAYMENT SERVICE DEGRADED
        </h2>
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold"
          style={{
            backgroundColor: "color-mix(in oklab, var(--color-critical) 22%, transparent)",
            color: "var(--color-critical)",
            border: "1px solid color-mix(in oklab, var(--color-critical) 40%, transparent)",
          }}
        >
          SEV-1
        </span>
      </div>

      <ul className="mt-3 space-y-2 text-xs sm:text-[13px]">
        <li className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-foreground/80">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" /> 5xx errors ↗
          </span>
          <Sparkline />
        </li>
        <li className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-foreground/80">
            <Database className="h-3.5 w-3.5 text-muted-foreground" /> DB connections{" "}
            <span style={{ color: "var(--color-critical)" }}>98%</span>
          </span>
          <Sparkline />
        </li>
        <li className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-foreground/80">
            <Box className="h-3.5 w-3.5 text-muted-foreground" /> Deployment detected
          </span>
          <Sparkline critical={false} />
        </li>
      </ul>
    </section>
  );
}

export function RootCausePanel() {
  return (
    <section
      className="glass-surface p-3.5 sm:p-4"
      style={{ animation: "rise 0.8s ease-out both" }}
    >
      <header className="flex items-center gap-2">
        <Crosshair className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs sm:text-[13px] text-foreground/85 font-medium">Root Cause</span>
      </header>

      <p className="mt-2.5 text-[10px] text-muted-foreground uppercase tracking-wider">Likely root cause</p>
      <h3 className="mt-0.5 text-sm sm:text-[14px] font-semibold leading-snug text-white">
        Database connection pool exhaustion
      </h3>

      <div className="mt-2 flex items-center justify-between text-xs text-foreground/75">
        <span>Confidence</span>
        <span className="font-mono text-[11px] text-primary">78%</span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full"
          style={{
            width: "78%",
            background:
              "linear-gradient(90deg, color-mix(in oklab, var(--color-critical) 70%, transparent), var(--color-critical))",
          }}
        />
      </div>

      <p className="mt-3 text-[10px] text-muted-foreground uppercase tracking-wider">Key evidence</p>
      <ul className="mt-1.5 space-y-1.5 text-xs text-foreground/80">
        {[
          "DB connections at 98%",
          "Increased connection timeout errors",
          "Spike after recent deployment",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/80" />
            <span className="text-[11px] sm:text-xs leading-tight">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
