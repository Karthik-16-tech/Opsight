import { Activity, Box, Database, ArrowRight } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface IncidentTicket {
  id: string;
  title: string;
  severity: string;
  status: string;
  category: "payments" | "latency" | "redis" | "auth";
  similarity: string;
  timeAgo: string;
  context: string;
  rootCause: string;
  similarityReason: string;
  resolutionSteps: string[];
  metrics: {
    mttr: string;
    errorDrop: string;
    latencyRecovery: string;
  };
}

export const TICKETS: IncidentTicket[] = [
  {
    id: "#INC-2841",
    category: "payments",
    title: "Payment Service 504 Timeout & DB Pool Saturation",
    severity: "SEV-1",
    status: "Resolved",
    similarity: "94% Similarity Match",
    timeAgo: "14 days ago · Flash Checkout Traffic Surge",
    context: "Microservice: payments-service on node-us-east-2 (NEXA Production)",
    rootCause:
      "Database connection pool exhaustion on PostgreSQL cluster (pegged at 98%). Commit a8f3c1b introduced an unclosed transaction block under concurrent checkout traffic, leaking available database connections.",
    similarityReason:
      "Identical symptom signature: 504 Gateway Timeouts, +340ms latency spikes, and 18.4% 5xx error rate caused by unreleased PostgreSQL connection handles on node-us-east-2.",
    resolutionSteps: [
      "Drained traffic from degraded node-us-east-2 and rerouted active checkout requests to healthy standby pods in us-east-1.",
      "Dispatched automated SELECT pg_terminate_backend(pid) on PostgreSQL to evict orphaned idle-in-transaction connections.",
      "Triggered instant canary rollback of payments-service to stable release v2.13.8.",
      "Dynamically resized HikariCP connection pool limit from 50 to 200 with an aggressive 30s leak-detection threshold.",
    ],
    metrics: {
      mttr: "7m MTTR",
      errorDrop: "18.4% → 0.01% Error Rate",
      latencyRecovery: "38ms Latency",
    },
  },
  {
    id: "#INC-2719",
    category: "latency",
    title: "Checkout API Latency & Pod Restarts on Node-us-east-2",
    severity: "SEV-2",
    status: "Resolved",
    similarity: "88% Similarity Match",
    timeAgo: "32 days ago · Promotional Campaign Surge",
    context: "Microservice: payments-service & auth-gateway (NEXA Production)",
    rootCause:
      "CPU throttling and thread pool saturation on Kubernetes worker node-us-east-2 caused by rapid pod restarts under unexpected traffic surge.",
    similarityReason:
      "Latency spike (+280ms) and pod restarts on the identical worker node node-us-east-2.",
    resolutionSteps: [
      "Scaled Horizontal Pod Autoscaler (HPA) target capacity from 3 to 8 worker pods.",
      "Flushed Redis connection locks and adjusted circuit breaker sensitivity on auth-gateway.",
      "Redistributed container workloads evenly across us-east-1 and us-east-2 availability zones.",
    ],
    metrics: {
      mttr: "12m MTTR",
      errorDrop: "9.2% → 0.00% Error Rate",
      latencyRecovery: "45ms Latency",
    },
  },
  {
    id: "#INC-2510",
    category: "redis",
    title: "Redis Cluster Memory Saturation & Eviction Stall",
    severity: "SEV-2",
    status: "Resolved",
    similarity: "84% Similarity Match",
    timeAgo: "45 days ago · Cart Session Spike",
    context: "Infrastructure: redis-cache-cluster (NEXA Production)",
    rootCause:
      "Redis memory reached 89% maxmemory limit without volatile-lru eviction on shopping cart keys, causing write stalls and connection queuing.",
    similarityReason:
      "Memory pressure and connection timeout delays on cached checkout payloads.",
    resolutionSteps: [
      "Reconfigured maxmemory-policy to allkeys-lru on Redis master node.",
      "Flushed stale guest session TTLs and scaled Redis replica read-nodes.",
      "Enabled async background memory defragmentation.",
    ],
    metrics: {
      mttr: "9m MTTR",
      errorDrop: "4.8% → 0.00% Error Rate",
      latencyRecovery: "Cache latency < 2ms",
    },
  },
  {
    id: "#INC-2304",
    category: "auth",
    title: "Auth Gateway Token Validation Timeout",
    severity: "SEV-2",
    status: "Resolved",
    similarity: "79% Similarity Match",
    timeAgo: "60 days ago · Token Service Refresh",
    context: "Microservice: auth-gateway (NEXA Production)",
    rootCause:
      "JWT public key caching failure in auth-gateway causing synchronous remote JWKS fetches for every incoming checkout request.",
    similarityReason:
      "Upstream gateway timeouts cascading into payments-service during authentication.",
    resolutionSteps: [
      "Implemented in-memory local LRU cache for JWKS verification keys with 12h TTL.",
      "Enabled circuit breaker to fall back to secondary key distributor.",
    ],
    metrics: {
      mttr: "6m MTTR",
      errorDrop: "7.1% → 0.00% Error Rate",
      latencyRecovery: "Auth overhead reduced to 12ms",
    },
  },
];

