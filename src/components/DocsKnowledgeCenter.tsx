import React, { useState } from 'react';
import {
  BookOpen,
  UserCheck,
  ShieldAlert,
  CreditCard,
  Cpu,
  FileText,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Layers,
  Compass,
  Zap,
  Building2,
  Code2,
  Workflow,
  ChevronRight,
  Play,
  Info,
  HelpCircle
} from 'lucide-react';

interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  badge: string;
  color: string;
  quote: string;
  story: string;
  goals: string[];
  painPoints: string[];
  workflowSteps: {
    stepNumber: number;
    title: string;
    description: string;
    targetTab: string;
    actionLabel: string;
  }[];
}

interface Article {
  id: string;
  category: 'domain-basics' | 'platform-guide' | 'risk-vectors' | 'compliance';
  title: string;
  readTime: string;
  summary: string;
  content: string[];
  keyTerms?: { term: string; definition: string }[];
}

export const DocsKnowledgeCenter: React.FC<{
  onNavigateTab: (tabId: string) => void;
}> = ({ onNavigateTab }) => {
  const [activeSection, setActiveSection] = useState<'primer' | 'personas' | 'guides' | 'glossary'>('personas');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('elena');
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Defined User Personas
  const personas: Persona[] = [
    {
      id: 'elena',
      name: 'Elena Rostova',
      role: 'Senior Risk Operations Analyst',
      avatar: 'ER',
      badge: 'Frontline Triage',
      color: 'from-blue-600 to-cyan-600',
      quote: "I need to make high-confidence decisions on flagged payments within seconds without blocking legitimate customers.",
      story: "Elena monitors real-time transaction streams during peak shopping hours. When a $4,800 crypto transaction gets flagged with an 88/100 risk score, she uses TrustShield's RAG Explainability to inspect the proxy subnet, device fingerprint, and customer velocity before approving or declining.",
      goals: [
        'Minimize manual review queue handling time (<30 seconds/case)',
        'Reduce false positive declines on high-value loyal customers',
        'Quickly uncover proxy subnet clusters and account takeover patterns'
      ],
      painPoints: [
        'Black-box AI models that don’t explain why a payment was flagged',
        'Context switching across multiple databases, IP lookups, and logs'
      ],
      workflowSteps: [
        {
          stepNumber: 1,
          title: 'Live Telemetry Triage',
          description: 'Elena keeps the Live Risk Stream open. High-risk transactions appear instantly with color-coded risk tiers and anomaly flags.',
          targetTab: 'live-monitor',
          actionLabel: 'Open Live Stream'
        },
        {
          stepNumber: 2,
          title: 'Contextual RAG Deep Dive',
          description: 'She clicks "Explain Risk with RAG" on a flagged transaction to view retrieved historical audit logs, IP geolocations, and 30-day customer velocity baselines.',
          targetTab: 'rag-explainability',
          actionLabel: 'Explore RAG Engine'
        },
        {
          stepNumber: 3,
          title: 'Agentic AI Consultation',
          description: 'Elena asks the Agentic AI Workbench to synthesize past chargeback incidents for this specific merchant and query subnet activity.',
          targetTab: 'agent-workbench',
          actionLabel: 'Consult AI Agent'
        },
        {
          stepNumber: 4,
          title: 'One-Click Decision & Audit',
          description: 'With full confidence, she executes a decision (Approve, Decline, or Step-Up) and appends an AI-generated audit note to the record.',
          targetTab: 'live-monitor',
          actionLabel: 'Return & Execute'
        }
      ]
    },
    {
      id: 'marcus',
      name: 'Marcus Thorne',
      role: 'Head of Fraud & Compliance',
      avatar: 'MT',
      badge: 'Strategy & Compliance',
      color: 'from-purple-600 to-indigo-600',
      quote: "My focus is maintaining chargeback rates below 0.9% while optimizing authorization rates and generating compliance reports effortlessly.",
      story: "Marcus evaluates monthly fraud retention metrics and regulatory compliance. When new proxy attack vectors emerge, he tests risk rule thresholds in the Simulator before pushing policy updates live and uses the Agent to draft formal Suspicious Activity Reports (SAR).",
      goals: [
        'Keep platform chargeback ratio strictly below international card network thresholds (<0.9%)',
        'Backtest fraud rule changes on live payloads before deployment',
        'Automate Suspicious Activity Report (SAR) drafting for FinCEN compliance'
      ],
      painPoints: [
        'Unintended conversion drops caused by overly aggressive risk rules',
        'Time-consuming manual drafting of compliance documentation'
      ],
      workflowSteps: [
        {
          stepNumber: 1,
          title: 'Platform Analytics & Retention Review',
          description: 'Marcus checks overall fraud prevention savings, false positive rates, and category distribution in Analytics.',
          targetTab: 'analytics',
          actionLabel: 'View Analytics'
        },
        {
          stepNumber: 2,
          title: 'Rule Testing & Payload Simulation',
          description: 'He uses the Simulator to test custom risk factors (e.g., VPN + Account Age < 7 days) and observe predicted scores.',
          targetTab: 'simulator',
          actionLabel: 'Launch Simulator'
        },
        {
          stepNumber: 3,
          title: 'Automated SAR Report Generation',
          description: 'He requests the Agentic AI Workbench to generate a fully formatted Suspicious Activity Report for a flagged cluster.',
          targetTab: 'agent-workbench',
          actionLabel: 'Generate SAR Draft'
        }
      ]
    },
    {
      id: 'samira',
      name: 'Samira Patel',
      role: 'Fintech Integration Engineer',
      avatar: 'SP',
      badge: 'Developer & API',
      color: 'from-emerald-600 to-teal-600',
      quote: "I need simple REST endpoints, transparent JSON payloads, and reliable sub-100ms risk scoring for our checkout pipeline.",
      story: "Samira builds payment integrations for online merchants. She relies on TrustShield AI's REST APIs to send telemetry payloads (device details, AVS/CVV matches, IP data) and consume real-time risk evaluations seamlessly.",
      goals: [
        'Integrate risk evaluation APIs into merchant checkout flows with minimal latency',
        'Ensure fallback rule engine availability during API rate limits or network spikes',
        'Inspect API payloads and mock live payments'
      ],
      painPoints: [
        'Unpredictable API responses or missing fallback mechanisms',
        'Complex SDK setup with unclear payload definitions'
      ],
      workflowSteps: [
        {
          stepNumber: 1,
          title: 'Payload Design & API Testing',
          description: 'Samira uses the Simulator tab to construct test payment payloads and verify risk score calculations.',
          targetTab: 'simulator',
          actionLabel: 'Test Payloads'
        },
        {
          stepNumber: 2,
          title: 'Live Stream Verification',
          description: 'She triggers API calls and watches the payments render in real-time on the Live Risk Stream board.',
          targetTab: 'live-monitor',
          actionLabel: 'Check Live Telemetry'
        }
      ]
    }
  ];

  // Domain Articles
  const articles: Article[] = [
    {
      id: 'digital-payments-101',
      category: 'domain-basics',
      title: 'Digital Payment Platforms: The Core Ecosystem',
      readTime: '3 min read',
      summary: 'An introductory guide explaining payment gateways, acquirers, issuing banks, and where risk scoring sits in the lifecycle.',
      content: [
        'In a digital payment transaction, data travels between four key parties: the Cardholder, the Merchant, the Acquiring Bank (merchant bank), and the Issuing Bank (customer bank).',
        'The Payment Gateway encrypts and routes transaction requests. Before the payment reaches the issuing bank for authorization, a Risk Engine (like TrustShield AI) evaluates the transaction in real time.',
        'If the risk score exceeds acceptable thresholds, the system can trigger 3D Secure (3DS) authentication, place a temporary hold, or decline the payment to prevent fraud.'
      ],
      keyTerms: [
        { term: 'Payment Gateway', definition: 'The service that reads and transfers payment details from customer to merchant acquiring bank.' },
        { term: 'Issuing Bank', definition: 'The financial institution that issued the payment card to the consumer.' },
        { term: '3D Secure (3DS)', definition: 'An additional security protocol (e.g., OTP via SMS/App) requiring identity verification during checkout.' }
      ]
    },
    {
      id: 'fraud-risk-vectors',
      category: 'risk-vectors',
      title: 'Common Digital Fraud Risk Vectors Explained',
      readTime: '4 min read',
      summary: 'Learn about Account Takeover (ATO), Proxy/VPN Spoofing, Carding Velocity, and Synthetic Identity Fraud.',
      content: [
        'Account Takeover (ATO): Fraudsters gain unauthorized access to a legitimate user account using stolen credentials or session hijacking.',
        'Proxy & Residential VPN Spoofing: Bad actors route traffic through residential proxy networks to mask their true geographic origin and bypass geo-blocking rules.',
        'Card Testing / Velocity Attacks: Automated scripts attempt rapid low-value transactions across multiple stolen card numbers to test validity.',
        'Synthetic Identity: Fraudsters combine real and fake information (e.g., legitimate SSN with a fake name) to open fraudulent accounts.'
      ],
      keyTerms: [
        { term: 'AVS Match', definition: 'Address Verification System check comparing billing street address and zip code.' },
        { term: 'CVV Match', definition: 'Card Verification Value 3-digit security code match verification.' },
        { term: 'Proxy/VPN Detection', definition: 'Identifying IP addresses assigned to datacenters, TOR exit nodes, or commercial VPN providers.' }
      ]
    },
    {
      id: 'trustshield-architecture',
      category: 'platform-guide',
      title: 'TrustShield AI Platform Architecture & Navigation',
      readTime: '3 min read',
      summary: 'A complete tour of TrustShield AI tabs and how AI models combine with rule engines for high-accuracy scoring.',
      content: [
        '1. Live Risk Stream: High-velocity monitor displaying real-time incoming payments, risk levels, and instant action buttons.',
        '2. RAG Explainability: Contextual intelligence module synthesizing customer historical baselines, IP geolocations, and telemetry.',
        '3. Agentic AI Workbench: Conversational assistant capable of drafting SAR compliance reports, analyzing subnet patterns, and recommending rule tweaks.',
        '4. Simulator & Rules: Interactive playground to craft custom payment JSON payloads and test risk factor algorithms.',
        '5. Analytics & Retention: Executive dashboard displaying chargeback mitigation ROI, false positive rates, and high-risk categories.'
      ]
    },
    {
      id: 'compliance-sar-guide',
      category: 'compliance',
      title: 'Compliance & Suspicious Activity Reporting (SAR)',
      readTime: '3 min read',
      summary: 'Understanding legal requirements for reporting suspicious financial activity and automating filings with AI.',
      content: [
        'Financial institutions and fintech platforms are legally required to file Suspicious Activity Reports (SAR) when detecting transactions involving suspected money laundering or identity theft.',
        'TrustShield AI streamlines SAR creation by aggregating evidence (IP logs, device fingerprints, transaction velocity) into a standardized narrative ready for compliance team review.'
      ]
    }
  ];

  const selectedPersona = personas.find((p) => p.id === selectedPersonaId) || personas[0];

  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner & Knowledge Search */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Knowledge & Onboarding Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            New to Digital Payments & Risk Intelligence?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Welcome to <span className="text-blue-400 font-semibold">TrustShield AI</span>. Explore domain primers, follow user persona journeys, and master how our AI-powered platform prevents fraud while preserving checkout conversions.
          </p>

          {/* Quick Tab Switcher Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => setActiveSection('personas')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeSection === 'personas'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>User Personas & Journeys</span>
            </button>
            <button
              onClick={() => setActiveSection('primer')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeSection === 'primer'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Digital Payment Primer</span>
            </button>
            <button
              onClick={() => setActiveSection('guides')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeSection === 'guides'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Platform Docs & Modules</span>
            </button>
            <button
              onClick={() => setActiveSection('glossary')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeSection === 'glossary'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Risk Glossary & Metrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: USER PERSONAS & STORYTELLING JOURNEYS */}
      {activeSection === 'personas' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-400" />
                User Personas & Interactive App Workflows
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Select a persona to explore how different roles interact with TrustShield AI to solve specific business and technical challenges.
              </p>
            </div>
          </div>

          {/* Persona Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personas.map((p) => {
              const isSelected = p.id === selectedPersonaId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPersonaId(p.id);
                    setActiveWorkflowStep(0);
                  }}
                  className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500 shadow-xl shadow-blue-950/40 ring-1 ring-blue-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                        {p.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight">{p.name}</h3>
                        <p className="text-xs text-slate-400">{p.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-blue-300 border border-slate-700">
                      {p.badge}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-300 italic line-clamp-2">
                    "{p.quote}"
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Persona Deep Dive Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start border-b border-slate-800 pb-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedPersona.color} text-white font-extrabold text-lg flex items-center justify-center shadow-lg`}>
                    {selectedPersona.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedPersona.name}</h3>
                    <p className="text-xs sm:text-sm text-blue-400 font-medium">{selectedPersona.role}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                  <strong className="text-white font-semibold">User Story & Context:</strong> {selectedPersona.story}
                </p>
              </div>

              {/* Goals & Pain Points Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Core Goals
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {selectedPersona.goals.map((g, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Key Pain Points
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {selectedPersona.painPoints.map((pp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{pp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Interactive Workflow Storyboard */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-blue-400" />
                  Interactive App Workflow Journey
                </h4>
                <span className="text-xs text-slate-400">Click a step or button to jump directly into that app tab</span>
              </div>

              {/* Stepper Header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {selectedPersona.workflowSteps.map((step, idx) => {
                  const isActive = activeWorkflowStep === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveWorkflowStep(idx)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-blue-600/15 border-blue-500/80 text-white'
                          : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                          isActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}>
                          Step {step.stepNumber}
                        </span>
                        {isActive && <ChevronRight className="w-4 h-4 text-blue-400 animate-pulse" />}
                      </div>
                      <p className="text-xs font-bold text-slate-200 truncate">{step.title}</p>
                    </button>
                  );
                })}
              </div>

              {/* Active Step Details & Direct Action Launcher */}
              {selectedPersona.workflowSteps[activeWorkflowStep] && (
                <div className="bg-slate-950/90 border border-blue-500/30 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-inner">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-blue-400">Step {selectedPersona.workflowSteps[activeWorkflowStep].stepNumber}:</span>
                      <h5 className="font-bold text-white text-base">
                        {selectedPersona.workflowSteps[activeWorkflowStep].title}
                      </h5>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedPersona.workflowSteps[activeWorkflowStep].description}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigateTab(selectedPersona.workflowSteps[activeWorkflowStep].targetTab)}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/20 whitespace-nowrap flex-shrink-0"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{selectedPersona.workflowSteps[activeWorkflowStep].actionLabel}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DIGITAL PAYMENT PRIMER FOR BEGINNERS */}
      {activeSection === 'primer' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              Digital Payment Platforms: Fundamental Concepts
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              A beginner-friendly breakdown of how digital payments work, how risk engines process transactions, and key industry terminology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: The Transaction Lifecycle */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Workflow className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-lg">1. The Payment Lifecycle</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                When a buyer submits a payment online, data flows rapidly through multiple systems:
              </p>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <div>
                    <strong className="text-white">Checkout Initiation:</strong> Buyer enters card details. Gateway encrypts payload.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                  <div>
                    <strong className="text-white">AI Risk Evaluation:</strong> TrustShield AI evaluates telemetry in sub-100ms (IP proxy check, AVS/CVV match, velocity).
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">3</span>
                  <div>
                    <strong className="text-white">Decision Routing:</strong> Low risk passes to Issuing Bank for authorization; high risk triggers 3DS OTP challenge or decline.
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Core Risk Indicators */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-lg">2. Key Risk Indicators (KRIs)</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Fraud risk engines evaluate hundreds of signals per transaction. Core factors include:
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-amber-300">IP Geolocation vs Card Issuing Country:</strong> A transaction placed from Brazil using a US-issued card raises risk flags.
                </li>
                <li className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-amber-300">Proxy / VPN Detection:</strong> Datacenter IPs, Tor exit nodes, or commercial residential proxies indicate identity concealment.
                </li>
                <li className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-amber-300">Velocity Surge:</strong> Multiple high-value purchases within minutes on a newly created account indicate potential ATO or card testing.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PLATFORM DOCS & KNOWLEDGE ARTICLES */}
      {activeSection === 'guides' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-400" />
                TrustShield AI Knowledge Base
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Search technical guides, risk vectors, and platform tab documentation.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search docs or terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Guides' },
              { id: 'domain-basics', label: 'Domain Basics' },
              { id: 'platform-guide', label: 'Platform Architecture' },
              { id: 'risk-vectors', label: 'Risk Vectors' },
              { id: 'compliance', label: 'Compliance & SAR' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Article List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((art) => (
              <div key={art.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                      {art.category.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{art.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{art.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{art.summary}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    {art.content.map((p, idx) => (
                      <p key={idx} className="text-xs text-slate-400 leading-relaxed">
                        • {p}
                      </p>
                    ))}
                  </div>

                  {art.keyTerms && art.keyTerms.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-300 block">Key Definitions:</span>
                      {art.keyTerms.map((kt, idx) => (
                        <div key={idx} className="text-xs text-slate-400">
                          <strong className="text-blue-300">{kt.term}:</strong> {kt.definition}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: RISK GLOSSARY & METRICS */}
      {activeSection === 'glossary' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              Risk Metrics & Terminology Glossary
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Essential metrics used by fraud operations teams to balance security and payment authorization rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Metric</span>
              <h3 className="font-bold text-white text-base">Chargeback Ratio</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The percentage of transactions disputed by cardholders as fraud. Visa/MasterCard enforce strict thresholds (&lt;0.9%). Exceeding this incurs heavy fines or merchant account termination.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Metric</span>
              <h3 className="font-bold text-white text-base">False Positive Rate (FPR)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The percentage of legitimate customer payments mistakenly flagged or declined by risk rules. High FPR damages customer trust and hurts merchant revenue.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Metric</span>
              <h3 className="font-bold text-white text-base">Risk Score (0 - 100)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A composite score calculated by TrustShield AI. Scores 0–30 are low risk (auto-approve), 31–70 medium risk (review/step-up), and 71–100 critical risk (auto-decline/hold).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
