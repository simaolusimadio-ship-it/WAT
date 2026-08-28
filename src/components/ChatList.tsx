import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Lock,
  Pin,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Mic,
  FileText,
  MapPin,
  CreditCard,
  ShoppingBag,
  Sparkles,
  VolumeX,
  Clock,
  CircleDot,
  Filter,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { Room } from '../types';

export const ChatList: React.FC = () => {
  const {
    rooms,
    activeRoomId,
    setActiveRoomId,
    currentUser,
    users,
    stories,
    setIsNewChatModalOpen,
    setIsStoryViewerOpen,
    setSelectedStoryIndex,
    togglePinRoom,
    toggleMuteRoom,
  } = useChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'groups' | 'business' | 'e2ee'>('all');

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Text search
      const matchesSearch =
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (room.topic && room.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (room.lastMessage && room.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Filter type
      if (filterType === 'unread') return room.unreadCount > 0;
      if (filterType === 'groups') return room.type === 'group' || room.type === 'community';
      if (filterType === 'business') return room.businessInfo !== undefined || room.id.includes('business');
      if (filterType === 'e2ee') return room.isEncrypted;

      return true;
    }).sort((a, b) => {
      // Pinned rooms first, then by last message timestamp
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const timeA = a.lastMessage?.timestamp || a.createdAt;
      const timeB = b.lastMessage?.timestamp || b.createdAt;
      return timeB - timeA;
    });
  }, [rooms, searchQuery, filterType]);

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getPeerUser = (room: Room) => {
    if (room.type !== 'direct') return null;
    const peerId = room.memberIds.find((id) => id !== currentUser.id) || room.memberIds[0];
    return users.find((u) => u.id === peerId);
  };

  return (
    <div className="w-full md:w-80 lg:w-96 bg-neutral-900 border-r border-neutral-800 flex flex-col h-full shrink-0 select-none">
      {/* Top Header */}
      <div className="p-3.5 pb-2 border-b border-neutral-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-100">
              Chats
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-medium">
              Synapse v1.98
            </span>
          </div>

          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-transform active:scale-95 shadow-md shadow-emerald-500/20 flex items-center justify-center"
            title="Start New Chat or Room"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Stories / Status Mini Rail */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2.5 pt-0.5 no-scrollbar">
          {/* My status trigger */}
          <div
            onClick={() => {
              setSelectedStoryIndex(0);
              setIsStoryViewerOpen(true);
            }}
            className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover p-0.5 ring-2 ring-neutral-700 group-hover:ring-emerald-400 transition-all"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 text-neutral-950 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-neutral-900">
                +
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 group-hover:text-neutral-200 truncate w-14 text-center">
              Your status
            </span>
          </div>

          {/* Contact stories */}
          {stories.map((story, idx) => (
            <div
              key={story.id}
              onClick={() => {
                setSelectedStoryIndex(idx);
                setIsStoryViewerOpen(true);
              }}
              className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group"
            >
              <div
                className={`p-0.5 rounded-full ${
                  story.viewed
                    ? 'ring-2 ring-neutral-700'
                    : 'bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 p-[2px]'
                }`}
              >
                <img
                  src={story.userAvatar}
                  alt={story.userName}
                  className="w-11 h-11 rounded-full object-cover bg-neutral-800"
                />
              </div>
              <span className="text-[11px] text-neutral-300 group-hover:text-emerald-400 truncate w-14 text-center font-medium">
                {story.userName.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Search input */}
        <div className="relative mt-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Matrix rooms, messages..."
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500/50 rounded-xl pl-9 pr-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar">
          {(['all', 'unread', 'groups', 'business', 'e2ee'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              {type === 'e2ee' ? '🔒 E2EE' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/40">
        {filteredRooms.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-xs">
            No rooms found matching "{searchQuery}"
          </div>
        ) : (
          filteredRooms.map((room) => {
            const isActive = room.id === activeRoomId;
            const peer = getPeerUser(room);
            const isOnline = peer ? peer.isOnline : false;

            return (
              <div
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`group flex items-center gap-3 p-3 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-neutral-800/90 border-l-4 border-emerald-500'
                    : 'hover:bg-neutral-800/50'
                }`}
              >
                {/* Avatar with status badge */}
                <div className="relative shrink-0">
                  <img
                    src={room.avatar}
                    alt={room.name}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-neutral-800"
                  />
                  {room.type === 'direct' && (
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-neutral-900 ${
                        isOnline ? 'bg-emerald-500' : 'bg-neutral-600'
                      }`}
                    />
                  )}
                  {room.type === 'channel' && (
                    <span className="absolute -bottom-1 -right-1 bg-cyan-500 text-neutral-950 p-0.5 rounded-full ring-2 ring-neutral-900">
                      <Sparkles className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Info & Last Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3 className="text-sm font-semibold text-neutral-100 truncate group-hover:text-emerald-300 transition-colors">
                        {room.name}
                      </h3>
                      {room.isEncrypted && (
                        <Lock className="w-3 h-3 text-emerald-400 shrink-0" title="E2EE Encrypted" />
                      )}
                      {room.businessInfo && (
                        <span className="px-1 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[9px] font-mono shrink-0">
                          BIZ
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                      {formatTimestamp(room.lastMessage?.timestamp || room.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    {/* Last message preview */}
                    <div className="flex items-center gap-1 min-w-0 pr-2 truncate">
                      {room.lastMessage?.senderId === currentUser.id && (
                        <span className="text-neutral-400 shrink-0">
                          {room.lastMessage.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                          ) : room.lastMessage.status === 'delivered' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-neutral-400 inline" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-neutral-500 inline" />
                          )}
                        </span>
                      )}

                      {/* Icon for media type */}
                      {room.lastMessage?.type === 'audio' && (
                        <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      {room.lastMessage?.type === 'image' && (
                        <ImageIcon className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      )}
                      {room.lastMessage?.type === 'file' && (
                        <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      {room.lastMessage?.type === 'location' && (
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      {room.lastMessage?.type === 'invoice' && (
                        <CreditCard className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      {room.lastMessage?.type === 'product_card' && (
                        <ShoppingBag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      )}

                      <span className="truncate">
                        {room.lastMessage
                          ? room.lastMessage.text || 'Media attachment'
                          : room.topic || 'No messages yet'}
                      </span>
                    </div>

                    {/* Right badges: Unread count, Pin, Mute, Disappearing */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {room.isMuted && <VolumeX className="w-3 h-3 text-neutral-500" />}
                      {room.disappearingTimer > 0 && (
                        <Clock className="w-3 h-3 text-amber-400" title="Disappearing timer active" />
                      )}
                      {room.isPinned && <Pin className="w-3 h-3 text-emerald-400 rotate-45" />}
                      {room.unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-emerald-500 text-neutral-950 font-bold text-[10px] rounded-full min-w-[18px] text-center shadow-sm">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
