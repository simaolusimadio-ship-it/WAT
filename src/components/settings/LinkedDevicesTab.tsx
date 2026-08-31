import React, { useState } from 'react';
import {
  Laptop,
  Smartphone,
  Tablet,
  QrCode,
  LogOut,
  Shield,
  Clock,
  MapPin,
  CheckCircle2,
  X,
} from 'lucide-react';
import { WATUserSettings, LinkedDeviceSession } from '../../types/watUserSettings';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const LinkedDevicesTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const devices = settings.linkedDevices;
  const [showQRModal, setShowQRModal] = useState(false);

  const handleLogoutDevice = (id: string) => {
    updateSettings((prev) => ({
      ...prev,
      linkedDevices: prev.linkedDevices.filter((d) => d.id !== id),
    }));
    showToast('Device logged out remotely.');
  };

  const handleSimulateNewLink = () => {
    const newSession: LinkedDeviceSession = {
      id: `dev-${Date.now()}`,
      name: 'Firefox on Linux (Ubuntu 24.04)',
      deviceType: 'desktop',
      os: 'Linux x86_64',
      browser: 'Mozilla Firefox 129.0',
      lastActive: 'Just linked',
      location: 'Nairobi, Kenya',
      ipAddress: '197.232.88.14',
      isCurrent: false,
    };
    updateSettings((prev) => ({
      ...prev,
      linkedDevices: [...prev.linkedDevices, newSession],
    }));
    setShowQRModal(false);
    showToast('New device successfully paired via E2EE QR Code!');
  };

  return (
    <div className="space-y-6 text-neutral-200 animate-fade-in">
      {/* 14. Linked Devices Hub */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-100">14. 💻 Linked Devices & Multi-Client</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Use WAT on Web, Desktop, and tablets without keeping your phone online.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowQRModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Link a Device</span>
          </button>
        </div>

        {/* QR Linking Modal */}
        {showQRModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-neutral-100">Scan QR Code to Link</h4>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
                {/* SVG QR Code Simulation */}
                <div className="w-48 h-48 bg-neutral-950 rounded-xl p-3 flex flex-col items-center justify-center text-emerald-400">
                  <QrCode className="w-36 h-36" />
                  <span className="text-[10px] font-mono mt-1 text-neutral-400">WAT_MATRIX_PAIR_KEY</span>
                </div>
              </div>

              <p className="text-xs text-neutral-400">
                Point your WAT camera at <span className="text-neutral-200 font-mono">web.wat.chat</span> to authenticate with end-to-end encryption.
              </p>

              <button
                type="button"
                onClick={handleSimulateNewLink}
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs"
              >
                Simulate Successful QR Scan
              </button>
            </div>
          </div>
        )}

        {/* Active Sessions List */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Active Device Sessions ({devices.length})
          </div>

          {devices.map((dev) => (
            <div
              key={dev.id}
              className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 shrink-0">
                  {dev.deviceType === 'desktop' ? (
                    <Laptop className="w-5 h-5" />
                  ) : dev.deviceType === 'tablet' ? (
                    <Tablet className="w-5 h-5" />
                  ) : (
                    <Smartphone className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-neutral-200 truncate">{dev.name}</span>
                    {dev.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold shrink-0">
                        THIS DEVICE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {dev.lastActive}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {dev.location}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 mt-0.5 break-all">
                    {dev.os} • {dev.browser} {dev.ipAddress ? `• IP: ${dev.ipAddress}` : ''}
                  </div>
                </div>
              </div>

              {!dev.isCurrent && (
                <button
                  type="button"
                  onClick={() => handleLogoutDevice(dev.id)}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-rose-400 hover:text-rose-300 text-xs font-bold border border-neutral-800 flex items-center justify-center gap-1 transition-colors self-end sm:self-auto"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
