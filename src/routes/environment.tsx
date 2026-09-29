import { createFileRoute } from '@tanstack/react-router'
import { OpsightApp } from "@/components/opsight/OpsightApp";

export const Route = createFileRoute("/environment")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Opsight — 3D Infrastructure Environment" },
      {
        name: "description",
        content:
          "Explore the interactive 3D holographic topology environment and live incident memory correlations with Opsight.",
      },
      { property: "og:title", content: "Opsight — 3D Infrastructure Environment" },
      {
        property: "og:description",
        content:
          "Watch an AI agent investigate live incidents inside a cinematic 3D infrastructure environment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OpsightApp,
});

