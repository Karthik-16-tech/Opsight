import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Database,
  Globe,
  Key,
  Plus,
  RefreshCw,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { DashboardHeader } from "@/components/opsight/DashboardHeader";

export const Route = createFileRoute("/connection")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Service Connections — Opsight" },
      {
        name: "description",
        content: "Manage connected services, telemetry pipelines, and infrastructure integrations.",
      },
    ],
  }),
  component: ConnectionPage,
});

const connections = [
  {
    id: "payment-api",
    name: "Payment Gateway API",
    category: "Core API",
    type: "REST / Webhook",
    status: "degraded",
    latency: "340ms",
    health: "Degraded (5xx errors detected)",
    icon: Zap,
    lastSync: "30s ago",
  },
  {
    id: "postgres-primary",
    name: "Primary PostgreSQL (RDS)",
    category: "Database",
    type: "PostgreSQL 16",
    status: "warning",
    latency: "18ms",
    health: "Pool Exhaustion (98% capacity)",
    icon: Database,
    lastSync: "12s ago",
  },
  {
    id: "auth-service",
    name: "Auth & Identity Service",
    category: "Core API",
    type: "OIDC / JWT",
    status: "healthy",
    latency: "14ms",
    health: "Operational",
    icon: ShieldCheck,
    lastSync: "1m ago",
  },
  {
    id: "aws-eks",
    name: "AWS Kubernetes Cluster",
    category: "Infrastructure",
    type: "EKS us-east-1",
    status: "healthy",
    latency: "8ms",
    health: "Operational (42 pods active)",
    icon: Server,
    lastSync: "45s ago",
  },
  {
    id: "redis-cache",
    name: "Redis Cache Cluster",
    category: "Database",
    type: "In-Memory",
    status: "healthy",
    latency: "2ms",
    health: "Operational (Memory 41%)",
    icon: Database,
    lastSync: "20s ago",
  },
  {
    id: "cloudflare-edge",
    name: "Cloudflare Edge Network",
    category: "CDN & Edge",
    type: "WAF & Reverse Proxy",
    status: "healthy",
    latency: "5ms",
    health: "Operational (Global Routing)",
    icon: Globe,
    lastSync: "1m ago",
  },
];

function ConnectionPage() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const copyToClipboard = (text: string, type: "key" | "webhook") => {
    navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    }
  };

  return (
    <main className="min-h-screen w-full bg-black text-white relative pt-20 pb-16 px-6 sm:px-10 lg:px-16 overflow-y-auto">
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 15%, color-mix(in oklab, var(--color-halo) 12%, transparent), transparent 70%)",
        }}
      />

      {/* Top Header with Page Navigation Bar */}
      <DashboardHeader active="connection" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Page Title & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
              Service Connections
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
              Active telemetry streaming, API integrations, and connected infrastructure nodes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/12 bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Refresh Status</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Connect Service</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { label: "Connected Services", value: "6 Active", status: "normal" },
            { label: "Active Incidents", value: "1 Degraded", status: "critical" },
            { label: "Telemetry Stream", value: "24.8k msg/s", status: "normal" },
            { label: "Avg Roundtrip Ping", value: "11.2 ms", status: "healthy" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-surface p-4 rounded-xl flex flex-col justify-between"
            >
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                {stat.label}
              </span>
              <span
                className={`text-lg sm:text-xl font-medium mt-2 tracking-tight ${
                  stat.status === "critical"
                    ? "text-red-400"
                    : stat.status === "healthy"
                      ? "text-emerald-400"
                      : "text-white"
                }`}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {connections.map((conn) => {
            const Icon = conn.icon;
            const isDegraded = conn.status === "degraded";
            const isWarning = conn.status === "warning";

            return (
              <div
                key={conn.id}
                className="glass-surface p-5 rounded-2xl flex flex-col justify-between group hover:border-white/20 transition-all duration-300"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                        <Icon size={16} strokeWidth={1.8} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white leading-tight">
                          {conn.name}
                        </h3>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {conn.category} · {conn.type}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        isDegraded
                          ? "bg-red-500/15 text-red-400 border border-red-500/30"
                          : isWarning
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isDegraded
                            ? "bg-red-400 shadow-[0_0_8px_#f87171]"
                            : isWarning
                              ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                              : "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                        }`}
                      />
                      {isDegraded ? "Degraded" : isWarning ? "Warning" : "Healthy"}
                    </span>
                  </div>

                  {/* Health message */}
                  <p className="text-xs text-neutral-300 font-light mb-4 bg-white/[0.03] p-2 rounded-lg border border-white/[0.05]">
                    {conn.health}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                  <span>Ping: {conn.latency}</span>
                  <span>Synced {conn.lastSync}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Telemetry Integration Credentials Panel */}
        <div className="glass-surface p-6 rounded-2xl">
          <h2 className="text-sm sm:text-base font-medium text-white mb-1">
            Telemetry Ingest &amp; Webhooks
          </h2>
          <p className="text-xs text-neutral-400 font-light mb-5">
            Configure your application runners and microservices to send OpenTelemetry and incident traces directly to Opsight.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ingest Endpoint */}
            <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Live Ingestion Webhook Endpoint
              </span>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs font-mono text-neutral-200 truncate">
                  https://ingest.opsight.ai/v1/traces/hook_prod_89a4f
                </code>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      "https://ingest.opsight.ai/v1/traces/hook_prod_89a4f",
                      "webhook"
                    )
                  }
                  className="flex-shrink-0 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy endpoint"
                >
                  {copiedWebhook ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Copy size={15} />}
                </button>
              </div>
            </div>

            {/* Secret Token */}
            <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Opsight Agent API Secret Key
              </span>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs font-mono text-neutral-200 truncate">
                  ops_live_sec_7894a029fe43bc889104
                </code>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard("ops_live_sec_7894a029fe43bc889104", "key")
                  }
                  className="flex-shrink-0 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy API key"
                >
                  {copiedKey ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Copy size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
