# TrustShield AI

**AI-Powered Fraud & Risk Intelligence Platform** for real-time payment scoring, Retrieval-Augmented Generation (RAG) explainability, agentic risk investigation, rule simulation, and executive fraud analytics.

TrustShield AI pairs a low-latency deterministic risk engine with **Google Gemini (`gemini-2.5-flash`)** to score incoming payment telemetry, explain *why* transactions were flagged using historical case context, and assist Risk Operations and Compliance teams with interactive investigation and Suspicious Activity Report (SAR) drafting.

---

## Key Features

- **Live Risk Telemetry Stream (`LiveMonitor`)**
  - Real-time transaction monitoring table with search, risk-tier filtering (`critical`, `high`, `medium`, `low`), and slide-over inspection drawer.
  - One-click **Approve** / **Decline** case resolution, background stream simulation (30s interval toggle), and instant deep-links into RAG Explainability or the Agentic Copilot.
- **RAG Explainability Engine (`RagExplainability`)**
  - Eliminates black-box scoring by synthesizing executive summaries, root-cause vectors, historical baseline context, and recommended ops actions via `/api/explain`.
  - Displays a **Risk Score Attribution Waterfall** and **Vector Similarity Matches** against historical threat cases.
- **Agentic AI Workbench (`AgentWorkbench`)**
  - Context-aware Risk Copilot powered by `/api/agent-chat` (with intelligent rule-based fallback when Gemini quota is exhausted or unconfigured).
  - Supports natural-language queries, proxy/subnet pattern analysis, false-positive threshold optimization, and automated **SAR** drafting.
- **Simulation Sandbox & Hybrid Rules (`Simulator`)**
  - Craft custom transaction payloads (amount, merchant category, IP country, device type, VPN/proxy, new device token, AVS match) and evaluate them live via `/api/evaluate`.
  - Adjust AI vs. deterministic rule weightings and toggle active hard rules (`Impossible Velocity / Geo Jump`, `Anonymous Proxy / Tor Node`, `High Dollar Amount Spikes`, etc.).
- **Analytics & Retention Dashboard (`AnalyticsDashboard`)**
  - Interactive Recharts visualizations for **Prevented Fraud Loss Trends**, **DAU/MAU Growth**, **Weekly Retention Cohort Matrix**, and **Feature Adoption & API Call Volume**.
- **In-App Docs & Knowledge Center (`DocsKnowledgeCenter`)**
  - Interactive onboarding hub with storytelling user persona journeys, a Digital Payments 101 primer, searchable platform guides, and a risk metrics glossary.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide React, Recharts |
| **Backend** | Node.js, Express 4 (`server.ts`), `tsx` (dev), `esbuild` (prod bundle) |
| **AI / Scoring** | `@google/genai` (`gemini-2.5-flash`) + deterministic rule-based fallback engine |

---

## Quick Start

### Prerequisites
- **Node.js** 20+ and **npm**
- Optional: a **Gemini API Key** (if omitted or quota-limited, TrustShield AI automatically falls back to its built-in deterministic scoring, explainability, and copilot engines)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and add your Gemini API key if available:
```bash
cp .env.example .env
```

```env
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"
```

### 3. Run in Development
Starts the Express server on port `3000` with Vite middleware mounted for the React SPA:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Type-Check & Production Build
```bash
npm run lint    # Runs tsc --noEmit
npm run build   # Builds Vite client + bundles server.ts to dist/server.cjs
npm start       # Serves production app on port 3000
```

---

## Project Structure

```text
├── server.ts                         # Express API (/api/health, /api/evaluate, /api/explain, /api/agent-chat) + Vite/static serving
├── index.html                        # HTML entry point
├── vite.config.ts                    # Vite + Tailwind v4 configuration
├── package.json                      # Scripts & dependencies
├── .env.example                      # Environment variable template
└── src/
    ├── App.tsx                       # Root state, tab router, and live stream simulation loop
    ├── types.ts                      # Core TypeScript domain models (Transaction, Rule, AnalyticsData, UserProfile)
    ├── data/
    │   └── mockData.ts               # Seed transactions, default rules, and analytics cohorts
    └── components/
        ├── Header.tsx                # Top navigation, live stream toggle, persona switcher trigger
        ├── LiveMonitor.tsx           # Real-time transaction stream, filters, and detail drawer
        ├── RagExplainability.tsx     # RAG synthesis inspector, waterfall, and historical case matches
        ├── AgentWorkbench.tsx        # Autonomous AI Risk Copilot chat interface
        ├── Simulator.tsx             # Transaction payload sandbox & hybrid rule configuration
        ├── AnalyticsDashboard.tsx    # Fraud savings, DAU/MAU, cohorts, and feature usage charts
        ├── DocsKnowledgeCenter.tsx   # Embedded onboarding, persona journeys, and domain glossary
        └── AuthModal.tsx             # Simulated OAuth / role-persona switcher modal
```

---

## Documentation Index

| Document | Audience | Purpose |
| --- | --- | --- |
| [**User Guide**](docs/user-guide.md) | Risk Analysts, Compliance, Product, Integrators | Visual UI walkthroughs and programmatic API workflows by user persona |
| [**System Design & AWS Architecture**](docs/system-design.md) | Solutions Architects, Principal Engineers | Current vs. target production architecture, AWS deployment blueprint, streaming, and RAG scaling |
| [**Developer Guide**](docs/developer-guide.md) | Frontend & Backend Engineers | Codebase map, state flow, extending rules/components, and local tooling |
| [**API Reference**](docs/api-reference.md) | Integration Engineers | Complete REST endpoint contracts, JSON schemas, `curl`/TypeScript examples, and fallback semantics |
| [**Security & Compliance**](docs/security-compliance.md) | Security Engineers, Compliance Officers | PCI-DSS scope reduction, PII redaction for LLMs, FinCEN SAR governance, and AWS security controls |
| [**Operations Runbook**](docs/runbook.md) | SREs, Fraud Operations | Incident playbooks for LLM quota failover, false-positive spikes, and proxy attacks |
| [**Testing & Benchmarking**](docs/testing.md) | QA, Backend, ML Engineers | Rule validation, AI mocking, backtesting, and checkout latency load testing |
| [**Production Roadmap**](docs/roadmap.md) | Engineering & Product Leadership | Current mock/in-memory capabilities vs. production milestones |

---

## License

Apache-2.0 - see source file headers for details.
