import React from 'react';
import { ShieldCheck, Activity, User, ChevronDown, LogIn } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  isStreaming,
  setIsStreaming,
}) => {
  const navTabs = [
    { id: 'live-monitor', label: 'Live Risk Stream' },
    { id: 'rag-explainability', label: 'RAG Explainability' },
    { id: 'agent-workbench', label: 'Agentic AI Workbench' },
    { id: 'simulator', label: 'Simulator & Rules' },
    { id: 'analytics', label: 'Analytics & Retention' },
    { id: 'docs-knowledge', label: 'Docs & Guide' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Status */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-inner flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <span className="font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-transparent">
                  TrustShield <span className="text-blue-500 font-extrabold">AI</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
                  LIVE v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block whitespace-nowrap">
                AI Fraud & Risk Intelligence Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action & Profile Controls */}
          <div className="flex items-center space-x-3">
            {/* Stream Toggle */}
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isStreaming
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${isStreaming ? 'text-emerald-400 animate-spin' : ''}`} />
              <span>{isStreaming ? 'Stream Active' : 'Stream Paused'}</span>
            </button>

            {/* Profile Selector Button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden lg:block">
                <p className="font-semibold text-slate-200 leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400">{user.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-800 space-x-2 no-scrollbar">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
