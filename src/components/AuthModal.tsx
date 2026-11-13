import React from 'react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  const profiles: UserProfile[] = [
    {
      name: 'Alex Vance',
      email: 'alex.vance@fintechpay.io',
      role: 'Head of Risk Operations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      provider: 'google',
    },
    {
      name: 'Sarah Chen',
      email: 'sarah.chen@payments.co',
      role: 'Payments Product Manager',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      provider: 'github',
    },
    {
      name: 'Marcus Thorne',
      email: 'm.thorne@compliance.gov',
      role: 'Compliance Officer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      provider: 'google',
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">TrustShield AI Authentication</h3>
            <p className="text-xs text-slate-400">Select active team persona or simulated OAuth profile</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onSelectUser(profiles[0]);
              onClose();
            }}
            className="w-full flex items-center justify-center space-x-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-4 rounded-xl border border-slate-700 text-xs transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google OAuth</span>
          </button>

          <button
            onClick={() => {
              onSelectUser(profiles[1]);
              onClose();
            }}
            className="w-full flex items-center justify-center space-x-3 bg-slate-950 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl border border-slate-700 text-xs transition-all"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Sign in with GitHub OAuth</span>
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-slate-500">
            Or Switch Active Role Persona
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Profile List */}
        <div className="space-y-2">
          {profiles.map((p, idx) => {
            const isSelected = p.email === currentUser.email;
            return (
              <div
                key={idx}
                onClick={() => {
                  onSelectUser(p);
                  onClose();
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-600/10 border-blue-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-white">{p.name}</div>
                  <div className="text-[11px] text-blue-400 font-medium">{p.role}</div>
                  <div className="text-[10px] text-slate-500">{p.email}</div>
                </div>
                {isSelected && <span className="text-xs font-bold text-blue-400">Active ✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
