import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  User,
  Shield,
  Lock,
  MessageSquare,
  Palette,
  Bell,
  HardDrive,
  PhoneCall,
  Laptop,
  CreditCard,
  Languages,
  HelpCircle,
  Briefcase,
  Search,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { WATUserSettings } from '../types/watUserSettings';
import {
  loadSavedUserSettings,
  saveUserSettingsToStorage,
  resetUserSettingsToDefault,
} from '../data/defaultUserSettings';

import { ProfileAccountTab } from './settings/ProfileAccountTab';
import { PrivacyTab } from './settings/PrivacyTab';
import { SecurityE2EETab } from './settings/SecurityE2EETab';
import { ChatsAppearanceTab } from './settings/ChatsAppearanceTab';
import { NotificationsTab } from './settings/NotificationsTab';
import { StorageDataMediaTab } from './settings/StorageDataMediaTab';
import { CallsTab } from './settings/CallsTab';
import { LinkedDevicesTab } from './settings/LinkedDevicesTab';
import { PaymentsTab } from './settings/PaymentsTab';
import { AccessibilityLanguageTab } from './settings/AccessibilityLanguageTab';
import { HelpLegalComplianceTab } from './settings/HelpLegalComplianceTab';

type SettingsTab =
  | 'profile_account'
  | 'privacy'
  | 'security'
  | 'chats'
  | 'notifications'
  | 'storage'
  | 'calls'
  | 'linked_devices'
  | 'payments'
  | 'accessibility_language'
  | 'help_legal';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, setIsBusinessSettingsOpen, currentUser } = useChat();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile_account');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<WATUserSettings>(loadSavedUserSettings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save settings on change
  useEffect(() => {
    saveUserSettingsToStorage(settings);
  }, [settings]);

  // Reset to list view when modal opens
  useEffect(() => {
    if (isSettingsOpen) {
      setMobileView('list');
    }
  }, [isSettingsOpen]);

  if (!isSettingsOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const navCategories = [
    {
      id: 'profile_account' as SettingsTab,
      label: 'Profile & Account',
      sublabel: 'Identity, phone, email, passkeys, 2FA',
      icon: User,
      color: 'text-emerald-400',
    },
    {
      id: 'privacy' as SettingsTab,
      label: 'Privacy & Visibility',
      sublabel: 'Last seen, read receipts, blocked, timers',
      icon: Shield,
      color: 'text-cyan-400',
    },
    {
      id: 'security' as SettingsTab,
      label: 'Security & E2EE',
      sublabel: 'Olm/Megolm keys, encrypted backups',
      icon: Lock,
      color: 'text-emerald-400',
    },
    {
      id: 'chats' as SettingsTab,
      label: 'Chats & Appearance',
      sublabel: 'Themes, wallpaper, fonts, backups',
      icon: MessageSquare,
      color: 'text-purple-400',
    },
    {
      id: 'notifications' as SettingsTab,
      label: 'Notifications',
      sublabel: 'Audio synth chimes, tones, vibration',
      icon: Bell,
      color: 'text-amber-400',
    },
    {
      id: 'storage' as SettingsTab,
      label: 'Storage & Data',
      sublabel: 'Auto-download, network usage, files',
      icon: HardDrive,
      color: 'text-blue-400',
    },
    {
      id: 'calls' as SettingsTab,
      label: 'Calls & WebRTC',
      sublabel: 'Jitsi Meet SFU, noise cancellation',
      icon: PhoneCall,
      color: 'text-emerald-400',
    },
    {
      id: 'linked_devices' as SettingsTab,
      label: 'Linked Devices',
      sublabel: 'Desktop, Web, QR pairing, sessions',
      icon: Laptop,
      color: 'text-indigo-400',
    },
    {
      id: 'payments' as SettingsTab,
      label: 'Payments & Wallet',
      sublabel: 'M-Pesa, MoMo, Card, transactions',
      icon: CreditCard,
      color: 'text-emerald-400',
    },
    {
      id: 'accessibility_language' as SettingsTab,
      label: 'Language & Accessibility',
      sublabel: 'Real-time translation, captions, contrast',
      icon: Languages,
      color: 'text-teal-400',
    },
    {
      id: 'help_legal' as SettingsTab,
      label: 'Help & Legal (POPIA)',
      sublabel: 'Support, POPIA compliance, reports',
      icon: HelpCircle,
      color: 'text-rose-400',
    },
  ];

  const filteredCategories = navCategories.filter(
    (c) =>
      c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sublabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCategoryObj = navCategories.find((c) => c.id === activeTab) || navCategories[0];
  const ActiveIcon = activeCategoryObj.icon;

  const handleSelectTab = (tabId: SettingsTab) => {
    setActiveTab(tabId);
    setMobileView('detail');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center sm:p-4 animate-fade-in select-none">
      <div className="bg-white/95 backdrop-blur-2xl border-0 sm:border border-black/[0.08] rounded-none sm:rounded-3xl w-full h-full sm:h-[88vh] sm:max-w-5xl shadow-[0_24px_48px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col text-neutral-900">
        {/* Top Header - Responsive */}
        <header className="px-4 sm:px-6 py-3.5 sm:py-4 bg-white/70 border-b border-black/[0.06] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* On mobile, if in detail view, show Back Button */}
            {mobileView === 'detail' && (
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className="md:hidden p-2 rounded-xl text-neutral-700 hover:text-black bg-black/[0.04] hover:bg-black/[0.08] transition-colors shrink-0"
                title="Back to Settings List"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-black/[0.05] text-neutral-900 border border-black/[0.08] flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 flex items-center gap-2 truncate">
                <span className="truncate">
                  {mobileView === 'detail' ? activeCategoryObj.label : 'WAT Settings Ecosystem'}
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-black/[0.05] text-[9px] sm:text-[10px] font-mono text-neutral-600 shrink-0">
                  v1.0.0
                </span>
              </h2>
              <p className="text-[11px] text-neutral-500 hidden sm:block truncate">
                {mobileView === 'detail'
                  ? activeCategoryObj.sublabel
                  : 'Standard WhatsApp & Matrix federated preferences, privacy, encryption, and payments'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Switch to WAT Business Settings */}
            <button
              type="button"
              onClick={() => {
                setIsSettingsOpen(false);
                setIsBusinessSettingsOpen(true);
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-black/[0.05] hover:bg-black/[0.1] text-neutral-900 border border-black/[0.08] text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WAT Business</span>
              <span className="sm:hidden">Business</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="p-1.5 sm:p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-black/[0.05] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-black text-white text-xs font-bold px-4 py-2 text-center flex items-center justify-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Body with Responsive Mobile List / Detail Navigation */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Category Sidebar (Always visible on md+, visible on mobile only when mobileView === 'list') */}
          <aside
            className={`w-full md:w-64 lg:w-72 bg-white/50 border-r border-black/[0.06] flex flex-col shrink-0 overflow-hidden ${
              mobileView === 'list' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* User Profile Snippet Card (Quick jump to profile on mobile) */}
            <div className="p-3 border-b border-black/[0.06] bg-black/[0.01]">
              <button
                type="button"
                onClick={() => handleSelectTab('profile_account')}
                className="w-full p-2.5 rounded-2xl bg-white hover:bg-black/[0.02] border border-black/[0.06] flex items-center gap-3 text-left transition-all group shadow-sm"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-black/10 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-neutral-900 truncate group-hover:text-black">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate">
                    {currentUser.statusMessage || 'Available • Matrix Active'}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black shrink-0" />
              </button>
            </div>

            {/* Search Box */}
            <div className="p-3 border-b border-black/[0.06]">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-black/[0.03] border border-black/[0.08] rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Category Nav List */}
            <nav className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectTab(cat.id)}
                    className={`w-full p-3 sm:p-2.5 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99] ${
                      isSelected
                        ? 'bg-black text-white shadow-md'
                        : 'text-neutral-700 hover:text-black hover:bg-black/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-black/[0.04] text-neutral-800 border border-black/[0.06]'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-xs font-bold truncate">{cat.label}</div>
                        <div className={`text-[11px] sm:text-[10px] truncate ${isSelected ? 'text-white/70' : 'text-neutral-500'}`}>
                          {cat.sublabel}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-white' : 'text-neutral-400'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Quick Reset Settings */}
            <div className="p-3 border-t border-black/[0.06] flex items-center justify-between bg-white/40">
              <span className="text-[11px] font-mono text-neutral-400">WAT OS Matrix</span>
              <button
                type="button"
                onClick={() => {
                  setSettings(resetUserSettingsToDefault());
                  showToast('Reset all settings to defaults.');
                }}
                className="text-[11px] text-neutral-500 hover:text-rose-500 transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </aside>

          {/* Right Content Panel (Visible on md+, visible on mobile only when mobileView === 'detail') */}
          <main
            className={`flex-1 overflow-y-auto p-4 sm:p-6 bg-white/30 custom-scrollbar ${
              mobileView === 'detail' ? 'block' : 'hidden md:block'
            }`}
          >
            {activeTab === 'profile_account' && (
              <ProfileAccountTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'privacy' && (
              <PrivacyTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'security' && (
              <SecurityE2EETab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'chats' && (
              <ChatsAppearanceTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'notifications' && (
              <NotificationsTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'storage' && (
              <StorageDataMediaTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'calls' && (
              <CallsTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'linked_devices' && (
              <LinkedDevicesTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'payments' && (
              <PaymentsTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'accessibility_language' && (
              <AccessibilityLanguageTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
            {activeTab === 'help_legal' && (
              <HelpLegalComplianceTab
                settings={settings}
                updateSettings={setSettings}
                showToast={showToast}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
