import { CheckCircle2, AlertTriangle, XCircle, ArrowDown, Sparkles, RefreshCw, Play } from "lucide-react";

export interface InvestigationTraceProps {
  isResolved: boolean;
  nodeStatuses?: Record<string, string>;
  onResolve: () => void;
  onSimulate: () => void;
  isResolving?: boolean;
}

export function Investigation3DTrace({
  isResolved,
  nodeStatuses = {},
  onResolve,
  onSimulate,
  isResolving = false,
}: InvestigationTraceProps) {
  const nodes = [
    {
      id: "frontend",
      label: "NEXA Storefront",
      category: "Frontend",
      status: "nominal",
      latency: "22ms",
      detail: "GET /checkout",
      code: "200 OK",
    },
    {
      id: "backend",
      label: "Backend Gateway",
      category: "Service Proxy",
      status: "nominal",
      latency: "18ms",
      detail: "Proxy → payments-service",
      code: "200 OK",
    },
    {
      id: "payment-api",
      label: "Payment API",
      category: "Critical Microservice",
      status: isResolved ? "nominal" : "critical",
      latency: isResolved ? "38ms" : "3.8s",
      detail: isResolved ? "Canary v2.13.8" : "504 Gateway Timeout",
      code: isResolved ? "200 OK" : "500 ERR 🔴",
    },
    {
      id: "database",
      label: "Database (PostgreSQL)",
      category: "Primary Cluster",
      status: isResolved ? "nominal" : "critical",
      latency: isResolved ? "3ms" : "3,800ms",
      detail: isResolved ? "24 / 100 conns" : "98 / 100 conns 🔴",
      code: isResolved ? "HEALTHY" : "SATURATED",
    },
    {
      id: "connection-pool",
      label: "HikariCP Pool",
      category: "Resource Manager",
      status: isResolved ? "nominal" : "warning",
      latency: isResolved ? "0ms wait" : "30s timeout",
      detail: isResolved ? "Pool resized (200)" : "Pool Exhaustion ⚠️",
      code: isResolved ? "NOMINAL" : "EXHAUSTED",
    },
  ];

  return (
    <div
      className="pointer-events-auto flex flex-col gap-2 rounded-2xl p-3.5 transition-all w-full"
      style={{
        background: "rgba(0, 0, 0, 0.78)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        animation: "rise 0.7s ease-out both",
      }}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${
              isResolved ? "bg-white" : "bg-white animate-pulse"
            }`}
          />
          <span className="text-[11px] font-semibold tracking-wider uppercase text-white/90">
            3D Visual Trace
          </span>
        </div>
        <span
          className={`rounded px-1.5 py-0.5 text-[9px] font-mono uppercase border ${
            isResolved
              ? "bg-white/10 text-white border-white/20"
              : "bg-white/10 text-white border-white/30"
          }`}
        >
          {isResolved ? "Telemetry Nominal" : "Failure Active"}
        </span>
      </div>

      {/* Trace Path Title */}
      <div className="text-[10px] text-white/50 flex items-center justify-between font-mono">
        <span>Path: Frontend → DB</span>
        <span>{isResolved ? "5 / 5 Healthy" : "3 / 5 Critical"}</span>
      </div>

      {/* Nodes Pipeline */}
      <div className="flex flex-col gap-1.5 mt-1">
        {nodes.map((node, index) => {
          const isCritical = node.status === "critical";
          const isWarning = node.status === "warning";
          const isHealthy = node.status === "nominal";

          return (
            <div key={node.id} className="flex flex-col">
              {/* Node Card */}
              <div
                className={`group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-all ${
                  isCritical
                    ? "bg-white/[0.08] border border-white/25"
                    : isWarning
                    ? "bg-white/[0.06] border border-white/20"
                    : "bg-white/[0.03] border border-white/8"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Status Indicator Icon */}
                  <div className="shrink-0">
                    {isCritical ? (
                      <XCircle className="h-4 w-4 text-white animate-pulse" />
                    ) : isWarning ? (
                      <AlertTriangle className="h-4 w-4 text-white/80" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-white/90" />
                    )}
                  </div>

                  {/* Name and category */}
                  <div className="truncate">
                    <div className="font-semibold text-white truncate text-[11px] leading-tight">
                      {node.label}
                    </div>
                    <div className="text-[9px] text-white/50 font-mono truncate">
                      {node.detail}
                    </div>
                  </div>
                </div>

                {/* Right Metrics badge */}
                <div className="text-right shrink-0 font-mono text-[10px]">
                  <div
                    className={`font-bold ${
                      isCritical
                        ? "text-white"
                        : isWarning
                        ? "text-white/80"
                        : "text-white/90"
                    }`}
                  >
                    {node.code}
                  </div>
                  <div className="text-[8px] text-white/40">{node.latency}</div>
                </div>
              </div>

              {/* Connecting Pulse Line */}
              {index < nodes.length - 1 && (
                <div className="flex items-center justify-center my-0.5">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-2.5 w-[1.5px] ${
                        !isResolved && index >= 1
                          ? "bg-white"
                          : "bg-white/20"
                      }`}
                    />
                    <ArrowDown
                      className={`h-2.5 w-2.5 -my-0.5 ${
                        !isResolved && index >= 1
                          ? "text-white animate-bounce"
                          : "text-white/30"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Controls for Demo */}
      <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1.5">
        {!isResolved ? (
          <button
            onClick={onResolve}
            disabled={isResolving}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-black bg-white hover:bg-white/90 transition-all cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5 text-black" />
            <span>{isResolving ? "Executing Runbook..." : "Execute Runbook (Resolve)"}</span>
          </button>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="rounded-xl bg-white/[0.06] border border-white/15 p-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-white font-semibold text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                <span>Hindsight Retain Active</span>
              </div>
              <p className="text-[9px] text-white/60 mt-0.5 font-mono">
                Postmortem saved as INC-015 in incident memory.
              </p>
            </div>

            <button
              onClick={onSimulate}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-white/80 bg-white/[0.08] hover:bg-white/15 border border-white/15 transition-all cursor-pointer active:scale-[0.98]"
            >
              <RefreshCw className="h-3 w-3 text-white/70" />
              <span>Simulate Incident Surge</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
