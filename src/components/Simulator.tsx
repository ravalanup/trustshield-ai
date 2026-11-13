import React, { useState } from 'react';
import { 
  Sliders, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight, 
  Zap, 
  Settings2,
  RefreshCw
} from 'lucide-react';
import { Rule, Transaction } from '../types';
import { DEFAULT_RULES } from '../data/mockData';

interface SimulatorProps {
  onAddEvaluatedTransaction: (tx: Transaction) => void;
}

export const Simulator: React.FC<SimulatorProps> = ({ onAddEvaluatedTransaction }) => {
  // Form State
  const [amount, setAmount] = useState<number>(4200.0);
  const [merchantCategory, setMerchantCategory] = useState<string>('Travel & Airlines');
  const [country, setCountry] = useState<string>('Nigeria');
  const [deviceType, setDeviceType] = useState<string>('Linux Desktop');
  const [isVpn, setIsVpn] = useState<boolean>(true);
  const [isNewDevice, setIsNewDevice] = useState<boolean>(true);
  const [avsMatch, setAvsMatch] = useState<boolean>(false);

  // Hybrid Weights
  const [aiWeight, setAiWeight] = useState<number>(60); // 60% AI, 40% Rules

  // Rules State
  const [rules, setRules] = useState<Rule[]>(DEFAULT_RULES);

  // Result state
  const [loading, setLoading] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    const mockTxPayload: Partial<Transaction> = {
      id: `TX-SIM-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      customerName: 'Simulation Test User',
      customerId: 'CUST-SIM-01',
      customerEmail: 'sim.test@trustshield.io',
      accountAgeDays: 30,
      amount: Number(amount),
      currency: 'USD',
      merchantName: 'Sandbox Merchant',
      merchantCategory,
      location: {
        city: 'Lagos',
        country,
        ip: '102.89.44.12',
        ipRiskScore: isVpn ? 85 : 12,
      },
      deviceInfo: {
        deviceType,
        os: 'Linux',
        browser: 'Chrome 125',
        isNewDevice,
        isVpnOrProxy: isVpn,
      },
      cardInfo: {
        brand: 'Visa',
        last4: '9941',
        issuingCountry: 'United States',
        cvvMatch: true,
        avsMatch,
      },
    };

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction: mockTxPayload }),
      });

      const data = await res.json();
      if (data.success && data.evaluation) {
        const evalRes = data.evaluation;
        setLastResult(evalRes);

        const fullTx: Transaction = {
          ...mockTxPayload as Transaction,
          riskScore: evalRes.riskScore,
          riskLevel: evalRes.riskLevel,
          status: evalRes.status,
          riskFactors: evalRes.riskFactors || [],
          aiExplanation: evalRes.aiExplanation,
        };

        onAddEvaluatedTransaction(fullTx);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Real-Time Risk Simulator & Hybrid Policy Engine</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Simulation Sandbox & Rules Weighting
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Test transaction parameters against your dynamic rule set and Gemini AI models in real time before deployment.
            </p>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow-md shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>Run Hybrid Evaluation</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Simulator vs Weight Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Input Parameters */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-blue-400" />
            Test Event Parameters
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Amount ($ USD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Merchant Category</label>
              <select
                value={merchantCategory}
                onChange={(e) => setMerchantCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Travel & Airlines">Travel & Airlines</option>
                <option value="Financial & Crypto">Financial & Crypto</option>
                <option value="Electronics">Electronics</option>
                <option value="Software & SaaS">Software & SaaS</option>
                <option value="Groceries">Groceries</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">IP Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Device Hardware</label>
              <input
                type="text"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs cursor-pointer">
              <span className="font-medium text-slate-300">Proxy / VPN Active</span>
              <input
                type="checkbox"
                checked={isVpn}
                onChange={(e) => setIsVpn(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs cursor-pointer">
              <span className="font-medium text-slate-300">Unrecognized Device Token</span>
              <input
                type="checkbox"
                checked={isNewDevice}
                onChange={(e) => setIsNewDevice(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs cursor-pointer">
              <span className="font-medium text-slate-300">AVS Billing Address Match</span>
              <input
                type="checkbox"
                checked={avsMatch}
                onChange={(e) => setAvsMatch(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
              />
            </label>
          </div>

          {/* Simulation Output Card */}
          {lastResult && (
            <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase text-blue-400">Simulation Score</span>
                <span className="font-mono font-extrabold text-amber-400 text-sm">
                  {lastResult.riskScore} / 100 ({lastResult.riskLevel.toUpperCase()})
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">{lastResult.aiExplanation}</p>
            </div>
          )}
        </div>

        {/* Right Card: Hybrid Model Weighting & Rules Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            Hybrid Model Weight Distribution
          </h3>

          {/* Slider Control */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-blue-400">AI Neural Model ({aiWeight}%)</span>
              <span className="text-indigo-400">Deterministic Hard Rules ({100 - aiWeight}%)</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={aiWeight}
              onChange={(e) => setAiWeight(Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 text-center">
              Adjust balance between predictive neural network signals and fixed compliance rules.
            </p>
          </div>

          {/* Active Rules Toggle List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Hard Rules & Actions
            </h4>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                    rule.enabled
                      ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                      : 'bg-slate-950/20 border-slate-900 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-100">{rule.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        Weight: {rule.weight}x
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{rule.description}</p>
                  </div>

                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="p-1.5 rounded-md hover:bg-slate-800 transition-colors"
                  >
                    {rule.enabled ? (
                      <ToggleRight className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
