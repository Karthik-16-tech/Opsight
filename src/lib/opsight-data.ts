export type ServiceId = "frontend" | "auth" | "queue" | "payment" | "database";

export type OpsightMode = "interface" | "topology" | "incidents" | "memory";

export interface ServiceMetric {
  label: string;
  value: string;
  trend?: string;
}

export interface ServiceData {
  id: ServiceId;
  name: string;
  status: "HEALTHY" | "DEGRADED" | "CRITICAL";
  severity?: string;
  dependency: string;
  position: [number, number, number];
  metrics: ServiceMetric[];
  logs: string[];
  errors: string[];
}

export const services: Record<ServiceId, ServiceData> = {
  frontend: {
    id: "frontend",
    name: "Frontend Service",
    status: "HEALTHY",
    dependency: "Auth, Payment, Queue",
    position: [0, 1.2, -4],
    metrics: [
      { label: "LATENCY", value: "24ms" },
      { label: "THROUGHPUT", value: "14.2k rps" },
      { label: "AVAILABILITY", value: "99.98%" },
      { label: "CACHE HIT", value: "94.2%" },
    ],
    logs: [
      "GET /api/checkout 200 (18ms)",
      "POST /v1/session/verify 200 (12ms)",
      "GET /static/bundle.js 304 (2ms)",
      "GET /api/health 200 (1ms)",
    ],
    errors: [
      "Edge gateway retries within normal limits",
      "No critical upstream client drops",
    ],
  },
  auth: {
    id: "auth",
    name: "Auth Service",
    status: "HEALTHY",
    dependency: "Payment API",
    position: [-4.5, 0.8, -1],
    metrics: [
      { label: "VERIFIES", value: "8.6k/s" },
      { label: "LATENCY", value: "9ms" },
      { label: "SESSIONS", value: "482k" },
      { label: "FAILURES", value: "0.01%" },
    ],
    logs: [
      "OAUTH2: exchange successful token_id=8f92",
      "JWT verified for session usr_99812",
      "Session refresh granted exp=3600s",
      "Healthcheck OK auth-cluster-1",
    ],
    errors: [
      "Expired refresh token rejected (standard flow)",
      "Token revocation cache synced",
    ],
  },
  queue: {
    id: "queue",
    name: "Message Queue",
    status: "HEALTHY",
    dependency: "Database Engine",
    position: [4.5, 0.8, -1],
    metrics: [
      { label: "QUEUE DEPTH", value: "1.4k" },
      { label: "CONSUME RATE", value: "5.2k/s" },
      { label: "CONSUMER LAG", value: "12ms" },
      { label: "PARTITIONS", value: "32/32" },
    ],
    logs: [
      "Partition 14 rebalanced smoothly",
      "Batch ack 240 items to db-consumer",
      "Heartbeat ack from broker-02",
      "Consumer throughput nominal",
    ],
    errors: [
      "Broker 03 consumer group rebalance jitter",
      "Minor backpressure resolved on worker pool",
    ],
  },
  payment: {
    id: "payment",
    name: "Payment API",
    status: "DEGRADED",
    severity: "SEV-1",
    dependency: "Database Primary",
    position: [-2.5, 0.4, 3],
    metrics: [
      { label: "ERROR RATE", value: "8.4%", trend: "↑" },
      { label: "P99 LATENCY", value: "2,480ms", trend: "↑" },
      { label: "TIMEOUTS", value: "142/min", trend: "↑" },
      { label: "FAILED TXNS", value: "$48.2k" },
    ],
    logs: [
      "ERROR [PaymentWorker] DB pool acquisition timeout > 5000ms",
      "POST /v2/charge timed out after 5.0s",
      "ERROR Connection pool saturated (98/100 active connections)",
      "Circuit breaker opened for primary_db_cluster",
    ],
    errors: [
      "PoolExhaustedException: connection pool empty",
      "Database replica lag exceeded 4500ms",
      "504 Gateway Timeout propagated to edge",
    ],
  },
  database: {
    id: "database",
    name: "Primary Database",
    status: "CRITICAL",
    severity: "CRITICAL",
    dependency: "Storage Engine",
    position: [3.2, 0, 3.5],
    metrics: [
      { label: "POOL ACTIVE", value: "98%", trend: "↑" },
      { label: "LOCK WAITS", value: "840ms", trend: "↑" },
      { label: "CPU UTIL", value: "94%" },
      { label: "IOPS", value: "18.4k" },
    ],
    logs: [
      "CRITICAL: Lock wait timeout on table transactions_v2",
      "WAL writer lagging behind by 14 segments",
      "Warning: vacuum delayed due to long-running tx",
      "ERROR: max_connections limit reached",
    ],
    errors: [
      "Transaction lock contention on index idx_tx_status",
      "Postgres client connection limit saturated (498/500)",
      "Replica replication lag spike to 12s",
    ],
  },
};

