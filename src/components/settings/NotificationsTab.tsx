import React from 'react';
import {
  Bell,
  Volume2,
  VolumeX,
  Vibrate,
  Smartphone,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { WATUserSettings } from '../../types/watUserSettings';
import { soundEngine } from '../../utils/audioSynth';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const NotificationsTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const notif = settings.notifications;

  const handleToggle = (key: keyof typeof notif) => {
    const nextVal = !(notif as any)[key];
    updateSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: nextVal,
      },
    }));

    if (key === 'conversationTones') {
      soundEngine.setMuted(!nextVal);
      if (nextVal) {
        soundEngine.playMessageSent();
      }
    }
    showToast(`Notification setting updated: ${String(key)}`);
  };

  const handleSelect = (key: keyof typeof notif, val: string) => {
    updateSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: val,
      },
    }));
    showToast(`Updated ${String(key)}`);
  };

  const handleTestSound = () => {
    soundEngine.playMessageReceived();
    showToast('Testing notification chime audio...');
  };

  return (
    <div className="space-y-6 text-neutral-200 animate-fade-in">
      {/* 7. Conversation Tones & Sound Engine */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">7. 🔔 Conversation Tones & Sound Engine</h3>
          </div>
          <button
            type="button"
            onClick={handleTestSound}
            className="px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-emerald-400 border border-neutral-700 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Sound</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {notif.conversationTones ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-neutral-500" />
              )}
              <span className="text-xs font-bold text-neutral-200">In-App Web Audio Synthesizer Tones</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Play real-time synthesized harmonic chimes for incoming and outgoing messages.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('conversationTones')}
            className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
              notif.conversationTones ? 'bg-emerald-500' : 'bg-neutral-800'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                notif.conversationTones ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Message & Group Alerts */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-neutral-100">Messages & Group Notifications</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Message Notification Sound */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <label className="text-xs font-bold text-neutral-200">Message Notification Tone</label>
            <select
              value={notif.messageSound}
              onChange={(e) => handleSelect('messageSound', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-semibold outline-none"
            >
              <option value="WAT Chime Pulse (Web Audio Synth)">WAT Chime Pulse (Default)</option>
              <option value="Marimba Drop">Marimba Harmonic Drop</option>
              <option value="Savanna Kalimba">Savanna Kalimba Ping</option>
              <option value="Silent">Silent</option>
            </select>
          </div>

          {/* Message Vibration */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <label className="text-xs font-bold text-neutral-200">Message Vibration</label>
            <select
              value={notif.messageVibrate}
              onChange={(e) => handleSelect('messageVibrate', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-semibold outline-none"
            >
              <option value="default">Default</option>
              <option value="short">Short</option>
              <option value="long">Long</option>
              <option value="off">Off</option>
            </select>
          </div>

          {/* Group Notification Tone */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <label className="text-xs font-bold text-neutral-200">Group Chat Tone</label>
            <select
              value={notif.groupSound}
              onChange={(e) => handleSelect('groupSound', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-semibold outline-none"
            >
              <option value="WAT Soft Bell">WAT Soft Bell</option>
              <option value="Gentle Echo">Gentle Echo</option>
              <option value="Silent">Silent</option>
            </select>
          </div>

          {/* Call Ringtone */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <label className="text-xs font-bold text-neutral-200">Call Ringtone</label>
            <select
              value={notif.callRingtone}
              onChange={(e) => handleSelect('callRingtone', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-semibold outline-none"
            >
              <option value="WAT Harmonic Sine Loop">WAT Harmonic Sine Loop</option>
              <option value="African Balafon Rhythms">African Balafon Rhythms</option>
              <option value="Classic Electronic Ring">Classic Electronic Ring</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-200">High Priority Notifications</span>
              <p className="text-[11px] text-neutral-400">Show previews of notifications at the top of the screen.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('highPriorityAlerts')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                notif.highPriorityAlerts ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  notif.highPriorityAlerts ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-200">Preview Message Text on Lock-Screen</span>
              <p className="text-[11px] text-neutral-400">Hide message snippets for enhanced privacy.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('previewText')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                notif.previewText ? 'bg-cyan-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  notif.previewText ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
