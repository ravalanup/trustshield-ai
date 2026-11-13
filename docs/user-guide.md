# TrustShield AI - User Guide

This guide explains who uses TrustShield AI and how each persona operates the platform **visually** (via the web console) and **programmatically** (via REST APIs).

---

## 1. User Personas Overview

TrustShield AI serves four primary roles across Risk Operations, Compliance, Product, and Engineering:

| Persona | Primary Role | Core Objective | Primary Surfaces |
| --- | --- | --- | --- |
| **Elena Rostova** | Senior Risk Operations Analyst | Triage flagged payments in `<30s`, minimize false declines, spot attack clusters | Live Risk Stream, RAG Explainability, Agentic AI Workbench |
| **Marcus Thorne** | Head of Fraud & Compliance | Keep chargebacks `<0.9%`, tune risk policy, generate FinCEN SAR narratives | Analytics & Retention, Simulator & Rules, Agentic AI Workbench |
| **Sarah Chen** | Payments Product Manager | Balance authorization conversion against fraud loss and analyst adoption | Analytics & Retention, Simulator & Rules, Docs & Guide |
| **Samira Patel** | Fintech Integration Engineer | Integrate sub-100ms checkout scoring and validate fallback reliability | `/api/evaluate`, `/api/explain`, Simulator & Rules |

> **In-App Role Switching:** Click the user profile badge in the top-right header (`AuthModal`) to switch between **Alex Vance** (Head of Risk Operations), **Sarah Chen** (Payments Product Manager), and **Marcus Thorne** (Compliance Officer). *(In the current build, this modal simulates OAuth login and role context.)*

---

## 2. Visual Usage Guide (Web Console)

### Persona A: Elena Rostova - Frontline Risk Triage
1. **Monitor Incoming Risk (`Live Risk Stream` tab)**
   - Keep **Stream Active** enabled in the header to watch simulated transactions arrive every 30 seconds, or click **Simulate Incoming Live Event** to inject a test payment immediately.
   - Use the search bar (by ID, customer, merchant, or country) and the **Risk Tier** dropdown (`Critical`, `High`, `Medium`, `Low`) to isolate `review` items.
   - Click any row to open the **Transaction Detail Drawer**, inspect device fingerprint (`isNewDevice`, `isVpnOrProxy`), card verification (`CVV`, `AVS`), and primary risk signals, then click **Approve Transaction** or **Decline & Block Card**.
2. **Investigate Root Cause (`RAG Explainability` tab)**
   - From the stream table, click the sparkles icon (**View RAG Explanation**) on a flagged transaction.
   - Click **Synthesize Gemini RAG Explanation** to generate an executive summary, root-cause vector, and recommended ops action.
   - Review the **Risk Score Attribution Waterfall** (`score * weight` breakdown) and **Vector Similarity Matches** (e.g., `CASE-2025-0891`, 94% similarity) to verify precedent.
3. **Escalate or Spot Clusters (`Agentic AI Workbench` tab)**
   - Click the chat icon (**Query Agent Analyst**) on a transaction to bind it as the **Active Context Event**.
   - Use suggested commands or type custom prompts such as:
     - *"Why was transaction TX-9042 flagged as critical?"*
     - *"Analyze the last 5 transactions for common proxy or subnet patterns."*

---

### Persona B: Marcus Thorne - Fraud Strategy & Compliance
1. **Review Macro KPIs (`Analytics & Retention` tab)**
   - Track **Prevented Fraud Loss Trend ($ USD)**, **DAU/MAU** analyst engagement, weekly **Customer Retention Cohorts**, and **Feature Adoption & API Call Volume**.
2. **Stress-Test Policy Changes (`Simulator & Rules` tab)**
   - Adjust the **Hybrid Model Weight Distribution** slider (e.g., `60% AI Neural Model` / `40% Deterministic Hard Rules`).
   - Toggle individual hard rules (`RULE-01` Impossible Velocity / Geo Jump, `RULE-02` Anonymous Proxy / Tor Node, etc.).
   - Enter hypothetical test parameters (e.g., `$4,200`, `Travel & Airlines`, `Nigeria`, `Proxy/VPN Active = true`, `AVS Match = false`) and click **Run Hybrid Evaluation** to inspect the resulting score and add the event to the Live Stream.
