import React, { useState } from 'react';
import {
  X,
  Settings,
  Server,
  Volume2,
  VolumeX,
  Shield,
  Key,
  Database,
  Moon,
  Smartphone,
  Check,
  Video,
  ExternalLink,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { soundEngine } from '../utils/audioSynth';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    currentUser,
    jitsiServerConfig,
    setJitsiServerConfig,
    setIsJitsiDevOpsOpen,
  } = useChat();

  const [homeserverUrl, setHomeserverUrl] = useState('https://matrix.wat.chat');
  const [jitsiDomain, setJitsiDomain] = useState(jitsiServerConfig.serverDomain);
  const [soundsEnabled, setSoundsEnabled] = useState(soundEngine.isSoundMuted() ? false : true);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isSettingsOpen) return null;

  const handleToggleSound = () => {
    const nextState = !soundsEnabled;
    setSoundsEnabled(nextState);
    soundEngine.setMuted(!nextState);
    if (nextState) {
      soundEngine.playMessageSent();
    }
  };

  const handleSave = () => {
    setJitsiServerConfig((prev) => ({
      ...prev,
      serverDomain: jitsiDomain.trim() || 'meet.wat.chat',
      isCustomServer: true,
    }));
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setIsSettingsOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-800 text-neutral-200 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                WAT Settings & Preferences
              </h3>
              <p className="text-xs text-neutral-400">
                Matrix homeserver, sound synthesizers & security
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* User Profile Card */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="text-sm font-bold text-neutral-100">{currentUser.name}</h4>
              <p className="text-xs font-mono text-emerald-400">{currentUser.handle}</p>
              <p className="text-[11px] text-neutral-500">{currentUser.location}</p>
            </div>
          </div>

          {/* Matrix Homeserver */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
              Matrix Homeserver URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={homeserverUrl}
                onChange={(e) => setHomeserverUrl(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-200"
              />
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded-lg">
                Connected
              </span>
            </div>
          </div>

          {/* Jitsi Meet Video Conference Server */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-neutral-200">
                  Self-Hosted Jitsi Meet Server
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsJitsiDevOpsOpen(true);
                }}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>DevOps Guide</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={jitsiDomain}
                onChange={(e) => setJitsiDomain(e.target.value)}
                placeholder="meet.wat.chat"
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs font-mono text-neutral-200"
              />
              <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-[10px] font-mono rounded-lg">
                FQDN
              </span>
            </div>
            <p className="text-[10px] text-neutral-500">
              Configured domain for SFU WebRTC audio/video calls and multi-party conferences.
            </p>
          </div>

          {/* Audio Synthesizer Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-2.5">
              {soundsEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-neutral-500" />
              )}
              <div>
                <div className="text-xs font-semibold text-neutral-200">
                  Web Audio Synthesizer Effects
                </div>
                <div className="text-[10px] text-neutral-400">
                  Synthesized chimes for sent, received, and call rings
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                soundsEnabled ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  soundsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* E2EE Backup */}
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Key className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-semibold text-neutral-200">
                  Cryptographic Key Backup
                </div>
                <div className="text-[10px] text-neutral-400">
                  Megolm ratchet sessions secured with passphrase
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              ACTIVE
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-neutral-500">
            WAT Messenger v1.0.0
          </span>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md flex items-center gap-1"
          >
            {savedNotice ? <Check className="w-4 h-4" /> : null}
            <span>{savedNotice ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
