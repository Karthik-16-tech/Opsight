import asyncio
import json
import os
import time
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

app = FastAPI(
    title="OPSIGHT Engineering Operations Platform & Hindsight Backend",
    version="2.1.0",
    description="Live operational telemetry, Hindsight memory engine, and AI investigation copilot for NEXA production.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client
try:
    client = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Warning initializing Gemini Client: {e}")
    client = None

# ============================================================================
# 1. LIVE NEXA OPERATIONAL TELEMETRY STORE (MOCK / LIVE ADAPTER LAYER)
# ============================================================================

live_ops_state = {
    "incident_active": True,
    "incident_id": "INC-CURRENT-504",
    "severity": "SEV-1",
    "affected_service": "payment-api",
    "node": "node-us-east-2",
    "metrics": {
        "error_rate": 18.4,
        "latency_sec": 3.8,
        "latency_spike_ms": 340,
        "db_connections": 98,
        "db_max_connections": 100,
        "db_pool_status": "EXHAUSTED",
        "active_queries": 184,
        "login_drop_pct": 42,
        "checkout_drop_pct": 68,
        "revenue_loss_per_min": 1420,
    },
    "recent_deployment": {
        "commit": "a8f3c1b",
        "service": "payment-api",
        "deployed_ago": "3 minutes ago",
        "author": "checkout-team",
        "message": "feat: optimized checkout session transaction management",
    },
    "trace_path": [
        "frontend",
        "backend",
        "payment-api",
        "database",
        "connection-pool"
    ],
    "critical_nodes": ["payment-api", "payments-db", "connection-pool"],
}

# ============================================================================
# 2. HINDSIGHT MEMORY STORE (HISTORICAL INCIDENTS & POSTMORTEMS)
# ============================================================================

hindsight_database = [
    {
        "id": "INC-014",
        "title": "Payment Service 504 Timeout & DB Pool Saturation",
        "severity": "SEV-1",
        "category": "payments",
        "occurred": "14 days ago during flash checkout load",
        "similarity_score": 0.94,
        "root_cause": "Database connection pool exhaustion on PostgreSQL cluster (pegged at 98%). Unclosed transaction handles leaked connections under high checkout traffic.",
        "why_matched": "Identical symptom signature: 504 Gateway Timeouts on checkout, +340ms latency spikes, and 18.4% 5xx error rate caused by unreleased PostgreSQL connection handles on node-us-east-2.",
        "proven_resolution": [
            "Drained traffic from degraded node-us-east-2 to standby healthy pods in us-east-1.",
            "Executed pg_terminate_backend on PostgreSQL to evict orphaned idle-in-transaction connections.",
            "Triggered canary rollback of payment-api to stable release v2.13.8.",
            "Rescaled HikariCP max pool from 50 to 200 with 30s leak-detection threshold.",
        ],
        "metrics_achieved": {
            "mttr": "7m MTTR",
            "error_rate_drop": "18.4% -> 0.01%",
            "latency_stabilized": "38ms",
        },
        "postmortem_lessons": "Enforce automated HikariCP connection leak detection in pre-production staging. Add lint check against unclosed transaction blocks in payment routes.",
    },
    {
        "id": "INC-2719",
        "title": "Checkout API Latency & Pod Restarts on Node-us-east-2",
        "severity": "SEV-2",
        "category": "latency",
        "occurred": "32 days ago",
        "similarity_score": 0.81,
        "root_cause": "CPU throttling and thread pool saturation on Kubernetes worker node-us-east-2 caused by rapid pod restarts under traffic surge.",
        "why_matched": "Latency spike (+280ms) and pod restarts on the identical worker node node-us-east-2.",
        "proven_resolution": [
            "Scaled Horizontal Pod Autoscaler (HPA) target capacity from 3 to 8 worker pods.",
            "Flushed Redis connection locks and adjusted circuit breaker sensitivity on auth-gateway.",
            "Redistributed container workloads evenly across us-east-1 and us-east-2 availability zones.",
        ],
        "metrics_achieved": {
            "mttr": "12m MTTR",
            "error_rate_drop": "9.2% -> 0.00%",
            "latency_stabilized": "45ms",
        },
        "postmortem_lessons": "Increase minimum baseline pod replica count on node-us-east-2 before scheduled promotional windows.",
    },
    {
        "id": "INC-2510",
        "title": "Redis Cluster Memory Saturation & Eviction Stall",
        "severity": "SEV-2",
        "category": "redis",
        "occurred": "45 days ago",
        "similarity_score": 0.78,
        "root_cause": "Redis memory reached 89% maxmemory limit without volatile-lru eviction on shopping cart keys.",
        "why_matched": "Memory pressure and connection timeout delays on cached checkout payloads.",
        "proven_resolution": [
            "Reconfigured maxmemory-policy to allkeys-lru on Redis master node.",
            "Flushed stale guest session TTLs and scaled Redis replica read-nodes.",
            "Enabled async background memory defragmentation.",
        ],
        "metrics_achieved": {
            "mttr": "9m MTTR",
            "error_rate_drop": "4.8% -> 0.00%",
            "latency_stabilized": "< 2ms",
        },
        "postmortem_lessons": "Set strict 2-hour TTL on unauthenticated shopping carts to avoid memory bloat.",
    },
]

# ============================================================================
# 3. CONTROLLED AGENT TOOLS
# ============================================================================

def get_payment_status() -> Dict[str, Any]:
    """Inspects payment service status, error code, and database connections."""
    if live_ops_state["incident_active"]:
        return {
            "service": "payment-api",
            "status_code": 500,
            "status": "degraded",
            "error": "504 Gateway Timeout",
            "latency": live_ops_state["metrics"]["latency_sec"],
            "database_connections": f"{live_ops_state['metrics']['db_connections']}/{live_ops_state['metrics']['db_max_connections']}",
            "connection_pool": live_ops_state["metrics"]["db_pool_status"],
            "active_queries": live_ops_state["metrics"]["active_queries"],
        }
    return {
        "service": "payment-api",
        "status_code": 200,
        "status": "healthy",
        "latency": live_ops_state["metrics"]["latency_sec"],
        "database_connections": f"{live_ops_state['metrics']['db_connections']}/{live_ops_state['metrics']['db_max_connections']}",
        "connection_pool": live_ops_state["metrics"]["db_pool_status"],
        "active_queries": live_ops_state["metrics"]["active_queries"],
    }

def get_service_status() -> Dict[str, Any]:
    """Inspects all microservices in the monitored production environment."""
    if live_ops_state["incident_active"]:
        return {
            "nexa-storefront": {"status": "nominal", "uptime": "99.98%", "latency": "22ms"},
            "backend-gateway": {"status": "nominal", "latency": "18ms"},
            "payment-api": {"status": "critical", "5xx_rate": f"{live_ops_state['metrics']['error_rate']}%", "node": "node-us-east-2"},
            "payments-db": {"status": "critical", "connections": f"{live_ops_state['metrics']['db_connections']}/{live_ops_state['metrics']['db_max_connections']}"},
            "connection-pool": {"status": "exhausted", "saturation": "98%"},
            "redis-cache": {"status": "nominal", "memory_usage": "48%"},
        }
    return {
        "nexa-storefront": {"status": "nominal", "uptime": "100%", "latency": "18ms"},
        "backend-gateway": {"status": "nominal", "latency": "14ms"},
        "payment-api": {"status": "nominal", "5xx_rate": "0.01%", "node": "node-us-east-2"},
        "payments-db": {"status": "nominal", "connections": f"{live_ops_state['metrics']['db_connections']}/{live_ops_state['metrics']['db_max_connections']}"},
        "connection-pool": {"status": "nominal", "saturation": "24%"},
        "redis-cache": {"status": "nominal", "memory_usage": "48%"},
    }

def get_recent_errors() -> List[Dict[str, Any]]:
    """Returns recent error events captured by telemetry."""
    if live_ops_state["incident_active"]:
        return [
            {"time": "-1m", "level": "FATAL", "service": "payment-api", "msg": "HikariPool-1 - Connection is not available, request timed out after 30000ms."},
            {"time": "-2m", "level": "ERROR", "service": "backend-gateway", "msg": "504 Gateway Timeout while proxying request to payment-api on node-us-east-2."},
            {"time": "-3m", "level": "WARN", "service": "payments-db", "msg": "Active connections reached 98/100 (98% saturation threshold exceeded)."},
        ]
    return [{"time": "now", "level": "INFO", "service": "payment-api", "msg": "All microservice health checks nominal."}]

def get_database_health() -> Dict[str, Any]:
    """Returns PostgreSQL connection pool and query telemetry."""
    return {
        "database": "payments-db",
        "connections": live_ops_state["metrics"]["db_connections"],
        "max_connections": live_ops_state["metrics"]["db_max_connections"],
        "pool_status": live_ops_state["metrics"]["db_pool_status"],
        "active_queries": live_ops_state["metrics"]["active_queries"],
    }

def get_metrics() -> Dict[str, Any]:
    """Returns live Prometheus / CloudWatch telemetry metrics."""
    return live_ops_state["metrics"]

def get_recent_deployments() -> Dict[str, Any]:
    """Returns recent CI/CD deployments."""
    return live_ops_state["recent_deployment"]

def get_trace() -> Dict[str, Any]:
    """Returns distributed APM trace."""
    if live_ops_state["incident_active"]:
        return {
            "trace_id": "tr-7f89a1c4",
            "root_span": "nexa-storefront GET /checkout",
            "path": live_ops_state["trace_path"],
            "critical_nodes": live_ops_state["critical_nodes"],
            "bottleneck": "payments-db (waiting for HikariCP connection slot: 3800ms)",
        }
    return {
        "trace_id": "tr-9a1b2c3d",
        "root_span": "nexa-storefront GET /checkout",
        "path": live_ops_state["trace_path"],
        "critical_nodes": [],
        "bottleneck": "none (nominal 38ms end-to-end trace)",
    }

def search_hindsight(query: str) -> List[Dict[str, Any]]:
    """Searches Hindsight memory for historical incident precedents."""
    q = query.lower()
    if any(k in q for k in ["redis", "cache", "memory"]):
        return [hindsight_database[2]]
    if any(k in q for k in ["latency", "pod", "restart", "cpu"]):
        return [hindsight_database[1]]
    # Default: payments / 504 / db pool
    return [hindsight_database[0]]

def save_to_hindsight(incident_data: Dict[str, Any]) -> Dict[str, Any]:
    """Saves resolved incident postmortem to Hindsight memory."""
    new_ticket = {
        "id": f"INC-{len(hindsight_database) + 12:03d}",
        "title": incident_data.get("title", "Resolved Incident"),
        "severity": incident_data.get("severity", "SEV-1"),
        "category": incident_data.get("category", "payments"),
        "occurred": "Just now",
        "similarity_score": 1.0,
        "root_cause": incident_data.get("root_cause", "Resolved via Opsight Runbook"),
        "proven_resolution": incident_data.get("resolution_steps", []),
        "postmortem_lessons": incident_data.get("lessons", "Resolution saved to Hindsight memory."),
    }
    hindsight_database.append(new_ticket)
    return new_ticket

# ============================================================================
# 4. SYSTEM PROMPT FOR OPSIGHT AGENT
# ============================================================================

OPSIGHT_SYSTEM_PROMPT = """
You are OPSIGHT, the AI engineering operations intelligence platform for SREs, DevOps engineers, and on-call teams.
You explain complex cloud outages like ChatGPT: structured, easy for developers to understand, and with exact root causes.

When an engineer asks to investigate or ask about payment errors, structure your response into 4 distinct, well-organized sections:

### 🔍 Root Cause Attribution
Clearly identify WHICH architecture layer caused the error: Is it Frontend, Backend, Microservice, or Database?
Explicitly state that the root failure is at the **Database Layer (PostgreSQL Cluster)**, not Frontend or API Gateway. Explain that commit a8f3c1b left unclosed transaction blocks, pegging PostgreSQL connection slots at 98% saturation and starving the HikariCP pool.

### 📋 Error Message Breakdown by Architecture Layer
Show the specific error message observed at each layer:
1. **Frontend (NEXA Storefront)**: `Checkout timeout: POST /api/checkout stalled after 30s` (Waiting on backend)
2. **Backend Gateway (API Gateway)**: `504 Gateway Timeout while proxying request to payments-service on node-us-east-2`
3. **Payment API (payments-service)**: `HikariPool-1 - Connection is not available, request timed out after 30000ms`
4. **Database (PostgreSQL Primary)**: `🔴 ROOT CAUSE: FATAL - remaining connection slots reserved for non-replication superuser connections (pegged at 98/100 connections, pool EXHAUSTED, 184 active queries)`

### 🛠️ What Needs to Be Done to Resolve
List the clear, sequential engineering remediation steps:
1. **Reroute Traffic**: Drain checkout traffic from degraded node-us-east-2 to standby healthy pods in us-east-1.
2. **Clear Orphaned Connections**: Run `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction';` in PostgreSQL.
3. **Rollback Faulty Commit**: Trigger canary rollback of payments-service to stable release v2.13.8.
4. **Scale HikariCP Pool**: Rescale maximum pool size from 50 to 200 with an aggressive 30s connection leak threshold.

### 📑 Matched Hindsight Ticket
Conclude your response with the matched similar incident ticket from Hindsight memory:
"Similar Incident Ticket: #INC-014 (94% Match) - Payment Service 504 Timeout & DB Pool Saturation."
"""

# ============================================================================
# 5. REQUEST / RESPONSE MODELS
# ============================================================================

class ChatMessage(BaseModel):
    role: str
    content: str

class VoiceChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class HindsightMatchItem(BaseModel):
    id: str
    title: str
    similarity: float
    root_cause: str
    resolution: str

class InvestigationResponse(BaseModel):
    incident: str
    severity: str
    affected_service: str
    root_cause: str
    path: List[str]
    critical_nodes: List[str]
    node_statuses: Dict[str, str]
    metrics: Dict[str, Any]
    hindsight_matches: List[HindsightMatchItem]
    recommended_actions: List[str]
    voice_reply: str
    spoken_summary: Optional[str] = None
    reply: Optional[str] = None
    timestamp: str
    status: str

class ResolveRequest(BaseModel):
    action: Optional[str] = "execute_runbook"
    runbook_id: Optional[str] = "INC-014"

# ============================================================================
# 6. REST API & CONTROLLED CONNECTOR ENDPOINTS
# ============================================================================

@app.get("/")
def root():
    return {
        "status": "online",
        "platform": "OPSIGHT Engineering Operations Platform",
        "monitored_app": "NEXA E-Commerce Production",
        "hindsight_memory": "active",
        "model": "gemini-2.5-flash",
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "gemini_connected": client is not None,
        "hindsight_records": len(hindsight_database),
        "live_incident": live_ops_state["incident_active"],
    }

# Controlled NEXA Connector Endpoints (accessible under both /ops and /api/ops)
@app.get("/ops/payment-status")
@app.get("/api/ops/payment-status")
def api_payment_status():
    return get_payment_status()

@app.get("/ops/recent-errors")
@app.get("/api/ops/recent-errors")
def api_recent_errors():
    return get_recent_errors()

@app.get("/ops/metrics")
@app.get("/api/ops/metrics")
def api_metrics():
    return get_metrics()

@app.get("/ops/database-health")
@app.get("/api/ops/database-health")
def api_db_health():
    return get_database_health()

@app.get("/ops/recent-deployments")
@app.get("/api/ops/recent-deployments")
def api_deployments():
    return get_recent_deployments()

@app.get("/ops/traces")
@app.get("/api/ops/traces")
def api_traces():
    return get_trace()

@app.get("/ops/service-status")
@app.get("/api/ops/service-status")
def api_service_status():
    return get_service_status()

# Hindsight Search
@app.get("/api/hindsight/search")
def api_hindsight_search(q: str = "payment"):
    return search_hindsight(q)

# Primary Investigation & Voice Agent Endpoint
@app.post("/api/investigate", response_model=InvestigationResponse)
@app.post("/api/voice-chat")
async def investigate_endpoint(request: VoiceChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Empty query received.")

    user_query = request.message.strip()

    # Step 1: Execute Controlled Agent Tools
    live_metrics = get_metrics()
    db_health = get_database_health()
    recent_deploy = get_recent_deployments()
    trace_data = get_trace()
    hindsight_results = search_hindsight(user_query)

    top_match = hindsight_results[0] if hindsight_results else hindsight_database[0]

    # Step 2: Query Gemini 2.5 Flash for the authoritative spoken reasoning
    voice_reply_text = ""
    try:
        conversation_context = ""
        if request.history:
            for msg in request.history[-6:]:
                role_label = "Engineer" if msg.role == "user" else "OPSIGHT"
                conversation_context += f"{role_label}: {msg.content}\n"

        prompt = f"""Conversation context:
{conversation_context}
Engineer spoken query: "{user_query}"

Live Evidence Collected from Production Tools:
- Monitored Microservice: {live_ops_state['affected_service']} on {live_ops_state['node']}
- Live Telemetry: 5xx Error Rate {live_metrics['error_rate']}%, Latency {live_metrics['latency_sec']}s (spiked +340ms), DB Connection Pool {db_health['connections']}/{db_health['max_connections']} ({db_health['pool_status']}), Active Queries: {db_health['active_queries']}
- APM Trace Bottleneck: {trace_data['bottleneck']}
- Recent Git Deployment: Commit {recent_deploy['commit']} deployed {recent_deploy['deployed_ago']} by {recent_deploy['author']} ("{recent_deploy['message']}")
- Similar Hindsight Incident: Ticket {top_match['id']} ({int(top_match['similarity_score'] * 100)}% similarity match) - Historical Cause: {top_match['root_cause']}

MANDATORY RESPONSE REQUIREMENTS:
1. Explain the error clearly to the programmer/engineer in an easy, straightforward way.
2. Evaluate the telemetry clearly: explain that the payment API is failing with 504 Gateway Timeouts because database connections are pegged at 98% saturation, caused by unclosed transaction blocks in commit {recent_deploy['commit']}.
3. State the concrete resolution steps: drain node-us-east-2, kill idle transactions via pg_terminate_backend, and canary rollback to v2.13.8.
4. AT THE VERY END OF YOUR ANSWER, YOU MUST CLEARLY DISPLAY THE MATCHED SIMILAR TICKET:
"Similar Incident Ticket: #{top_match['id']} ({int(top_match['similarity_score'] * 100)}% match) — {top_match['title']}."
"""

        for model_name in ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=OPSIGHT_SYSTEM_PROMPT,
                        temperature=0.3,
                        max_output_tokens=900,
                    ),
                )
                if response.text and response.text.strip():
                    voice_reply_text = response.text.strip()
                    break
            except Exception as model_err:
                print(f"Model {model_name} unavailable: {model_err}")
                continue
    except Exception as e:
        print(f"Gemini API error, falling back to evidence engine: {e}")

    chatgpt_breakdown = f"""### 🔍 Root Cause Attribution
The failure originates at the **Database Layer (PostgreSQL Primary)**, not the Frontend or Backend Gateway.

Commit `{recent_deploy['commit']}` deployed {recent_deploy['deployed_ago']} introduced unclosed database transactions. Under checkout load, PostgreSQL connections climbed to **98/100 (98% saturation)**, exhausting the HikariCP connection pool and cascading timeouts upstream to the API Gateway.

---

### 📋 Error Message Breakdown by Architecture Layer
• **Frontend (NEXA Storefront)**: `Checkout timeout: POST /api/checkout stalled after 30s` (Waiting on backend)
• **Backend Gateway (API Gateway)**: `504 Gateway Timeout while proxying request to payments-service on node-us-east-2`
• **Payment API (payments-service)**: `HikariPool-1 - Connection is not available, request timed out after 30000ms`
• **Database (PostgreSQL Primary)**: 🔴 `FATAL: remaining connection slots reserved (98/100 connections in use, pool EXHAUSTED, 184 queued queries)`

---

### 🛠️ What Needs to Be Done to Resolve
1. **Reroute Traffic**: Drain checkout traffic from degraded node `{live_ops_state['node']}` to standby pods in `us-east-1`.
2. **Clear Orphaned DB Connections**: Run in PostgreSQL:
   `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction';`
3. **Rollback Faulty Commit**: Trigger canary rollback of `{recent_deploy['service']}` to stable release `v2.13.8`.
4. **Rescale HikariCP Capacity**: Increase maximum connection pool size from 50 to 200 with an aggressive 30s connection leak threshold.

---

Similar Incident Ticket: #{top_match['id']} ({int(top_match['similarity_score'] * 100)}% Match) - {top_match['title']}."""

    spoken_summary = (
        f"Investigation complete: The failure was caused by the Database layer, where PostgreSQL connection pool reached 98% saturation from unclosed transactions in commit {recent_deploy['commit']}. "
        f"This cascaded a 504 Gateway Timeout to the Backend and stalled the Frontend. "
        f"To resolve: drain node-us-east-2, terminate idle database connections with pg_terminate_backend, and rollback to version v2.13.8. "
        f"Similar Incident Ticket: #{top_match['id']} with {int(top_match['similarity_score'] * 100)}% similarity."
    )

    final_reply_text = voice_reply_text if (voice_reply_text and "Root Cause" in voice_reply_text) else chatgpt_breakdown

    # Node statuses for 3D engine visualization (green -> yellow -> red)
    if live_ops_state["incident_active"]:
        node_statuses = {
            "frontend": "nominal",
            "backend": "nominal",
            "payment-api": "critical",
            "database": "critical",
            "connection-pool": "warning",
        }
    else:
        node_statuses = {
            "frontend": "nominal",
            "backend": "nominal",
            "payment-api": "nominal",
            "database": "nominal",
            "connection-pool": "nominal",
        }

    # Format structured response for the 3D investigation frontend
    return InvestigationResponse(
        incident="payment_failure" if live_ops_state["incident_active"] else "nominal",
        severity=live_ops_state["severity"],
        affected_service=live_ops_state["affected_service"],
        root_cause=top_match["root_cause"],
        path=trace_data["path"],
        critical_nodes=trace_data["critical_nodes"],
        node_statuses=node_statuses,
        metrics=live_metrics,
        hindsight_matches=[
            HindsightMatchItem(
                id=top_match["id"],
                title=top_match["title"],
                similarity=top_match["similarity_score"],
                root_cause=top_match["root_cause"],
                resolution=top_match["proven_resolution"][0] + "; " + top_match["proven_resolution"][2],
            )
        ],
        recommended_actions=top_match["proven_resolution"],
        voice_reply=final_reply_text,
        spoken_summary=spoken_summary,
        reply=final_reply_text,
        timestamp=time.strftime("%H:%M:%S"),
        status="investigating" if live_ops_state["incident_active"] else "resolved",
    )