3. **Draft Compliance Narratives (`Agentic AI Workbench` tab)**
   - Select a critical transaction and click/send: *"Draft a Suspicious Activity Report (SAR) summary for TX-9042."*
   - Copy the structured narrative (Subject, Customer, Amount, Primary Anomaly Vectors, Recommended Action) into your compliance filing workflow.

---

### Persona C: Sarah Chen - Payments Product & Onboarding
1. **Evaluate Feature ROI (`Analytics & Retention` tab)**
   - Compare monthly API call growth across Real-time Scoring, RAG Inspector, Agentic Chat, Dynamic Rules, and Simulation Sandbox.
2. **Onboard New Team Members (`Docs & Guide` tab)**
   - Open **User Personas & Journeys** to walk stakeholders through interactive step-by-step workflows with direct launch buttons into each tab.
   - Use **Digital Payment Primer** and **Risk Glossary & Metrics** to align non-technical stakeholders on Chargeback Ratio, False Positive Rate (FPR), 3DS, AVS, and CVV.

---

## 3. Programmatic Usage Guide (REST APIs)

Integration engineers (like **Samira Patel**) interact with TrustShield AI via its HTTP JSON endpoints hosted on port `3000` (or behind your API gateway in production).

### Workflow 1: Real-Time Checkout Risk Scoring (`POST /api/evaluate`)
Call `/api/evaluate` synchronously during checkout before sending an authorization request to the payment processor/acquirer.

```bash
curl -X POST http://localhost:3000/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "transaction": {
      "id": "TX-9901",
      "timestamp": "2026-11-13T18:00:00Z",
      "customerName": "Jordan Lee",
      "customerId": "CUST-4420",
      "customerEmail": "jordan.lee@example.com",
      "accountAgeDays": 12,
      "amount": 4800,
      "currency": "USD",
      "merchantName": "Binance Crypto",
      "merchantCategory": "Financial & Crypto",
      "location": {
        "city": "São Paulo",
        "country": "Brazil",
        "ip": "185.220.101.45",
        "ipRiskScore": 85
      },
      "deviceInfo": {
        "deviceType": "Mobile Phone",
        "os": "Android 14",
        "browser": "Chrome Mobile",
        "isNewDevice": true,
        "isVpnOrProxy": true
      },
      "cardInfo": {
        "brand": "Visa",
        "last4": "4109",
        "issuingCountry": "United States",
        "cvvMatch": true,
        "avsMatch": false
      }
    }
  }'
```

**Programmatic Decision Routing:**
- `status === "approved"` (`riskScore < 40`): Proceed directly to card authorization.
- `status === "challenged"` (`40 <= riskScore < 65`): Trigger 3D Secure (3DS) OTP / biometric step-up.
- `status === "review"` (`riskScore >= 65`): Hold settlement and enqueue for Elena's manual review queue.
- `status === "declined"`: Reject checkout and return a soft decline code.

---

### Workflow 2: Automated Case Enrichment (`POST /api/explain`)
When a transaction enters the `review` queue, call `/api/explain` asynchronously to pre-populate the analyst drawer with root-cause analysis and historical context.

```ts
async function enrichFlaggedCase(transaction: Transaction) {
  const res = await fetch('http://localhost:3000/api/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction }),
  });

  if (!res.ok) throw new Error(`Explain API failed: ${res.status}`);
  const { explanation } = await res.json();
  // explanation = { summary, rootCauseAnalysis, historicalContext, recommendedAction, confidenceScore }
  return explanation;
}
```

---

### Workflow 3: Programmatic Copilot & SAR Generation (`POST /api/agent-chat`)
Integrate `/api/agent-chat` into internal Slack bots, Jira/Zendesk case tickets, or compliance cron jobs to auto-draft SAR summaries for critical transactions.

```ts
async function generateSarDraft(contextTransaction: Transaction) {
  const res = await fetch('http://localhost:3000/api/agent-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Draft a Suspicious Activity Report (SAR) summary for ${contextTransaction.id}.`,
      contextTransaction,
    }),
  });

  const { reply } = await res.json();
  return reply;
}
```

---

### Workflow 4: Service Liveness & AI Readiness Check (`GET /api/health`)
Verify whether the server is healthy and whether `GEMINI_API_KEY` is active (versus operating in deterministic fallback mode):

```bash
curl http://localhost:3000/api/health
```
