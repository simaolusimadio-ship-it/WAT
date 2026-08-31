import React from 'react';
import {
  MessageSquare,
  Palette,
  Image,
  Type,
  CornerDownLeft,
  Eye,
  Archive,
  CloudUpload,
  Download,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { WATUserSettings } from '../../types/watUserSettings';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const ChatsAppearanceTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const ch = settings.chats;

  const handleChatSettingChange = (key: keyof typeof ch, val: any) => {
    updateSettings((prev) => ({
      ...prev,
      chats: {
        ...prev.chats,
        [key]: val,
      },
    }));
    showToast(`Chat preference updated: ${String(key)}`);
  };

  const handleToggle = (key: keyof typeof ch) => {
    updateSettings((prev) => ({
      ...prev,
      chats: {
        ...prev.chats,
        [key]: !(prev.chats as any)[key],
      },
    }));
    showToast(`Chat setting toggled: ${String(key)}`);
  };

  const handleTriggerBackup = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updateSettings((prev) => ({
      ...prev,
      chats: {
        ...prev.chats,
        lastBackupTime: `Today at ${timeNow}`,
      },
    }));
    showToast('Encrypted Matrix backup completed successfully!');
  };

  return (
    <div className="space-y-6 text-neutral-200 animate-fade-in">
      {/* 6. Chat Themes & Appearance Personalization */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">6. 🎨 Themes & Personalization Engine</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">HIGH-CONTRAST READY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'dark', label: 'Dark Obsidian', bg: 'bg-neutral-950', border: 'border-neutral-800' },
            { id: 'light', label: 'Crisp Light', bg: 'bg-neutral-100 text-neutral-900', border: 'border-neutral-300' },
            { id: 'midnight', label: 'Midnight Blue', bg: 'bg-slate-950', border: 'border-blue-900/50' },
            { id: 'matrix', label: 'Matrix Terminal', bg: 'bg-black', border: 'border-emerald-500/50 text-emerald-400' },
            { id: 'safari', label: 'Safari Ochre', bg: 'bg-stone-950', border: 'border-amber-700/50 text-amber-300' },
            { id: 'system', label: 'System Default', bg: 'bg-neutral-900', border: 'border-neutral-700' },
          ].map((themeOpt) => (
            <button
              key={themeOpt.id}
              type="button"
              onClick={() => handleChatSettingChange('theme', themeOpt.id)}
              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                themeOpt.bg
              } ${
                ch.theme === themeOpt.id
                  ? 'ring-2 ring-emerald-400 border-emerald-400 shadow-md'
                  : themeOpt.border
              }`}
            >
              <span className="text-xs font-bold">{themeOpt.label}</span>
              {ch.theme === themeOpt.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </button>
          ))}
        </div>

        {/* Font Size & Wallpaper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-cyan-400" />
              <label className="text-xs font-bold text-neutral-200">Chat Font Size</label>
            </div>
            <div className="flex gap-2">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleChatSettingChange('fontSize', size)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize border ${
                    ch.fontSize === size
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-amber-400" />
              <label className="text-xs font-bold text-neutral-200">Chat Wallpaper</label>
            </div>
            <select
              value={ch.wallpaper}
              onChange={(e) => handleChatSettingChange('wallpaper', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-semibold outline-none"
            >
              <option value="matrix-subtle">WAT Matrix Subtle (Default)</option>
              <option value="solid-dark">Solid Obsidian Black</option>
              <option value="african-geometric">African Geometric Pattern</option>
              <option value="warm-sunset">Warm Savanna Gradient</option>
            </select>
          </div>
        </div>
      </section>

      {/* 5. Chat Interaction & History */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-neutral-100">Chat Behavior & Media Visibility</h3>

        <div className="space-y-3">
          {/* Enter key behavior */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CornerDownLeft className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-neutral-200">Enter is Send</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Enter key will send your message instead of adding a new line.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('enterIsSend')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                ch.enterIsSend ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  ch.enterIsSend ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Media Visibility */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-neutral-200">Media Visibility in Gallery</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Show newly downloaded media in your phone's photo library and gallery.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('mediaVisibility')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                ch.mediaVisibility ? 'bg-cyan-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  ch.mediaVisibility ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Keep Chats Archived */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-neutral-200">Keep Chats Archived</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Archived chats will remain archived when a new message is received.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('keepChatsArchived')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                ch.keepChatsArchived ? 'bg-amber-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  ch.keepChatsArchived ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Chat Backup & Transfer */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <CloudUpload className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">Chat Backup & Transfer</h3>
          </div>
          <span className="text-xs font-mono text-neutral-400">{ch.backupSize}</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-neutral-200">Last Matrix Cloud Backup</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">{ch.lastBackupTime}</div>
            <div className="text-[10px] text-neutral-400 mt-1">
              Auto-backup schedule: <span className="capitalize font-semibold text-neutral-300">{ch.chatBackupFrequency}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTriggerBackup}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            Back Up Now
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => showToast('Chat export ZIP created with attached media!')}
            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center gap-3 text-left transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-xs font-bold text-neutral-200">Export Chat History</div>
              <div className="text-[10px] text-neutral-400">Download formatted JSON/TXT logs</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => showToast('All inactive chats moved to archive.')}
            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center gap-3 text-left transition-colors"
          >
            <Archive className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-xs font-bold text-neutral-200">Archive All Chats</div>
              <div className="text-[10px] text-neutral-400">Keep inbox uncluttered</div>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};
