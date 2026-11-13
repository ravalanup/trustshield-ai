# TrustShield AI - Operations & Incident Runbook

This runbook provides step-by-step response procedures for Site Reliability Engineers (SREs) and Fraud Operations Leads operating TrustShield AI.

---

## 1. Playbook: Gemini API Quota Exhausted (`429 RESOURCE_EXHAUSTED`) or Timeout

### Symptoms
- Server logs emit:
  - `Gemini evaluation error/quota exceeded, utilizing intelligent fallback engine`
  - `Gemini explainability error/quota exceeded, using fallback`
  - `Gemini agent-chat error/quota exceeded, using smart agent fallback`
- `/api/evaluate` continues returning `200 OK`, but `aiExplanation` uses the deterministic template string (`Evaluated score X/100 based on Y primary risk factors...`).

### Impact Assessment
- **Checkout Scoring**: **Low/None** - deterministic rule scoring remains operational with sub-20ms latency.
- **RAG Explainability & Copilot**: **Degraded** - analysts receive template summaries and rule-based copilot replies instead of dynamic Gemini reasoning.

### Remediation Steps
1. Verify API key and quota tier:
   ```bash
   curl -s http://localhost:3000/api/health
   ```
   Confirm `"geminiConfigured": true`.
2. Inspect Google AI Studio / Cloud Billing quota metrics for `generativelanguage.googleapis.com/generate_content_free_tier_requests` or RPM/TPM limits.
3. Reduce background simulation frequency if running in demo/staging (in `src/App.tsx`, `isStreaming` fires `/api/evaluate` every `30000ms`; toggle **Stream Paused** in the header to halt synthetic LLM traffic).
4. In production, upgrade to a paid Tier / Provisioned Throughput or route non-critical `/api/explain` enrichment through an SQS queue with exponential backoff + jitter.

---

## 2. Playbook: False Positive Rate (FPR) Spike

### Symptoms
- Legitimate cardholders report unexpected declines or excessive 3DS challenges (`status: "challenged"` or `"review"`).
- `LiveMonitor` shows a sudden surge in `medium`/`high`/`critical` flags for known recurring SaaS or retail merchants.

### Diagnosis
1. Open **Live Risk Stream**, filter by `High Risk` or `Critical Risk`, and inspect 5–10 recent flagged transactions.
2. Check **Primary Risk Signals** in the detail drawer (or **Attribution Waterfall** in `RagExplainability`) to identify which rule/factor is over-firing (commonly `AVS Partial Match` on international postal formats, `Proxy / Anonymizer Active` on corporate VPNs, or `High Value Transaction` during promotional sales).

### Mitigation
1. Open **Simulator & Rules** (`Simulator.tsx`) to test threshold adjustments on a representative legitimate payload.
2. Lower the weight or temporarily disable the noisy rule (e.g., convert hard `decline` on corporate VPN subnets into `challenge` / 3DS step-up).
3. Ask the **Agentic AI Workbench**: *"What rule threshold changes would reduce false positives for SaaS subscriptions by 10%?"* to document policy rationale before publishing.

---

## 3. Playbook: Coordinated Proxy / Card-Testing Attack

### Symptoms
- Rapid burst of high-risk transactions targeting `Financial & Crypto` or `Electronics` merchants within a short window.
- Multiple transactions share the same IP subnet (e.g., `185.220.101.x`), `isNewDevice: true`, `isVpnOrProxy: true`, and `accountAgeDays < 30`.

### Immediate Containment
1. Filter **Live Risk Stream** by `critical` and `high`.
2. Open **Agentic AI Workbench** and run: *"Analyze the last 5 transactions for common proxy or subnet patterns."*
3. Verify `RULE-02` (**Anonymous Proxy / Tor Node**, action: `decline`) and `RULE-04` (**Rapid Card Velocity**, action: `decline`) are **enabled** and weighted at `5x` / `4x`.
4. In production AWS deployments:
   - Push the offending CIDR range (e.g., `185.220.101.0/24`) to an **AWS WAF IP Set** or **DynamoDB IP Deny Cache** for 24-hour temporary containment.
   - Escalate confirmed attack clusters to Compliance for FinCEN **SAR** drafting via `AgentWorkbench`.

---

## 4. Playbook: Server Unresponsive or High Checkout Latency

### Checklist
1. Check process health (`GET /api/health`) and verify port `3000` is listening.
2. Measure `/api/evaluate` response time:
   ```bash
   curl -w "\ntime_total: %{time_total}s\n" -o /dev/null -s -X POST http://localhost:3000/api/evaluate \
     -H "Content-Type: application/json" \
     -d '{"transaction":{"id":"HEALTH-CHK","amount":100}}'
   ```
3. If `time_total > 1.5s` due to upstream Gemini latency:
   - Enforce a strict timeout (`AbortController`, e.g. `1200ms`) around `ai.models.generateContent` so requests fail fast into the deterministic fallback scorer rather than stalling checkout threads.
   - In production, decouple LLM narrative generation from the synchronous `/api/evaluate` path (see [System Design](system-design.md)).
