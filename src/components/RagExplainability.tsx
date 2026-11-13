import React, { useState } from 'react';
import { 
  Sparkles, 
  Database, 
  GitBranch, 
  FileCheck2, 
  ShieldAlert, 
  RefreshCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Transaction } from '../types';

interface RagExplainabilityProps {
  transactions: Transaction[];
  activeTx: Transaction | null;
  onSelectTx: (tx: Transaction) => void;
}

export const RagExplainability: React.FC<RagExplainabilityProps> = ({
  transactions,
  activeTx,
  onSelectTx,
}) => {
  const selected = activeTx || transactions[0];

  const [loading, setLoading] = useState(false);
  const [explanationData, setExplanationData] = useState<any>(null);

  const handleSynthesizeRAG = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction: selected }),
      });
      const data = await res.json();
      if (data.success && data.explanation) {
        setExplanationData(data.explanation);
      }
    } catch (err) {
      console.error('RAG synthesis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/60 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Retrieval-Augmented Generation (RAG) Context Engine</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Explainable AI & Vector Pattern Matcher
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Eliminate black-box AI risk scoring. RAG retrieves similar historical fraud cases from our vector store to generate clear, regulatory-compliant natural language explanations.
            </p>
          </div>

          <button
            onClick={handleSynthesizeRAG}
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-all shadow-md shadow-blue-600/30 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Cpu className="w-4 h-4 text-blue-200" />
            )}
            <span>Synthesize Gemini RAG Explanation</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Transaction Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Select Event for RAG Analysis
          </h3>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {transactions.map((tx) => {
              const isSelected = selected.id === tx.id;
              return (
                <div
                  key={tx.id}
                  onClick={() => {
                    onSelectTx(tx);
                    setExplanationData(null);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500/50 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="font-mono text-blue-400">{tx.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.riskLevel === 'critical'
                          ? 'bg-rose-500/20 text-rose-400'
                          : tx.riskLevel === 'high'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      Score: {tx.riskScore}
                    </span>
                  </div>
                  <div className="text-xs font-medium mt-1 truncate">
                    ${tx.amount.toLocaleString()} at {tx.merchantName}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {tx.customerName} • {tx.location.country}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle & Right Column: RAG Explanation & Vector Matches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Transaction Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-xs font-mono text-blue-400 font-bold">{selected.id}</span>
                <h3 className="text-base font-bold text-white">
                  ${selected.amount.toLocaleString()} • {selected.merchantName} ({selected.merchantCategory})
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Risk Level: </span>
                <span className="text-xs font-bold uppercase text-amber-400 font-mono">
                  {selected.riskLevel} ({selected.riskScore}/100)
                </span>
              </div>
            </div>

            {/* Synthesized RAG Rationale */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                Gemini Synthesized Executive Rationale
              </h4>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 leading-relaxed space-y-3">
                <p className="font-medium text-blue-200">
                  {explanationData?.summary || selected.aiExplanation || 'Select "Synthesize Gemini RAG Explanation" to generate real-time neural vector context.'}
                </p>

                {explanationData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Root Cause Vector</span>
                      <p className="text-slate-300 mt-0.5">{explanationData.rootCauseAnalysis}</p>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Recommended Ops Action</span>
                      <p className="text-emerald-400 font-medium mt-0.5">{explanationData.recommendedAction}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Decision Tree Attribution Waterfall */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                Risk Score Attribution Waterfall (0 → {selected.riskScore})
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selected.riskFactors.map((rf, idx) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-300 truncate">{rf.name}</span>
                      <span className="text-amber-400 font-mono">+{Math.round(rf.score * rf.weight)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{rf.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RAG Vector Store Matches */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Vector Similarity Matches (Historical Threat DB)
              </h4>

              <div className="space-y-2">
                {(selected.ragMatches || [
                  { caseId: 'CASE-2025-0891', similarity: 0.94, description: 'Cross-border travel ticket purchase via residential proxy.', outcome: 'Confirmed Fraud - Chargeback ($12,400)' },
                  { caseId: 'CASE-2026-0104', similarity: 0.88, description: 'Linux user-agent issuing high-value ticket from proxy.', outcome: 'Confirmed ATO - Recovered' },
                ]).map((match, i) => (
                  <div
                    key={i}
                    className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-emerald-400 font-bold">{match.caseId}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                          {Math.round(match.similarity * 100)}% Similarity
                        </span>
                      </div>
                      <p className="text-slate-300 mt-1">{match.description}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      Outcome: {match.outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
