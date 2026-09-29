import { useMemo, useState } from "react";

type NodeId = "frontend" | "auth" | "queue" | "payment" | "database";

type Node = {
  id: NodeId;
  label: string;
  x: number;
  y: number;
  status: "healthy" | "critical";
};

const NODES: Node[] = [
  { id: "frontend", label: "Frontend", x: 50, y: 18, status: "healthy" },
  { id: "auth", label: "Auth Service", x: 20, y: 44, status: "healthy" },
  { id: "queue", label: "Queue", x: 80, y: 42, status: "healthy" },
  { id: "payment", label: "Payment API", x: 40, y: 62, status: "critical" },
  { id: "database", label: "Database", x: 72, y: 78, status: "critical" },
];

const EDGES: Array<[NodeId, NodeId]> = [
  ["frontend", "auth"],
  ["frontend", "queue"],
  ["frontend", "payment"],
  ["auth", "payment"],
  ["queue", "database"],
  ["payment", "database"],
];

const MEMORY = [
  { id: "INC-014", similarity: 91, x: 9, y: 20 },
  { id: "INC-027", similarity: 84, x: 92, y: 62 },
  { id: "INC-009", similarity: 72, x: 14, y: 82 },
];

function pos(id: NodeId) {
  const n = NODES.find((node) => node.id === id)!;
  return n;
}

export function TopologyStage() {
  const [selected, setSelected] = useState<NodeId | null>("payment");
  const [hovered, setHovered] = useState<NodeId | null>(null);

  const emphasized = useMemo(() => {
    const active = hovered ?? selected;
    if (!active) return new Set<string>();
    return new Set(
      EDGES.filter(([a, b]) => a === active || b === active).map(
        ([a, b]) => `${a}-${b}`,
      ),
    );
  }, [hovered, selected]);

  const particles = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        left: (i * 37) % 100,
        top: (i * 61) % 100,
        delay: (i % 11) * 0.7,
        size: i % 5 === 0 ? 2 : 1,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 select-none">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 50% at 50% 48%, color-mix(in oklab, var(--color-halo) 14%, transparent), transparent 72%)",
        }}
      />

      {/* holographic floor grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-1/4 vignette-fade opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklab, var(--color-halo) 22%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--color-halo) 22%, transparent) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          transform: "perspective(900px) rotateX(64deg)",
          transformOrigin: "50% 0%",
        }}
      />

      {particles.map((p, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-white/50"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animation: `breathe ${6 + (i % 5)}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {EDGES.map(([a, b]) => {
          const from = pos(a);
          const to = pos(b);
          const critical = from.status === "critical" && to.status === "critical";
          const key = `${a}-${b}`;
          const active = emphasized.has(key);
          return (
            <g key={key}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={
                  critical
                    ? "color-mix(in oklab, var(--color-critical) 90%, transparent)"
                    : "color-mix(in oklab, var(--color-halo) 55%, transparent)"
                }
                strokeWidth={active ? 0.32 : 0.14}
                opacity={active ? 0.95 : 0.45}
                vectorEffect="non-scaling-stroke"
              />
              <circle
                r={critical ? 0.7 : 0.55}
                fill={critical ? "var(--color-critical)" : "white"}
                opacity={0.9}
              >
                <animateMotion
                  dur={`${critical ? 2.2 : 4.4}s`}
                  repeatCount="indefinite"
                  path={`M${from.x},${from.y} L${to.x},${to.y}`}
                />
              </circle>
            </g>
          );
        })}

        {MEMORY.map((m) => (
          <line
            key={m.id}
            x1={m.x}
            y1={m.y}
            x2={pos("payment").x}
            y2={pos("payment").y}
            stroke="color-mix(in oklab, white 30%, transparent)"
            strokeDasharray="1 2"
            strokeWidth={0.1}
            opacity={selected === "payment" ? 0.6 : 0.2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {MEMORY.map((m, i) => (
        <div
          key={m.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md px-2.5 py-1.5 text-[10px] tracking-wider glass-hairline"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            animation: `drift ${8 + i}s ease-in-out ${i}s infinite`,
          }}
        >
          <div className="text-foreground/80">{m.id}</div>
          <div className="text-muted-foreground">{m.similarity}% similar</div>
        </div>
      ))}

      {NODES.map((node) => {
        const critical = node.status === "critical";
        const active = selected === node.id || hovered === node.id;
        return (
          <button
            key={node.id}
            type="button"
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setSelected(node.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 outline-none cursor-pointer"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <span className="mb-3 block text-xs tracking-wide text-foreground/85">
              {node.label}
            </span>
            <span className="relative mx-auto block h-14 w-14">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: `0 0 60px 12px color-mix(in oklab, ${
                    critical ? "var(--color-critical)" : "var(--color-halo)"
                  } ${active ? 40 : 22}%, transparent)`,
                }}
              />
              <span
                className="absolute inset-0 rotate-45 rounded-[10px] border transition-transform duration-500"
                style={{
                  borderColor: critical
                    ? "color-mix(in oklab, var(--color-critical) 80%, transparent)"
                    : "color-mix(in oklab, var(--color-halo) 70%, transparent)",
                  background: critical
                    ? "linear-gradient(145deg, color-mix(in oklab, var(--color-critical) 30%, transparent), transparent)"
                    : "linear-gradient(145deg, color-mix(in oklab, var(--color-halo) 22%, transparent), transparent)",
                  transform: `rotate(45deg) scale(${active ? 1.12 : 1})`,
                }}
              />
              {critical && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full border"
                  style={{
                    borderColor:
                      "color-mix(in oklab, var(--color-critical) 60%, transparent)",
                    animation: "pulse-ring 2.6s ease-out infinite",
                  }}
                />
              )}
            </span>
            <span
              aria-hidden
              className="mx-auto mt-3 block h-px w-16"
              style={{
                background: `linear-gradient(90deg, transparent, color-mix(in oklab, ${
                  critical ? "var(--color-critical)" : "var(--color-halo)"
                } 70%, transparent), transparent)`,
              }}
            />
          </button>
        );
      })}

      {selected && (
        <div
          className="absolute left-1/2 top-[6%] -translate-x-1/2 rounded-full px-4 py-1.5 text-[11px] tracking-[0.2em] uppercase glass-hairline"
          style={{ animation: "rise 0.4s ease-out" }}
        >
          {pos(selected).label} ·{" "}
          <span
            style={{
              color:
                pos(selected).status === "critical"
                  ? "var(--color-critical)"
                  : "var(--color-healthy)",
            }}
          >
            {pos(selected).status === "critical" ? "degraded" : "operational"}
          </span>
        </div>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(88% 82% at 50% 50%, transparent 42%, #000 94%)",
        }}
      />
    </div>
  );
}
