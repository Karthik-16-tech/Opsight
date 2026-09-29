import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  ChevronDown,
  Clock3,
  Code2,
  Database,
  FileText,
  HardDrive,
  Layers3,
  List,
  Network,
  Server,
  ShoppingCart,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/opsight/DashboardHeader";
import storefrontImage from "@/assets/nexa-storefront.png";

type ServiceId = "web" | "api" | "payments" | "database";

const services: {
  id: ServiceId;
  name: string;
  description: string;
  status: "healthy" | "warning" | "critical";
  Icon: typeof ShoppingCart;
}[] = [
  { id: "web", name: "NEXA", description: "Web App", status: "healthy", Icon: ShoppingCart },
  { id: "api", name: "Payment API", description: "HTTP 500 · 42% errors", status: "warning", Icon: Code2 },
  { id: "payments", name: "Payment Service", description: "Latency 3.8s", status: "critical", Icon: Server },
  { id: "database", name: "Database", description: "98 / 100 connections", status: "critical", Icon: Database },
];

const incidents = [
  { id: "INC-014", name: "Payment failure", match: "91% similar", root: "DB connection pool exhaustion", resolved: "Rollback deployment", date: "12 Mar 2026", high: true },
  { id: "INC-027", name: "Checkout timeout", match: "84% similar", root: "DB connection exhaustion", resolved: "Pool configuration", date: "18 Jan 2026", high: false },
  { id: "INC-009", name: "Payment latency", match: "72% similar", root: "Database saturation", resolved: "Restart service", date: "05 Nov 2025", high: false },
];

const activityItems = [
  { time: "12:48", title: "SEV-1 incident detected", text: "Payment service failing (42% errors)", critical: true },
  { time: "12:44", title: "HTTP 500 errors begin", text: "Error rate increased from 0.8% → 15%" },
  { time: "12:41", title: "Payment latency increasing", text: "Latency increased from 420ms → 2.1s" },
  { time: "12:38", title: "DB connections increasing", text: "Connections increased from 42 → 78" },
  { time: "12:35", title: "Deployment v1.8.4", text: "New version deployed to payment service" },
];

const serviceDetails: Record<ServiceId, { title: string; status: string; description: string; rows: [string, string][] }> = {
  web: { title: "NEXA Web App", status: "Operational", description: "Customer-facing storefront and checkout entry point.", rows: [["Availability", "99.99%"], ["Active sessions", "2,841"], ["Latest release", "v3.6.2"]] },
  api: { title: "Payment API", status: "Degraded", description: "Requests to the payment gateway are returning elevated server errors.", rows: [["HTTP 500 errors", "42%"], ["Requests / min", "1,284"], ["Last healthy", "12:43 PM"]] },
  payments: { title: "Payment Service", status: "Critical", description: "Payment processing is affected by high latency and database contention.", rows: [["Response time", "3.8s"], ["Error rate", "42%"], ["Deployment", "v1.8.4 · 12 min ago"]] },
  database: { title: "Database infrastructure", status: "Critical · 98 / 100 connections", description: "Connection pool is nearing capacity. Explore the live infrastructure topology.", rows: [["Connections", "98 / 100"], ["Pool utilization", "98%"], ["Primary region", "us-east-1"]] },
};

