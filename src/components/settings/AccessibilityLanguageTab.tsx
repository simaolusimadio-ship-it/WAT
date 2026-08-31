import React from 'react';
import {
  Globe,
  Languages,
  Eye,
  Volume2,
  Mic,
  MessageSquare,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { WATUserSettings } from '../../types/watUserSettings';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const AccessibilityLanguageTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
}) => {
  const acc = settings.accessibility;
  const lang = settings.language;

  const handleAccToggle = (key: keyof typeof acc) => {
    updateSettings((prev) => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [key]: !(prev.accessibility as any)[key],
      },
    }));
    showToast(`Accessibility updated: ${String(key)}`);
  };

  const handleLangChange = (key: keyof typeof lang, val: any) => {
    updateSettings((prev) => ({
      ...prev,
      language: {
        ...prev.language,
        [key]: val,
      },
    }));
    showToast(`Language preference updated: ${String(key)}`);
  };

  return (
    <div className="space-y-6 text-neutral-200 animate-fade-in">
      {/* 29. Language & Real-Time Translation */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">29. 🌍 Language & Real-Time Translation</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">AI LOCALIZED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <label className="text-xs font-bold text-neutral-200">Application Display Language</label>
            <select
              value={lang.appLanguage}
              onChange={(e) => handleLangChange('appLanguage', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-semibold outline-none"
            >
              <option value="English (US)">English (US)</option>
              <option value="Swahili (Kiswahili)">Swahili (Kiswahili)</option>
              <option value="French (Français)">French (Français)</option>
              <option value="Zulu (isiZulu)">Zulu (isiZulu)</option>
              <option value="Yoruba (Èdè Yorùbá)">Yoruba (Èdè Yorùbá)</option>
              <option value="Portuguese (Português)">Portuguese (Português)</option>
              <option value="Arabic (العربية)">Arabic (العربية)</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <label className="text-xs font-bold text-neutral-200">Default Target Translation</label>
            <select
              value={lang.preferredTranslateTarget}
              onChange={(e) => handleLangChange('preferredTranslateTarget', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-semibold outline-none"
            >
              <option value="English">English</option>
              <option value="Swahili">Swahili</option>
              <option value="French">French</option>
              <option value="Yoruba">Yoruba</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-neutral-200">Auto-Translate Incoming Foreign Messages</span>
            <p className="text-[11px] text-neutral-400">
              Uses on-device & Gemini translation models to seamlessly translate multi-lingual chats.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleLangChange('autoTranslateIncoming', !lang.autoTranslateIncoming)}
            className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
              lang.autoTranslateIncoming ? 'bg-emerald-500' : 'bg-neutral-800'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                lang.autoTranslateIncoming ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* 28. Accessibility Controls */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-neutral-100">28. ♿ Accessibility & Universal Usability</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">WCAG AAA READY</span>
        </div>

        <div className="space-y-3">
          {/* Live Captions for Video/Voice Calls */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-200">Live Captions in Calls</span>
              <p className="text-[11px] text-neutral-400">Show real-time speech-to-text captions during voice & video calls.</p>
            </div>
            <button
              type="button"
              onClick={() => handleAccToggle('captionsEnabled')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                acc.captionsEnabled ? 'bg-cyan-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  acc.captionsEnabled ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Voice to text */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-200">Speech-to-Text Voice Dictation</span>
              <p className="text-[11px] text-neutral-400">Transcribe voice recordings into text automatically.</p>
            </div>
            <button
              type="button"
              onClick={() => handleAccToggle('speechToText')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                acc.speechToText ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  acc.speechToText ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* High Contrast Mode */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-200">High Contrast Mode</span>
              <p className="text-[11px] text-neutral-400">Maximize contrast ratios for enhanced legibility.</p>
            </div>
            <button
              type="button"
              onClick={() => handleAccToggle('highContrast')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                acc.highContrast ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  acc.highContrast ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-200">Reduced Motion</span>
              <p className="text-[11px] text-neutral-400">Disable transitions and spring physics animations.</p>
            </div>
            <button
              type="button"
              onClick={() => handleAccToggle('reducedMotion')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                acc.reducedMotion ? 'bg-cyan-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  acc.reducedMotion ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
