# TrustShield AI - Testing, Rule Validation & Benchmarking Guide

This document defines how to verify code quality, test deterministic and AI-backed endpoints, validate fraud rules, and benchmark checkout latency.

---

## 1. Current Verification Checks

Run static type-checking and production bundle verification after any change:

```bash
npm run lint    # Runs tsc --noEmit across client & server
npm run build   # Verifies Vite React bundle + esbuild server.ts bundle
```

### Smoke Test Local Endpoints
With `npm run dev` running on port `3000`:

```bash
# 1. Health check
curl -s http://localhost:3000/api/health

# 2. High-risk evaluation (triggers High Value + Proxy + New Device + AVS fail = 99 max)
curl -s -X POST http://localhost:3000/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "transaction": {
      "id": "TX-TEST-01",
      "amount": 5000,
      "deviceInfo": { "isVpnOrProxy": true, "isNewDevice": true },
      "cardInfo": { "avsMatch": false, "cvvMatch": true }
    }
  }'

# 3. Explainability synthesis
curl -s -X POST http://localhost:3000/api/explain \
  -H "Content-Type: application/json" \
  -d '{"transaction":{"id":"TX-TEST-01","riskScore":99,"riskLevel":"critical"}}'

# 4. Agentic SAR generation
curl -s -X POST http://localhost:3000/api/agent-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Draft a SAR for TX-TEST-01","contextTransaction":{"id":"TX-TEST-01","amount":5000}}'
```

---

## 2. Recommended Automated Test Suite

When hardening TrustShield AI for production, add **Vitest** (unit/integration) and **Playwright** (end-to-end UI):

### A. Deterministic Scoring Unit Tests
Test the fallback scoring rules in `server.ts` (extracted into a pure `evaluateDeterministic(tx)` module) against boundary values:
- **Low-risk baseline**: `amount: 50`, clean device, AVS/CVV match → `riskScore === 12`, `riskLevel === "low"`, `status === "approved"`.
- **Threshold boundary (`amount === 2500` vs `2500.01`)**: Verify strict `>` behavior.
- **Tier transitions**: Verify exact score cutoffs (`40` → `medium`/`challenged`, `65` → `high`/`review`, `85` → `critical`/`review`, max clamp `99`).
- **Missing optional nested fields**: Payload without `deviceInfo` or `cardInfo` must not throw `TypeError`.

### B. AI Mocking & Fallback Contract Tests
- **Happy Path (Mocked `@google/genai`)**: Return valid JSON and fence-wrapped JSON (`` ```json ... ``` ``) to verify parser resilience.
- **Malformed LLM Output**: Return non-JSON prose from the mock and assert `/api/evaluate` and `/api/explain` gracefully fall back to deterministic output with HTTP `200`.
- **Quota Exhaustion (`429 RESOURCE_EXHAUSTED`)**: Reject the mock with a 429 `ApiError` and verify zero unhandled rejections and valid fallback schema.

### C. UI & End-to-End Flows (Playwright)
- Switch between all 6 header tabs (`Live Risk Stream`, `RAG Explainability`, `Agentic AI Workbench`, `Simulator & Rules`, `Analytics & Retention`, `Docs & Guide`).
- Filter `LiveMonitor` by `critical`, open the transaction drawer, click **Approve Transaction**, and verify badge state transitions to `Approved`.
- Run a custom payload in `Simulator`, verify the new `TX-SIM-*` row appears at the top of `LiveMonitor`, and inspect it in `RagExplainability`.

---

## 3. Rule Backtesting & Shadow Mode

Before enabling a new fraud rule or changing `aiWeight` in production:
1. **Shadow Evaluation**: Run candidate rule configurations in **read-only shadow mode** on live traffic (`shadowScore` logged to Aurora/S3 without affecting checkout `status`).
2. **Confusion Matrix Analysis**: Replay 30–90 days of labeled transactions (`Confirmed Fraud / Chargeback` vs. `Settled Clean`) to measure:
   - **Precision / False Positive Rate (FPR)** - ensure legitimate customer friction stays below target (e.g., `< 1.8%`).
   - **Recall / Fraud Capture Rate** - ensure high-value fraud coverage improves.
   - **Net Dollar Savings** = `(Fraud Prevented) - (False Decline Margin Loss + Manual Review Cost)`.

---

## 4. Load & Latency Benchmarking

Target SLAs for the **synchronous checkout scoring path** (with deterministic/ML scoring decoupled from async LLM enrichment):
- **p50 latency**: `< 20 ms`
- **p99 latency**: `< 80 ms`
- **Throughput**: Sustained `1,000+ RPS` per cluster with zero `5xx` errors.

Use **k6** or **Artillery** against `/api/evaluate` (with `GEMINI_API_KEY` unset or circuit-broken to benchmark pure rule/ML throughput) and assert `http_req_failed < 0.1%` and `p(99) < 80ms`.
