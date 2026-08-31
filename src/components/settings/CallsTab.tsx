import React, { useState } from 'react';
import {
  PhoneCall,
  Video,
  Mic,
  Volume2,
  Server,
  Shield,
  ExternalLink,
  PhoneOff,
  Radio,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { WATUserSettings } from '../../types/watUserSettings';
import { useChat } from '../../context/ChatContext';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const CallsTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const { jitsiServerConfig, setJitsiServerConfig, setIsJitsiDevOpsOpen } = useChat();
  const c = settings.calls;
  const [jitsiInput, setJitsiInput] = useState(jitsiServerConfig.serverDomain || c.jitsiServerDomain);

  const handleToggle = (key: keyof typeof c) => {
    updateSettings((prev) => ({
      ...prev,
      calls: {
        ...prev.calls,
        [key]: !(prev.calls as any)[key],
      },
    }));
    showToast(`Call setting updated: ${String(key)}`);
  };

  const handleSaveJitsiDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const domain = jitsiInput.trim() || 'meet.wat.chat';
    setJitsiServerConfig((prev) => ({
      ...prev,
      serverDomain: domain,
      isCustomServer: true,
    }));
    updateSettings((prev) => ({
      ...prev,
      calls: {
        ...prev.calls,
        jitsiServerDomain: domain,
      },
    }));
    showToast(`Configured SFU WebRTC domain: ${domain}`);
  };

  return (
    <div className="space-y-6 text-neutral-200 animate-fade-in">
      {/* 10. Voice & Video Calls Experience */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">10. 📞 Voice & Video Calling Engine</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">WEBRTC SFU ENABLED</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-neutral-200">Self-Hosted Jitsi Meet / Matrix SFU Domain</span>
            </div>
            <button
              type="button"
              onClick={() => setIsJitsiDevOpsOpen(true)}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>DevOps Handbook</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <form onSubmit={handleSaveJitsiDomain} className="flex gap-2">
            <input
              type="text"
              value={jitsiInput}
              onChange={(e) => setJitsiInput(e.target.value)}
              placeholder="meet.wat.chat"
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-200 outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-sm"
            >
              Update Domain
            </button>
          </form>
          <p className="text-[10px] text-neutral-400">
            Dedicated Videobridge with end-to-end encrypted audio/video streams, screen sharing, and tile view.
          </p>
        </div>

        {/* Audio Processing Toggles */}
        <div className="space-y-3 pt-2">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-200">AI Background Noise Suppression</span>
              <p className="text-[11px] text-neutral-400">Isolate spoken voice and filter background ambient noise.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('noiseSuppression')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                c.noiseSuppression ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  c.noiseSuppression ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-200">Acoustic Echo Cancellation</span>
              <p className="text-[11px] text-neutral-400">Prevent feedback loop when using device speakerphone.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('echoCancellation')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                c.echoCancellation ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  c.echoCancellation ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-200">Screen Sharing During Video Calls</span>
              <p className="text-[11px] text-neutral-400">Allow 1080p 60fps screen presentation in conferences.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('screenSharingEnabled')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                c.screenSharingEnabled ? 'bg-cyan-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  c.screenSharingEnabled ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
