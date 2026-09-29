import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Copy,
  Database,
  ExternalLink,
  Flame,
  Globe2,
  History,
  Network,
  Radio,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  previousTickets,
  services,
  type OpsightMode,
  type PreviousTicket,
  type ServiceId,
} from "@/lib/opsight-data";

function StatusDot({ incident = false, recovering = false }: { incident?: boolean; recovering?: boolean }) {
  if (recovering) return <span className="status-dot is-recovering" />;
  return <span className={`status-dot ${incident ? "is-incident" : ""}`} />;
}

function WebsitePreview({ onExpand }: { onExpand: () => void }) {
  return (
    <button className="website-preview" onClick={onExpand} aria-label="Expand live website preview">
      <div className="browser-bar">
        <i /><i /><i /><span>opsight.ai</span><ExternalLink size={12} />
      </div>
      <div className="mini-site">
        <div className="mini-nav">
          <b><span />OPSIGHT</b>
          <em>Platform &nbsp; Intelligence &nbsp; Security</em>
        </div>
        <div className="mini-hero">
          <small>AI OPERATIONS INTELLIGENCE</small>
          <strong>See the signal.<br />Resolve the incident.</strong>
          <div className="mini-graph">
            <i /><i /><i /><i />
          </div>
        </div>
      </div>
    </button>
  );
}

