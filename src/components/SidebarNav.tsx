import React from 'react';
import {
  MessageSquare,
  Compass,
  Phone,
  Store,
  Layers,
  Sparkles,
  ShieldCheck,
  Settings,
  Users,
  CircleDot,
  Radio,
  UserCheck,
  Server,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const SidebarNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setIsBlueprintOpen,
    setIsE2EEOpen,
    setIsUVSModalOpen,
    setIsSettingsOpen,
    setIsUserSwitcherOpen,
    setIsJitsiDevOpsOpen,
    rooms,
    stories,
  } = useChat();

  const totalUnread = rooms.reduce((acc, r) => acc + (r.unreadCount || 0), 0);
  const unviewedStories = stories.filter((s) => !s.viewed).length;

  return (
    <aside className="w-16 md:w-20 bg-neutral-900/90 backdrop-blur border-r border-neutral-800 flex flex-col items-center py-4 justify-between select-none z-30 shrink-0">
      {/* Brand Logo & Protocol Badge */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => setActiveTab('chats')}
          title="WAT Instant Messenger"
          className="relative group p-2 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/30 transition-transform active:scale-95"
        >
          <div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center font-black tracking-tighter text-lg">
            WAT
          </div>
          {/* Matrix Protocol indicator */}
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-neutral-900 rounded-full animate-pulse" />
        </button>
        <span className="text-[10px] font-mono tracking-wider font-semibold text-emerald-400 uppercase">
          Matrix
        </span>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex flex-col items-center gap-2 my-auto">
        {/* Chats Tab */}
        <button
          onClick={() => setActiveTab('chats')}
          className={`relative p-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'chats'
              ? 'bg-emerald-500/15 text-emerald-400 shadow-inner'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
          title="Messages (Matrix Rooms)"
        >
          <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
          {totalUnread > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-emerald-500 text-neutral-950 text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-scale">
              {totalUnread}
            </span>
          )}
        </button>

        {/* Stories / Status */}
        <button
          onClick={() => setActiveTab('stories')}
          className={`relative p-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'stories'
              ? 'bg-emerald-500/15 text-emerald-400 shadow-inner'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
          title="Stories & Status"
        >
          <CircleDot className="w-5 h-5 md:w-6 md:h-6" />
          {unviewedStories > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-neutral-900" />
          )}
        </button>

        {/* Communities / Spaces */}
        <button
          onClick={() => setActiveTab('communities')}
          className={`relative p-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'communities'
              ? 'bg-emerald-500/15 text-emerald-400 shadow-inner'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
          title="Communities & Spaces"
        >
          <Compass className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* WebRTC Calls */}
        <button
          onClick={() => setActiveTab('calls')}
          className={`relative p-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'calls'
              ? 'bg-emerald-500/15 text-emerald-400 shadow-inner'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
          title="WebRTC Calls"
        >
          <Phone className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Matrix Conference Hub */}
        <button
          onClick={() => setActiveTab('conference')}
          className={`relative p-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'conference'
              ? 'bg-emerald-500/15 text-emerald-400 shadow-inner'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
          title="Matrix Conference & Ecosystem Hub (matrix-conf-website)"
        >
          <Radio className="w-5 h-5 md:w-6 md:h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
        </button>

        {/* Business & Commerce */}
        <button
          onClick={() => setActiveTab('business')}
          className={`relative p-3 rounded-2xl transition-all duration-200 ${
            activeTab === 'business'
              ? 'bg-emerald-500/15 text-emerald-400 shadow-inner'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
          title="Business Suite & Catalog"
        >
          <Store className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Architecture & Cloud Blueprint */}
        <button
          onClick={() => setIsBlueprintOpen(true)}
          className="relative p-3 rounded-2xl text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-200"
          title="System Architecture Blueprint & Live Matrix Inspector"
        >
          <Layers className="w-5 h-5 md:w-6 md:h-6" />
          <span className="absolute -top-0.5 -right-0.5 px-1 py-0.2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded text-[9px] font-mono">
            DEV
          </span>
        </button>

        {/* Jitsi DevOps & Self-Hosting Hub */}
        <button
          onClick={() => setIsJitsiDevOpsOpen(true)}
          className="relative p-3 rounded-2xl text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-200"
          title="Jitsi-Meet Self-Hosting DevOps Guide (jitsi.github.io/handbook)"
        >
          <Server className="w-5 h-5 md:w-6 md:h-6" />
          <span className="absolute -top-0.5 -right-0.5 px-1 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[9px] font-mono">
            OPS
          </span>
        </button>
      </nav>

      {/* Footer Controls: UVS, E2EE, User Switcher, Settings */}
      <div className="flex flex-col items-center gap-2.5 pt-2">
        {/* Matrix User Verification Service (UVS) */}
        <button
          onClick={() => setIsUVSModalOpen(true)}
          title="Matrix User Verification Service (UVS & OpenID)"
          className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-xl transition-colors"
        >
          <UserCheck className="w-5 h-5" />
        </button>

        {/* E2EE Security Badge */}
        <button
          onClick={() => setIsE2EEOpen(true)}
          title="E2EE Olm/Megolm Encryption Active"
          className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl transition-colors"
        >
          <ShieldCheck className="w-5 h-5" />
        </button>

        {/* User Switcher Persona */}
        <button
          onClick={() => setIsUserSwitcherOpen(true)}
          className="relative group p-0.5 rounded-full ring-2 ring-emerald-500/40 hover:ring-emerald-400 transition-all"
          title={`Active: ${currentUser.name} (${currentUser.handle}) - Tap to switch persona`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-neutral-900" />
        </button>

        {/* Settings */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Settings & Preferences"
          className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-xl transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
