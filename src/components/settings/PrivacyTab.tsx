import React, { useState } from 'react';
import {
  Eye,
  Shield,
  Clock,
  CheckCheck,
  Users,
  PhoneOff,
  UserX,
  MapPin,
  Globe,
  Radio,
  Lock,
  Plus,
  Trash2,
} from 'lucide-react';
import { WATUserSettings, BlockedContact } from '../../types/watUserSettings';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const PrivacyTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const priv = settings.privacy;
  const [newBlockedName, setNewBlockedName] = useState('');
  const [newBlockedPhone, setNewBlockedPhone] = useState('');
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);

  const handlePrivacyChange = (key: keyof typeof priv, val: any) => {
    updateSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: val,
      },
    }));
    showToast(`Privacy setting updated: ${String(key)}`);
  };

  const handleUnblock = (id: string) => {
    updateSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        blockedContacts: prev.privacy.blockedContacts.filter((c) => c.id !== id),
      },
    }));
    showToast('Contact unblocked');
  };

  const handleAddBlocked = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedName.trim()) return;
    const newContact: BlockedContact = {
      id: `blk-${Date.now()}`,
      name: newBlockedName.trim(),
      phone: newBlockedPhone.trim() || '+000 000 0000',
      handle: `@${newBlockedName.toLowerCase().replace(/\s+/g, '_')}:matrix.org`,
      blockedAt: new Date().toISOString().split('T')[0],
    };
    updateSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        blockedContacts: [...prev.privacy.blockedContacts, newContact],
      },
    }));
    showToast(`Blocked ${newBlockedName}`);
    setNewBlockedName('');
    setNewBlockedPhone('');
    setShowAddBlockModal(false);
  };

  return (
    <div className="space-y-6 text-neutral-200 animate-fade-in">
      {/* 2. Profile Visibility & Who Can See */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">2. 👁️ Profile Visibility & Audience</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">ENCRYPTED POLICIES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Last Seen & Online */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <label className="text-xs font-bold text-neutral-200">Last Seen & Online Status</label>
            <p className="text-[11px] text-neutral-400">Who can see when you were last active</p>
            <select
              value={priv.lastSeenAndOnline}
              onChange={(e) => handlePrivacyChange('lastSeenAndOnline', e.target.value as any)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-semibold outline-none"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          {/* Profile Photo */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <label className="text-xs font-bold text-neutral-200">Profile Photo Visibility</label>
            <p className="text-[11px] text-neutral-400">Control who can view your avatar photo</p>
            <select
              value={priv.profilePhoto}
              onChange={(e) => handlePrivacyChange('profilePhoto', e.target.value as any)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-semibold outline-none"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          {/* About */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <label className="text-xs font-bold text-neutral-200">About / Bio Visibility</label>
            <p className="text-[11px] text-neutral-400">Who can see your status quote and bio</p>
            <select
              value={priv.about}
              onChange={(e) => handlePrivacyChange('about', e.target.value as any)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-semibold outline-none"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          {/* Status Updates */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <label className="text-xs font-bold text-neutral-200">Status Story Audience</label>
            <p className="text-[11px] text-neutral-400">Default audience for 24-hour status stories</p>
            <select
              value={priv.status}
              onChange={(e) => handlePrivacyChange('status', e.target.value as any)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-semibold outline-none"
            >
              <option value="contacts">My Contacts</option>
              <option value="contacts_except">My Contacts Except...</option>
              <option value="only_share_with">Only Share With...</option>
            </select>
          </div>
        </div>
      </section>

      {/* Messaging & Interaction Privacy */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-neutral-100">Interaction & Messaging Privacy</h3>

        <div className="space-y-3">
          {/* Read Receipts */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-neutral-200">Read Receipts (Blue Ticks)</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                If turned off, you won't send or receive read receipts. Read receipts are always sent for group chats.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handlePrivacyChange('readReceipts', !priv.readReceipts)}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                priv.readReceipts ? 'bg-cyan-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  priv.readReceipts ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Default Message Timer for Disappearing Messages */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-neutral-200">Default Disappearing Message Timer</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Start new individual chats with disappearing messages set to this duration.
              </p>
            </div>
            <select
              value={priv.defaultMessageTimer}
              onChange={(e) => handlePrivacyChange('defaultMessageTimer', parseInt(e.target.value))}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-100 font-semibold outline-none"
            >
              <option value={0}>Off</option>
              <option value={86400}>24 Hours</option>
              <option value={604800}>7 Days</option>
              <option value={7776000}>90 Days</option>
            </select>
          </div>

          {/* Groups who can add me */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-neutral-200">Groups (Who Can Add Me)</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Control which accounts can add you to group conversations without an invitation link.
              </p>
            </div>
            <select
              value={priv.groupsWhoCanAdd}
              onChange={(e) => handlePrivacyChange('groupsWhoCanAdd', e.target.value as any)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-100 font-semibold outline-none"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts</option>
              <option value="nobody">Nobody (Invite only)</option>
            </select>
          </div>

          {/* Silence Unknown Callers */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <PhoneOff className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-neutral-200">Silence Unknown Callers</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Calls from unknown numbers will be silenced automatically but shown in the Calls tab.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handlePrivacyChange('silenceUnknownCallers', !priv.silenceUnknownCallers)}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                priv.silenceUnknownCallers ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  priv.silenceUnknownCallers ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Protect IP Address in Calls */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-neutral-200">Protect IP Address in Calls</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Relay all peer-to-peer calls through WAT Jitsi SFU servers to hide your real IP location.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handlePrivacyChange('protectIpInCalls', !priv.protectIpInCalls)}
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                priv.protectIpInCalls ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  priv.protectIpInCalls ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Blocked Contacts */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <UserX className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-neutral-100">
              Blocked Contacts ({priv.blockedContacts.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAddBlockModal(true)}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Block</span>
          </button>
        </div>

        {showAddBlockModal && (
          <form onSubmit={handleAddBlocked} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-neutral-200">Block Contact or Number</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Name or handle"
                value={newBlockedName}
                onChange={(e) => setNewBlockedName(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 outline-none"
              />
              <input
                type="text"
                placeholder="Phone number"
                value={newBlockedPhone}
                onChange={(e) => setNewBlockedPhone(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs"
              >
                Confirm Block
              </button>
              <button
                type="button"
                onClick={() => setShowAddBlockModal(false)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {priv.blockedContacts.map((blk) => (
            <div
              key={blk.id}
              className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-neutral-200">{blk.name}</div>
                <div className="text-[11px] font-mono text-neutral-400">{blk.phone} • {blk.handle}</div>
              </div>
              <button
                type="button"
                onClick={() => handleUnblock(blk.id)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-rose-400 border border-neutral-800"
              >
                Unblock
              </button>
            </div>
          ))}

          {priv.blockedContacts.length === 0 && (
            <div className="p-4 text-center text-xs text-neutral-500">
              No blocked contacts. Blocked accounts will not be able to message or call you.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