# --- Postmortem & Learning Endpoint ---
@app.post("/api/resolve")
def resolve_incident(req: Optional[ResolveRequest] = None):
    """Executes resolution runbook, recovers metrics, logs postmortem, and saves to Hindsight memory."""
    # 1. Recover live state
    live_ops_state["incident_active"] = False
    live_ops_state["metrics"]["error_rate"] = 0.01
    live_ops_state["metrics"]["latency_sec"] = 0.038
    live_ops_state["metrics"]["latency_spike_ms"] = 0
    live_ops_state["metrics"]["db_connections"] = 24
    live_ops_state["metrics"]["db_pool_status"] = "HEALTHY"
    live_ops_state["metrics"]["active_queries"] = 12
    live_ops_state["metrics"]["login_drop_pct"] = 0
    live_ops_state["metrics"]["checkout_drop_pct"] = 0
    live_ops_state["metrics"]["revenue_loss_per_min"] = 0

    # 2. Save postmortem to Hindsight
    new_hindsight_record = save_to_hindsight({
        "title": "Payment Service 504 Timeout on Node-us-east-2",
        "severity": "SEV-1",
        "root_cause": "PostgreSQL connection exhaustion from unclosed transaction block in commit a8f3c1b.",
        "resolution_steps": [
            "Drained node-us-east-2 to us-east-1 standby pods.",
            "Evicted idle transactions via pg_terminate_backend.",
            "Canary rollback to payment-api v2.13.8.",
            "Resized HikariCP pool limit to 200.",
        ],
        "lessons": "Connection leak detection enabled at 30s threshold. Pre-release regression testing added for transaction lifecycles.",
    })

    return {
        "status": "resolved",
        "message": "Incident successfully resolved. Telemetry recovered to nominal baseline.",
        "recovered_metrics": live_ops_state["metrics"],
        "node_statuses": {
            "frontend": "nominal",
            "backend": "nominal",
            "payment-api": "nominal",
            "database": "nominal",
            "connection-pool": "nominal",
        },
        "hindsight_saved": new_hindsight_record,
        "timestamp": time.strftime("%H:%M:%S"),
    }

