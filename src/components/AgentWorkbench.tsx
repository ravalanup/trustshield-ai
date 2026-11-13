import React, { useState } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  FileText, 
  Sliders, 
  RefreshCw,
  Terminal
} from 'lucide-react';
import { Transaction, AgentChatMessage } from '../types';

interface AgentWorkbenchProps {
  activeTransaction: Transaction | null;
  transactions: Transaction[];
}

export const AgentWorkbench: React.FC<AgentWorkbenchProps> = ({
  activeTransaction,
  transactions,
}) => {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      text: `Hello! I am your **TrustShield AI Risk Copilot**. I analyze live telemetry, synthesize RAG vector matches, and evaluate rule policies. How can I assist your Risk Operations team today?`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const contextTx = activeTransaction || transactions[0];

  const suggestedPrompts = [
    `Why was transaction ${contextTx?.id || 'TX-9042'} flagged as ${contextTx?.riskLevel || 'critical'}?`,
    `Analyze the last 5 transactions for common proxy or subnet patterns.`,
    `Draft a Suspicious Activity Report (SAR) summary for ${contextTx?.id || 'TX-9042'}.`,
    `What rule threshold changes would reduce false positives for SaaS subscriptions by 10%?`,
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: AgentChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          contextTransaction: contextTx,
        }),
      });

      const data = await res.json();
      const agentReply = data.reply || 'Agent received query.';

      const agentMsg: AgentChatMessage = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: agentReply,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error('Agent chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Agentic Risk Analyst Workbench</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Autonomous AI Risk Copilot
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Interact with TrustShield's autonomous agent to query transaction history, draft SAR regulatory reports, and stress-test risk policies.
          </p>
        </div>

        {contextTx && (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs flex items-center space-x-3">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Active Context Event</p>
              <p className="font-mono text-blue-400 font-bold">{contextTx.id}</p>
            </div>
            <div className="text-right border-l border-slate-800 pl-3">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Risk Score</p>
              <p className="font-mono text-amber-400 font-bold">{contextTx.riskScore}/100</p>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts Bar */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          Suggested Risk Operations Commands
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
            >
              <span className="truncate pr-2">{prompt}</span>
              <Send className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Interface */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[520px] shadow-sm">
        {/* Chat Stream Window */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
          {messages.map((msg) => {
            const isAgent = msg.sender === 'agent';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  isAgent ? 'justify-start' : 'justify-end'
                }`}
              >
                {isAgent && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-xl p-4 text-xs leading-relaxed space-y-2 shadow-sm ${
                    isAgent
                      ? 'bg-slate-900 border border-slate-800 text-slate-200'
                      : 'bg-blue-600 text-white font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-1 text-[10px] opacity-75">
                    <span className="font-bold">{isAgent ? 'TrustShield AI Agent' : 'Risk Analyst'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className="whitespace-pre-line">{msg.text}</div>
                </div>

                {!isAgent && (
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-indigo-400 p-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>TrustShield Agent analyzing live vector embeddings & rules...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Ask TrustShield AI Agent about risk models, SAR drafting, or rule tuning..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-all flex items-center space-x-1.5 disabled:opacity-50"
          >
            <span>Ask Agent</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
