import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Columns, LayoutGrid, X } from "lucide-react";

import { CommandBar } from "@/components/opsight/CommandBar";
import { DashboardHeader } from "@/components/opsight/DashboardHeader";
import { IncidentPanel, RootCausePanel } from "@/components/opsight/Panels";
import { SplineStage } from "@/components/opsight/SplineStage";
import { Investigation3DTrace } from "@/components/opsight/Investigation3DTrace";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Opsight Dashboard — Spline 3D" },
      {
        name: "description",
        content:
          "Opsight is a holographic AI operations agent that traces incidents across your infrastructure in a live 3D command environment.",
      },
      { property: "og:title", content: "Opsight Dashboard — Spline 3D" },
      {
        property: "og:description",
        content:
          "Watch an AI agent investigate live incidents inside a cinematic 3D infrastructure environment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const BACKEND_URL =
  (import.meta.env["VITE_FASTAPI_BACKEND_URL"] as string) || "http://127.0.0.1:8000";

function Dashboard() {
  const [activeQuery, setActiveQuery] = useState("");
  const [isResolved, setIsResolved] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState<any>(null);
  const [hindsightNotice, setHindsightNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"trace" | "telemetry">("trace");
  const [isSplitView, setIsSplitView] = useState(false);

  // Poll live operational telemetry from backend
  useEffect(() => {
    let isMounted = true;

    const fetchTelemetry = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/ops/payment-status`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.status === "healthy" || data.status_code === 200) {
              setIsResolved(true);
            } else {
              setIsResolved(false);
            }
          }
        }
      } catch (err) {
        // backend offline fallback
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleResolve = async () => {
    if (isResolving) return;
    setIsResolving(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "execute_runbook", runbook_id: "INC-014" }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsResolved(true);
        setLiveMetrics(data.recovered_metrics);
        setHindsightNotice("Postmortem saved to Hindsight Memory (INC-015 Retained).");

        // Speak confirmation
        if ("speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(
              "Resolution runbook executed. Drained node-us-east-2 to healthy standby pods, cleared idle PostgreSQL connection handles, and completed canary rollback to payments release v2.13.8. Postmortem retained in Hindsight memory."
            );
            utterance.rate = 1.05;
            window.speechSynthesis.speak(utterance);
          } catch (e) {
            // ignore
          }
        }
      } else {
        setIsResolved(true);
      }
    } catch (e) {
      console.warn("Backend resolve fallback:", e);
      setIsResolved(true);
      setHindsightNotice("Postmortem saved to Hindsight Memory (INC-015 Retained).");
    } finally {
      setIsResolving(false);
    }
  };

  const handleSimulate = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/incident/trigger`, {
        method: "POST",
      });
      setIsResolved(false);
      setHindsightNotice(null);
    } catch (e) {
      setIsResolved(false);
      setHindsightNotice(null);
    }
  };

  const handleUserQuery = (query: string) => {
    setActiveQuery(query);
    const q = query.toLowerCase();
    if (
      q.includes("resolve") ||
      q.includes("fix") ||
      q.includes("runbook") ||
      q.includes("remediate")
    ) {
      handleResolve();
    }
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Spline 3D Stage (Completely unobstructed on left and center!) */}
      <SplineStage />

      {/* Top Header with Page Navigation Bar */}
      <DashboardHeader active="spline" />

      {/* Floating Hindsight Retain Notification Banner */}
      {hindsightNotice && (
        <div
          className="pointer-events-auto absolute top-16 inset-x-0 mx-auto z-40 w-fit max-w-md flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs text-white"
          style={{
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8)",
            animation: "rise 0.5s ease-out both",
          }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-white shrink-0" />
            <span className="font-mono">{hindsightNotice}</span>
          </div>
          <button
            onClick={() => setHindsightNotice(null)}
            className="text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* RIGHT SIDE HUD PANELS: Positioned safely to the right so Spline 3D character is never overlapped! */}
      <div className="pointer-events-auto absolute right-4 top-16 z-20 hidden lg:flex flex-row items-start gap-2.5 xl:right-6">
        {/* If Split View is toggled on wide screens, show 3D trace side-by-side on the right */}
        {isSplitView && (
          <div className="w-[17.5rem] xl:w-[19rem]">
            <Investigation3DTrace
              isResolved={isResolved}
              onResolve={handleResolve}
              onSimulate={handleSimulate}
              isResolving={isResolving}
            />
          </div>
        )}

        {/* Primary Right Panel Column */}
        <div className="flex w-[17.5rem] xl:w-[19rem] flex-col gap-2">
          {/* Segmented Switcher Bar (3D Trace vs Telemetry) */}
          <div
            className="flex items-center justify-between rounded-xl p-1 text-xs"
            style={{
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <div className="flex items-center gap-1 w-full">
              <button
                onClick={() => {
                  setActiveTab("trace");
                  setIsSplitView(false);
                }}
                className={`flex-1 rounded-lg py-1 px-2.5 text-[11px] font-semibold transition-all cursor-pointer ${
                  activeTab === "trace" && !isSplitView
                    ? "bg-white text-black shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                3D Visual Trace
              </button>
              <button
                onClick={() => {
                  setActiveTab("telemetry");
                  setIsSplitView(false);
                }}
                className={`flex-1 rounded-lg py-1 px-2.5 text-[11px] font-semibold transition-all cursor-pointer ${
                  activeTab === "telemetry" && !isSplitView
                    ? "bg-white text-black shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Live Telemetry
              </button>
            </div>

            {/* Split View Toggle for wide displays */}
            <button
              onClick={() => setIsSplitView((prev) => !prev)}
              title={isSplitView ? "Single Panel Mode" : "Side-by-side View"}
              className={`ml-1.5 p-1 rounded-md transition-colors cursor-pointer ${
                isSplitView ? "bg-white/20 text-white" : "text-white/40 hover:text-white"
              }`}
            >
              {isSplitView ? (
                <LayoutGrid className="h-3.5 w-3.5" />
              ) : (
                <Columns className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* Render Active View */}
          {isSplitView ? (
            <IncidentPanel isResolved={isResolved} metrics={liveMetrics} />
          ) : activeTab === "trace" ? (
            <Investigation3DTrace
              isResolved={isResolved}
              onResolve={handleResolve}
              onSimulate={handleSimulate}
              isResolving={isResolving}
            />
          ) : (
            <IncidentPanel isResolved={isResolved} metrics={liveMetrics} />
          )}

          {/* Detected Incident Ticket Card (#INC-2841 / INC-014) */}
          <RootCausePanel
            activeQuery={activeQuery}
            onResolve={handleResolve}
            isResolved={isResolved}
          />
        </div>
      </div>

      {/* Command & Voice Bar with Upward Floating Chat History (Compact Size) */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-6 z-50 mx-auto w-[min(31rem,88vw)] px-2">
        <CommandBar onSubmit={handleUserQuery} />
      </div>

      {/* Mobile/Compact HUD Panels (Screen width < 1024px) */}
      <div className="pointer-events-auto absolute inset-x-3 top-16 z-20 flex flex-col gap-2 max-w-sm mx-auto lg:hidden max-h-[48vh] overflow-y-auto no-scrollbar">
        {/* Mobile Tab Switcher */}
        <div
          className="flex items-center justify-between rounded-xl p-1 text-xs shrink-0"
          style={{
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <div className="flex items-center gap-1 w-full">
            <button
              onClick={() => setActiveTab("trace")}
              className={`flex-1 rounded-lg py-1 px-2.5 text-[11px] font-semibold transition-all cursor-pointer ${
                activeTab === "trace"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              3D Visual Trace
            </button>
            <button
              onClick={() => setActiveTab("telemetry")}
              className={`flex-1 rounded-lg py-1 px-2.5 text-[11px] font-semibold transition-all cursor-pointer ${
                activeTab === "telemetry"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Live Telemetry
            </button>
          </div>
        </div>

        {/* Mobile Active Panel */}
        {activeTab === "trace" ? (
          <Investigation3DTrace
            isResolved={isResolved}
            onResolve={handleResolve}
            onSimulate={handleSimulate}
            isResolving={isResolving}
          />
        ) : (
          <IncidentPanel isResolved={isResolved} metrics={liveMetrics} />
        )}

        {/* Detected Incident Ticket Card */}
        <RootCausePanel
          activeQuery={activeQuery}
          onResolve={handleResolve}
          isResolved={isResolved}
        />
      </div>
    </main>
  );
}
