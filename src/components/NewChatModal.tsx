import React, { useState } from 'react';
import { X, MessageSquare, Users, Shield, Plus, Lock } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const NewChatModal: React.FC = () => {
  const { isNewChatModalOpen, setIsNewChatModalOpen, users, currentUser, createRoom, setActiveTab } = useChat();

  const [chatType, setChatType] = useState<'direct' | 'group'>('direct');
  const [groupName, setGroupName] = useState('');
  const [groupTopic, setGroupTopic] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  if (!isNewChatModalOpen) return null;

  const contacts = users.filter((u) => u.id !== currentUser.id && u.id !== 'user_ai');

  const toggleUserSelection = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleStartDirectChat = (contact: typeof users[0]) => {
    const room = createRoom(contact.name, 'direct', [contact.id], contact.statusMessage);
    setIsNewChatModalOpen(false);
    setActiveTab('chats');
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    createRoom(groupName.trim(), 'group', selectedUserIds, groupTopic);
    setIsNewChatModalOpen(false);
    setActiveTab('chats');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl w-full max-w-md shadow-[0_24px_48px_rgba(0,0,0,0.14)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-white/60 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black/[0.05] text-neutral-900 border border-black/[0.08] flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                New Matrix Room
              </h3>
              <p className="text-xs text-neutral-500">
                Start a direct encrypted chat or multi-user group
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewChatModalOpen(false)}
            className="p-1.5 rounded-full text-neutral-500 hover:text-black hover:bg-black/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Direct vs Group */}
        <div className="p-4 border-b border-black/[0.06] flex gap-2">
          <button
            onClick={() => setChatType('direct')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              chatType === 'direct'
                ? 'bg-black text-white shadow-sm'
                : 'bg-black/[0.04] text-neutral-600 hover:text-black'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Chat (1:1)</span>
          </button>
          <button
            onClick={() => setChatType('group')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              chatType === 'group'
                ? 'bg-black text-white shadow-sm'
                : 'bg-black/[0.04] text-neutral-600 hover:text-black'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Encrypted Group</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 max-h-80 overflow-y-auto space-y-3">
          {chatType === 'direct' ? (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Select Contact to Message
              </span>
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleStartDirectChat(contact)}
                  className="p-2.5 rounded-2xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.06] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover border border-black/10"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">
                        {contact.name}
                      </h4>
                      <p className="text-[10px] font-mono text-neutral-500">
                        {contact.handle}
                      </p>
                    </div>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Group Room Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Lagos FinTech Engineers"
                  className="w-full mt-1 bg-black/[0.03] border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Room Topic
                </label>
                <input
                  type="text"
                  value={groupTopic}
                  onChange={(e) => setGroupTopic(e.target.value)}
                  placeholder="Brief room purpose"
                  className="w-full mt-1 bg-black/[0.03] border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                  Add Members ({selectedUserIds.length} selected)
                </label>
                <div className="space-y-1.5">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => toggleUserSelection(contact.id)}
                      className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                        selectedUserIds.includes(contact.id)
                          ? 'bg-black text-white border-black'
                          : 'bg-black/[0.02] border-black/[0.06] text-neutral-800 hover:bg-black/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold">{contact.name}</span>
                      </div>
                      <span className="text-xs font-bold">
                        {selectedUserIds.includes(contact.id) ? '✓' : '+'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {chatType === 'group' && (
          <div className="p-4 bg-white/60 border-t border-black/[0.06] flex justify-end">
            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim()}
              className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Create Encrypted Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
