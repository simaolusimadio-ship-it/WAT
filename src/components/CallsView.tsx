import React, { useState } from 'react';
import {
  Phone,
  Video,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  ShieldCheck,
  Plus,
  Server,
  Terminal,
  ExternalLink,
  Smartphone,
  QrCode,
  Sparkles,
  Users,
  Copy,
  Check,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const CallsView: React.FC = () => {
  const {
    rooms,
    startCall,
    startJitsiConference,
    users,
    currentUser,
    setIsJitsiDevOpsOpen,
    jitsiServerConfig,
  } = useChat();

  const [customRoomName, setCustomRoomName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const callHistory = [
    {
      id: 'call_h1',
      room: rooms.find((r) => r.id === 'room_kwame') || rooms[0],
      type: 'video' as const,
      direction: 'incoming' as const,
      status: 'answered' as const,
      time: 'Today, 2:15 PM',
      duration: '14m 32s',
    },
    {
      id: 'call_h2',
      room: rooms.find((r) => r.id === 'room_brian') || rooms[1],
      type: 'voice' as const,
      direction: 'outgoing' as const,
      status: 'answered' as const,
      time: 'Yesterday, 6:40 PM',
      duration: '5m 12s',
    },
    {
      id: 'call_h3',
      room: rooms.find((r) => r.id === 'room_zainab') || rooms[2],
      type: 'voice' as const,
      direction: 'incoming' as const,
      status: 'missed' as const,
      time: 'May 12, 11:20 AM',
      duration: '0s',
    },
  ];

  const handleStartCustomMeeting = () => {
    const name = customRoomName.trim() || `wat-conference-${Date.now().toString().slice(-4)}`;
    startJitsiConference(name, 'video');
  };

  return (
    <div className="flex-1 bg-neutral-950 flex flex-col h-full overflow-y-auto select-none p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                <span>Calls & Video Conferences</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                  JITSI MEET SFU
                </span>
              </h1>
              <p className="text-xs text-neutral-400">
                Connected to sovereign server: <span className="text-emerald-400 font-mono">{jitsiServerConfig.serverDomain}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsJitsiDevOpsOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/40 transition-all active:scale-95 self-start md:self-auto"
          >
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Jitsi DevOps & Self-Hosting Guide</span>
          </button>
        </div>

        {/* Instant Jitsi Meet Conference Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/30 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono">
                  SECURE & SCALABLE
                </span>
                <span className="text-xs text-neutral-400">Web & Mobile Compatible</span>
              </div>
              <h2 className="text-base font-bold text-neutral-100">
                Create an Instant Jitsi Video Conference
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Launch end-to-end encrypted multi-user video meetings powered by Jitsi Meet. Seamlessly connect from your web browser or scan to join on the Jitsi Meet mobile app.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                value={customRoomName}
                onChange={(e) => setCustomRoomName(e.target.value)}
                placeholder="Room name (optional)"
                className="px-3.5 py-2 rounded-xl bg-neutral-950/80 border border-neutral-700 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 min-w-[180px]"
              />
              <button
                onClick={handleStartCustomMeeting}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all active:scale-95 shrink-0"
              >
                <Video className="w-4 h-4" />
                <span>Start Meeting</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Dial Matrix Contacts */}
        <div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
            Quick Connect Contacts
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {users
              .filter((u) => u.id !== currentUser.id && u.id !== 'user_ai')
              .map((contact) => {
                const targetRoom = rooms.find((r) => r.memberIds.includes(contact.id)) || rooms[0];
                return (
                  <div
                    key={contact.id}
                    className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center text-center gap-2"
                  >
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-neutral-700"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-neutral-900 ${
                          contact.isOnline ? 'bg-emerald-500' : 'bg-neutral-600'
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-100 truncate w-28">
                        {contact.name}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        {contact.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => startCall(targetRoom.id, 'voice')}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-400 transition-colors"
                        title="Voice Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => startCall(targetRoom.id, 'video')}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-400 transition-colors"
                        title="Jitsi Video Call"
                      >
                        <Video className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Call History */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
            Recent Call Activity
          </h3>
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl divide-y divide-neutral-800 overflow-hidden">
            {callHistory.map((call) => (
              <div
                key={call.id}
                className="p-4 flex items-center justify-between hover:bg-neutral-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={call.room.avatar}
                    alt={call.room.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-neutral-100">
                      {call.room.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                      {call.status === 'missed' ? (
                        <PhoneMissed className="w-3.5 h-3.5 text-rose-400" />
                      ) : call.direction === 'incoming' ? (
                        <PhoneIncoming className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <PhoneOutgoing className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                      <span>{call.time}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px]">{call.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startCall(call.room.id, call.type)}
                    className="p-2.5 rounded-xl bg-neutral-800 hover:bg-emerald-500 hover:text-neutral-950 text-neutral-200 transition-colors"
                    title={`Call back (${call.type})`}
                  >
                    {call.type === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

