import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Building2,
  MessageSquare,
  ShoppingBag,
  Tag,
  Users,
  Radio,
  Bot,
  Shield,
  Sparkles,
  BarChart3,
  Calendar,
  Lock,
  Bell,
  HardDrive,
  Code,
  Globe,
  RotateCcw,
  Check,
  Save,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { WATBusinessSettings } from '../../types/businessSettings';
import {
  loadSavedBusinessSettings,
  saveBusinessSettingsToStorage,
  resetBusinessSettingsToDefault,
} from '../../data/defaultBusinessSettings';

import { ProfileAndAccountTab } from './settings/ProfileAndAccountTab';
import { MessagingSettingsTab } from './settings/MessagingSettingsTab';
import { CommercePaymentsTab } from './settings/CommercePaymentsTab';
import { LabelsAndCustomersTab } from './settings/LabelsAndCustomersTab';
import { BroadcastMarketingTab } from './settings/BroadcastMarketingTab';
import { AutomationTab } from './settings/AutomationTab';
import { TeamStaffTab } from './settings/TeamStaffTab';
import { AIBusinessTab } from './settings/AIBusinessTab';
import { AnalyticsTab } from './settings/AnalyticsTab';
import { DocumentsAppointmentsTab } from './settings/DocumentsAppointmentsTab';
import { PrivacySecurityTab } from './settings/PrivacySecurityTab';
import { NotificationsCallsTab } from './settings/NotificationsCallsTab';
import { ChatsStorageDevicesTab } from './settings/ChatsStorageDevicesTab';
import { IntegrationsDevApiTab } from './settings/IntegrationsDevApiTab';
import { LanguageAppearanceLegalTab } from './settings/LanguageAppearanceLegalTab';

export type SettingsSectionId =
  | 'profile_account'
  | 'messaging_tools'
  | 'commerce_payments'
  | 'labels_org'
  | 'customers_contacts'
  | 'broadcast_marketing'
  | 'automation_rules'
  | 'team_staff'
  | 'ai_assistant'
  | 'analytics_growth'
  | 'documents_appointments'
  | 'privacy_security'
  | 'notifications_calls'
  | 'chats_storage_devices'
  | 'integrations_dev_api'
  | 'language_appearance_legal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: SettingsSectionId;
}

interface NavItem {
  id: SettingsSectionId;
  label: string;
  categoryNumber: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'profile_account',
    label: 'Business Profile & Account',
    categoryNumber: '1, 25, 28',
    icon: Building2,
    badge: 'Verified',
    description: 'Name, address, catalog link, hours, verification & matrix handle',
  },
  {
    id: 'messaging_tools',
    label: 'Messaging Settings',
    categoryNumber: '2',
    icon: MessageSquare,
    badge: '4 Quick Replies',
    description: 'Greeting, away message, quick replies & transactional templates',
  },
  {
    id: 'commerce_payments',
    label: 'Commerce & Payments',
    categoryNumber: '3, 15',
    icon: ShoppingBag,
    badge: 'M-Pesa / MoMo',
    description: 'Catalog cart, flat delivery, Mobile Money & settlement accounts',
  },
  {
    id: 'labels_org',
    label: 'Customer & Order Labels',
    categoryNumber: '4',
    icon: Tag,
    badge: '14 Labels',
    description: 'Color-coded tags, VIP, pending payment & auto-assignment rules',
  },
  {
    id: 'customers_contacts',
    label: 'Customers & CRM',
    categoryNumber: '5',
    icon: Users,
    badge: '3 Profiles',
    description: 'Customer segmentation, lifetime value, notes & contact export',
  },
  {
    id: 'broadcast_marketing',
    label: 'Broadcast & Marketing',
    categoryNumber: '6',
    icon: Radio,
    badge: 'Campaigns',
    description: 'Promotional messages, flash sales & scheduled broadcasts',
  },
  {
    id: 'automation_rules',
    label: 'Business Automation',
    categoryNumber: '7',
    icon: Bot,
    badge: 'Rules Active',
    description: 'Keyword triggers, instant FAQ answers & smart team routing',
  },
  {
    id: 'team_staff',
    label: 'Team & Permissions',
    categoryNumber: '8',
    icon: Shield,
    badge: '4 Staff',
    description: 'Staff roles, granular permissions (Finance, Sales, Support)',
  },
  {
    id: 'ai_assistant',
    label: 'AI Sales Assistant',
    categoryNumber: '9',
    icon: Sparkles,
    badge: 'Gemini Pro',
    description: 'Autonomous catalog advisor, product recommendation & upsells',
  },
  {
    id: 'analytics_growth',
    label: 'Analytics & Reports',
    categoryNumber: '10',
    icon: BarChart3,
    badge: 'Live Data',
    description: 'Revenue graphs, message delivery rate & customer retention KPIs',
  },
  {
    id: 'documents_appointments',
    label: 'Invoices & Bookings',
    categoryNumber: '11, 12',
    icon: Calendar,
    badge: 'Active',
    description: 'VAT invoices, receipts, consulting bookings & calendar sync',
  },
  {
    id: 'privacy_security',
    label: 'Business Privacy & Security',
    categoryNumber: '13',
    icon: Lock,
    badge: 'Encrypted',
    description: 'Team 2FA, customer data protection, audit logs & privacy policies',
  },
  {
    id: 'notifications_calls',
    label: 'Notifications & Voice SFU',
    categoryNumber: '14',
    icon: Bell,
    badge: 'Jitsi VIP',
    description: 'Order chimes, custom ringtones & high-def voice conference settings',
  },
  {
    id: 'chats_storage_devices',
    label: 'Storage & Linked Registers',
    categoryNumber: '16, 17',
    icon: HardDrive,
    badge: 'Cloud Sync',
    description: 'Enterprise backup, register POS tablets & offline local cache',
  },
  {
    id: 'integrations_dev_api',
    label: 'Webhooks & Matrix APIs',
    categoryNumber: '18, 19, 20',
    icon: Code,
    badge: 'MSC REST',
    description: 'Shopify, WooCommerce, ERP webhooks & sovereign Matrix bot tokens',
  },
  {
    id: 'language_appearance_legal',
    label: 'Language & Brand Appearance',
    categoryNumber: '21, 22, 23, 24',
    icon: Globe,
    badge: 'Multi-lingual',
    description: 'African language packs (Swahili, Zulu, Yoruba), brand theme & compliance',
  },
];

