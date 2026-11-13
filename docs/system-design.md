# TrustShield AI - System Design & AWS Production Architecture

This document describes TrustShield AI's current architecture, identifies simulated/mock boundaries in the prototype, and defines a full-featured, production-grade **AWS deployment architecture** for technical architects and platform engineers.

---

## 1. Current Architecture (Prototype / MVP)

Today, TrustShield AI runs as a single Node.js service (`server.ts`) on port `3000` that serves both the React SPA and REST API endpoints:

```text
+-------------------------------------------------------------------+
|                        Browser (React 19 SPA)                     |
|  LiveMonitor | RagExplainability | AgentWorkbench | Simulator     |
|  AnalyticsDashboard | DocsKnowledgeCenter | AuthModal             |
+---------------------------------+---------------------------------+
                                  | HTTP JSON (/api/*)
                                  v
+-------------------------------------------------------------------+
|                   Express 4 Server (server.ts)                    |
|  - Vite Middleware (dev) / Static dist (prod)                     |
|  - POST /api/evaluate   -> Gemini 2.5 Flash -> Deterministic Rule |
|  - POST /api/explain    -> Gemini 2.5 Flash -> Fallback Template  |
|  - POST /api/agent-chat -> Gemini 2.5 Flash -> Context Rule Engine|
|  - GET  /api/health                                               |
+-------------------------------------------------------------------+
```

### Current Prototype Limitations (Mock vs. Live)
| Capability | Current Implementation | Production Gap |
| --- | --- | --- |
| **Transaction Persistence** | In-memory React state seeded from `src/data/mockData.ts` | Resets on reload; no audit log or multi-user sync |
| **Telemetry Stream** | `setInterval` every 30s in `src/App.tsx` calling `/api/evaluate` | Must ingest real payment gateway webhooks / Kafka / Kinesis events |
| **Rule Engine** | `Simulator.tsx` toggles rules in local state; `server.ts` uses hardcoded fallback checks | Needs versioned, persistent rule policies evaluated dynamically on every request |
| **RAG Vector Store** | `ragMatches` are inline mock arrays or LLM-hallucinated IDs | Needs real embedding pipeline + vector similarity search over historical fraud cases |
| **Velocity & Geo Signals** | `accountAgeDays` and `ipRiskScore` arrive pre-populated on mock payloads | Needs real-time sliding-window counters (Redis) and IP/device threat intel feeds |
| **Authentication & RBAC** | Client-side `AuthModal.tsx` profile switcher | Needs OIDC/Cognito JWT validation, tenant isolation, and server-side RBAC |
| **Analytics & Cohorts** | Static `MOCK_ANALYTICS` object | Needs OLAP aggregation over historical transaction & chargeback outcomes |

---

## 2. Target Production Architecture on AWS

To move beyond mocks into a **sub-100ms checkout scoring SLA**, **true vector RAG**, **persistent auditability**, and **PCI-DSS readiness**, deploy TrustShield AI on AWS as decoupled microservices across three planes: **Real-Time Decision Plane**, **Intelligence & RAG Plane**, and **Data & Analytics Plane**.

```text
                                 [ Payment Gateways / Merchant Checkouts ]
                                                    |
                                           TLS 1.3 + HMAC / mTLS
                                                    v
[ Analysts ] -> CloudFront + S3 (SPA)     AWS WAF -> API Gateway / ALB
                     |                              |
                     +--- Amazon Cognito (OIDC) ----+
                                                    |
        +-------------------------------------------+-------------------------------------------+
        | (Sync <100ms Checkout Path)               | (Case Investigation & Copilot)            |
        v                                           v                                           v
+-------------------------------+       +-----------------------+                   +-----------------------+
|   Risk Scoring Service        |       |  RAG Explainability   |                   |  Agentic Copilot      |
|   (ECS Fargate / EKS)         |       |  Service (ECS)        |                   |  Service (ECS)        |
|  - Dynamic Rule Engine (OPA)  |       |  - Vector Retrieval   |                   |  - Tool Calling       |
|  - ML Fraud Scorer (SageMaker)|       |  - Gemini / Bedrock   |                   |  - SAR Draft Pipeline |
+---+-----------------------+---+       +-----------+-----------+                   +-----------+-----------+
    |                       |                       |                                           |
    v                       v                       v                                           v
ElastiCache (Redis)    DynamoDB             OpenSearch Serverless                    Amazon Aurora PostgreSQL
- Sliding velocity     - Device/IP cache    (Vector DB: Historical                  - Transactions & Decisions
- Card/Account bursts  - Idempotency keys    Fraud Cases & SARs)                    - Versioned Rules & Audits
    |                                                                                           ^
    +----------------------> Amazon Kinesis Data Streams / MSK <--------------------------------+
                                    |                   |
                                    v                   v
                         Lambda Enrichers         S3 Data Lake (Parquet)
                         - Chargeback sync        - Athena / QuickSight Analytics
                         - Vector indexing        - ML Model Retraining (SageMaker)
```

---

## 3. Component-by-Component AWS Design

