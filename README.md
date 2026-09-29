# Opsight: Autonomous Site Reliability with Episodic Memory

Opsight is an autonomous incident observation and self-healing system operating across distributed microservices architectures. By combining real-time edge telemetry, hardware-accelerated 3D WebGL topology visualization, and episodic agent memory powered by [Hindsight](https://github.com/vectorize-io/hindsight), Opsight bridges the gap between active failure detection and surgical code remediation.

> **Read the full engineering deep dive:** [Why Autonomous SRE Needs Episodic Memory: How We Built Opsight with Hindsight](article.md)

---

## Architecture Overview

Opsight bridges client edge experience, streaming telemetry, 3D spatial infrastructure mapping, and persistent episodic memory:

![NEXA Edge Storefront & Automated Diagnostics](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/at3kxmbkc1lf4due2t09.png)

1. **Edge Telemetry Plane (`NEXA Storefront`):** Intercepts client-side transaction failures (such as `500 Internal Server Error` on checkout) and immediately dispatches structured diagnostics to the orchestrator.
2. **Ingress & Topology Stream:** Aggregates real-time health telemetry across Kubernetes clusters, PostgreSQL instances, Redis caches, and Envoy edge gateways.
3. **Spatial Visualization Engine (3D Observatory):** Renders the live service mesh in Three.js and WebGL, positioning historical incidents as holographic 3D memory crystals adjacent to afflicted nodes.
4. **Episodic Memory Core ([Hindsight](https://github.com/vectorize-io/hindsight)):** Queries institutional knowledge, historical postmortems, and proven pull request diffs using vector similarity to eliminate trial-and-error diagnostics.

---

## 3D Infrastructure Observatory & Hindsight Memory Nodes

![Opsight 3D Topology with Holographic Hindsight Memory Nodes](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/44ewrewb4ttzqrk28ili.png)

When an outage occurs, Opsight isolates the impacted services and projects historical incident postmortems directly onto the 3D canvas. Clicking any memory crystal reveals root causes, telemetry deltas, and verified configuration fixes:

![Opsight Autonomous AI Agent Showcase](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/y3wfr32y79s72yim2do5.png)

---

## Autonomous Agent Copilot & Incident RCA

![Opsight Interactive Spline 3D Agent Dashboard with Real-Time RCA](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/iycvjoe0br1tzqkh7neg.png)

Opsight's autonomous copilot correlates live telemetry with prior postmortems to determine root cause and propose verified production patches:

- **Metric Signatures:** Evaluates connection pool saturation, lock contention, and HTTP error rates.
- **Episodic Matching:** Computes cosine similarity against previously resolved tickets (e.g. `INC-014`).
- **Remediation Execution:** Delivers precise configuration diffs (e.g. HikariCP pool resizing, concurrent Postgres indexing) to restore service in under 90 seconds.

---

## Service Connections & Streaming Health

![Opsight Service Connections and Streaming Telemetry](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/6w22xf67ovtyabl6ojid.png)

---

## Getting Started

### Prerequisites
- Node.js (v18+) or [Bun](https://bun.sh)
- Vite / TanStack Start

### Installation & Local Development

```sh
# Install dependencies
bun install   # or: npm install

# Start local development server on port 3000
bun run dev --port 3000   # or: npm run dev
```

Visit `http://localhost:3000` to explore:
- `/` - Opsight Hero Landing & Agent Showcase
- `/dashboard` - Spline 3D Interactive Agent Experience
- `/environment` - WebGL 3D Topology & Hindsight Memory Crystals
- `/connection` - Live Service Mesh Connections & Telemetry Streams
- `/app-dashboard` - NEXA Storefront & Black Glassmorphic Infrastructure Control Center

---

## References & Resources

- **Article Deep Dive:** [article.md](article.md)
- **Hindsight GitHub:** [https://github.com/vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)
- **Hindsight Documentation:** [https://hindsight.vectorize.io/](https://hindsight.vectorize.io/)
- **Vectorize Agent Memory:** [https://vectorize.io/what-is-agent-memory](https://vectorize.io/what-is-agent-memory)