export const BusinessSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialSection = 'profile_account',
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>(initialSection);
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<WATBusinessSettings>(loadSavedBusinessSettings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync initial section if it changes externally
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Auto-save whenever settings change
  useEffect(() => {
    saveBusinessSettingsToStorage(settings);
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleUpdateSettings = (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => {
    setSettings((prev) => {
      const next = updater(prev);
      saveBusinessSettingsToStorage(next);
      return next;
    });
  };

  const handleManualSave = () => {
    saveBusinessSettingsToStorage(settings);
    showToast('All business settings saved to local matrix store!');
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all business settings to defaults?')) {
      const def = resetBusinessSettingsToDefault();
      setSettings(def);
      showToast('All business settings reset to default values.');
    }
  };

  if (!isOpen) return null;

  const filteredNavItems = NAV_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryNumber.includes(searchQuery)
  );

  const currentNav = NAV_ITEMS.find((n) => n.id === activeSection) || NAV_ITEMS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-6xl h-[92vh] bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden text-neutral-900 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-black text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <header className="p-4 sm:p-5 border-b border-black/[0.06] bg-white/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-neutral-900">
                  WAT Business Settings
                </h2>
              </div>
              <p className="text-xs text-neutral-500">
                Configure African artisan commerce, mobile money gateways, staff roles, and AI bots.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl text-neutral-600 hover:text-black hover:bg-black/[0.04] text-xs font-semibold transition-colors"
              title="Reset to factory defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleManualSave}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-600 hover:text-black transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Modal Body: Two-Column Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Sidebar: Navigation & Search */}
          <aside className="w-full md:w-80 lg:w-88 border-b md:border-b-0 md:border-r border-black/[0.06] bg-neutral-50/80 flex flex-col shrink-0">
            {/* Search filter in sidebar */}
            <div className="p-3.5 border-b border-black/[0.06]">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search business settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-black/[0.08] rounded-2xl text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-black shadow-sm"
                />
              </div>
            </div>

            {/* Nav list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full p-3 rounded-2xl text-left flex items-center justify-between gap-3 transition-all ${
                      isActive
                        ? 'bg-black text-white shadow-sm'
                        : 'hover:bg-black/[0.04] text-neutral-700 hover:text-black'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white font-bold'
                            : 'bg-black/[0.04] text-neutral-700 border border-black/[0.06]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs font-bold truncate">
                            {item.label}
                          </span>
                        </div>
                        <p className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-white/70' : 'text-neutral-500'}`}>
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {item.badge && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-black/[0.05] text-neutral-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-3.5 h-3.5 ${
                          isActive ? 'text-white' : 'text-neutral-400'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}

              {filteredNavItems.length === 0 && (
                <div className="p-6 text-center text-xs text-neutral-400">
                  No business setting category matching "{searchQuery}"
                </div>
              )}
            </div>
          </aside>

          {/* Right Main Content Pane */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white/60 space-y-6 custom-scrollbar">
            {/* Active Section Breadcrumb */}
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
                <span>Business Suite</span>
                <span>/</span>
                <span className="text-neutral-900">{currentNav.label}</span>
                <span className="text-[10px] font-mono text-neutral-400">
                  (Categories: {currentNav.categoryNumber})
                </span>
              </div>
            </div>

            {/* Dynamic Active Tab Content */}
            {activeSection === 'profile_account' && (
              <ProfileAndAccountTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'messaging_tools' && (
              <MessagingSettingsTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'commerce_payments' && (
              <CommercePaymentsTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'labels_org' && (
              <LabelsAndCustomersTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'customers_contacts' && (
              <LabelsAndCustomersTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'broadcast_marketing' && (
              <BroadcastMarketingTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'automation_rules' && (
              <AutomationTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'team_staff' && (
              <TeamStaffTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'ai_assistant' && (
              <AIBusinessTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'analytics_growth' && (
              <AnalyticsTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'documents_appointments' && (
              <DocumentsAppointmentsTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'privacy_security' && (
              <PrivacySecurityTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'notifications_calls' && (
              <NotificationsCallsTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'chats_storage_devices' && (
              <ChatsStorageDevicesTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'integrations_dev_api' && (
              <IntegrationsDevApiTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
            {activeSection === 'language_appearance_legal' && (
              <LanguageAppearanceLegalTab
                settings={settings}
                updateSettings={handleUpdateSettings}
                showToast={showToast}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