### A. Edge, Auth & Frontend Delivery
- **Frontend Hosting**: Build the React SPA (`vite build`) into **Amazon S3** and distribute via **Amazon CloudFront** with strict CSP headers and Origin Access Control (OAC).
- **API Edge & Security**: Place **AWS WAF** (rate limiting, bot control, OWASP rules) in front of **Amazon API Gateway** (REST/WebSocket) or an **Application Load Balancer (ALB)**.
- **Authentication & RBAC**: Replace `AuthModal.tsx` with **Amazon Cognito User Pools** (federated with Google/Okta/Azure AD SAML/OIDC). Issue short-lived JWTs carrying `tenant_id` and `role` (`risk_analyst`, `compliance_officer`, `fraud_admin`, `integrator`).

### B. Sub-100ms Real-Time Scoring Plane (`POST /api/evaluate`)
LLM calls (`~600–2000ms`) are too slow to block synchronous card authorizations. In production, split scoring into **Fast Synchronous Evaluation** and **Async AI Enrichment**:
1. **Synchronous Path (`<60ms` p99)**:
   - **API Service (ECS Fargate / Go or Node.js)** checks **DynamoDB** for idempotency keys and cached IP/device reputation.
   - Queries **Amazon ElastiCache for Redis** (`ZCOUNT` / sliding-window sorted sets) for real-time velocity metrics (e.g., card uses in last 5 min, distinct merchants in 30 min, impossible-travel geo deltas).
   - Runs the **Dynamic Rule Engine** (persisted rules from Aurora/DynamoDB with configurable weights) + a low-latency **Amazon SageMaker Real-Time Endpoint** (XGBoost / LightGBM tabular fraud model).
   - Returns `{ riskScore, riskLevel, status, riskFactors }` immediately to the checkout gateway.
2. **Asynchronous AI Path (Event-Driven)**:
   - Publishes every scored transaction to **Amazon Kinesis Data Streams** (or **Amazon MSK**).
   - For `medium` / `high` / `critical` events, an async **AWS Lambda** or **ECS Worker** invokes **Gemini 2.5 Flash** (via Secrets Manager API key) or **Amazon Bedrock** to synthesize narrative explanations, writes the result to Aurora, and pushes live updates to connected analyst browsers over **API Gateway WebSockets** (replacing the 30s client polling timer).

### C. True RAG Explainability Engine (`POST /api/explain`)
Replace hardcoded `ragMatches` with genuine retrieval-augmented generation:
1. **Ingestion & Embedding Pipeline**: When an analyst marks a case as `Confirmed Fraud`, `Chargeback`, or `False Positive`, a Kinesis consumer sanitizes PII, generates a structured case summary embedding (`text-embedding-004` or Bedrock Titan Embeddings), and indexes it into **Amazon OpenSearch Serverless (Vector Engine)** or **Aurora PostgreSQL (`pgvector`)**.
2. **Retrieval at Query Time**: `/api/explain` embeds the target transaction's behavioral vector (merchant category, geo-jump delta, proxy flags, amount ratio, AVS/CVV flags), retrieves top-$k$ cosine-similar historical cases with verified outcomes, and passes those grounded citations to Gemini to generate the executive rationale and confidence score.

### D. Agentic AI Copilot (`POST /api/agent-chat`)
Upgrade the stateless chat endpoint into a stateful, tool-augmented agent:
- **Conversation Memory**: Persist analyst chat threads in **DynamoDB** (TTL-enabled) keyed by `tenant_id` and `case_id`.
- **Grounded Tool Execution**: Give the agent read-only query tools backed by Aurora/OpenSearch (e.g., `getSubnetCluster(ipPrefix)`, `getMerchantChargebackRate(merchantId)`, `simulateRuleDiff(rulePatch)`) so subnet pattern analysis and false-positive threshold estimates reflect real production data rather than static templates.
- **SAR Workflow**: Persist generated SAR drafts to Aurora (`compliance_reports` table) and export immutable PDF/XML filings to an encrypted, Object-Lock-enabled **S3 Compliance Bucket**.

### E. Persistence, Rules & Analytics
- **Amazon Aurora PostgreSQL (Multi-AZ)**: System of record for `transactions`, `decision_audit_logs` (append-only), `rules` (versioned with `published_by` and rollback support), and `sar_reports`.
- **Analytics Pipeline**: Stream Kinesis events via **Amazon Data Firehose** to **Amazon S3 (Iceberg/Parquet)**. Compute real DAU/MAU, cohort retention, prevented fraud savings, and false-positive rates using **Amazon Athena** or **dbt + Redshift**, replacing `MOCK_ANALYTICS`.

---

## 4. Networking, Deployment & Reliability Blueprint

- **VPC Topology**: Deploy ECS tasks, Aurora, ElastiCache, and OpenSearch inside **private subnets** across at least **2 Availability Zones (AZs)**; expose only CloudFront and ALB/API Gateway to the public internet.
- **Secrets & Keys**: Store `GEMINI_API_KEY`, DB credentials, and webhook signing secrets in **AWS Secrets Manager** with automatic rotation and **AWS KMS** CMK encryption.
- **Infrastructure as Code (IaC)**: Provision via **AWS CDK (TypeScript)** or **Terraform** with separate `dev`, `staging`, and `prod` AWS accounts (AWS Organizations).
- **CI/CD**: GitHub Actions -> OIDC role assumption into AWS -> run `tsc --noEmit`, unit/contract tests, container scan (Trivy/ECR) -> blue/green ECS deployment via CodeDeploy.
- **Graceful Degradation**: Retain TrustShield's deterministic rule fallback (`server.ts` pattern) with a circuit breaker (e.g., trip on Gemini `429` or `>2500ms` latency) so checkout scoring never fails closed on LLM outages.
