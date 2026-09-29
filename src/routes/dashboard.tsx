import { createFileRoute } from "@tanstack/react-router";

import { CommandBar } from "@/components/opsight/CommandBar";
import { DashboardHeader } from "@/components/opsight/DashboardHeader";
import { IncidentPanel, RootCausePanel } from "@/components/opsight/Panels";
import { SplineStage } from "@/components/opsight/SplineStage";

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

function Dashboard() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Spline 3D Stage */}
      <SplineStage />

      {/* Top Header with Page Navigation Bar */}
      <DashboardHeader active="spline" />

      {/* Right glass panels (compact size) */}
      <div className="pointer-events-auto absolute right-4 top-16 z-20 hidden w-[15.5rem] xl:w-[16.5rem] flex-col gap-2.5 lg:flex xl:right-6">
        <IncidentPanel />
        <RootCausePanel />
      </div>

      {/* Command Bar */}
      <div className="absolute inset-x-0 bottom-5 z-20 mx-auto w-[min(42rem,92vw)] px-2">
        <CommandBar />
      </div>

      {/* Mobile panels */}
      <div className="absolute inset-x-0 bottom-20 z-20 space-y-2.5 px-4 lg:hidden max-w-sm mx-auto">
        <IncidentPanel />
      </div>
    </main>
  );
}
