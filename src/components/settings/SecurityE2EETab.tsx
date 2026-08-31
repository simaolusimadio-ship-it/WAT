import React, { useState } from 'react';
import {
  Shield,
  Key,
  Lock,
  Fingerprint,
  FileKey,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { WATUserSettings } from '../../types/watUserSettings';
import { useChat } from '../../context/ChatContext';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const SecurityE2EETab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const { currentUser, setIsE2EEOpen } = useChat();
  const sec = settings.security;
  const [showKeyModal, setShowKeyModal] = useState(false);

  const handleSecurityToggle = (key: keyof typeof sec) => {
    updateSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: !(prev.security as any)[key],
      },
    }));
    showToast(`Security preference updated: ${String(key)}`);
  };

  const copyToClipboard = (txt: string, label: string) => {
    navigator.clipboard?.writeText(txt);
    showToast(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="space-y-6 text-neutral-200 animate-fade-in">
      {/* 3. End-to-End Encryption Status */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">3. 🔒 End-to-End Encryption & Key Ratchet</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">OLM / MEGOLD ACTIVE</span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          Your personal messages and calls are secured with end-to-end encryption. Only you and the person you're communicating with can read or listen to them. Not even WAT or Matrix homeservers can access your plaintext content.
        </p>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-bold text-neutral-200">Device Cryptographic Identity Key</div>
            <div className="font-mono text-xs text-emerald-400">
              {currentUser.e2eeFingerprint || 'ed25519:7x8a+WAT...k92M/matrix'}
            </div>
            <div className="text-[10px] text-neutral-400">Device ID: {currentUser.deviceId || 'WAT_WEB_01'}</div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(currentUser.e2eeFingerprint, 'Identity Key')}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-neutral-300 border border-neutral-800 flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Key</span>
            </button>
            <button
              type="button"
              onClick={() => setIsE2EEOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold shadow-sm"
            >
              Verify Keys
            </button>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-neutral-100">Account Security Controls</h3>

        <div className="space-y-3">
          {/* End-to-End Encrypted Backups */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileKey className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-neutral-200">End-to-End Encrypted Backups</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Protect your cloud backup with a 64-digit encryption key or password before uploading.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSecurityToggle('encryptedBackups')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                sec.encryptedBackups ? 'bg-amber-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  sec.encryptedBackups ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Passkeys sign-in */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-neutral-200">Passkeys for Secure Sign-In</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Use your device's biometric sensor (Face ID, Touch ID, PIN) for instant zero-knowledge login.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSecurityToggle('passkeyRegistered')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                sec.passkeyRegistered ? 'bg-cyan-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  sec.passkeyRegistered ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Biometric App Lock */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-neutral-200">Biometric App Lock</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Require biometric authentication or passcode each time you open WAT Messenger.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSecurityToggle('biometricLock')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                sec.biometricLock ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  sec.biometricLock ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Security Code Change Alerts */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-neutral-200">Security Notifications</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Get notified when your security code changes with any of your end-to-end encrypted contacts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSecurityToggle('securityCodeAlerts')}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                sec.securityCodeAlerts ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  sec.securityCodeAlerts ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