export const connections: Array<[ServiceId, ServiceId]> = [
  ["frontend", "auth"],
  ["frontend", "queue"],
  ["frontend", "payment"],
  ["auth", "payment"],
  ["queue", "database"],
  ["payment", "database"],
];

export interface PreviousTicket {
  id: string;
  title: string;
  serviceId: ServiceId;
  relatedServiceId?: ServiceId;
  similarity: number;
  date: string;
  mttr: string;
  severity: "SEV-1" | "SEV-2" | "SEV-3";
  status: "RESOLVED";
  rootCause: string;
  symptoms: string[];
  fixSummary: string;
  fixSteps: string[];
  fixCode?: string;
  appliedPR?: string;
  engineer: string;
  position3D: [number, number, number];
}

export const previousTickets: PreviousTicket[] = [
  {
    id: "INC-014",
    title: "Database Connection Pool Starvation Post-Deployment",
    serviceId: "payment",
    relatedServiceId: "database",
    similarity: 94,
    date: "Aug 14, 2026",
    mttr: "12m",
    severity: "SEV-1",
    status: "RESOLVED",
    rootCause:
      "HikariCP connection pool was capped at 30 connections with no acquisition timeout during payment peak, causing worker thread exhaustion when checkout batch traffic spiked.",
    symptoms: [
      "504 Gateway Timeouts on POST /v2/charge",
      "DB active connection pool hit 100% saturation",
      "PaymentWorker threads locked waiting for free socket",
    ],
    fixSummary:
      "Hot-expanded HikariCP maxPoolSize from 30 -> 90, enabled a 3,000ms acquisition timeout, and deployed rate limiting on batch checkout queue.",
    fixSteps: [
      "Patched ConfigMap to raise hikari.maximum-pool-size from 30 to 90",
      "Set hikari.connection-timeout=3000 to prevent infinite thread locks",
      "Executed pg_terminate_backend() on stale idle-in-transaction sockets",
      "Merged PR #4829 adding backpressure throttling to payment worker pool",
    ],
    fixCode: `// Spring / HikariCP Production Fix (PR #4829)
spring.datasource.hikari.maximum-pool-size=90
spring.datasource.hikari.minimum-idle=25
spring.datasource.hikari.connection-timeout=3000
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.max-lifetime=1200000
spring.datasource.hikari.leak-detection-threshold=2500`,
    appliedPR: "PR #4829: Hikari pool resize & timeout guard",
    engineer: "Sarah Lin (Staff SRE)",
    position3D: [-5.2, 2.2, 4.2],
  },
  {
    id: "INC-027",
    title: "Postgres Lock Contention on Transactions Index",
    serviceId: "database",
    relatedServiceId: "payment",
    similarity: 88,
    date: "Jul 29, 2026",
    mttr: "18m",
    severity: "SEV-1",
    status: "RESOLVED",
    rootCause:
      "Missing composite index on (merchant_id, status, created_at) forced sequential table scans during concurrent checkout bursts, accumulating row exclusive locks.",
    symptoms: [
      "Database CPU utilization spiked to 96%",
      "Average lock wait time exceeded 840ms",
      "WAL writer lagging by 14 segments",
    ],
    fixSummary:
      "Created concurrent composite index `idx_tx_merchant_status` and terminated long-held blocking read locks.",
    fixSteps: [
      "Terminated long-held idle read transactions holding table locks",
      "Ran CONCURRENTLY index creation to prevent table write blockage",
      "Configured statement_timeout to 4,000ms to safeguard replica",
      "Scaled PostgreSQL Read Replica count from 2 to 4 instances",
    ],
    fixCode: `-- PostgreSQL Concurrent Index & Timeout Tuning (PR #4611)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tx_merchant_status 
  ON transactions (merchant_id, status, created_at DESC);

ALTER SYSTEM SET statement_timeout = '4000ms';
SELECT pg_reload_conf();`,
    appliedPR: "PR #4611: Add composite index for payment lookups",
    engineer: "Alex Chen (Data Infrastructure)",
    position3D: [5.6, 2.4, 4.8],
  },
  {
    id: "INC-009",
    title: "Edge Gateway Cascading Retries on Downstream Slowdown",
    serviceId: "frontend",
    relatedServiceId: "payment",
    similarity: 81,
    date: "Jun 11, 2026",
    mttr: "9m",
    severity: "SEV-2",
    status: "RESOLVED",
    rootCause:
      "Downstream payment latency caused edge HTTP client timeouts, triggering immediate non-jittered retries that tripled overall system load.",
    symptoms: [
      "Request multiplier x3.4 caused by client retries",
      "Edge ingress worker memory spiked above 85%",
      "Client-side checkout failure rate reached 6.2%",
    ],
    fixSummary:
      "Implemented exponential backoff with full jitter and configured Envoy circuit breaker fallback with fast failure rejection.",
    fixSteps: [
      "Configured Envoy retry policy with exponential backoff and randomized jitter",
      "Added circuit breaker threshold (max 50 concurrent pending requests)",
      "Enabled synthetic fallback response for degraded payments",
      "Scaled ingress proxy pods from 6 to 12 replicas",
    ],
    fixCode: `// Envoy Ingress Filter Configuration (PR #4210)
retry_policy:
  retry_on: "5xx,connect-failure,refused-stream"
  num_retries: 2
  retry_back_off:
    base_interval: 0.25s
    max_interval: 2.0s
circuit_breakers:
  thresholds:
    - priority: DEFAULT
      max_connections: 1024
      max_pending_requests: 64`,
    appliedPR: "PR #4210: Envoy exponential backoff & circuit breakers",
    engineer: "Marcus Vance (Edge Platform)",
    position3D: [-1.8, 3.2, -4.5],
  },
  {
    id: "INC-033",
    title: "Consumer Partition Deadlock on Unparsable Payloads",
    serviceId: "queue",
    relatedServiceId: "database",
    similarity: 78,
    date: "May 03, 2026",
    mttr: "15m",
    severity: "SEV-2",
    status: "RESOLVED",
    rootCause:
      "Consumer group partition rebalance deadlock due to synchronous ACK attempts on malformed payment webhook JSON.",
    symptoms: [
      "Message queue consumer lag rose by 14,200 items",
      "Partition 14 rebalance loops triggered worker restarts",
      "Database ingestion stalled for 8 minutes",
    ],
    fixSummary:
      "Routed invalid payloads to Dead Letter Queue (DLQ) after 3 retry attempts and enabled asynchronous offset commitments.",
    fixSteps: [
      "Provisioned Dead Letter Queue `payments.webhooks.dlq`",
      "Updated consumer worker to acknowledge after DLQ rerouting",
      "Restarted worker pool with asynchronous commit mode enabled",
      "Drained backlogged partition using batch processor",
    ],
    fixCode: `// Kafka / RabbitMQ Consumer DLQ Routing (PR #3988)
factory.setErrorHandler(new DeadLetterPublishingRecoverer(template,
  (record, ex) -> new TopicPartition("payments.webhooks.dlq", record.partition())));
factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.RECORD);`,
    appliedPR: "PR #3988: Consumer DLQ routing & async commits",
    engineer: "Elena Rostova (Core Systems)",
    position3D: [5.8, 2.7, -1.8],
  },
  {
    id: "INC-042",
    title: "JWT Key Revocation Cache Stampede",
    serviceId: "auth",
    relatedServiceId: "payment",
    similarity: 74,
    date: "Apr 19, 2026",
    mttr: "8m",
    severity: "SEV-3",
    status: "RESOLVED",
    rootCause:
      "Redis sentinel failover caused cold-cache stampede on public key verification, overloading the auth identity provider.",
    symptoms: [
      "Auth token verification latency jumped from 9ms to 420ms",
      "Redis cache hit rate dropped from 99.4% to 14%",
      "Downstream services queued authorization requests",
    ],
    fixSummary:
      "Added multi-tiered caching: local in-memory Caffeine L1 cache (15m TTL) with Redis L2 fallback and stale-while-revalidate.",
    fixSteps: [
      "Configured in-process Caffeine L1 cache with 10,000 token capacity",
      "Set stale-while-revalidate policy during Redis failover events",
      "Pre-warmed JWT public key ring across all auth pods",
    ],
    fixCode: `// Multi-Tier Cache with Stale-While-Revalidate (PR #3820)
Caffeine.newBuilder()
  .maximumSize(10_000)
  .expireAfterWrite(Duration.ofMinutes(15))
  .refreshAfterWrite(Duration.ofMinutes(5))
  .build(key -> fetchJwksKeyWithFallback(key));`,
    appliedPR: "PR #3820: Caffeine L1 in-memory JWT key caching",
    engineer: "Devon Reed (Security Infrastructure)",
    position3D: [-5.5, 2.6, -2.2],
  },
];

