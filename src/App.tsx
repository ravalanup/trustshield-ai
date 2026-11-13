/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LiveMonitor } from './components/LiveMonitor';
import { RagExplainability } from './components/RagExplainability';
import { AgentWorkbench } from './components/AgentWorkbench';
import { Simulator } from './components/Simulator';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { DocsKnowledgeCenter } from './components/DocsKnowledgeCenter';
import { AuthModal } from './components/AuthModal';
import { INITIAL_TRANSACTIONS, MOCK_ANALYTICS } from './data/mockData';
import { Transaction, UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('live-monitor');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Selected Tx for deep tools
  const [ragSelectedTx, setRagSelectedTx] = useState<Transaction | null>(INITIAL_TRANSACTIONS[0]);
  const [agentSelectedTx, setAgentSelectedTx] = useState<Transaction | null>(INITIAL_TRANSACTIONS[0]);

  // Current User Profile
  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Vance',
    email: 'alex.vance@fintechpay.io',
    role: 'Head of Risk Operations',
    avatar: '',
    provider: 'google',
  });

  // Handle status changes (Approve / Decline)
  const handleUpdateStatus = (id: string, status: 'approved' | 'declined' | 'review') => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, status } : tx))
    );
  };

  // Add newly evaluated transaction
  const handleAddEvaluatedTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
    setRagSelectedTx(tx);
    setAgentSelectedTx(tx);
  };

  // Simulate an incoming live transaction
  const handleSimulateNew = async () => {
    setIsEvaluating(true);
    const randomAmounts = [1200, 4800, 8900, 150, 3200];
    const randomMerchants = [
      { name: 'Binance Crypto', cat: 'Financial & Crypto' },
      { name: 'Delta Airlines', cat: 'Travel & Airlines' },
      { name: 'Sephora Online', cat: 'Retail & Beauty' },
      { name: 'Uber Luxury', cat: 'Rideshare & Mobility' },
    ];
    const randomCities = [
      { city: 'S\u00e3o Paulo', country: 'Brazil' },
      { city: 'Tokyo', country: 'Japan' },
      { city: 'Dubai', country: 'UAE' },
      { city: 'New York', country: 'United States' },
    ];

    const selMerchant = randomMerchants[Math.floor(Math.random() * randomMerchants.length)];
    const selCity = randomCities[Math.floor(Math.random() * randomCities.length)];
    const amt = randomAmounts[Math.floor(Math.random() * randomAmounts.length)];

    const simTx: Partial<Transaction> = {
      id: `TX-${Math.floor(9043 + Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      customerName: 'Live Simulation User',
      customerId: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      customerEmail: 'telemetry.stream@trustshield.io',
      accountAgeDays: Math.floor(Math.random() * 300),
      amount: amt,
      currency: 'USD',
      merchantName: selMerchant.name,
      merchantCategory: selMerchant.cat,
      location: {
        city: selCity.city,
        country: selCity.country,
        ip: `${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}.12.99`,
        ipRiskScore: amt > 3000 ? 78 : 12,
      },
      deviceInfo: {
        deviceType: 'Mobile Phone',
        os: 'Android 14',
        browser: 'Chrome Mobile',
        isNewDevice: amt > 3000,
        isVpnOrProxy: amt > 3000,
      },
      cardInfo: {
        brand: 'MasterCard',
        last4: '4109',
        issuingCountry: 'United States',
        cvvMatch: true,
        avsMatch: amt <= 3000,
      },
    };

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction: simTx }),
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        const evalRes = data.evaluation;
        const fullSimTx: Transaction = {
          ...simTx as Transaction,
          riskScore: evalRes.riskScore,
          riskLevel: evalRes.riskLevel,
          status: evalRes.status,
          riskFactors: evalRes.riskFactors || [],
          aiExplanation: evalRes.aiExplanation,
        };
        handleAddEvaluatedTransaction(fullSimTx);
      }
    } catch (err) {
      console.error('Simulation stream error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Background stream simulation every 30 seconds if enabled
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      handleSimulateNew();
    }, 30000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
      />

      {/* Main Content View Container */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'live-monitor' && (
          <LiveMonitor
            transactions={transactions}
            onSelectTransaction={(tx) => setRagSelectedTx(tx)}
            onUpdateStatus={handleUpdateStatus}
            onOpenRag={(tx) => {
              setRagSelectedTx(tx);
              setActiveTab('rag-explainability');
            }}
            onOpenAgent={(tx) => {
              setAgentSelectedTx(tx);
              setActiveTab('agent-workbench');
            }}
            onSimulateNew={handleSimulateNew}
            isEvaluating={isEvaluating}
          />
        )}

        {activeTab === 'rag-explainability' && (
          <RagExplainability
            transactions={transactions}
            activeTx={ragSelectedTx}
            onSelectTx={(tx) => setRagSelectedTx(tx)}
          />
        )}

        {activeTab === 'agent-workbench' && (
          <AgentWorkbench
            activeTransaction={agentSelectedTx}
            transactions={transactions}
          />
        )}

        {activeTab === 'simulator' && (
          <Simulator onAddEvaluatedTransaction={handleAddEvaluatedTransaction} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard data={MOCK_ANALYTICS} />
        )}

        {activeTab === 'docs-knowledge' && (
          <DocsKnowledgeCenter onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
      </main>

      {/* Auth & Role Switcher Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onSelectUser={setUser}
      />
    </div>
  );
}
