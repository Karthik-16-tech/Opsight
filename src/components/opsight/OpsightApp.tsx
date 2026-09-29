import { useState } from "react";
import { InfrastructureScene } from "./InfrastructureScene";
import { OpsightHUD } from "./OpsightHUD";
import { DashboardHeader } from "./DashboardHeader";
import type { OpsightMode, PreviousTicket, ServiceId } from "@/lib/opsight-data";

export function OpsightApp() {
  const [selected, setSelected] = useState<ServiceId | null>(null);
  const [hovered, setHovered] = useState<ServiceId | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<PreviousTicket | null>(null);
  const [mode, setMode] = useState<OpsightMode>("interface");
  const [allTicketsOpen, setAllTicketsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const isModalOpen = Boolean(selectedTicket || allTicketsOpen || previewOpen);

  return (
    <main className={`opsight-shell mode-${mode} relative h-screen w-full overflow-hidden`}>
      <DashboardHeader active="environment" />
      <div className="scene-layer">
        <InfrastructureScene
          selected={selected}
          hovered={hovered}
          selectedTicket={selectedTicket}
          mode={mode}
          hide3DLabels={isModalOpen}
          onSelect={setSelected}
          onHover={setHovered}
          onSelectTicket={setSelectedTicket}
          onDeselect={() => setSelected(null)}
        />
      </div>
      <OpsightHUD
        selected={selected}
        selectedTicket={selectedTicket}
        mode={mode}
        allTicketsOpen={allTicketsOpen}
        previewOpen={previewOpen}
        onSetAllTicketsOpen={setAllTicketsOpen}
        onSetPreviewOpen={setPreviewOpen}
        onModeChange={setMode}
        onSelect={setSelected}
        onSelectTicket={setSelectedTicket}
        onReset={() => {
          setSelected(null);
          setSelectedTicket(null);
          setAllTicketsOpen(false);
          setPreviewOpen(false);
        }}
      />
    </main>
  );
}

export default OpsightApp;
