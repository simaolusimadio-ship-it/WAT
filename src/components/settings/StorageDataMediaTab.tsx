import React from 'react';
import {
  HardDrive,
  Wifi,
  Radio,
  FileText,
  Image,
  Video,
  Music,
  Trash2,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { WATUserSettings } from '../../types/watUserSettings';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const StorageDataMediaTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const st = settings.storage;
  const auto = st.mediaAutoDownload;

  const handleAutoDownloadToggle = (
    network: 'mobileData' | 'wifi' | 'roaming',
    mediaType: 'photos' | 'audio' | 'videos' | 'documents'
  ) => {
    updateSettings((prev) => ({
      ...prev,
      storage: {
        ...prev.storage,
        mediaAutoDownload: {
          ...prev.storage.mediaAutoDownload,
          [network]: {
            ...prev.storage.mediaAutoDownload[network],
            [mediaType]: !prev.storage.mediaAutoDownload[network][mediaType],
          },
        },
      },
    }));
    showToast(`Updated auto-download for ${mediaType} on ${network}`);
  };

  const handleLowDataToggle = () => {
    updateSettings((prev) => ({
      ...prev,
      storage: {
        ...prev.storage,
        useLessDataForCalls: !prev.storage.useLessDataForCalls,
      },
    }));
    showToast(`Low data mode ${!st.useLessDataForCalls ? 'enabled' : 'disabled'}`);
  };

  const handleClearCache = (type: string) => {
    showToast(`Cleared temporary ${type} cache! Freeing space.`);
  };

  return (
    <div className="space-y-6 text-neutral-200 animate-fade-in">
      {/* 8. Manage Storage Visualizer */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">8. 💾 Storage Management & Files</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {(st.storageUsedMB / 1024).toFixed(1)} GB of {(st.totalStorageMB / 1024).toFixed(0)} GB USED
          </span>
        </div>

        {/* Multi-color Storage Bar */}
        <div className="space-y-2">
          <div className="w-full h-4 rounded-full bg-neutral-950 border border-neutral-800 overflow-hidden flex">
            <div style={{ width: '45%' }} className="bg-emerald-500 h-full" title="Photos" />
            <div style={{ width: '30%' }} className="bg-cyan-500 h-full" title="Videos" />
            <div style={{ width: '15%' }} className="bg-amber-500 h-full" title="Audio & Voice" />
            <div style={{ width: '10%' }} className="bg-indigo-500 h-full" title="Documents" />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Photos ({st.photosMB} MB)
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Videos ({st.videosMB} MB)
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Voice & Audio ({st.audioMB} MB)
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Documents ({st.docsMB} MB)
            </span>
          </div>
        </div>

        {/* Quick Clean Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleClearCache('large files (>5MB)')}
            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-left transition-colors"
          >
            <div>
              <div className="text-xs font-bold text-neutral-200">Review & Delete Large Files</div>
              <div className="text-[10px] text-neutral-400">Files forwarded frequently or &gt; 5MB</div>
            </div>
            <Trash2 className="w-4 h-4 text-rose-400" />
          </button>

          <button
            type="button"
            onClick={() => handleClearCache('voice notes')}
            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-left transition-colors"
          >
            <div>
              <div className="text-xs font-bold text-neutral-200">Clear Voice Note Cache</div>
              <div className="text-[10px] text-neutral-400">Keeps recordings saved in matrix rooms</div>
            </div>
            <Trash2 className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </section>

      {/* 9. Media Auto-Download Matrix */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-neutral-100">9. 📡 Media Auto-Download Controls</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">DATA SAVER</span>
        </div>

        <p className="text-xs text-neutral-400">
          Voice messages are always automatically downloaded for the best communication experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mobile Data */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-amber-400" /> When Using Mobile Data
            </div>
            {(['photos', 'audio', 'videos', 'documents'] as const).map((type) => (
              <label key={type} className="flex items-center justify-between text-xs text-neutral-300 capitalize cursor-pointer">
                <span>{type}</span>
                <input
                  type="checkbox"
                  checked={auto.mobileData[type]}
                  onChange={() => handleAutoDownloadToggle('mobileData', type)}
                  className="rounded border-neutral-700 text-emerald-500 focus:ring-0 bg-neutral-900"
                />
              </label>
            ))}
          </div>

          {/* Wi-Fi */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-emerald-400" /> When Connected on Wi-Fi
            </div>
            {(['photos', 'audio', 'videos', 'documents'] as const).map((type) => (
              <label key={type} className="flex items-center justify-between text-xs text-neutral-300 capitalize cursor-pointer">
                <span>{type}</span>
                <input
                  type="checkbox"
                  checked={auto.wifi[type]}
                  onChange={() => handleAutoDownloadToggle('wifi', type)}
                  className="rounded border-neutral-700 text-emerald-500 focus:ring-0 bg-neutral-900"
                />
              </label>
            ))}
          </div>

          {/* Roaming */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-400" /> When Roaming
            </div>
            {(['photos', 'audio', 'videos', 'documents'] as const).map((type) => (
              <label key={type} className="flex items-center justify-between text-xs text-neutral-300 capitalize cursor-pointer">
                <span>{type}</span>
                <input
                  type="checkbox"
                  checked={auto.roaming[type]}
                  onChange={() => handleAutoDownloadToggle('roaming', type)}
                  className="rounded border-neutral-700 text-emerald-500 focus:ring-0 bg-neutral-900"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Low Data Mode for Calls */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between mt-2">
          <div className="space-y-1">
            <span className="text-xs font-bold text-neutral-200">Use Less Data for Calls (Opus Codec)</span>
            <p className="text-[11px] text-neutral-400">
              Lowers audio bitrates on mobile cellular networks to save bandwidth.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLowDataToggle}
            className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
              st.useLessDataForCalls ? 'bg-emerald-500' : 'bg-neutral-800'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                st.useLessDataForCalls ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>
    </div>
  );
};
