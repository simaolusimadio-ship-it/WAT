import React, { useState } from 'react';
import {
  User as UserIcon,
  Phone,
  Mail,
  Shield,
  Key,
  Fingerprint,
  Trash2,
  Download,
  AlertTriangle,
  Server,
  Sparkles,
  MapPin,
  Camera,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { WATUserSettings } from '../../types/watUserSettings';
import { useChat } from '../../context/ChatContext';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const ProfileAccountTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const { currentUser } = useChat();
  const acc = settings.account;
  const prof = settings.profile;

  const [isChangingNumber, setIsChangingNumber] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleProfileChange = (key: keyof typeof prof, val: string) => {
    updateSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: val,
      },
    }));
  };

  const handleAccountChange = (key: keyof typeof acc, val: any) => {
    updateSettings((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        [key]: val,
      },
    }));
    showToast(`Account setting updated: ${String(key)}`);
  };

  const handleApplyNewNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoneNumber.trim()) return;
    updateSettings((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        phoneNumber: newPhoneNumber,
      },
      profile: {
        ...prev.profile,
        phoneNumber: newPhoneNumber,
      },
    }));
    showToast(`Phone number successfully migrated to ${newPhoneNumber}`);
    setIsChangingNumber(false);
    setNewPhoneNumber('');
  };

  const copyToClipboard = (txt: string, label: string) => {
    navigator.clipboard?.writeText(txt);
    showToast(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="space-y-6 text-neutral-200 animate-fade-in">
      {/* 4. Profile Section */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">4. 👤 Public Identity & Profile</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">SYNCED ACROSS MATRIX</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative group">
            <img
              src={prof.avatar || currentUser.avatar}
              alt={prof.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-neutral-800 shadow-xl"
            />
            <button
              type="button"
              onClick={() => showToast('Avatar photo updated!')}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md transition-transform active:scale-95"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 w-full space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Display Name</label>
                <input
                  type="text"
                  value={prof.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-semibold focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Matrix Handle / Username</label>
                <div className="flex items-center gap-1.5 mt-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2">
                  <input
                    type="text"
                    value={prof.handle}
                    onChange={(e) => handleProfileChange('handle', e.target.value)}
                    className="flex-1 bg-transparent text-xs text-emerald-400 font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(prof.handle, 'Handle')}
                    className="text-neutral-500 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">About / Status</label>
              <input
                type="text"
                value={prof.statusMessage}
                onChange={(e) => handleProfileChange('statusMessage', e.target.value)}
                placeholder="Hey there! I am using WAT."
                className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  value={prof.location}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={prof.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Account & Security Settings */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">1. 🔐 Account Identity & Credentials</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">ACTIVE & SECURED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Phone Number & Change Number */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Registered Phone Number
              </span>
              <button
                type="button"
                onClick={() => setIsChangingNumber(!isChangingNumber)}
                className="text-[11px] text-emerald-400 hover:underline font-semibold"
              >
                {isChangingNumber ? 'Cancel' : 'Change Number'}
              </button>
            </div>
            <div className="text-xs font-mono text-neutral-300 font-bold">{acc.phoneNumber}</div>
            {isChangingNumber && (
              <form onSubmit={handleApplyNewNumber} className="mt-2 pt-2 border-t border-neutral-800 space-y-2">
                <input
                  type="text"
                  placeholder="Enter new phone number (e.g. +254 700 000 000)"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-100 outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs"
                >
                  Migrate Account & Data
                </button>
              </form>
            )}
          </div>

          {/* Two-Step Verification */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" /> Two-Step Verification PIN
              </span>
              <button
                type="button"
                onClick={() => handleAccountChange('twoStepEnabled', !acc.twoStepEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                  acc.twoStepEnabled ? 'bg-emerald-500' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    acc.twoStepEnabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              Adds a required 6-digit PIN when registering your account on new devices.
            </p>
          </div>

          {/* Passkeys Sign-In */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-cyan-400" /> WebAuthn Passkeys
              </span>
              <button
                type="button"
                onClick={() => handleAccountChange('passkeysEnabled', !acc.passkeysEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                  acc.passkeysEnabled ? 'bg-cyan-500' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    acc.passkeysEnabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              Sign in effortlessly using Face ID, Touch ID, or Windows Hello passkeys.
            </p>
          </div>

          {/* Security Notifications */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Security Code Alerts
              </span>
              <button
                type="button"
                onClick={() => handleAccountChange('securityNotifications', !acc.securityNotifications)}
                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                  acc.securityNotifications ? 'bg-emerald-500' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    acc.securityNotifications ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              Receive alerts when a contact's E2EE device encryption keys change.
            </p>
          </div>
        </div>

        {/* Matrix Federation Homeserver URL */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-neutral-200">Matrix Synapse Homeserver</span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono">{acc.matrixHomeserver}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
            FEDERATION ACTIVE
          </span>
        </div>
      </section>

      {/* Account Lifecycle & Data Requests */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-neutral-100">Account Lifecycle & Management</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => showToast('Account information report requested. Will be ready in 3 business days.')}
            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-left flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-bold text-neutral-200">Request Account Info</div>
                <div className="text-[10px] text-neutral-400">Get a ZIP report of your account data</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
            className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-left flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <div>
                <div className="text-xs font-bold text-rose-300">Delete My Account</div>
                <div className="text-[10px] text-rose-400/80">Permanently erase message history & credentials</div>
              </div>
            </div>
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-600/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Are you sure you want to delete your account?</span>
            </div>
            <p className="text-[11px] text-rose-200/80">
              Deleting your account will delete your account history, remove you from all your groups, and delete your Matrix cryptographic key ratchet.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Account deletion simulated.');
                  setShowDeleteConfirm(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Confirm Delete Account
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