# --- Trigger / Simulate Failure Incident (For Demo Replay) ---
@app.post("/api/incident/trigger")
@app.post("/api/incident/simulate")
def trigger_incident():
    """Triggers/simulates the SEV-1 payment failure incident."""
    live_ops_state["incident_active"] = True
    live_ops_state["metrics"]["error_rate"] = 18.4
    live_ops_state["metrics"]["latency_sec"] = 3.8
    live_ops_state["metrics"]["latency_spike_ms"] = 340
    live_ops_state["metrics"]["db_connections"] = 98
    live_ops_state["metrics"]["db_pool_status"] = "EXHAUSTED"
    live_ops_state["metrics"]["active_queries"] = 184
    live_ops_state["metrics"]["login_drop_pct"] = 42
    live_ops_state["metrics"]["checkout_drop_pct"] = 68
    live_ops_state["metrics"]["revenue_loss_per_min"] = 1420
    return {
        "status": "incident_active",
        "incident": "Payment Service 504 Timeout & DB Pool Saturation",
        "severity": "SEV-1",
        "metrics": live_ops_state["metrics"],
        "node_statuses": {
            "frontend": "nominal",
            "backend": "nominal",
            "payment-api": "critical",
            "database": "critical",
            "connection-pool": "warning",
        },
    }

# --- Live Telemetry WebSocket ---
@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            payload = {
                "type": "telemetry_tick",
                "incident_active": live_ops_state["incident_active"],
                "metrics": live_ops_state["metrics"],
                "database": get_database_health(),
                "payment": get_payment_status(),
                "node_statuses": {
                    "frontend": "nominal",
                    "backend": "nominal",
                    "payment-api": "critical" if live_ops_state["incident_active"] else "nominal",
                    "database": "critical" if live_ops_state["incident_active"] else "nominal",
                    "connection-pool": "warning" if live_ops_state["incident_active"] else "nominal",
                },
                "hindsight_count": len(hindsight_database),
                "timestamp": time.strftime("%H:%M:%S"),
            }
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(2.0)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket closed: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