// LIVE FLOWING TELEMETRY GRAPH
function FlowingGraph({ critical = true }: { critical?: boolean }) {
  const strokeColor = critical ? "#ffffff" : "rgba(255, 255, 255, 0.4)";

  return (
    <div className="relative h-5 w-20 overflow-hidden flex items-center">
      <div
        className="flex w-[200%] h-full shrink-0"
        style={{
          animation: "flowing-graph 2.5s linear infinite",
        }}
      >
        <svg
          viewBox="0 0 100 20"
          className="w-1/2 h-full shrink-0"
          preserveAspectRatio="none"
        >
          <path
            d="M0,16 L12,14 L24,15 L36,9 L48,11 L60,4 L72,6 L84,2 L100,16"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <svg
          viewBox="0 0 100 20"
          className="w-1/2 h-full shrink-0"
          preserveAspectRatio="none"
        >
          <path
            d="M0,16 L12,14 L24,15 L36,9 L48,11 L60,4 L72,6 L84,2 L100,16"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}

// PROMINENT LIVE FLOWING TELEMETRY GRAPH
function ProminentFlowingErrorGraph({ isResolved = false }: { isResolved?: boolean }) {
  return (
    <div className="relative mt-2.5 w-full rounded-xl bg-black/60 border border-white/10 p-2.5 overflow-hidden">
      <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-1.5">
        <span className="flex items-center gap-1.5 text-white/90 font-semibold">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isResolved ? "bg-white" : "bg-white animate-pulse"
            }`}
          />
          {isResolved ? "5xx Error Baseline: 0.01%" : "5xx Error Surge: 18.4%"}
        </span>
        <span>{isResolved ? "Baseline Restored" : "Baseline: 0.02%"}</span>
      </div>

      {/* Live Flowing Wave Canvas */}
      <div className="relative h-14 w-full overflow-hidden flex items-end">
        {/* Coordinate Grid lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-15">
          <div className="border-b border-white w-full" />
          <div className="border-b border-white w-full" />
          <div className="border-b border-white w-full" />
        </div>

        {/* Infinitely Flowing Telemetry Curve */}
        <div
          className="flex w-[200%] h-full shrink-0"
          style={{ animation: isResolved ? "flowing-graph 4.5s linear infinite" : "flowing-graph 2.8s linear infinite" }}
        >
          {/* Half 1 */}
          <div className="relative w-1/2 h-full shrink-0">
            <svg viewBox="0 0 160 50" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="flowGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={isResolved ? "0.08" : "0.25"} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d={
                  isResolved
                    ? "M 0,44 L 20,43 L 40,44 L 60,43 L 80,44 L 100,43 L 120,44 L 140,43 L 160,44 L 160,50 L 0,50 Z"
                    : "M 0,42 L 20,40 L 35,41 L 50,38 L 65,12 L 80,18 L 95,8 L 110,14 L 125,6 L 140,12 L 160,8 L 160,50 L 0,50 Z"
                }
                fill="url(#flowGrad1)"
              />
              <path
                d={
                  isResolved
                    ? "M 0,44 L 20,43 L 40,44 L 60,43 L 80,44 L 100,43 L 120,44 L 140,43 L 160,44"
                    : "M 0,42 L 20,40 L 35,41 L 50,38 L 65,12 L 80,18 L 95,8 L 110,14 L 125,6 L 140,12 L 160,8"
                }
                fill="none"
                stroke="#ffffff"
                strokeWidth={isResolved ? "1.2" : "1.8"}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {/* Half 2 (for seamless loop) */}
          <div className="relative w-1/2 h-full shrink-0">
            <svg viewBox="0 0 160 50" className="w-full h-full" preserveAspectRatio="none">
              <path
                d={
                  isResolved
                    ? "M 0,44 L 20,43 L 40,44 L 60,43 L 80,44 L 100,43 L 120,44 L 140,43 L 160,44 L 160,50 L 0,50 Z"
                    : "M 0,42 L 20,40 L 35,41 L 50,38 L 65,12 L 80,18 L 95,8 L 110,14 L 125,6 L 140,12 L 160,8 L 160,50 L 0,50 Z"
                }
                fill="url(#flowGrad1)"
              />
              <path
                d={
                  isResolved
                    ? "M 0,44 L 20,43 L 40,44 L 60,43 L 80,44 L 100,43 L 120,44 L 140,43 L 160,44"
                    : "M 0,42 L 20,40 L 35,41 L 50,38 L 65,12 L 80,18 L 95,8 L 110,14 L 125,6 L 140,12 L 160,8"
                }
                fill="none"
                stroke="#ffffff"
                strokeWidth={isResolved ? "1.2" : "1.8"}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Time axis */}
      <div className="mt-1 flex items-center justify-between text-[8px] font-mono text-white/40 border-t border-white/5 pt-0.5">
        <span>-5m</span>
        <span>{isResolved ? "Canary v2.13.8 Rollback" : "-3m (Deploy a8f3)"}</span>
        <span className="text-white font-bold animate-pulse">NOW</span>
      </div>
    </div>
  );
}

export function IncidentPanel({
  isResolved = false,
  metrics,
}: {
  isResolved?: boolean;
  metrics?: any;
}) {
  const loginDrop = isResolved ? "0%" : metrics?.login_drop_pct ? `-${metrics.login_drop_pct}%` : "-42%";
  const checkoutDrop = isResolved ? "0%" : metrics?.checkout_drop_pct ? `-${metrics.checkout_drop_pct}%` : "-68%";
  const revenueLoss = isResolved ? "$0/m" : metrics?.revenue_loss_per_min ? `-$${metrics.revenue_loss_per_min}/m` : "-$1,420/m";
  const dbPool = isResolved ? "24%" : metrics?.db_connections ? `${metrics.db_connections}%` : "98%";

  return (
    <section
      className="rounded-2xl p-3.5 sm:p-4 transition-all"
      style={{
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        animation: "rise 0.6s ease-out both",
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isResolved ? "bg-white" : "bg-white animate-pulse"
            }`}
          />
          <span className="text-xs text-white/90 font-semibold tracking-wide">
            {isResolved ? "Incident Resolved" : "Live Incident"}
          </span>
        </div>
        <span
          className={`rounded px-1.5 py-0.2 text-[9px] font-mono uppercase border ${
            isResolved
              ? "bg-white/10 text-white border-white/20"
              : "bg-white/10 text-white border-white/20"
          }`}
        >
          {isResolved ? "NOMINAL" : "SEV-1"}
        </span>
      </header>

      {/* Incident Title */}
      <div className="mt-2.5">
        <h2 className="text-xs sm:text-[13px] font-bold tracking-tight text-white leading-tight">
          {isResolved ? "PAYMENTS SERVICE NOMINAL" : "PAYMENT SERVICE DEGRADED"}
        </h2>
        <p className="text-[10px] text-white/50 mt-0.5">
          {isResolved
            ? "node-us-east-2 · Baseline Telemetry Recovered"
            : "node-us-east-2 · 504 Gateway Timeout"}
        </p>
      </div>

      {/* THE PROMINENT FLOWING ERROR GRAPH */}
      <ProminentFlowingErrorGraph isResolved={isResolved} />

      {/* DECREMENT & BUSINESS IMPACT GRID (User logins & Market rate decrease) */}
      <div className="mt-3 grid grid-cols-2 gap-1.5 pt-1 border-t border-white/10 text-[10px]">
        {/* User Logins Decrement */}
        <div className="rounded-lg bg-white/[0.04] p-1.5 border border-white/5">
          <div className="text-white/40 text-[9px]">User Logins</div>
          <div className="font-mono text-[11px] font-bold text-white flex items-center justify-between mt-0.5">
            <span>{loginDrop}</span>
            <span className="text-[8px] text-white/40 font-normal">
              {isResolved ? "Restored" : "Auth drop"}
            </span>
          </div>
        </div>

        {/* Checkout Flow Decrement */}
        <div className="rounded-lg bg-white/[0.04] p-1.5 border border-white/5">
          <div className="text-white/40 text-[9px]">Checkout Rate</div>
          <div className="font-mono text-[11px] font-bold text-white flex items-center justify-between mt-0.5">
            <span>{checkoutDrop}</span>
            <span className="text-[8px] text-white/40 font-normal">
              {isResolved ? "Nominal" : "Cart drop"}
            </span>
          </div>
        </div>

        {/* Market Rate Decrement */}
        <div className="rounded-lg bg-white/[0.04] p-1.5 border border-white/5">
          <div className="text-white/40 text-[9px]">Market Revenue</div>
          <div className="font-mono text-[11px] font-bold text-white flex items-center justify-between mt-0.5">
            <span>{revenueLoss}</span>
            <span className="text-[8px] text-white/40 font-normal">
              {isResolved ? "Stabilized" : "Loss rate"}
            </span>
          </div>
        </div>

        {/* DB Connection Saturation */}
        <div className="rounded-lg bg-white/[0.04] p-1.5 border border-white/5">
          <div className="text-white/40 text-[9px]">DB Pool</div>
          <div className="font-mono text-[11px] font-bold text-white flex items-center justify-between mt-0.5">
            <span>{dbPool}</span>
            <span className="text-[8px] text-white/40 font-normal">
              {isResolved ? "Healthy" : "Saturated"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RootCausePanel({
  activeQuery,
  onResolve,
  isResolved = false,
}: {
  activeQuery?: string;
  onResolve?: () => void;
  isResolved?: boolean;
}) {
  const [selectedTicket, setSelectedTicket] = useState<IncidentTicket | null>(null);

  // Match tickets relevant to the user query (NEVER random!)
  const getRelevantTickets = (): IncidentTicket[] => {
    const defaultTicket = TICKETS[0]!;
    if (!activeQuery || !activeQuery.trim()) {
      // Default to the live incident ticket (#INC-2841)
      return [defaultTicket];
    }

    const q = activeQuery.toLowerCase();

    if (q.includes("redis") || q.includes("cache") || q.includes("memory")) {
      return [TICKETS[2] || defaultTicket]; // #INC-2510
    }
    if (
      q.includes("latency") ||
      q.includes("restart") ||
      q.includes("cpu") ||
      q.includes("node")
    ) {
      return [TICKETS[1] || defaultTicket]; // #INC-2719
    }
    if (q.includes("auth") || q.includes("token") || q.includes("login") || q.includes("gateway")) {
      return [TICKETS[3] || defaultTicket]; // #INC-2304
    }
    // Default / Payment 504 / Database
    return [defaultTicket];
  };

  const relevantTickets = getRelevantTickets();

  return (
    <>
      {/* ALL BLACK GLASSMORPHISM BOX SHOWING ONLY THE RELEVANT TICKET NUMBER (NO RANDOM, PURE WHITE TEXT) */}
      <section
        className="rounded-2xl p-3.5 sm:p-4 transition-all"
        style={{
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          animation: "rise 0.8s ease-out both",
        }}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-white/90">
              Detected Ticket
            </span>
          </div>
          <span className="text-[9px] text-white/50 font-mono">
            {activeQuery?.toLowerCase().includes("latency")
              ? "From Latency Spike"
              : activeQuery?.toLowerCase().includes("redis")
              ? "From Cache Lock"
              : "From 504 Timeout"}
          </span>
        </div>

        {/* SHOW ONLY RELEVANT TICKET NUMBER FOR THE DETECTED ERROR */}
        <div className="mt-2.5 flex flex-col gap-2">
          {relevantTickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all cursor-pointer hover:bg-white/10"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold tracking-wide text-white">
                  {ticket.id}
                </span>
                <span className="text-[10px] text-white/50 font-mono">
                  {ticket.status}
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </button>
          ))}
        </div>
      </section>

      {/* ALL BLACK GLASSMORPHISM DIALOG BOX (PURE WHITE TEXT, NO NEON, NO OTHER COLOR) */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent
          className="max-w-xl text-white sm:rounded-2xl"
          style={{
            background: "rgba(0, 0, 0, 0.95)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.9)",
          }}
        >
          {selectedTicket && (
            <div className="space-y-4 text-xs">
              <DialogHeader className="border-b border-white/10 pb-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-white tracking-wider">
                    {selectedTicket.id}
                  </span>
                  <span className="rounded px-2 py-0.5 text-[10px] font-mono uppercase bg-white/10 text-white/90 border border-white/20">
                    {selectedTicket.severity}
                  </span>
                  <span className="rounded px-2 py-0.5 text-[10px] font-mono uppercase bg-white/10 text-white/90 border border-white/20">
                    {selectedTicket.status}
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-white/60">
                    {selectedTicket.similarity}
                  </span>
                </div>
                <DialogTitle className="mt-2 text-base font-semibold text-white tracking-tight">
                  {selectedTicket.title}
                </DialogTitle>
                <DialogDescription className="text-white/60 text-xs">
                  {selectedTicket.timeAgo} · {selectedTicket.context}
                </DialogDescription>
              </DialogHeader>

              {/* Similarity Reason */}
              <div
                className="rounded-xl p-3 space-y-1"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <p className="text-[10px] uppercase font-mono tracking-wider text-white/50">
                  Why It Matches Your Query
                </p>
                <p className="text-white/90 leading-relaxed">
                  {selectedTicket.similarityReason}
                </p>
              </div>

              {/* Confirmed Root Cause */}
              <div
                className="rounded-xl p-3 space-y-1"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <p className="text-[10px] uppercase font-mono tracking-wider text-white/50">
                  Confirmed Historical Root Cause
                </p>
                <p className="text-white/90 leading-relaxed">
                  {selectedTicket.rootCause}
                </p>
              </div>

              {/* Proven Resolution Runbook */}
              <div
                className="rounded-xl p-3 space-y-2"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <p className="text-[10px] uppercase font-mono tracking-wider text-white/50">
                  Proven Resolution Runbook
                </p>
                <ul className="space-y-1.5">
                  {selectedTicket.resolutionSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/90 leading-relaxed">
                      <span className="font-mono text-white/50 text-[11px] font-bold">
                        {idx + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verified Postmortem Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div
                  className="rounded-xl p-2.5 text-center"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="text-[10px] text-white/50">Resolution Time</div>
                  <div className="font-mono text-xs font-semibold text-white mt-0.5">
                    {selectedTicket.metrics.mttr}
                  </div>
                </div>
                <div
                  className="rounded-xl p-2.5 text-center"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="text-[10px] text-white/50">Error Reduction</div>
                  <div className="font-mono text-xs font-semibold text-white mt-0.5">
                    {selectedTicket.metrics.errorDrop}
                  </div>
                </div>
                <div
                  className="rounded-xl p-2.5 text-center"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="text-[10px] text-white/50">Latency Recovery</div>
                  <div className="font-mono text-xs font-semibold text-white mt-0.5">
                    {selectedTicket.metrics.latencyRecovery}
                  </div>
                </div>
              </div>

              {/* Action Button: Execute Proven Runbook */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedTicket(null);
                    onResolve?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold text-black bg-white hover:bg-white/90 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <span className="font-mono">⚡</span>
                  <span>{isResolved ? "Runbook Already Applied · System Nominal" : "Execute Proven Runbook & Retain in Hindsight"}</span>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
