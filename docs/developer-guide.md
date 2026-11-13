# TrustShield AI - Developer Guide

This guide helps engineers navigate the TrustShield AI codebase, understand state and API boundaries, and safely add or update features.

---

## 1. Codebase Map

### Root & Configuration
| File | Purpose |
| --- | --- |
| `package.json` | Scripts (`dev`, `build`, `start`, `lint`) and runtime/dev dependencies |
| `server.ts` | Express server on port `3000`: REST API routes + Vite dev middleware / production static serving |
| `vite.config.ts` | Vite 6 config with React plugin, Tailwind CSS v4 plugin, and `DISABLE_HMR` support |
| `tsconfig.json` | TypeScript configuration (`tsc --noEmit` via `npm run lint`) |
| `.env.example` | Documents `GEMINI_API_KEY` and `APP_URL` |
| `metadata.json` | App name, description, and server-side Gemini capability declaration |

### Frontend (`src/`)
| File | Responsibility |
| --- | --- |
| `src/main.tsx` | React root mount (`index.html` -> `#root`) |
| `src/index.css` | Global Tailwind v4 import (`@import "tailwindcss";`) |
| `src/types.ts` | Shared interfaces: `Transaction`, `RiskFactor`, `RiskLevel`, `TransactionStatus`, `Rule`, `UserProfile`, `AnalyticsData`, `AgentChatMessage` |
| `src/data/mockData.ts` | Seed data: `INITIAL_TRANSACTIONS` (5 cases), `DEFAULT_RULES` (5 rules), `MOCK_ANALYTICS` |
| `src/App.tsx` | Top-level state owner (`activeTab`, `transactions`, `isStreaming`, `ragSelectedTx`, `agentSelectedTx`, `user`) + 30s simulation loop |

### UI Components (`src/components/`)
| Component | Tab ID | Key Responsibilities & Props |
| --- | --- | --- |
| `Header.tsx` | - | Renders brand, 6 navigation tabs (`navTabs`), stream pause/resume toggle, and user profile button |
| `LiveMonitor.tsx` | `live-monitor` | KPI cards, search/risk-tier filters, transaction table, slide-over detail drawer, approve/decline actions, manual simulation trigger |
| `RagExplainability.tsx` | `rag-explainability` | Event selector sidebar, `POST /api/explain` trigger, attribution waterfall (`score * weight`), historical `ragMatches` list |
| `AgentWorkbench.tsx` | `agent-workbench` | Active transaction context badge, 4 suggested prompt chips, conversational chat stream calling `POST /api/agent-chat` |
| `Simulator.tsx` | `simulator` | Transaction parameter form, AI vs. rule weight slider (`aiWeight`), `DEFAULT_RULES` toggles, `POST /api/evaluate` runner |
| `AnalyticsDashboard.tsx` | `analytics` | Recharts `AreaChart` (fraud loss saved), `LineChart` (DAU), weekly retention cohort table, feature adoption cards |
| `DocsKnowledgeCenter.tsx` | `docs-knowledge` | Embedded onboarding: Persona storyboards (Elena, Marcus, Samira), Payment Primer, searchable Guides, Risk Glossary |
| `AuthModal.tsx` | - | Modal for switching simulated OAuth profiles (`Alex Vance`, `Sarah Chen`, `Marcus Thorne`) |

---

## 2. State & Data Flow

`src/App.tsx` holds the single source of truth for client state:

```text
App.tsx
 ├── transactions[] ──────────► LiveMonitor (table, drawer, approve/decline)
 │                                  ├── onOpenRag(tx)   ──► sets ragSelectedTx & switches tab
 │                                  └── onOpenAgent(tx) ──► sets agentSelectedTx & switches tab
 ├── ragSelectedTx ───────────► RagExplainability (calls POST /api/explain)
 ├── agentSelectedTx ─────────► AgentWorkbench (calls POST /api/agent-chat)
 ├── handleAddEvaluatedTransaction(tx) ◄── Simulator (calls POST /api/evaluate)
 ├── MOCK_ANALYTICS ──────────► AnalyticsDashboard
 └── user ────────────────────► Header & AuthModal
```

### Server Evaluation Pipeline (`server.ts`)
Each AI-backed endpoint follows a **Gemini-first, deterministic-fallback** pattern:
1. `getGeminiClient()` checks `process.env.GEMINI_API_KEY` (ignoring placeholder `"MY_GEMINI_API_KEY"`).
2. If configured, calls `ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt })` inside a `try/catch`.
3. On missing key, JSON parse failure, or API errors (such as HTTP `429 RESOURCE_EXHAUSTED`), execution falls through cleanly to deterministic scoring/templating logic and returns HTTP `200` with `{ success: true, ... }`.

---

## 3. Common Extension Tasks

### Add a New Navigation Tab
1. Add the tab entry `{ id: 'your-tab', label: 'Your Label' }` to `navTabs` in `src/components/Header.tsx`.
2. Create `src/components/YourView.tsx`.
3. Import and conditionally render `{activeTab === 'your-tab' && <YourView />}` in `src/App.tsx`.

### Add a New Transaction Signal or Rule
1. Extend `Transaction` or `RiskFactor['category']` in `src/types.ts`.
2. Add seed rule definitions to `DEFAULT_RULES` in `src/data/mockData.ts`.
3. Update the Gemini prompt schema and deterministic fallback rules in `server.ts` (`POST /api/evaluate`) so both paths produce consistent `riskFactors` shapes.
4. Expose the new input control in `src/components/Simulator.tsx` if you want analysts to test it interactively.

### Replace Mock Data with a Backend Database
1. Keep `src/types.ts` as your shared DTO contract.
2. Add `GET /api/transactions`, `PATCH /api/transactions/:id`, and `GET /api/rules` / `PUT /api/rules/:id` routes in `server.ts`.
3. Replace `INITIAL_TRANSACTIONS` initialization in `src/App.tsx` with a `useEffect` fetch and optimistic status updates.
4. Persist `Simulator.tsx` rule toggles and `aiWeight` via the new rules API instead of local component state.

---

## 4. Development Commands & Gotchas

- **`npm run dev`**: Runs `tsx server.ts` on `0.0.0.0:3000`. In non-production mode, Express mounts `vite.createServer({ server: { middlewareMode: true } })`.
- **`npm run lint`**: Runs `tsc --noEmit`. Always run before committing to verify strict TypeScript compatibility across `server.ts` and `src/`.
- **`npm run build`**: Runs `vite build` (outputs client assets to `dist/`) followed by `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs`.
- **HMR Flag**: `vite.config.ts` respects `DISABLE_HMR=true` (disables HMR and file watching when running inside managed preview sandboxes).
- **Gemini JSON Cleaning**: Responses from `gemini-2.5-flash` in `server.ts` strip markdown code fences (` ```json ` / ` ``` `) before `JSON.parse`. When modifying prompts, consider enabling structured `responseMimeType: "application/json"` and `responseSchema` via `@google/genai` for stricter parsing guarantees.
