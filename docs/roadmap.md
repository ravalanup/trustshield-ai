# TrustShield AI - Production Readiness & Roadmap

This document maps TrustShield AI's current prototype capabilities against the engineering milestones required for a full enterprise deployment.

---

## 1. Current State vs. Production Gap Matrix

| Domain | Current Prototype (`v2.4`) | Production Target | Priority |
| --- | --- | --- | --- |
| **Database & State** | In-memory React state seeded by `src/data/mockData.ts` | Amazon Aurora PostgreSQL (transactions, rules, audit logs, SARs) + DynamoDB | P0 |
| **Streaming Ingestion** | Client-side 30s `setInterval` (`App.tsx`) | Payment gateway webhooks -> Amazon Kinesis / MSK -> WebSocket push to UI | P0 |
| **Authentication & RBAC** | Client-side `AuthModal.tsx` persona switcher | Amazon Cognito / OIDC SSO + JWT validation + server-side RBAC | P0 |
| **Rule Execution** | `Simulator.tsx` toggles local state; `server.ts` runs hardcoded fallback checks | Persistent, versioned rule engine loaded dynamically on every `/api/evaluate` call | P0 |
| **Scoring Latency** | Synchronous Gemini call inside `/api/evaluate` (`~500–2000ms`) | Synchronous `<60ms` Rule + SageMaker ML path; async Gemini enrichment | P1 |
| **RAG Retrieval** | Static/inline `ragMatches` objects | Embedding pipeline + OpenSearch Serverless / `pgvector` historical case search | P1 |
| **Velocity & Threat Intel** | Static `accountAgeDays` & `ipRiskScore` on payloads | Real-time Redis sliding-window counters + external IP/proxy/BIN intelligence APIs | P1 |
| **PII & Compliance** | Full transaction JSON sent to Gemini prompt | Pre-inference PII redaction, Zod validation, immutable S3 Object Lock SAR archive | P1 |
| **Analytics & Cohorts** | Static `MOCK_ANALYTICS` dataset | S3 Data Lake (Parquet) + Athena / Redshift live cohort & ROI queries | P2 |

---

## 2. Phased Delivery Roadmap

### Phase 1 - Persistence, Auth & Dynamic Rules (Weeks 1–3)
- Provision **Aurora PostgreSQL** for transactions, decision audit logs, and versioned fraud rules.
- Add `GET/PATCH /api/transactions` and `GET/PUT /api/rules` endpoints with **Zod** schema validation.
- Wire `server.ts` `/api/evaluate` to execute the persisted active rules + `aiWeight` configuration rather than static thresholds.
- Replace `AuthModal.tsx` mock switcher with **OIDC/Cognito** authentication and role-based route guards.

### Phase 2 - Real-Time Velocity & Decoupled Streaming (Weeks 4–6)
- Introduce **ElastiCache (Redis)** sliding-window counters for card, account, IP subnet, and merchant velocity (`RULE-04` & `RULE-01` geo-jump calculation).
- Split `/api/evaluate` into a fast synchronous scoring path (`<80ms` p99) and an async **Kinesis / SQS** worker for Gemini narrative generation.
- Push newly scored events and async AI explanations to `LiveMonitor` over **WebSockets / SSE**, replacing the 30s client timer.

### Phase 3 - True Vector RAG & Agentic Tools (Weeks 7–9)
- Index resolved fraud/chargeback cases into **OpenSearch Serverless** or **`pgvector`**.
- Update `/api/explain` to query top-$k$ historical vector matches and cite verified case IDs.
- Upgrade `/api/agent-chat` with read-only investigation tools (`querySubnetActivity`, `getMerchantFraudRate`, `simulateRuleImpact`) and persistent SAR report storage.

### Phase 4 - Live Analytics, Testing & Multi-Region AWS Hardening (Weeks 10–12)
- Replace `MOCK_ANALYTICS` with live aggregations (prevented fraud loss, false positive rate, DAU/MAU, retention cohorts).
- Implement automated Vitest + Playwright CI pipelines, shadow-mode rule backtesting, WAF rate limiting, and multi-AZ AWS CDK/Terraform deployment.
