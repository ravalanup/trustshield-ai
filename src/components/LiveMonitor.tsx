import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  ShieldAlert, 
  Zap, 
  Globe, 
  Smartphone, 
  CreditCard,
  MessageSquareCode,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Transaction, RiskLevel } from '../types';

interface LiveMonitorProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onUpdateStatus: (id: string, status: 'approved' | 'declined' | 'review') => void;
  onOpenRag: (tx: Transaction) => void;
  onOpenAgent: (tx: Transaction) => void;
  onSimulateNew: () => void;
  isEvaluating: boolean;
}

export const LiveMonitor: React.FC<LiveMonitorProps> = ({
  transactions,
  onSelectTransaction,
  onUpdateStatus,
  onOpenRag,
  onOpenAgent,
  onSimulateNew,
  isEvaluating,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.location.country.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === 'all' || tx.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (level: RiskLevel, score: number) => {
    switch (level) {
      case 'critical':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1.5"></span>
            CRITICAL ({score})
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            HIGH ({score})
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
            MEDIUM ({score})
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            LOW ({score})
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-950 text-rose-300 border border-rose-800">
            <XCircle className="w-3 h-3 mr-1" /> Declined
          </span>
        );
      case 'review':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-950 text-amber-300 border border-amber-800">
            <AlertTriangle className="w-3 h-3 mr-1" /> In Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Impact KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">Total Evaluated Today</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-extrabold text-white">56,100</p>
            <span className="text-xs font-semibold text-emerald-400">+12% vs avg</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Real-time latency: 18ms</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">Fraud Rate</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-extrabold text-rose-400">0.42%</p>
            <span className="text-xs font-semibold text-emerald-400">↓ 35% reduction</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Model accuracy: 99.4%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">False Positive Rate</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-extrabold text-amber-300">1.8%</p>
            <span className="text-xs font-semibold text-emerald-400">↓ 25% drop</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Saves customer friction</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">Prevented Fraud Losses</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-extrabold text-emerald-400">$8,420,000</p>
            <span className="text-xs font-semibold text-blue-400">Annualized</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Modeled ROI: 12.4x</p>
        </div>
      </div>

      {/* Action & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Customer, Merchant, Country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risk Tiers</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        <button
          onClick={onSimulateNew}
          disabled={isEvaluating}
          className="w-full md:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
        >
          {isEvaluating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
          )}
          <span>Simulate Incoming Live Event</span>
        </button>
      </div>

      {/* Main Transactions Stream Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              Real-Time Risk Telemetry Stream
            </h3>
            <p className="text-xs text-slate-400">
              Transactions evaluated in real-time by TrustShield Hybrid Rules + Gemini AI
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Showing {filtered.length} of {transactions.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Customer & Account</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Merchant & Category</th>
                <th className="py-3 px-4">Geography & IP</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
              {filtered.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => setSelectedTx(tx)}
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-blue-400">
                    {tx.id}
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{tx.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {tx.customerId} • {tx.accountAgeDays}d old
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-100 font-mono">
                      ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">{tx.currency}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-200 font-medium">{tx.merchantName}</div>
                    <div className="text-[10px] font-medium text-slate-400">
                      {tx.merchantCategory}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1 text-slate-300">
                      <Globe className="w-3 h-3 text-slate-500" />
                      <span>
                        {tx.location.city}, {tx.location.country}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      IP: {tx.location.ip}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {getRiskBadge(tx.riskLevel, tx.riskScore)}
                  </td>

                  <td className="py-3.5 px-4">{getStatusBadge(tx.status)}</td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        title="View RAG Explanation"
                        onClick={() => onOpenRag(tx)}
                        className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-blue-400" />
                      </button>

                      <button
                        title="Query Agent Analyst"
                        onClick={() => onOpenAgent(tx)}
                        className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
                      >
                        <MessageSquareCode className="w-4 h-4 text-indigo-400" />
                      </button>

                      {tx.status === 'review' && (
                        <>
                          <button
                            title="Approve Transaction"
                            onClick={() => onUpdateStatus(tx.id, 'approved')}
                            className="p-1.5 rounded-md hover:bg-emerald-950 text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            title="Decline Transaction"
                            onClick={() => onUpdateStatus(tx.id, 'declined')}
                            className="p-1.5 rounded-md hover:bg-rose-950 text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Drawer / Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-blue-400">{selectedTx.id}</span>
                  {getRiskBadge(selectedTx.riskLevel, selectedTx.riskScore)}
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  ${selectedTx.amount.toLocaleString()} at {selectedTx.merchantName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* AI Explanation Banner */}
            <div className="bg-slate-950 border border-blue-500/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-400">
                <Sparkles className="w-4 h-4" />
                <span>AI Risk Assessment & RAG Rationale</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedTx.aiExplanation || 'Evaluated by TrustShield AI Risk Model.'}
              </p>
            </div>

            {/* Primary Risk Factors */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Risk Signals
              </h4>
              <div className="space-y-2">
                {selectedTx.riskFactors.map((rf, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-200">{rf.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                          {rf.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{rf.description}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-400">
                      Score: {rf.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device & Geolocation Hardware Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-3 space-y-1">
                <div className="flex items-center text-xs text-slate-400 gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Device Fingerprint</span>
                </div>
                <p className="text-xs font-medium text-slate-200">
                  {selectedTx.deviceInfo.deviceType} ({selectedTx.deviceInfo.os})
                </p>
                <div className="text-[11px] text-slate-400">
                  {selectedTx.deviceInfo.isNewDevice ? '⚠️ New Hardware ID' : '✓ Known Device'}
                  {selectedTx.deviceInfo.isVpnOrProxy ? ' • ⚠️ VPN Active' : ''}
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-3 space-y-1">
                <div className="flex items-center text-xs text-slate-400 gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Card & AVS Status</span>
                </div>
                <p className="text-xs font-medium text-slate-200">
                  {selectedTx.cardInfo.brand} •••• {selectedTx.cardInfo.last4}
                </p>
                <div className="text-[11px] text-slate-400">
                  CVV: {selectedTx.cardInfo.cvvMatch ? '✓ Match' : '❌ Fail'} • AVS:{' '}
                  {selectedTx.cardInfo.avsMatch ? '✓ Match' : '❌ Fail'}
                </div>
              </div>
            </div>

            {/* Quick Decision Actions */}
            <div className="pt-4 border-t border-slate-800 flex gap-3">
              <button
                onClick={() => {
                  onUpdateStatus(selectedTx.id, 'approved');
                  setSelectedTx(null);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all"
              >
                Approve Transaction
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(selectedTx.id, 'declined');
                  setSelectedTx(null);
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all"
              >
                Decline & Block Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
