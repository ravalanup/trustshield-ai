# TrustShield AI - REST API Reference

Base URL (local development): `http://localhost:3000`
Content-Type: `application/json`

> **Resilience Guarantee:** All AI-backed endpoints (`POST /api/evaluate`, `POST /api/explain`, `POST /api/agent-chat`) attempt inference with **Gemini (`gemini-2.5-flash`)** when `GEMINI_API_KEY` is configured and automatically fall back to deterministic rule/template engines if the key is absent, rate-limited (`429`), or returns invalid JSON.

---

## 1. Health & AI Readiness

### `GET /api/health`
Returns server liveness and whether `GEMINI_API_KEY` is configured.

**Response (`200 OK`)**
```json
{
  "status": "ok",
  "app": "TrustShield AI",
  "timestamp": "2026-11-13T18:10:00.000Z",
  "geminiConfigured": true
}
```

---

## 2. Real-Time Transaction Risk Evaluation

### `POST /api/evaluate`
Evaluates a payment transaction payload and returns a composite risk score (`0–100`), risk tier, recommended status, contributing risk factors, executive explanation, and historical RAG case matches.

**Request Body**
```json
{
  "transaction": {
    "id": "TX-9901",
    "timestamp": "2026-11-13T18:00:00Z",
    "customerName": "Jordan Lee",
    "customerId": "CUST-4420",
    "customerEmail": "jordan.lee@example.com",
    "accountAgeDays": 14,
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
}
```

**Response (`200 OK`)**
```json
{
  "success": true,
  "evaluation": {
    "riskScore": 92,
    "riskLevel": "critical",
    "status": "review",
    "aiExplanation": "Evaluated score 92/100 based on 4 primary risk factors including amount scale, device proxy signals, and verification checks.",
    "riskFactors": [
      {
        "name": "High Value Transaction",
        "score": 85,
        "weight": 0.3,
        "description": "Transaction amount $4800 exceeds high-tier threshold.",
        "category": "amount"
      },
      {
        "name": "Proxy / Anonymizer Active",
        "score": 80,
        "weight": 0.25,
        "description": "IP address mapped to known proxy or residential VPN endpoint.",
        "category": "device"
      }
    ],
    "ragMatches": [
      {
        "caseId": "CASE-2026-9021",
        "similarity": 0.89,
        "description": "High-tier checkout from new device with proxy network enabled.",
        "outcome": "Manual Review - Fraud Prevented"
      }
    ]
  }
}
```

**Error Responses**
- `400 Bad Request`: `{ "error": "Transaction payload is required" }` when `req.body.transaction` is missing.
- `500 Internal Server Error`: `{ "error": "<message>" }` on unexpected server failure.

### Deterministic Fallback Scoring Rules (when Gemini is unavailable)
Starting from base score `12`:
- `amount > 2500`: `+35` (`High Value Transaction`)
- `deviceInfo.isVpnOrProxy === true`: `+25` (`Proxy / Anonymizer Active`)
- `deviceInfo.isNewDevice === true`: `+15` (`Unrecognized Device Token`)
- `cardInfo && (!cardInfo.avsMatch || !cardInfo.cvvMatch)`: `+20` (`AVS/CVV Verification Mismatch`)

Score is clamped to `[2, 99]` and mapped to tiers:
- `85–99` → `riskLevel: "critical"`, `status: "review"`
- `65–84` → `riskLevel: "high"`, `status: "review"`
- `40–64` → `riskLevel: "medium"`, `status: "challenged"`
- `0–39` → `riskLevel: "low"`, `status: "approved"`

---

## 3. RAG Contextual Explainability

### `POST /api/explain`
Synthesizes an analyst-grade narrative explanation, root-cause breakdown, historical context, recommended ops action, and confidence score for a transaction.

**Request Body**
```json
{
  "transaction": {
    "id": "TX-9042",
    "amount": 8450,
    "riskScore": 92,
    "riskLevel": "critical"
  }
}
```

**Response (`200 OK`)**
```json
{
  "success": true,
  "explanation": {
    "summary": "Transaction TX-9042 presents elevated risk (92/100) driven by velocity spikes, device proxy flags, and geographical displacement.",
    "rootCauseAnalysis": "Cross-border IP anomaly paired with unverified residential proxy and a 10x deviation from normal spending history.",
    "historicalContext": "Customer profile shows 90-day clean history in local jurisdiction. Current event matches pattern CASE-2025-0891 (Credential Stuffing / ATO).",
    "recommendedAction": "Escalate to Manual Review or trigger mandatory 3DS biometric OTP verification before settlement.",
    "confidenceScore": 94
  }
}
```

---

## 4. Agentic Risk Analyst Chat

### `POST /api/agent-chat`
Answers natural-language risk, compliance, and policy questions grounded in an optional active `contextTransaction`.

**Request Body**
```json
{
  "message": "Draft a Suspicious Activity Report (SAR) summary for TX-9042.",
  "contextTransaction": {
    "id": "TX-9042",
    "customerName": "Marcus Vance",
    "customerId": "CUST-8831",
    "amount": 8450,
    "currency": "USD",
    "merchantName": "AeroJets International",
    "riskScore": 92,
    "riskLevel": "critical"
  }
}
```

**Response (`200 OK`)**
```json
{
  "success": true,
  "reply": "**SUSPICIOUS ACTIVITY REPORT (SAR) DRAFT**\n\n**Subject:** Transaction TX-9042 - High Risk Anomaly..."
}
```

### Fallback Intent Routing
When Gemini is unavailable, `/api/agent-chat` inspects `message` keywords to return structured templates:
- `sar` / `suspicious activity report` → Pre-populated SAR narrative using `contextTransaction` fields
- `flagged` / `why` / `critical` / `risk` → Telemetry & verification breakdown
- `false positive` / `threshold` / `rule` → Policy tuning recommendations
- `pattern` / `subnet` / `proxy` → Cluster & subnet containment guidance
- Default → Context-aware mitigation recommendation

---

## 5. Production Integration Recommendations

When deploying behind an API Gateway in production:
1. **Authentication**: Require `Authorization: Bearer <JWT>` (for analyst UI calls) or HMAC-SHA256 request signatures (`X-TrustShield-Signature` + `X-TrustShield-Timestamp`) for merchant/gateway server-to-server calls.
2. **Idempotency**: Include `Idempotency-Key: <transaction.id>` on `POST /api/evaluate` to prevent duplicate velocity increments on network retries.
3. **Webhooks**: Emit signed async callbacks (`transaction.decision.updated`) whenever a `review` or `challenged` transaction transitions to `approved` or `declined`.