export const Route = createFileRoute("/app-dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "NEXA System Observatory — Opsight App Dashboard" },
      { name: "description", content: "Live system health, service dependencies, incidents, and infrastructure for NEXA." },
      { property: "og:title", content: "NEXA System Observatory — Opsight App Dashboard" },
      { property: "og:description", content: "Live system health, service dependencies, incidents, and infrastructure for NEXA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null);
  const [databaseView, setDatabaseView] = useState(false);
  const [timeRange, setTimeRange] = useState("Last 30 minutes");
  const [showAllIncidents, setShowAllIncidents] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);

  const openService = (id: ServiceId) => {
    if (id === "database") {
      setDatabaseView(true);
      return;
    }
    setSelectedService(id);
  };

  return (
    <main className={`observatory ${databaseView ? "observatory--database" : ""}`}>
      {/* Universal navigation bar */}
      <DashboardHeader active="app-dashboard" />

      <div className="atmosphere" aria-hidden="true"><i /><i /><i /><i /></div>
      {databaseView ? (
        <section className="infra-scene" aria-label="Database infrastructure exploration" style={{ paddingTop: "78px" }}>
          <header className="infra-header">
            <div className="infra-brand"><span className="infra-mark"><Database size={19} /></span><div><p>INFRASTRUCTURE EXPLORER</p><h1>Database topology</h1></div></div>
            <Button variant="outline" className="glass-button" onClick={() => setDatabaseView(false)}><X /> Return to observatory</Button>
          </header>
          <div className="infra-kicker"><span className="live-dot" /> LIVE TOPOLOGY <span className="infra-divider" /> US-EAST-1 · PRIMARY CLUSTER</div>
          <div className="infra-stage">
            <div className="infra-orbit infra-orbit--one" /><div className="infra-orbit infra-orbit--two" />
            <div className="infra-node infra-node--primary"><Database size={32} /><span>PRIMARY CLUSTER</span><strong>nexa-prod-db-01</strong><small>98 / 100 connections · 98% utilized</small><i /></div>
            <div className="infra-branch infra-branch--left" /><div className="infra-branch infra-branch--right" />
            <div className="infra-node infra-node--replica infra-node--left"><HardDrive size={23} /><span>READ REPLICA</span><strong>nexa-read-01</strong><small>Latency 42 ms · Healthy</small><i /></div>
            <div className="infra-node infra-node--replica infra-node--right"><Layers3 size={23} /><span>CONNECTION POOL</span><strong>payment-pool</strong><small>98 active · 2 available</small><i /></div>
            <div className="infra-signal infra-signal--left" /><div className="infra-signal infra-signal--right" />
          </div>
          <div className="infra-footer"><span><Activity size={15} /> CONNECTION PRESSURE</span><strong>Critical <em>98%</em></strong><span>Pool capacity nearly exhausted</span></div>
        </section>
      ) : (
        <div className="dashboard-shell" style={{ paddingTop: "88px" }}>
          <section className="top-row" aria-label="NEXA overview">
            <div className="brand-block">
              <div className="wordmark">NEXA</div>
              <p className="brand-subtitle">E-Commerce Platform</p>
              <div className="brand-status"><span className="online-dot" /> <span>Online</span><i /> <time>21 Jul 2026, 12:48 PM</time></div>
              <Button variant="outline" className="open-store" onClick={() => setSelectedService("web")}>Open in NEXA <ArrowRight size={16} /></Button>
            </div>
            <button className="laptop" onClick={() => setSelectedService("web")} aria-label="Open NEXA storefront details">
              <div className="laptop-screen">
                <img
                  src={storefrontImage}
                  alt="NEXA E-Commerce Platform"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="laptop-base" />
            </button>
            <Panel className="health-panel">
              <PanelHeader icon={<Activity />} title="System Health">
                <label className="range-picker"><span className="sr-only">System health time range</span><select value={timeRange} onChange={(event) => setTimeRange(event.target.value)}><option>Last 30 minutes</option><option>Last 1 hour</option><option>Last 24 hours</option></select><ChevronDown size={13} /></label>
              </PanelHeader>
              <div className="metrics-grid">
                <Metric title="CPU" value="43%" amount={43} tone="blue" points="0,23 9,18 18,20 26,10 34,14 44,9 53,14 62,12 73,18 82,16 92,19 100,17" />
                <Metric title="Memory" value="58%" amount={58} tone="blue" points="0,20 9,16 17,19 25,11 35,15 45,9 55,13 66,16 76,12 86,18 94,16 100,18" />
                <Metric title="Database" value="98/100" amount={98} tone="critical" label="Connections" points="0,24 9,18 18,22 26,8 35,13 44,9 54,15 64,14 76,17 88,16 100,18" />
                <Metric title="Avg. Response" value="320" suffix="ms" amount={36} tone="muted" points="0,20 9,19 18,16 26,19 35,13 44,16 54,11 64,14 74,16 84,11 93,17 100,13" />
              </div>
            </Panel>
          </section>

          <section className="middle-row" aria-label="Live systems and incident">
            <Panel className="flow-panel">
              <PanelHeader icon={<Network />} title="Service Flow"><span className="live-pill"><span /> Live</span></PanelHeader>
              <div className="flow-track">{services.map((service, index) => <div className="flow-step" key={service.id}><button onClick={() => openService(service.id)} className={`service-node service-node--${service.status}`} aria-label={`View ${service.name} details`}><span className="service-light" /><service.Icon className="service-icon" strokeWidth={1.8} /><strong>{service.name}</strong><span className="service-description">{service.description}</span></button>{index < services.length - 1 && <div className={`flow-connector flow-connector--${index}`} aria-hidden="true"><ArrowRight size={20} /><i /></div>}</div>)}</div>
            </Panel>
            <Panel className="incident-panel">
              <div className="incident-top"><div className="panel-title"><AlertTriangle /><span>Live Incident</span></div><span className="severity-badge">SEV-1</span></div>
              <h2>Payment Service Failure</h2><p className="incident-subtitle">Automatically detected from NEXA</p>
              <div className="incident-rows">{[["HTTP 500 errors", "42%", true], ["Response time", "3.8s", true], ["Database connections", "98 / 100", true], ["Latest deployment", "v1.8.4", false], ["Deployment age", "12 min ago", false]].map(([label, value, critical]) => <div className="incident-row" key={String(label)}><span>{label}</span><strong className={critical ? "critical-text" : ""}>{value}</strong></div>)}</div>
            </Panel>
          </section>

          <section className="bottom-row" aria-label="Incident history and recent activity">
            <Panel className="previous-panel">
              <PanelHeader icon={<Clock3 />} title="Previous Issues"><Button variant="outline" size="sm" className="panel-action" onClick={() => setShowAllIncidents(!showAllIncidents)}>{showAllIncidents ? "Show less" : "View All"} <ArrowRight size={14} /></Button></PanelHeader>
              <div className="incident-list">{incidents.map((incident) => <article className="history-row" key={incident.id}><span className="history-icon"><FileText size={18} /></span><div className="history-name"><strong>{incident.id}</strong><span>{incident.name}</span></div><span className={`similarity ${incident.high ? "similarity--high" : ""}`}>{incident.match}</span><div className="history-resolution"><span>Root cause: <strong>{incident.root}</strong></span><span>Resolved: <strong>{incident.resolved}</strong></span></div><time>{incident.date}</time></article>)}{showAllIncidents && <article className="history-row history-row--extra"><span className="history-icon"><FileText size={18} /></span><div className="history-name"><strong>INC-006</strong><span>Gateway unavailable</span></div><span className="similarity">64% similar</span><div className="history-resolution"><span>Root cause: <strong>Upstream timeout</strong></span><span>Resolved: <strong>Failover enabled</strong></span></div><time>18 Sep 2025</time></article>}</div>
            </Panel>
            <Panel className="activity-panel">
              <PanelHeader icon={<List />} title="Recent Activity"><Button variant="outline" size="sm" className="panel-action" onClick={() => setShowAllActivity(!showAllActivity)}>{showAllActivity ? "Show less" : "View All"} <ArrowRight size={14} /></Button></PanelHeader>
              <div className="timeline">{activityItems.map((item) => <article className={`timeline-entry ${item.critical ? "timeline-entry--critical" : ""}`} key={item.time}><time>{item.time}</time><span className="timeline-marker" /><div><strong>{item.title}</strong><span>{item.text}</span></div></article>)}{showAllActivity && <article className="timeline-entry"><time>12:31</time><span className="timeline-marker" /><div><strong>Health check passed</strong><span>All services operational before deployment</span></div></article>}</div>
            </Panel>
          </section>
          <footer className="page-footer"><span><span className="online-dot" /> ALL SYSTEMS MONITORED</span><span>LAST UPDATED 12:48:32 PM <ArrowUpRight size={12} /></span></footer>
        </div>
      )}

      {selectedService && (
        <div className="detail-backdrop" role="presentation" onClick={() => setSelectedService(null)}>
          <section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={(event) => event.stopPropagation()}>
            <header>
              <span className="detail-icon">{selectedService === "web" ? <ShoppingCart /> : selectedService === "api" ? <Code2 /> : <Server />}</span>
              <Button variant="ghost" size="icon" aria-label="Close service details" onClick={() => setSelectedService(null)}>
                <X />
              </Button>
            </header>
            <span className="detail-eyebrow">SERVICE DETAILS</span>
            <h2 id="detail-title">{serviceDetails[selectedService].title}</h2>
            <span className={`detail-status ${selectedService === "web" ? "detail-status--healthy" : ""}`}>
              <i />{serviceDetails[selectedService].status}
            </span>
            <p>{serviceDetails[selectedService].description}</p>
            {selectedService === "web" && (
              <div className="mb-4 rounded-xl overflow-hidden border border-white/15 shadow-xl">
                <img
                  src={storefrontImage}
                  alt="NEXA Storefront UI"
                  className="w-full h-44 object-cover object-top"
                />
              </div>
            )}
            <div className="detail-rows">
              {serviceDetails[selectedService].rows.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <Button variant="outline" className="detail-close" onClick={() => setSelectedService(null)}>
              Close details
            </Button>
          </section>
        </div>
      )}
    </main>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`glass-panel ${className}`}>{children}</section>;
}

function PanelHeader({ icon, title, children }: { icon: React.ReactNode; title: string; children?: React.ReactNode }) {
  return <header className="panel-header"><div className="panel-title">{icon}<span>{title}</span></div>{children}</header>;
}

function Metric({ title, value, suffix, amount, tone, label, points }: { title: string; value: string; suffix?: string; amount: number; tone: "blue" | "critical" | "muted"; label?: string; points: string }) {
  return <article className={`metric-card metric-card--${tone}`}><span className="metric-label">{title}</span><div className="metric-ring" style={{ "--metric-value": `${amount}%` } as React.CSSProperties}><div><strong>{value}{suffix && <small>{suffix}</small>}</strong>{label && <span>{label}</span>}</div></div><svg className="metric-chart" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true"><polyline points={points} /></svg></article>;
}
