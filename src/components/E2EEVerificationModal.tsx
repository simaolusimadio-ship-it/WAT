import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Key,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const E2EEVerificationModal: React.FC = () => {
  const { isE2EEOpen, setIsE2EEOpen, currentUser, activeRoom } = useChat();
  const [isVerified, setIsVerified] = useState(true);

  if (!isE2EEOpen) return null;

  // Emoji SAS Verification list
  const sasEmojis = [
    { emoji: '🦊', label: 'Fox' },
    { emoji: '🎸', label: 'Guitar' },
    { emoji: '💎', label: 'Diamond' },
    { emoji: '🚀', label: 'Rocket' },
    { emoji: '🍕', label: 'Pizza' },
    { emoji: '🌴', label: 'Palm Tree' },
    { emoji: '⚡', label: 'Lightning' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                End-to-End Encryption (E2EE)
              </h3>
              <p className="text-xs text-neutral-400">
                Matrix Vodozemac (Rust) • Olm & Megolm Ratchet
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsE2EEOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Room Security Status */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-300">
                Room Encrypted: {activeRoom?.name || 'Active Session'}
              </h4>
              <p className="text-[11px] text-neutral-300 mt-0.5">
                Session ID: <span className="font-mono text-emerald-400">{activeRoom?.e2eeSessionId || 'megolm_sess_8912'}</span>
              </p>
            </div>
          </div>

          {/* Interactive Emoji SAS Match */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Cross-Signing Verification (SAS Emojis)
              </label>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Compare with recipient
              </span>
            </div>
            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Verify that the 7 emoji symbols shown below match exactly on your recipient's screen to guarantee no man-in-the-middle interception:
            </p>

            <div className="grid grid-cols-7 gap-1.5 bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
              {sasEmojis.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 transition-colors"
                >
                  <span className="text-2xl mb-1">{item.emoji}</span>
                  <span className="text-[9px] text-neutral-400 truncate font-mono">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Verified Devices */}
          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2">
              Your Authenticated Matrix Devices
            </label>
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Laptop className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-xs font-semibold text-neutral-200">
                      WAT Web App (Current Browser)
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500">
                      ID: {currentUser.deviceId} • Ed25519: +k91...7F0q
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Verified
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-xs font-semibold text-neutral-200">
                      WAT Flutter Mobile (Pixel 8 / iPhone 15)
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500">
                      ID: FLUTTER_MOBILE_01 • Ed25519: zM23...891P
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Cross-signing keys backed up</span>
          </div>
          <button
            onClick={() => setIsE2EEOpen(false)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md"
          >
            They Match (Confirm)
          </button>
        </div>
      </div>
    </div>
  );
};