function TicketDetailModal({
  ticket,
  onClose,
  onApplyFix,
  isApplying,
}: {
  ticket: PreviousTicket;
  onClose: () => void;
  onApplyFix: (ticket: PreviousTicket) => void;
  isApplying: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (ticket.fixCode) {
      navigator.clipboard.writeText(ticket.fixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-scrim">
      <section className="ticket-modal glass-panel">
        <Button size="icon" variant="ghost" className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={17} />
        </Button>

        <div className="ticket-modal-header">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-purple-400" />
            <span className="text-[10px] font-mono tracking-widest text-purple-300">
              HINDSIGHT MEMORY · PREVIOUS INCIDENT TICKET
            </span>
          </div>
          <div className="flex items-center gap-2.5 mt-2">
            <span className="ticket-badge-pill">{ticket.id}</span>
            <span className="similarity-badge-pill">{ticket.similarity}% Semantic Match</span>
            <span className="severity-pill">{ticket.severity}</span>
            <span className="resolved-pill">
              <CheckCircle2 size={11} className="inline mr-1 text-emerald-400" />
              RESOLVED
            </span>
          </div>
          <h2 className="text-xl font-medium mt-3 text-white">{ticket.title}</h2>
          <div className="flex items-center gap-4 text-xs text-neutral-400 font-mono mt-1">
            <span>Date: {ticket.date}</span>
            <span>MTTR: {ticket.mttr}</span>
            <span>Resolved by: {ticket.engineer}</span>
          </div>
        </div>

        <div className="ticket-modal-body">
          {/* Root Cause Analysis */}
          <div className="ticket-section">
            <div className="ticket-section-title">
              <Flame size={14} className="text-red-400" /> IDENTIFIED ROOT CAUSE
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed bg-black/40 p-3 rounded border border-white/5 font-mono">
              {ticket.rootCause}
            </p>
          </div>

          {/* Observed Symptoms */}
          <div className="ticket-section">
            <div className="ticket-section-title">
              <AlertTriangle size={14} className="text-amber-400" /> MATCHING SYMPTOMS & SIGNALS
            </div>
            <ul className="ticket-symptoms-list">
              {ticket.symptoms.map((s) => (
                <li key={s}>
                  <StatusDot incident />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Proven Fix & Resolution */}
          <div className="ticket-section">
            <div className="ticket-section-title">
              <Wrench size={14} className="text-emerald-400" /> PROVEN FIX APPLIED
              {ticket.appliedPR && <span className="ml-auto text-[10px] text-cyan-400 font-mono">{ticket.appliedPR}</span>}
            </div>
            <p className="text-xs text-emerald-200/90 mb-3 bg-emerald-950/20 p-2.5 rounded border border-emerald-500/20">
              {ticket.fixSummary}
            </p>

            <div className="space-y-1.5 mb-3">
              {ticket.fixSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                  <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {ticket.fixCode && (
              <div className="relative mt-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 bg-black/60 px-3 py-1.5 rounded-t border-t border-x border-white/10">
                  <span>CONFIGURATION / SQL PATCH</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
                  >
                    <Copy size={11} /> {copied ? "Copied!" : "Copy patch"}
                  </button>
                </div>
                <pre className="text-[10px] font-mono p-3 bg-black/80 rounded-b border border-white/10 text-cyan-200 overflow-x-auto">
                  {ticket.fixCode}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="ticket-modal-footer">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="default"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            disabled={isApplying}
            onClick={() => onApplyFix(ticket)}
          >
            {isApplying ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Applying Fix to Cluster...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles size={14} /> Apply This Fix Now <ArrowRight size={14} />
              </span>
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}

function InspectionPanel({
  selected,
  tick,
  activeTab,
  onTabChange,
  onPreview,
  onSelectTicket,
  onApplyFix,
  isApplying,
  remediated,
}: {
  selected: ServiceId;
  tick: number;
  activeTab: "telemetry" | "hindsight";
  onTabChange: (tab: "telemetry" | "hindsight") => void;
  onPreview: () => void;
  onSelectTicket: (ticket: PreviousTicket) => void;
  onApplyFix: (ticket: PreviousTicket) => void;
  isApplying: boolean;
  remediated: boolean;
}) {
  const item = services[selected];
  const isHealthy = item.status === "HEALTHY" || remediated;
  const stamp = new Date(Date.UTC(2026, 8, 28, 12, 41, (tick * 4) % 60)).toISOString().slice(11, 19);

  // Filter previous tickets related to this service
  const matchingTickets = previousTickets.filter(
    (t) => t.serviceId === selected || t.relatedServiceId === selected,
  );

  return (
    <aside className="inspection-panel glass-panel" aria-live="polite">
      <div className="panel-heading">
        <div>
          <div className="eyebrow">
            <StatusDot incident={!isHealthy} recovering={isApplying} />
            {remediated ? "REMEDIATED WITH HINDSIGHT FIX" : !isHealthy ? "LIVE INCIDENT" : "LIVE SERVICE"}
          </div>
          <h2>{item.name}</h2>
        </div>
        <div className={`status-badge ${remediated ? "is-remediated" : !isHealthy ? "is-incident" : ""}`}>
          {remediated ? "RESOLVED" : item.severity ?? item.status}
        </div>
      </div>

      <div className="service-subhead">
        <span>{remediated ? "HEALTHY (RECOVERED)" : item.status}</span>
        <span>Dependency · {item.dependency}</span>
      </div>

      {/* Tabs between Telemetry vs Hindsight Memory */}
      <div className="panel-subtabs">
        <button
          className={activeTab === "telemetry" ? "is-active" : ""}
          onClick={() => onTabChange("telemetry")}
        >
          <Activity size={12} /> Live Signals
        </button>
        <button
          className={activeTab === "hindsight" ? "is-active" : ""}
          onClick={() => onTabChange("hindsight")}
        >
          <Brain size={12} /> Previous Fixes ({matchingTickets.length})
        </button>
      </div>

      {activeTab === "telemetry" ? (
        <>
          <div className="metric-grid">
            {item.metrics.map((metric) => (
              <div className="metric" key={metric.label}>
                <span>{metric.label}</span>
                <strong className={!isHealthy && metric.trend ? "incident-text" : ""}>
                  {remediated && metric.trend
                    ? metric.label === "ERROR RATE"
                      ? "0.01%"
                      : metric.label === "P99 LATENCY"
                      ? "24ms"
                      : metric.label === "POOL ACTIVE"
                      ? "28%"
                      : metric.value
                    : metric.value}{" "}
                  {remediated ? "✓" : metric.trend}
                </strong>
              </div>
            ))}
          </div>

          {selected === "frontend" && <WebsitePreview onExpand={onPreview} />}

          <section className="data-section">
            <div className="section-title">
              <Radio size={13} /> SYSTEM LOGS <span>LIVE</span>
            </div>
            <div className="terminal">
              {remediated ? (
                <>
                  <p>
                    <time>[{stamp}]</time>
                    <b className="text-emerald-400">INFO [Patch] HikariCP maxPoolSize expanded to 90 successfully</b>
                  </p>
                  <p>
                    <time>[{stamp}]</time>
                    <b className="text-emerald-400">INFO Database connection pool saturation dropped to 28%</b>
                  </p>
                  <p>
                    <time>[{stamp}]</time>
                    <b className="text-emerald-400">INFO Circuit breaker closed. 504 errors eliminated.</b>
                  </p>
                </>
              ) : (
                item.logs.map((log, i) => (
                  <p key={log}>
                    <time>[{i === 0 ? stamp : `12:4${i}:0${i + 1}`}]</time>
                    <b className={log.includes("ERROR") ? "incident-text" : ""}>{log}</b>
                  </p>
                ))
              )}
            </div>
          </section>

          <section className="data-section">
            <div className="section-title">
              <AlertTriangle size={13} /> {remediated ? "REMEDIATION STATUS" : "SYSTEM ERRORS"}
            </div>
            <div className="error-list">
              {remediated ? (
                <div>
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span className="text-emerald-200">Incident resolved by applying Hindsight Ticket INC-014 fix.</span>
                </div>
              ) : (
                item.errors.map((error, i) => (
                  <div key={error}>
                    <StatusDot incident={!isHealthy && i < 2} />
                    <span>{error}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          {!isHealthy && !remediated && (
            <section className="root-cause">
              <div className="section-title">
                <Brain size={13} className="text-purple-400" />
                HINDSIGHT ROOT CAUSE CORRELATION
              </div>
              <p>Likely root cause from historical memory</p>
              <strong>Database connection pool exhaustion</strong>
              <div className="confidence">
                <span style={{ width: "94%" }} />
                <b>94% confidence (Matched with INC-014)</b>
              </div>
              <ul>
                <li>DB connections saturated at 98%</li>
                <li>Identical footprint to incident on Aug 14, 2026</li>
                <li>Proven resolution available in ticket INC-014</li>
              </ul>
              <Button
                variant="default"
                className="w-full mt-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono"
                onClick={() => onTabChange("hindsight")}
              >
                <Wrench size={13} className="mr-1.5" /> View Previous Fixes ({matchingTickets.length})
              </Button>
            </section>
          )}
        </>
      ) : (
        /* Hindsight Previous Tickets & Fixes List */
        <div className="space-y-3 mt-3">
          <div className="text-[10px] font-mono text-purple-300 flex items-center gap-1.5">
            <Brain size={12} /> HISTORICAL MATCHES FOR {item.name.toUpperCase()}
          </div>

          {matchingTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="previous-ticket-card"
              onClick={() => onSelectTicket(ticket)}
            >
              <div className="ticket-card-header">
                <span className="ticket-id">{ticket.id}</span>
                <span className="ticket-match">{ticket.similarity}% Match</span>
                <span className="ticket-date">{ticket.date}</span>
              </div>
              <div className="ticket-card-title">{ticket.title}</div>
              <div className="ticket-fix-preview">
                <b>Proven Fix:</b> {ticket.fixSummary}
              </div>
              <div className="ticket-card-actions">
                <button
                  type="button"
                  className="ticket-inspect-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTicket(ticket);
                  }}
                >
                  Inspect Ticket & Patch <ChevronRight size={12} />
                </button>
                <button
                  type="button"
                  className="ticket-apply-btn"
                  disabled={isApplying || remediated}
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyFix(ticket);
                  }}
                >
                  {remediated ? "Applied ✓" : isApplying ? "Applying..." : "Apply Fix"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

function LivePreview({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-scrim">
      <section className="live-preview glass-panel">
        <Button size="icon" variant="ghost" className="modal-close" onClick={onClose} aria-label="Close preview">
          <X size={17} />
        </Button>
        <div className="eyebrow">
          <StatusDot />
          LIVE WEBSITE PREVIEW
        </div>
        <div className="preview-stats">
          <span>
            URL <b>opsight.ai</b>
          </span>
          <span>
            STATUS <b>Online</b>
          </span>
          <span>
            HTTP <b>200</b>
          </span>
          <span>
            LATENCY <b>124ms</b>
          </span>
        </div>
        <WebsitePreview onExpand={() => undefined} />
      </section>
    </div>
  );
}

function AllTicketsDrawer({
  onClose,
  onSelectTicket,
  onApplyFix,
  isApplying,
  remediated,
}: {
  onClose: () => void;
  onSelectTicket: (ticket: PreviousTicket) => void;
  onApplyFix: (ticket: PreviousTicket) => void;
  isApplying: boolean;
  remediated: boolean;
}) {
  return (
    <div className="modal-scrim">
      <section className="all-tickets-modal glass-panel">
        <Button size="icon" variant="ghost" className="modal-close" onClick={onClose} aria-label="Close tickets modal">
          <X size={17} />
        </Button>

        <div className="flex items-center gap-2 mb-2">
          <Brain size={18} className="text-purple-400" />
          <h2 className="text-xl font-medium text-white">Opsight Hindsight Memory — Previous Incident Tickets & Fixes</h2>
        </div>
        <p className="text-xs text-neutral-400 mb-5 font-mono">
          Historical post-mortems, verified root causes, and automated fixes correlated by embedding similarity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[62vh] overflow-y-auto pr-1">
          {previousTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="previous-ticket-card hover:border-purple-400/50 cursor-pointer"
              onClick={() => onSelectTicket(ticket)}
            >
              <div className="ticket-card-header">
                <span className="ticket-id">{ticket.id}</span>
                <span className="ticket-match">{ticket.similarity}% Match</span>
                <span className="ticket-date">{ticket.date}</span>
                <span className="text-[10px] text-neutral-400 font-mono ml-auto">MTTR: {ticket.mttr}</span>
              </div>
              <div className="ticket-card-title text-sm">{ticket.title}</div>
              <div className="text-[11px] text-neutral-400 my-1 line-clamp-2">
                <b>Root Cause:</b> {ticket.rootCause}
              </div>
              <div className="ticket-fix-preview">
                <b>Verified Fix:</b> {ticket.fixSummary}
              </div>
              <div className="ticket-card-actions mt-3">
                <button
                  type="button"
                  className="ticket-inspect-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTicket(ticket);
                  }}
                >
                  View RCA & Code Patch <ChevronRight size={12} />
                </button>
                <button
                  type="button"
                  className="ticket-apply-btn"
                  disabled={isApplying || (remediated && ticket.id === "INC-014")}
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyFix(ticket);
                  }}
                >
                  {remediated && ticket.id === "INC-014" ? "Fix Applied ✓" : isApplying ? "Applying..." : "Apply Fix"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function OpsightHUD({
  selected,
  selectedTicket,
  allTicketsOpen = false,
  previewOpen = false,
  onSetAllTicketsOpen,
  onSetPreviewOpen,
  onSelect,
  onSelectTicket,
}: {
  selected: ServiceId | null;
  selectedTicket: PreviousTicket | null;
  mode: OpsightMode;
  allTicketsOpen?: boolean;
  previewOpen?: boolean;
  onSetAllTicketsOpen?: (open: boolean) => void;
  onSetPreviewOpen?: (open: boolean) => void;
  onModeChange: (mode: OpsightMode) => void;
  onSelect: (id: ServiceId) => void;
  onSelectTicket: (ticket: PreviousTicket | null) => void;
  onReset: () => void;
}) {
  const [tick, setTick] = useState(0);
  const [localPreviewOpen, setLocalPreviewOpen] = useState(false);
  const [localTicketsOpen, setLocalTicketsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"telemetry" | "hindsight">("telemetry");
  const [isApplying, setIsApplying] = useState(false);
  const [remediated, setRemediated] = useState(false);

  const openTicketsModal = () => (onSetAllTicketsOpen ? onSetAllTicketsOpen(true) : setLocalTicketsOpen(true));
  const closeTicketsModal = () => (onSetAllTicketsOpen ? onSetAllTicketsOpen(false) : setLocalTicketsOpen(false));
  const openPreviewModal = () => (onSetPreviewOpen ? onSetPreviewOpen(true) : setLocalPreviewOpen(true));
  const closePreviewModal = () => (onSetPreviewOpen ? onSetPreviewOpen(false) : setLocalPreviewOpen(false));
  const isTicketsOpen = onSetAllTicketsOpen !== undefined ? allTicketsOpen : localTicketsOpen;
  const isPreviewOpen = onSetPreviewOpen !== undefined ? previewOpen : localPreviewOpen;

  useEffect(() => {
    const timer = window.setInterval(() => setTick((n) => n + 1), 4000);
    return () => window.clearInterval(timer);
  }, []);

  const handleApplyFix = (ticket: PreviousTicket) => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setRemediated(true);
      // Auto-switch to telemetry to show restored healthy state!
      setActiveTab("telemetry");
    }, 1800);
  };

  return (
    <div className="opsight-hud">
      {/* Left Service Rail */}
      <div className="service-rail glass-panel">
        <span>SERVICES</span>
        {(Object.keys(services) as ServiceId[]).map((id) => {
          const s = services[id];
          const hasIncident = !remediated && s.status !== "HEALTHY";
          return (
            <button
              key={id}
              className={`service-rail-btn ${selected === id ? "active" : ""}`}
              onClick={() => {
                onSelect(id);
                onSelectTicket(null);
              }}
            >
              <StatusDot incident={hasIncident} recovering={isApplying && (id === "payment" || id === "database")} />
              <span>{s.name}</span>
              <ChevronRight size={13} />
            </button>
          );
        })}

        {/* Hindsight Tickets Button in rail */}
        <div className="pt-2 mt-2 border-t border-white/10">
          <button
            type="button"
            className="service-rail-tickets-btn w-full h-8 flex items-center justify-between text-[10px] font-mono text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 rounded px-2 transition-all border border-purple-500/30"
            onClick={openTicketsModal}
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <History size={12} className="text-purple-400 shrink-0" />
              <span>PREVIOUS TICKETS</span>
            </span>
            <b className="bg-purple-600/80 px-1.5 py-0.5 rounded text-[9px] text-white shrink-0 font-bold ml-1">5</b>
          </button>
        </div>
      </div>

      {/* Bottom Scene Legend & Caption */}
      <div className="scene-caption">
        <Network size={14} />
        <span>LIVE TOPOLOGY & HINDSIGHT NODES</span>
        <b>Drag to orbit · Scroll to zoom · Click crystals for previous tickets & fixes</b>
      </div>

      {/* Right Inspection Panel or Incident Summary */}
      {selected ? (
        <InspectionPanel
          selected={selected}
          tick={tick}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onPreview={() => setPreviewOpen(true)}
          onSelectTicket={onSelectTicket}
          onApplyFix={handleApplyFix}
          isApplying={isApplying}
          remediated={remediated}
        />
      ) : (
        <aside className="incident-summary glass-panel">
          <div className="eyebrow">
            <StatusDot incident={!remediated} recovering={isApplying} />
            {remediated ? "INCIDENT REMEDIATED" : "LIVE INCIDENT"}
          </div>
          <h2>
            {remediated ? "SYSTEM RESTORED" : "PAYMENT SERVICE"}
            <br />
            {remediated ? "HEALTHY" : "DEGRADED"}
          </h2>
          <div className="severity-line">
            <span>{remediated ? "RESOLVED" : "SEV-1"}</span>
            <b>{remediated ? "Fix verified" : "Started 12m ago"}</b>
          </div>

          {/* Past Incidents Match Card */}
          <div className="hindsight-match-banner">
            <div className="flex items-center gap-1.5 text-purple-300 font-mono text-[10px]">
              <Brain size={12} />
              <span>2 SIMILAR HISTORICAL TICKETS FOUND</span>
            </div>
            <p className="text-[11px] text-neutral-300 mt-1">
              Top match: <b>INC-014 (94% similarity)</b> — Database connection pool starvation.
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-500/20">
              <button
                className="text-[10px] text-purple-300 hover:text-white font-mono flex items-center gap-1"
                onClick={() => setAllTicketsOpen(true)}
              >
                View 5 past tickets <ChevronRight size={11} />
              </button>
              <button
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono font-medium underline"
                onClick={() => onSelectTicket(previousTickets[0])}
              >
                Inspect INC-014 Fix →
              </button>
            </div>
          </div>

          <div className="signal-list">
            <div>
              <Activity size={15} />
              <span>5xx errors</span>
              <b>{remediated ? "0.01% ↓" : "8.4% ↑"}</b>
            </div>
            <div>
              <Database size={15} />
              <span>DB connections</span>
              <b>{remediated ? "28%" : "98%"}</b>
            </div>
            <div>
              <Globe2 size={15} />
              <span>Deployment</span>
              <b>Detected</b>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant={remediated ? "default" : "danger"}
              onClick={() => onSelect("payment")}
            >
              {remediated ? "Inspect healthy node" : "Inspect incident node"} <ChevronRight size={14} />
            </Button>
            <Button
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-950/40 text-xs font-mono"
              onClick={openTicketsModal}
            >
              <History size={13} className="mr-1.5" /> Browse All Past Tickets & Fixes
            </Button>
          </div>
        </aside>
      )}

      {/* Selected Ticket Modal (when user clicks a 3D memory crystal or clicks inspect) */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => onSelectTicket(null)}
          onApplyFix={handleApplyFix}
          isApplying={isApplying}
        />
      )}

      {/* All Tickets Drawer / Modal */}
      {isTicketsOpen && (
        <AllTicketsDrawer
          onClose={closeTicketsModal}
          onSelectTicket={(t) => {
            closeTicketsModal();
            onSelectTicket(t);
          }}
          onApplyFix={handleApplyFix}
          isApplying={isApplying}
          remediated={remediated}
        />
      )}

      {isPreviewOpen && <LivePreview onClose={closePreviewModal} />}
    </div>
  );
}
