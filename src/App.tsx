import React from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import { SidebarNav } from './components/SidebarNav';
import { ChatList } from './components/ChatList';
import { ChatArea } from './components/ChatArea';
import { CommunitiesView } from './components/CommunitiesView';
import { CallsView } from './components/CallsView';
import { BusinessSuiteView } from './components/BusinessSuiteView';
import { MatrixConferenceView } from './components/MatrixConferenceView';
import { WebRTCCallModal } from './components/WebRTCCallModal';
import { StatusViewerModal } from './components/StatusViewerModal';
import { ArchitectureBlueprintModal } from './components/ArchitectureBlueprintModal';
import { E2EEVerificationModal } from './components/E2EEVerificationModal';
import { UserVerificationServiceModal } from './components/UserVerificationServiceModal';
import { UserSwitcherModal } from './components/UserSwitcherModal';
import { NewChatModal } from './components/NewChatModal';
import { SettingsModal } from './components/SettingsModal';
import { JitsiDevOpsHubModal } from './components/JitsiDevOpsHubModal';
import { MessageSquare, Compass, Phone, Store, Layers, CircleDot, Radio } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, totalUnread = 0 } = useChat() as any;

  return (
    <div className="flex h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans select-none antialiased">
      {/* Desktop / Tablet Left Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content Area */}
      <main className="flex-1 flex min-w-0 h-full overflow-hidden relative">
        {/* Chats Tab: Split ChatList + ChatArea */}
        {activeTab === 'chats' && (
          <div className="flex-1 flex h-full min-w-0">
            <ChatList />
            <ChatArea />
          </div>
        )}

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div className="flex-1 flex h-full min-w-0">
            <ChatList />
            <div className="flex-1 flex items-center justify-center bg-neutral-950 p-6 text-center">
              <div className="max-w-sm">
                <div className="w-14 h-14 rounded-3xl bg-neutral-900 border border-neutral-800 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CircleDot className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-neutral-100">
                  Status & Stories
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Click any avatar at the top of the chat list to view 24-hour disappearing photos and video updates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Communities / Spaces */}
        {activeTab === 'communities' && <CommunitiesView />}

        {/* Calls Log & Quick Connect */}
        {activeTab === 'calls' && <CallsView />}

        {/* Matrix Conference Hub (matrix-conf-website) */}
        {activeTab === 'conference' && <MatrixConferenceView />}

        {/* Business Suite & Mobile Commerce */}
        {activeTab === 'business' && <BusinessSuiteView />}
      </main>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-neutral-900/95 backdrop-blur border-t border-neutral-800 py-2 px-4 flex items-center justify-around z-40">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'chats' ? 'text-emerald-400' : 'text-neutral-400'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium">Chats</span>
        </button>

        <button
          onClick={() => setActiveTab('stories')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'stories' ? 'text-emerald-400' : 'text-neutral-400'
          }`}
        >
          <CircleDot className="w-5 h-5" />
          <span className="text-[10px] font-medium">Status</span>
        </button>

        <button
          onClick={() => setActiveTab('conference')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'conference' ? 'text-emerald-400' : 'text-neutral-400'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span className="text-[10px] font-medium">Conf</span>
        </button>

        <button
          onClick={() => setActiveTab('communities')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'communities' ? 'text-emerald-400' : 'text-neutral-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium">Spaces</span>
        </button>

        <button
          onClick={() => setActiveTab('calls')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'calls' ? 'text-emerald-400' : 'text-neutral-400'
          }`}
        >
          <Phone className="w-5 h-5" />
          <span className="text-[10px] font-medium">Calls</span>
        </button>

        <button
          onClick={() => setActiveTab('business')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'business' ? 'text-emerald-400' : 'text-neutral-400'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px] font-medium">Business</span>
        </button>
      </div>

      {/* Global Modals & Overlays */}
      <WebRTCCallModal />
      <StatusViewerModal />
      <ArchitectureBlueprintModal />
      <E2EEVerificationModal />
      <UserVerificationServiceModal />
      <UserSwitcherModal />
      <NewChatModal />
      <SettingsModal />
      <JitsiDevOpsHubModal />
    </div>
  );
};

export default function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
}
