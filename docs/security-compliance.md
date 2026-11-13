# TrustShield AI - Security, PCI-DSS & Regulatory Compliance Guide

Financial risk platforms process sensitive payment telemetry and personally identifiable information (PII). This document outlines the security and compliance controls required to operate TrustShield AI in production.

---

## 1. PCI-DSS Scope Minimization

TrustShield AI is designed to **avoid entering Cardholder Data Environment (CDE) scope** for raw card numbers:
- **Never transmit or log raw PAN (16-digit card number) or CVV codes.**
- Only pass non-sensitive card metadata into `cardInfo`:
  - `brand` (e.g., `Visa`, `MasterCard`, `Amex`)
  - `last4` (last four digits only)
  - `issuingCountry`
  - Boolean verification results (`cvvMatch`, `avsMatch`) from your payment gateway/PSP.
- **Tokenization**: Use gateway payment tokens (`pm_...` or `tok_...`) or salted cryptographic hashes (`HMAC-SHA256(pan, kmsKey)`) for cross-merchant card velocity tracking in Redis/DynamoDB.

---

## 2. PII Redaction Before LLM Inference

Currently, `server.ts` serializes the full `transaction` object into the Gemini prompt (`JSON.stringify(transaction, null, 2)`). In production:
1. **Strip Direct Identifiers**: Remove or pseudonymize `customerName`, `customerEmail`, and exact street addresses before sending payloads to external LLM APIs (`@google/genai` or Amazon Bedrock).
2. **Replace with Synthetic Tokens**: Pass `customerId` (internal UUID), `accountAgeDays`, `merchantCategory`, `country`/`city`, `ipRiskScore`, `deviceInfo`, and `cardInfo` match booleans-none of which expose raw customer identity.
3. **Zero Data Retention (ZDR)**: Use enterprise LLM endpoints with contractual zero-data-retention and no-training guarantees.
4. **Prompt Injection Defense**: Wrap untrusted string fields (`merchantName`, user chat inputs) in explicit XML/JSON delimiters and validate all LLM outputs against strict JSON schemas before rendering or storing.

---

## 3. Authentication, RBAC & Tenant Isolation

In the prototype, `AuthModal.tsx` is a client-side persona switcher with no server enforcement. Production requires:
- **OIDC / SAML SSO**: Authenticate analysts via Amazon Cognito / Okta / Google Workspace OIDC with mandatory MFA.
- **Role-Based Access Control (RBAC)**:
  - `Risk Analyst`: View stream, run `/api/explain`, approve/decline `review` transactions up to configured dollar limits.
  - `Compliance Officer`: Generate, edit, and export SAR reports; read-only access to rule configurations.
  - `Fraud Admin`: Modify rule weights, publish rule versions, configure `aiWeight` thresholds (require two-person approval / four-eyes principle for production rule changes).
  - `Integration Service`: Machine-to-machine OAuth2 client credentials or HMAC-signed access scoped strictly to `POST /api/evaluate`.
- **Multi-Tenant Isolation**: Enforce `tenant_id` extraction from verified JWT claims on every API query and database row-level security (RLS) policy in Aurora PostgreSQL.

---

## 4. Audit Logging & FinCEN SAR Governance

- **Immutable Decision Audit Trail**: Every automated evaluation and manual analyst override (`approved` / `declined`) must write an append-only record containing:
  - `transactionId`, `actorId` (or `system:rule-engine`), `previousStatus`, `newStatus`, `riskScore`, `ruleVersion`, `timestamp`, and `justification`.
- **SAR Retention & Confidentiality**:
  - Suspicious Activity Reports generated via `AgentWorkbench` are legally sensitive (**31 U.S.C. § 5318(g)** non-disclosure / "tipping off" prohibitions).
  - Restrict SAR access to `Compliance Officer` roles only, encrypt payloads with dedicated **AWS KMS Customer Managed Keys (CMK)**, and store finalized filings in **S3 Object Lock (Compliance Mode)** for a minimum of **5 years**.

---

## 5. Network, API & Secret Hygiene

| Control | Implementation |
| --- | --- |
| **Transport Security** | Enforce TLS 1.3 via CloudFront and ALB; disable HTTP (`80`) |
| **API Rate Limiting** | Apply AWS WAF rate-based rules per IP/tenant to protect `/api/evaluate` and LLM routes (`/api/explain`, `/api/agent-chat`) from abuse and quota exhaustion |
| **Secret Management** | Never commit `.env` or `GEMINI_API_KEY`; load via AWS Secrets Manager / IAM roles at runtime |
| **Input Validation** | Validate request bodies in `server.ts` with **Zod** (strict field types, max string lengths, numeric bounds) before processing |
| **Security Headers** | Enable `helmet` in Express with strict `Content-Security-Policy`, `X-Frame-Options`, and `HSTS` |
