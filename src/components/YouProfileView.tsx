import React, { useState } from 'react';
import {
  Wallet,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  CreditCard,
  Settings,
  Shield,
  Smartphone,
  Bell,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  ArrowRight,
  Building2,
  Users,
  MessageSquare,
  Phone,
  Share2,
  ExternalLink,
  Lock,
  Layers,
  Repeat,
  Edit3,
  Globe,
  Mail,
  MapPin,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { soundEngine } from '../utils/audioSynth';

type YouTab = 'profile' | 'wallet' | 'businesses' | 'posts' | 'settings';

export const YouProfileView: React.FC = () => {
  const {
    currentUser,
    walletBalance,
    walletCurrency,
    setWalletCurrency,
    walletTransactions,
    sendMoney,
    requestMoney,
    setIsSettingsOpen,
    setIsUserSwitcherOpen,
    setIsE2EEOpen,
    setIsUVSModalOpen,
    setIsEditProfileOpen,
    toggleBusinessMode,
    businessMode,
    setActiveTab,
    setActiveRoomId,
  } = useChat();

  const [activeSubTab, setActiveSubTab] = useState<YouTab>('wallet');
  const [copiedHandle, setCopiedHandle] = useState(false);

  // Send Money Modal State
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendRecipient, setSendRecipient] = useState('John Smith');
  const [sendHandle, setSendHandle] = useState('@johnsmith:wat.chat');
  const [sendAmount, setSendAmount] = useState('500');
  const [sendNote, setSendNote] = useState('Strategy advisory payment');

  // Request Money Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestPayer, setRequestPayer] = useState('Apex Capital Partners');
  const [requestAmount, setRequestAmount] = useState('1200');
  const [requestNote, setRequestNote] = useState('Consulting retainer tranche');

  // QR Modal State
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const handleCopyHandle = () => {
    navigator.clipboard.writeText(currentUser.handle);
    setCopiedHandle(true);
    soundEngine.playChime();
    setTimeout(() => setCopiedHandle(false), 1500);
  };

  const handleExecuteSend = () => {
    const val = parseFloat(sendAmount);
    if (!val || val <= 0) return;
    sendMoney(val, sendRecipient, sendHandle, sendNote);
    setIsSendModalOpen(false);
  };

  const handleExecuteRequest = () => {
    const val = parseFloat(requestAmount);
    if (!val || val <= 0) return;
    requestMoney(val, requestPayer, requestNote);
    setIsRequestModalOpen(false);
  };

  return (
    <div className="flex-1 bg-neutral-100 flex flex-col h-full overflow-y-auto select-none p-4 sm:p-6 md:p-8 pb-20 md:pb-8 text-neutral-900">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Profile Card Hero */}
        <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Large Profile Photo */}
            <div className="relative group">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-black/5 shadow-md bg-neutral-100"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" />
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-xs"
                title="Change Avatar"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Information */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                      {currentUser.name}
                    </h1>
                    <CheckCircle2 className="w-5 h-5 text-neutral-900" />
                  </div>
                  <button
                    onClick={handleCopyHandle}
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-black font-mono mt-1 transition-colors font-medium"
                  >
                    <span>{currentUser.handle}</span>
                    {copiedHandle ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    id="you-view-edit-profile-btn"
                    onClick={() => setIsEditProfileOpen(true)}
                    className="px-3.5 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-700 hover:text-black transition-colors border border-black/[0.06]"
                    title="Account Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsQRModalOpen(true)}
                    className="p-2.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-700 hover:text-black transition-colors border border-black/[0.06]"
                    title="Share Identity QR"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsUserSwitcherOpen(true)}
                    className="px-3.5 py-2 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 border border-black/[0.08] text-xs font-bold transition-all"
                  >
                    Switch User
                  </button>
                </div>
              </div>

              {/* Tagline / Headline */}
              <p className="text-sm font-semibold text-neutral-700 mt-2">
                {currentUser.statusMessage || 'Founder • Entrepreneur • Consultant'}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {currentUser.location || 'Johannesburg & Cape Town, South Africa'}
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-5">
                <button
                  onClick={() => {
                    setActiveRoomId('room_kwame');
                    setActiveTab('chats');
                  }}
                  className="px-4 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Message
                </button>

                <button
                  onClick={() => setActiveTab('calls')}
                  className="px-4 py-2 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 font-bold text-xs flex items-center gap-2 border border-black/[0.06] transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </button>

                <button
                  onClick={toggleBusinessMode}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all border ${
                    businessMode === 'business'
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-white/90 text-neutral-700 border-black/[0.08] hover:text-black'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  {businessMode === 'business' ? 'Business Mode: ON' : 'Switch to Business'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-white/90 p-1.5 rounded-2xl border border-black/[0.08] overflow-x-auto no-scrollbar shadow-sm">
          {[
            { id: 'wallet', label: '💳 WAT Wallet', count: `R${walletBalance.toLocaleString()}` },
            { id: 'profile', label: 'About & Bio' },
            { id: 'businesses', label: 'Businesses & Ventures' },
            { id: 'posts', label: 'Posts & Media' },
            { id: 'settings', label: 'Security & Settings' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveSubTab(t.id as YouTab);
                soundEngine.playChime();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeSubTab === t.id
                  ? 'bg-black text-white shadow-sm'
                  : 'text-neutral-600 hover:text-black hover:bg-black/[0.04]'
              }`}
            >
              <span>{t.label}</span>
              {t.count && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    activeSubTab === t.id
                      ? 'bg-white/20 text-white font-black'
                      : 'bg-black/[0.05] text-neutral-800'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 1. WALLET VIEW */}
        {activeSubTab === 'wallet' && (
          <div className="space-y-6">
            {/* Balance Hero Card */}
            <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 uppercase font-mono tracking-wider">
                  <Wallet className="w-4 h-4" />
                  WAT Verified Balance
                </div>
                <div className="flex items-center gap-1 bg-black/[0.03] p-1 rounded-xl border border-black/[0.06]">
                  {(['ZAR', 'USD', 'KES', 'NGN'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setWalletCurrency(curr)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-colors ${
                        walletCurrency === curr
                          ? 'bg-black text-white font-black'
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Large Amount */}
              <div className="mt-4">
                <span className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight font-mono">
                  {walletCurrency === 'ZAR' ? 'R' : walletCurrency === 'USD' ? '$' : 'KSh '}
                  {walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <p className="text-xs text-neutral-500 mt-1">
                  Instant settlement across Matrix federation & mobile money gateways
                </p>
              </div>

              {/* Quick 4 Action Buttons */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                <button
                  onClick={() => setIsSendModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex flex-col items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <ArrowUpRight className="w-5 h-5" />
                  <span>Send</span>
                </button>

                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 font-bold text-xs flex flex-col items-center gap-1.5 border border-black/[0.06] transition-all"
                >
                  <ArrowDownLeft className="w-5 h-5 text-neutral-900" />
                  <span>Receive</span>
                </button>

                <button
                  onClick={() => setIsQRModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 font-bold text-xs flex flex-col items-center gap-1.5 border border-black/[0.06] transition-all"
                >
                  <QrCode className="w-5 h-5 text-neutral-900" />
                  <span>Pay / QR</span>
                </button>

                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 font-bold text-xs flex flex-col items-center gap-1.5 border border-black/[0.06] transition-all"
                >
                  <Repeat className="w-5 h-5 text-neutral-900" />
                  <span>Request</span>
                </button>
              </div>
            </div>

            {/* Recent Activity List */}
            <div className="rounded-3xl bg-white/90 border border-black/[0.08] p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-neutral-500 uppercase font-mono tracking-wider">
                  Recent Activity
                </h3>
                <span className="text-xs text-neutral-400">Live Ledger</span>
              </div>

              <div className="space-y-2">
                {walletTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.06] flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-black/[0.04] text-neutral-800 flex items-center justify-center shrink-0 border border-black/[0.06]">
                        {tx.type === 'incoming' ? (
                          <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                        ) : tx.type === 'outgoing' ? (
                          <ArrowUpRight className="w-5 h-5 text-rose-500" />
                        ) : (
                          <Repeat className="w-5 h-5 text-neutral-800" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                          {tx.counterpartyName}
                        </h4>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {tx.note || tx.category} • {new Date(tx.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs sm:text-sm font-black font-mono ${
                          tx.type === 'incoming'
                            ? 'text-emerald-600'
                            : tx.type === 'outgoing'
                            ? 'text-rose-500'
                            : 'text-neutral-900'
                        }`}
                      >
                        {tx.type === 'incoming' ? '+' : tx.type === 'outgoing' ? '-' : ''}
                        {tx.currency} {tx.amount.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-neutral-400 capitalize">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. ABOUT & BIO TAB */}
        {activeSubTab === 'profile' && (
          <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 space-y-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <span>About {currentUser.name}</span>
                {currentUser.verified && (
                  <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                )}
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="px-3.5 py-1.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Bio Content */}
            <div className="p-4 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
                Bio & Background
              </span>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {currentUser.bio ||
                  'Founder, Technology Entrepreneur & Enterprise Consultant with deep expertise in decentralized communications, Matrix 2.0 protocol infrastructure, pan-African mobile money integration, and AI workflow automation.'}
              </p>
            </div>

            {/* Website & Social Links Grid */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Official Links & Social Channels
              </span>

              {currentUser.website && (
                <a
                  href={
                    currentUser.website.startsWith('http')
                      ? currentUser.website
                      : `https://${currentUser.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.06] text-xs text-neutral-800 hover:text-black transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-black/[0.04] text-neutral-800">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-neutral-900">{currentUser.website}</span>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        Official Website / Portfolio
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
                </a>
              )}
            </div>

            {/* Verified Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-black/[0.06]">
              <div className="p-3 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Location</span>
                <p className="text-xs font-bold text-neutral-900">
                  {currentUser.location || 'Johannesburg & Cape Town, South Africa'}
                </p>
              </div>
              <div className="p-3 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Matrix ID</span>
                <p className="text-xs font-bold text-neutral-900 font-mono">{currentUser.handle}</p>
              </div>
              <div className="p-3 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Phone & Email</span>
                <p className="text-xs font-bold text-neutral-900">
                  {currentUser.phone || '+27 82 555 0199'} • {currentUser.email || 'lusimadio12@gmail.com'}
                </p>
              </div>
              <div className="p-3 bg-black/[0.02] rounded-2xl border border-black/[0.06]">
                <span className="text-[11px] text-neutral-500 font-mono">Verified Device & Security</span>
                <p className="text-xs font-bold text-neutral-900 font-mono">
                  {currentUser.deviceId || 'Apple Silicon M3 • E2EE Active'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. BUSINESSES TAB */}
        {activeSubTab === 'businesses' && (
          <div className="space-y-4">
            <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 space-y-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-neutral-800" />
                  Your Active Businesses & Ventures
                </h3>
                <button
                  onClick={() => setActiveTab('business')}
                  className="text-xs text-neutral-800 hover:text-black font-bold"
                >
                  Open Business Suite →
                </button>
              </div>

              <div className="p-4 bg-black/[0.02] border border-black/[0.06] rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Lusimadio Strategic Consulting</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Enterprise architecture, fintech strategy & protocol design</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 bg-black/[0.05] text-neutral-800 border border-black/[0.08] rounded-xl text-[10px] font-bold">
                    R127,450 Monthly Revenue • 17 Orders
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('business')}
                  className="px-3.5 py-2 rounded-2xl bg-black text-white font-bold text-xs hover:bg-neutral-800 shadow-sm"
                >
                  Manage CRM
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. POSTS TAB */}
        {activeSubTab === 'posts' && (
          <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 text-center space-y-3 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <Sparkles className="w-8 h-8 text-neutral-800 mx-auto" />
            <h4 className="text-sm font-bold text-neutral-900">24-Hour Stories & Updates</h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Share photos, videos, and product launches with your network.
            </p>
            <button
              onClick={() => setActiveTab('stories')}
              className="px-4 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold shadow-sm"
            >
              View Stories Feed
            </button>
          </div>
        )}

        {/* 5. SETTINGS TAB */}
        {activeSubTab === 'settings' && (
          <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] p-6 space-y-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <h3 className="text-base font-bold text-neutral-900">Security & App Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setIsE2EEOpen(true)}
                className="p-3.5 bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.06] rounded-2xl flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-neutral-800" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">E2EE Cryptography</p>
                    <p className="text-[11px] text-neutral-500">Olm / Megolm verification</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => setIsUVSModalOpen(true)}
                className="p-3.5 bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.06] rounded-2xl flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-neutral-800" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Matrix UVS Service</p>
                    <p className="text-[11px] text-neutral-500">OpenID cross-signing</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-3.5 bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.06] rounded-2xl flex items-center justify-between text-left col-span-full transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-5 h-5 text-neutral-800" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Full Application Settings</p>
                    <p className="text-[11px] text-neutral-500">Notifications, chats, privacy, devices & storage</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Send Money Modal */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-md bg-white border border-black/[0.08] rounded-3xl p-6 shadow-2xl space-y-4 animate-scale">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-neutral-900" />
              Send Money via WAT Wallet
            </h3>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Recipient Name</label>
              <input
                type="text"
                value={sendRecipient}
                onChange={(e) => setSendRecipient(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Matrix Handle</label>
              <input
                type="text"
                value={sendHandle}
                onChange={(e) => setSendHandle(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Amount ({walletCurrency})</label>
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-sm font-mono text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Note (Optional)</label>
              <input
                type="text"
                value={sendNote}
                onChange={(e) => setSendNote(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSendModalOpen(false)}
                className="px-4 py-2 rounded-2xl text-xs text-neutral-600 hover:text-black font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteSend}
                className="px-5 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-sm"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Money Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-md bg-white border border-black/[0.08] rounded-3xl p-6 shadow-2xl space-y-4 animate-scale">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-neutral-900" />
              Request Money / Send Payment Link
            </h3>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Payer Name</label>
              <input
                type="text"
                value={requestPayer}
                onChange={(e) => setRequestPayer(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Amount ({walletCurrency})</label>
              <input
                type="number"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-sm font-mono text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Reason / Invoice Note</label>
              <input
                type="text"
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="px-4 py-2 rounded-2xl text-xs text-neutral-600 hover:text-black font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRequest}
                className="px-5 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-sm"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Identity & Pay Modal */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white border border-black/[0.08] rounded-3xl p-6 shadow-2xl space-y-4 text-center animate-scale">
            <h3 className="text-base font-bold text-neutral-900">
              WAT QR Pay & Connect
            </h3>
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl flex items-center justify-center border border-black/[0.08] shadow-sm">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=wat://pay/lusimadio:wat.chat"
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs font-mono text-neutral-900 font-bold">
              @lusimadio:wat.chat
            </p>
            <p className="text-[11px] text-neutral-500">
              Scan this QR to initiate instant zero-fee peer payments or verified Matrix room invitations.
            </p>
            <button
              onClick={() => setIsQRModalOpen(false)}
              className="w-full py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
