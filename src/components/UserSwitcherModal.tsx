import React from 'react';
import { X, Check, Users, ShieldCheck, Sparkles, Store } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const UserSwitcherModal: React.FC = () => {
  const { isUserSwitcherOpen, setIsUserSwitcherOpen, users, currentUser, setCurrentUserById } = useChat();

  if (!isUserSwitcherOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                Switch Matrix Account
              </h3>
              <p className="text-xs text-neutral-400">
                Simulate different clients, merchant accounts, and AI bots
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUserSwitcherOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User list */}
        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
          {users.map((u) => {
            const isActive = u.id === currentUser.id;
            return (
              <div
                key={u.id}
                onClick={() => {
                  setCurrentUserById(u.id);
                  setIsUserSwitcherOpen(false);
                }}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 border-emerald-400/80 shadow-md ring-1 ring-emerald-400'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-neutral-800"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-neutral-900 ${
                        u.isOnline ? 'bg-emerald-500' : 'bg-neutral-600'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-neutral-100">{u.name}</h4>
                      {u.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {u.id === 'user_business' && (
                        <Store className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      {u.id === 'user_ai' && (
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400">
                      {u.handle}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate max-w-[200px]">
                      {u.statusMessage || u.location}
                    </div>
                  </div>
                </div>

                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center font-bold">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-neutral-950/80 border-t border-neutral-800 text-[11px] text-neutral-500 font-mono text-center">
          Authenticated Session: Matrix Synapse (Rust Vodozemac)
        </div>
      </div>
    </div>
  );
};
