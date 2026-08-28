import React, { useState } from 'react';
import {
  Compass,
  Users,
  Hash,
  Sparkles,
  ArrowRight,
  Shield,
  Search,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const CommunitiesView: React.FC = () => {
  const { communities, createRoom, setActiveTab, setActiveRoomId } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCommunities = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinChannel = (channel: { id: string; name: string; topic: string }) => {
    // Create or navigate to room
    const room = createRoom(channel.name, 'group', ['user_amara', 'user_kwame', 'user_brian'], channel.topic);
    setActiveRoomId(room.id);
    setActiveTab('chats');
  };

  return (
    <div className="flex-1 bg-neutral-950 flex flex-col h-full overflow-y-auto select-none p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                  <span>Communities & Matrix Spaces</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                    DECENTRALIZED
                  </span>
                </h1>
                <p className="text-xs text-neutral-400">
                  Discover public channels, developer spaces, and tech hubs across the Matrix federation
                </p>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Matrix Spaces..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className="rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all shadow-lg"
            >
              {/* Cover / Banner */}
              <div className="relative h-28 bg-neutral-950 overflow-hidden">
                <img
                  src={community.avatar}
                  alt={community.name}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-[10px] font-mono text-emerald-400 font-bold border border-neutral-700">
                  {community.membersCount.toLocaleString()} Members
                </span>
              </div>

              {/* Body info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-neutral-100">
                      {community.name}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {community.description}
                  </p>

                  {/* Channel list */}
                  <div className="mt-4 space-y-1.5">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                      Active Channels ({community.channels.length})
                    </span>
                    {community.channels.map((ch) => (
                      <div
                        key={ch.id}
                        onClick={() => handleJoinChannel(ch)}
                        className="flex items-center justify-between p-2 rounded-xl bg-neutral-950/80 hover:bg-neutral-800/80 border border-neutral-800 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Hash className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-xs font-semibold text-neutral-200 group-hover:text-emerald-300 truncate">
                            {ch.name}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-500">
                    matrix.wat.chat
                  </span>
                  <button
                    onClick={() => handleJoinChannel(community.channels[0])}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                  >
                    Enter Space
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
