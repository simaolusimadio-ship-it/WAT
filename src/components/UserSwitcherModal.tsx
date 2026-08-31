import React from 'react';
import { X, Check, Users, ShieldCheck, Sparkles, Store, Settings } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const UserSwitcherModal: React.FC = () => {
  const { isUserSwitcherOpen, setIsUserSwitcherOpen, users, currentUser, setCurrentUserById, setIsSettingsOpen } = useChat();

  if (!isUserSwitcherOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl w-full max-w-md shadow-[0_24px_48px_rgba(0,0,0,0.14)] overflow-hidden text-neutral-900">
        {/* Header */}
        <div className="px-6 py-4 bg-white/80 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-900">
                Switch Matrix Account
              </h3>
              <p className="text-xs text-neutral-500">
                Simulate different clients, merchant accounts, and AI bots
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUserSwitcherOpen(false)}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-black hover:bg-black/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User list */}
        <div className="p-4 space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
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
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.05] text-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-black/10"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                        u.isOnline ? 'bg-emerald-500' : 'bg-neutral-400'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-neutral-900'}`}>{u.name}</h4>
                      {u.isVerified && (
                        <ShieldCheck className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-900'}`} />
                      )}
                      {u.id === 'user_business' && (
                        <Store className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-900'}`} />
                      )}
                      {u.id === 'user_ai' && (
                        <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-900'}`} />
                      )}
                    </div>
                    <div className={`text-[11px] font-mono ${isActive ? 'text-white/80' : 'text-neutral-500'}`}>
                      {u.handle}
                    </div>
                    <div className={`text-[10px] truncate max-w-[200px] ${isActive ? 'text-white/70' : 'text-neutral-500'}`}>
                      {u.statusMessage || u.location}
                    </div>
                  </div>
                </div>

                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-sm">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white/80 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <span>Session Protocol: Matrix 2.0 (OIDC)</span>
          <button
            onClick={() => {
              setIsUserSwitcherOpen(false);
              setIsSettingsOpen(true);
            }}
            className="hover:text-black flex items-center gap-1 transition-colors font-sans font-semibold text-neutral-700"
          >
            <Settings className="w-3 h-3" />
            <span>Manage Profiles</span>
          </button>
        </div>
      </div>
    </div>
  );
};
