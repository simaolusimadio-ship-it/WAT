import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  User,
  Room,
  Message,
  MessageType,
  MessageStatus,
  StoryStatus,
  CommunitySpace,
  ActiveCall,
  MatrixEventLog,
  InvoiceInfo,
  ProductInfo,
  LocationInfo,
  JitsiServerConfig,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ROOMS,
  INITIAL_MESSAGES,
  INITIAL_STORIES,
  INITIAL_COMMUNITIES,
  INITIAL_PRODUCTS,
} from '../data/initialData';
import { soundEngine } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface ChatContextType {
  // Users & Auth
  users: User[];
  currentUser: User;
  setCurrentUserById: (userId: string) => void;

  // Rooms
  rooms: Room[];
  activeRoomId: string;
  activeRoom: Room | undefined;
  setActiveRoomId: (id: string) => void;
  createRoom: (name: string, type: Room['type'], memberIds: string[], topic?: string) => Room;
  togglePinRoom: (roomId: string) => void;
  toggleMuteRoom: (roomId: string) => void;
  updateDisappearingTimer: (roomId: string, seconds: number) => void;

  // Messages
  messages: Message[];
  allMessages: Record<string, Message[]>;
  sendMessage: (params: {
    text: string;
    type?: MessageType;
    mediaUrl?: string;
    mediaInfo?: any;
    locationInfo?: LocationInfo;
    invoiceInfo?: InvoiceInfo;
    productInfo?: ProductInfo;
    contactInfo?: any;
    replyTo?: Message;
  }) => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  toggleStar: (messageId: string) => void;
  togglePinMessage: (messageId: string) => void;
  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string, forEveryone?: boolean) => void;
  translateMessage: (messageId: string, targetLanguage: string) => Promise<void>;
  transcribeMessage: (messageId: string) => Promise<void>;
  payInvoice: (messageId: string, paymentMethod: InvoiceInfo['paymentMethod']) => void;

  // Active Call (WebRTC & Jitsi Meet)
  activeCall: ActiveCall | null;
  startCall: (
    roomId: string,
    type: 'voice' | 'video',
    options?: {
      customDomain?: string;
      roomName?: string;
      mode?: 'jitsi_iframe' | 'interactive_mesh';
      isMobile?: boolean;
    }
  ) => void;
  startJitsiConference: (
    roomName?: string,
    type?: 'voice' | 'video',
    options?: {
      customDomain?: string;
      isMobile?: boolean;
    }
  ) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => void;
  toggleCallTileView: () => void;
  toggleCallLowBandwidth: () => void;
  toggleMobileLayout: () => void;
  setConferenceMode: (mode: 'jitsi_iframe' | 'interactive_mesh') => void;
  setCallE2EEKey: (key: string) => void;
  setCallPassword: (password: string) => void;

  // Social / Stories & Communities
  stories: StoryStatus[];
  communities: CommunitySpace[];
  addStory: (story: Omit<StoryStatus, 'id' | 'viewsCount' | 'viewed' | 'timestamp'>) => void;
  markStoryViewed: (storyId: string) => void;

  // Business Suite
  products: ProductInfo[];
  createInvoiceInChat: (amount: number, currency: InvoiceInfo['currency'], description: string, paymentMethod: InvoiceInfo['paymentMethod']) => void;
  shareProductInChat: (product: ProductInfo) => void;

  // Architecture & Matrix Events
  matrixLogs: MatrixEventLog[];
  logMatrixEvent: (type: string, endpoint: string, payloadSummary: string, direction?: 'inbound' | 'outbound') => void;

  // UI Navigation & Modals
  activeTab: 'chats' | 'stories' | 'communities' | 'calls' | 'business' | 'architecture' | 'conference';
  setActiveTab: (tab: 'chats' | 'stories' | 'communities' | 'calls' | 'business' | 'architecture' | 'conference') => void;
  isBlueprintOpen: boolean;
  setIsBlueprintOpen: (open: boolean) => void;
  isE2EEOpen: boolean;
  setIsE2EEOpen: (open: boolean) => void;
  isUVSModalOpen: boolean;
  setIsUVSModalOpen: (open: boolean) => void;
  isBusinessSuiteOpen: boolean;
  setIsBusinessSuiteOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isUserSwitcherOpen: boolean;
  setIsUserSwitcherOpen: (open: boolean) => void;
  isNewChatModalOpen: boolean;
  setIsNewChatModalOpen: (open: boolean) => void;
  isStarredDrawerOpen: boolean;
  setIsStarredDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isStoryViewerOpen: boolean;
  setIsStoryViewerOpen: (open: boolean) => void;
  selectedStoryIndex: number;
  setSelectedStoryIndex: (index: number) => void;
  isJitsiDevOpsOpen: boolean;
  setIsJitsiDevOpsOpen: (open: boolean) => void;
  jitsiServerConfig: JitsiServerConfig;
  setJitsiServerConfig: React.Dispatch<React.SetStateAction<JitsiServerConfig>>;

  // AI Helpers
  summarizeCurrentRoom: () => Promise<string>;
  generateSmartReplies: (lastMsg: string) => Promise<string[]>;
  rewriteText: (text: string, tone: string) => Promise<string>;

  // Typing simulation
  typingUsers: string[];
  sendTypingNotification: (isTyping: boolean) => void;
  simulatePeerTyping: (userName?: string, durationMs?: number) => void;
  markRoomAsRead: (roomId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('user_amara');
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string>('room_kwame');
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [stories, setStories] = useState<StoryStatus[]>(INITIAL_STORIES);
  const [communities] = useState<CommunitySpace[]>(INITIAL_COMMUNITIES);
  const [products] = useState<ProductInfo[]>(INITIAL_PRODUCTS);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Modals & Navigation
  const [activeTab, setActiveTab] = useState<'chats' | 'stories' | 'communities' | 'calls' | 'business' | 'architecture' | 'conference'>('chats');
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [isE2EEOpen, setIsE2EEOpen] = useState(false);
  const [isUVSModalOpen, setIsUVSModalOpen] = useState(false);
  const [isBusinessSuiteOpen, setIsBusinessSuiteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isStarredDrawerOpen, setIsStarredDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [isJitsiDevOpsOpen, setIsJitsiDevOpsOpen] = useState(false);
  const [jitsiServerConfig, setJitsiServerConfig] = useState<JitsiServerConfig>({
    serverDomain: 'meet.wat.chat',
    publicHttpPort: 80,
    publicHttpsPort: 443,
    jvbPort: 10000,
    enableAuth: true,
    authType: 'jwt',
    jwtAppId: 'wat_matrix_app',
    jwtAppSecret: 'sovereign_wat_secret_key_8892',
    enableGuests: true,
    enableLetsEncrypt: true,
    letsEncryptEmail: 'devops@wat.chat',
    enableJibri: true,
    enableJigasi: false,
    enableCoturn: true,
    enableOcto: true,
    configDirectory: '~/.jitsi-meet-cfg',
    isCustomServer: false,
  });

  // Active WebRTC Call
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);

  // Matrix Event Logs for Architecture Inspector
  const [matrixLogs, setMatrixLogs] = useState<MatrixEventLog[]>([
    {
      id: 'log_init_1',
      timestamp: Date.now() - 120000,
      type: 'm.room.encrypted (Megolm)',
      endpoint: '/_matrix/client/v3/sync?since=s7892_1',
      status: 200,
      direction: 'inbound',
      payloadSummary: 'Sync event: decrypted 4 megolm room sessions via vodozemac',
    },
    {
      id: 'log_init_2',
      timestamp: Date.now() - 60000,
      type: 'm.presence',
      endpoint: '/_matrix/client/v3/presence/@amara:wat.chat/status',
      status: 200,
      direction: 'outbound',
      payloadSummary: 'Presence updated to "online" via Redis pub/sub pool',
    },
    {
      id: 'log_init_3',
      timestamp: Date.now() - 30000,
      type: 'm.keys.query',
      endpoint: '/_matrix/client/v3/keys/query',
      status: 200,
      direction: 'outbound',
      payloadSummary: 'Fetched one-time Olm keys for @kwame:wat.chat & @brian:wat.chat',
    },
  ]);

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const activeRoom = useMemo(() => {
    return rooms.find((r) => r.id === activeRoomId);
  }, [rooms, activeRoomId]);

  const messages = useMemo(() => {
    return messagesByRoom[activeRoomId] || [];
  }, [messagesByRoom, activeRoomId]);

  const logMatrixEvent = (
    type: string,
    endpoint: string,
    payloadSummary: string,
    direction: 'inbound' | 'outbound' = 'outbound'
  ) => {
    const newLog: MatrixEventLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: Date.now(),
      type,
      endpoint,
      status: 200,
      direction,
      payloadSummary,
    };
    setMatrixLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const setCurrentUserById = (userId: string) => {
    setCurrentUserId(userId);
    logMatrixEvent(
      'm.session.switch',
      `/_matrix/client/v3/login/device/${userId}`,
      `Switched authenticated Matrix session to ${userId}`
    );
  };

  const markRoomAsRead = (roomId: string) => {
    setMessagesByRoom((prev) => {
      const roomMsgs = prev[roomId] || [];
      if (!roomMsgs.length) return prev;
      let hasChanges = false;
      const updated = roomMsgs.map((m) => {
        if (m.senderId !== currentUserId && m.status !== 'read') {
          hasChanges = true;
          return { ...m, status: 'read' as MessageStatus };
        }
        return m;
      });
      return hasChanges ? { ...prev, [roomId]: updated } : prev;
    });

    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, unreadCount: 0 } : r))
    );

    logMatrixEvent(
      'm.receipt',
      `/_matrix/client/v3/rooms/${roomId}/receipt/m.read`,
      `Dispatched Matrix m.receipt for room ${roomId}`
    );
  };

  const sendTypingNotification = (isTyping: boolean) => {
    if (!activeRoomId) return;
    if (isTyping) {
      logMatrixEvent(
        'm.typing',
        `/_matrix/client/v3/rooms/${activeRoomId}/typing/${currentUserId}`,
        `Broadcasted m.typing active event (timeout: 4000ms)`
      );
    }
  };

  const simulatePeerTyping = (userName?: string, durationMs: number = 3200) => {
    if (!activeRoom) return;
    const peerId = activeRoom.memberIds.find((id) => id !== currentUserId);
    const peer = users.find((u) => u.id === peerId);
    const name = userName || (peer ? peer.name : 'Participant');

    setTypingUsers((prev) => Array.from(new Set([...prev, name])));
    logMatrixEvent(
      'm.typing',
      `/_matrix/client/v3/rooms/${activeRoom.id}/typing/${peerId || 'peer'}`,
      `${name} is typing in ${activeRoom.name}`,
      'inbound'
    );

    setTimeout(() => {
      setTypingUsers((prev) => prev.filter((u) => u !== name));
    }, durationMs);
  };

  // Auto-mark room as read on active room change
  useEffect(() => {
    if (activeRoomId) {
      markRoomAsRead(activeRoomId);
    }
  }, [activeRoomId]);

  // Disappearing messages cleanup interval
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setMessagesByRoom((prev) => {
        let changed = false;
        const updated: Record<string, Message[]> = {};
        for (const [roomId, msgs] of Object.entries(prev)) {
          const messageList = (msgs || []) as Message[];
          const filtered = messageList.filter((m) => !m.expiresAt || m.expiresAt > now);
          if (filtered.length !== messageList.length) {
            changed = true;
          }
          updated[roomId] = filtered;
        }
        return changed ? updated : prev;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Send message
  const sendMessage = (params: {
    text: string;
    type?: MessageType;
    mediaUrl?: string;
    mediaInfo?: any;
    locationInfo?: LocationInfo;
    invoiceInfo?: InvoiceInfo;
    productInfo?: ProductInfo;
    contactInfo?: any;
    replyTo?: Message;
  }) => {
    if (!activeRoom) return;

    const expiresAt =
      activeRoom.disappearingTimer > 0
        ? Date.now() + activeRoom.disappearingTimer * 1000
        : undefined;

    const newMsg: Message = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      roomId: activeRoom.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: params.text,
      timestamp: Date.now(),
      status: 'delivered',
      type: params.type || 'text',
      mediaUrl: params.mediaUrl,
      mediaInfo: params.mediaInfo,
      locationInfo: params.locationInfo,
      invoiceInfo: params.invoiceInfo,
      productInfo: params.productInfo,
      contactInfo: params.contactInfo,
      replyTo: params.replyTo
        ? {
            id: params.replyTo.id,
            senderName: params.replyTo.senderName,
            text: params.replyTo.text,
            type: params.replyTo.type,
          }
        : undefined,
      reactions: {},
      isEncrypted: activeRoom.isEncrypted,
      e2eeAlgorithm: activeRoom.isEncrypted ? 'm.megolm.v1.aes-sha2' : undefined,
      expiresAt,
    };

    // Play sound
    soundEngine.playMessageSent();

    // Log Matrix Synapse CS-API event
    logMatrixEvent(
      activeRoom.isEncrypted ? 'm.room.encrypted' : 'm.room.message',
      `/_matrix/client/v3/rooms/${activeRoom.id}/send/m.room.message/${newMsg.id}`,
      `Sent ${params.type || 'text'} event (${params.text.slice(0, 35)}...)`
    );

    setMessagesByRoom((prev) => ({
      ...prev,
      [activeRoom.id]: [...(prev[activeRoom.id] || []), newMsg],
    }));

    // Progressive status update: 'sending' -> 'sent' -> 'delivered' -> 'read'
    setTimeout(() => {
      setMessagesByRoom((prev) => {
        const roomMsgs = prev[activeRoom.id] || [];
        const updated = roomMsgs.map((m) =>
          m.id === newMsg.id ? { ...m, status: 'sent' as MessageStatus } : m
        );
        return { ...prev, [activeRoom.id]: updated };
      });
    }, 250);

    setTimeout(() => {
      setMessagesByRoom((prev) => {
        const roomMsgs = prev[activeRoom.id] || [];
        const updated = roomMsgs.map((m) =>
          m.id === newMsg.id ? { ...m, status: 'delivered' as MessageStatus } : m
        );
        return { ...prev, [activeRoom.id]: updated };
      });
    }, 700);

    // If direct chat or AI bot, simulate peer read receipt transition
    if (activeRoom.type === 'direct' || activeRoom.id === 'room_ai_assistant') {
      setTimeout(() => {
        setMessagesByRoom((prev) => {
          const roomMsgs = prev[activeRoom.id] || [];
          const updated = roomMsgs.map((m) =>
            m.id === newMsg.id ? { ...m, status: 'read' as MessageStatus } : m
          );
          return { ...prev, [activeRoom.id]: updated };
        });
        logMatrixEvent(
          'm.receipt',
          `/_matrix/client/v3/rooms/${activeRoom.id}/receipt/m.read/${newMsg.id}`,
          `Peer read receipt confirmed for message ${newMsg.id}`,
          'inbound'
        );
      }, 2200);
    }

    // Update room's last message
    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoom.id
          ? {
              ...r,
              lastMessage: newMsg,
              unreadCount: 0,
            }
          : r
      )
    );

    // Trigger intelligent automated response if sending to WAT AI Copilot or Business account
    if (activeRoom.id === 'room_ai_assistant' || activeRoom.memberIds.includes('user_ai')) {
      handleAICopilotResponse(activeRoom.id, params.text);
    } else if (activeRoom.businessInfo?.autoReplyEnabled && currentUser.id !== 'user_business') {
      handleBusinessAutoReply(activeRoom);
    } else if (activeRoom.type === 'direct') {
      // Occasional realistic companion response simulation
      handleSimulatedPeerReply(activeRoom, params.text);
    }
  };

  // AI Copilot response handler
  const handleAICopilotResponse = async (roomId: string, userPrompt: string) => {
    setTypingUsers((prev) => [...prev, 'WAT AI Copilot']);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      const data = await res.json();
      const aiReplyText = data.reply || 'I am processing your Matrix request.';

      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u !== 'WAT AI Copilot'));

        const aiMsg: Message = {
          id: 'msg_ai_' + Date.now(),
          roomId,
          senderId: 'user_ai',
          senderName: 'WAT AI Copilot',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
          text: aiReplyText,
          timestamp: Date.now(),
          status: 'read',
          type: 'text',
          reactions: {},
        };

        soundEngine.playMessageReceived();
        setMessagesByRoom((prev) => ({
          ...prev,
          [roomId]: [...(prev[roomId] || []), aiMsg],
        }));

        setRooms((prev) =>
          prev.map((r) =>
            r.id === roomId ? { ...r, lastMessage: aiMsg } : r
          )
        );
      }, 900);
    } catch (e) {
      setTypingUsers((prev) => prev.filter((u) => u !== 'WAT AI Copilot'));
    }
  };

  // Business auto-reply handler
  const handleBusinessAutoReply = (room: Room) => {
    const peerId = room.memberIds.find((id) => id !== currentUser.id);
    const peer = users.find((u) => u.id === peerId);
    if (!peer) return;

    setTimeout(() => {
      setTypingUsers((prev) => [...prev, peer.name]);
    }, 600);

    setTimeout(() => {
      setTypingUsers((prev) => prev.filter((u) => u !== peer.name));

      const replyText =
        room.businessInfo?.autoReplyMessage ||
        'Thank you for reaching out to our official store! How can we assist you with our catalog today?';

      const replyMsg: Message = {
        id: 'msg_biz_' + Date.now(),
        roomId: room.id,
        senderId: peer.id,
        senderName: peer.name,
        senderAvatar: peer.avatar,
        text: replyText,
        timestamp: Date.now(),
        status: 'delivered',
        type: 'text',
        reactions: {},
        isEncrypted: room.isEncrypted,
      };

      soundEngine.playMessageReceived();
      setMessagesByRoom((prev) => ({
        ...prev,
        [room.id]: [...(prev[room.id] || []), replyMsg],
      }));
    }, 1800);
  };

  // Simulated peer reply
  const handleSimulatedPeerReply = (room: Room, text: string) => {
    // Only simulate if user sends a question or greeting
    const peerId = room.memberIds.find((id) => id !== currentUser.id);
    if (!peerId || peerId === 'user_ai') return;
    const peer = users.find((u) => u.id === peerId);
    if (!peer) return;

    if (
      text.toLowerCase().includes('hello') ||
      text.toLowerCase().includes('habari') ||
      text.toLowerCase().includes('hey') ||
      text.toLowerCase().includes('call') ||
      text.toLowerCase().includes('ready')
    ) {
      setTimeout(() => {
        setTypingUsers((prev) => [...prev, peer.name]);
      }, 1000);

      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u !== peer.name));

        const replies = [
          'Got it! Syncing with the Matrix Synapse worker now 👍',
          'Sounds fantastic! Ready whenever you are.',
          'Checking this on my device. E2EE key matches perfectly! 🔒',
          'Habari! Let me review this and get back to you shortly.',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMsg: Message = {
          id: 'msg_peer_' + Date.now(),
          roomId: room.id,
          senderId: peer.id,
          senderName: peer.name,
          senderAvatar: peer.avatar,
          text: randomReply,
          timestamp: Date.now(),
          status: 'delivered',
          type: 'text',
          reactions: {},
          isEncrypted: room.isEncrypted,
        };

        soundEngine.playMessageReceived();
        setMessagesByRoom((prev) => ({
          ...prev,
          [room.id]: [...(prev[room.id] || []), replyMsg],
        }));

        setRooms((prev) =>
          prev.map((r) =>
            r.id === room.id ? { ...r, lastMessage: replyMsg } : r
          )
        );
      }, 3000);
    }
  };

  // Toggle reaction
  const toggleReaction = (messageId: string, emoji: string) => {
    if (!activeRoom) return;
    soundEngine.playReactionPop();

    logMatrixEvent(
      'm.reaction',
      `/_matrix/client/v3/rooms/${activeRoom.id}/send/m.reaction`,
      `Reacted ${emoji} to event ${messageId}`
    );

    setMessagesByRoom((prev) => {
      const roomMsgs = prev[activeRoom.id] || [];
      const updated = roomMsgs.map((msg) => {
        if (msg.id !== messageId) return msg;

        const currentReaction = msg.reactions[emoji] || {
          emoji,
          count: 0,
          userIds: [],
        };
        const hasReacted = currentReaction.userIds.includes(currentUser.id);

        let newUserIds: string[];
        let newCount: number;

        if (hasReacted) {
          newUserIds = currentReaction.userIds.filter((id) => id !== currentUser.id);
          newCount = Math.max(0, currentReaction.count - 1);
        } else {
          newUserIds = [...currentReaction.userIds, currentUser.id];
          newCount = currentReaction.count + 1;
        }

        const newReactions = { ...msg.reactions };
        if (newCount === 0) {
          delete newReactions[emoji];
        } else {
          newReactions[emoji] = {
            emoji,
            count: newCount,
            userIds: newUserIds,
          };
        }

        return {
          ...msg,
          reactions: newReactions,
        };
      });
      return { ...prev, [activeRoom.id]: updated };
    });
  };

  // Toggle Star message
  const toggleStar = (messageId: string) => {
    if (!activeRoom) return;
    setMessagesByRoom((prev) => {
      const roomMsgs = prev[activeRoom.id] || [];
      const updated = roomMsgs.map((m) =>
        m.id === messageId ? { ...m, isStarred: !m.isStarred } : m
      );
      return { ...prev, [activeRoom.id]: updated };
    });
  };

  // Toggle Pin message
  const togglePinMessage = (messageId: string) => {
    if (!activeRoom) return;
    setMessagesByRoom((prev) => {
      const roomMsgs = prev[activeRoom.id] || [];
      const updated = roomMsgs.map((m) =>
        m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
      );
      return { ...prev, [activeRoom.id]: updated };
    });
  };

  // Edit message
  const editMessage = (messageId: string, newText: string) => {
    if (!activeRoom) return;
    logMatrixEvent(
      'm.room.message (edit)',
      `/_matrix/client/v3/rooms/${activeRoom.id}/send/m.room.message/edit`,
      `Edited message ${messageId}`
    );

    setMessagesByRoom((prev) => {
      const roomMsgs = prev[activeRoom.id] || [];
      const updated = roomMsgs.map((m) => {
        if (m.id !== messageId) return m;
        const history = m.editHistory || [{ text: m.text, timestamp: m.timestamp }];
        return {
          ...m,
          text: newText,
          isEdited: true,
          editedAt: Date.now(),
          editHistory: [...history, { text: newText, timestamp: Date.now() }],
        };
      });
      return { ...prev, [activeRoom.id]: updated };
    });
  };

  // Delete message
  const deleteMessage = (messageId: string, forEveryone: boolean = true) => {
    if (!activeRoom) return;
    logMatrixEvent(
      'm.room.redaction',
      `/_matrix/client/v3/rooms/${activeRoom.id}/redact/${messageId}`,
      `Redacted event ${messageId}`
    );

    setMessagesByRoom((prev) => {
      const roomMsgs = prev[activeRoom.id] || [];
      const updated = roomMsgs.filter((m) => m.id !== messageId);
      return { ...prev, [activeRoom.id]: updated };
    });
  };

  // Translate message via AI endpoint
  const translateMessage = async (messageId: string, targetLanguage: string) => {
    if (!activeRoom) return;
    const targetMsg = messages.find((m) => m.id === messageId);
    if (!targetMsg) return;

    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: targetMsg.text,
          targetLanguage,
        }),
      });
      const data = await res.json();
      if (data.translatedText) {
        setMessagesByRoom((prev) => {
          const roomMsgs = prev[activeRoom.id] || [];
          const updated = roomMsgs.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  translatedText: data.translatedText,
                  translatedLang: targetLanguage,
                }
              : m
          );
          return { ...prev, [activeRoom.id]: updated };
        });
      }
    } catch (e) {
      console.error('Translation failed', e);
    }
  };

  // Transcribe audio message via AI
  const transcribeMessage = async (messageId: string) => {
    if (!activeRoom) return;
    const targetMsg = messages.find((m) => m.id === messageId);
    if (!targetMsg) return;

    try {
      const res = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationSeconds: targetMsg.mediaInfo?.duration || 15,
        }),
      });
      const data = await res.json();
      if (data.transcript) {
        setMessagesByRoom((prev) => {
          const roomMsgs = prev[activeRoom.id] || [];
          const updated = roomMsgs.map((m) =>
            m.id === messageId
              ? { ...m, transcription: data.transcript }
              : m
          );
          return { ...prev, [activeRoom.id]: updated };
        });
      }
    } catch (e) {
      console.error('Transcription failed', e);
    }
  };

  // Pay invoice with instant confetti
  const payInvoice = (messageId: string, paymentMethod: InvoiceInfo['paymentMethod']) => {
    if (!activeRoom) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    logMatrixEvent(
      'm.payment.settlement',
      `/_api/payments/momo/verify/${messageId}`,
      `Settled payment via ${paymentMethod}`
    );

    setMessagesByRoom((prev) => {
      const roomMsgs = prev[activeRoom.id] || [];
      const updated = roomMsgs.map((m) => {
        if (m.id !== messageId || !m.invoiceInfo) return m;
        return {
          ...m,
          invoiceInfo: {
            ...m.invoiceInfo,
            status: 'paid' as const,
            paidAt: Date.now(),
            paymentMethod,
          },
        };
      });
      return { ...prev, [activeRoom.id]: updated };
    });
  };

  // Create room
  const createRoom = (name: string, type: Room['type'], memberIds: string[], topic?: string): Room => {
    const newRoom: Room = {
      id: 'room_' + Date.now(),
      name,
      type,
      avatar:
        type === 'group'
          ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      topic: topic || 'New Matrix Room',
      isEncrypted: type !== 'channel',
      e2eeSessionId: 'megolm_sess_' + Date.now(),
      memberIds: Array.from(new Set([currentUser.id, ...memberIds])),
      unreadCount: 0,
      disappearingTimer: 0,
      createdAt: Date.now(),
    };

    setRooms((prev) => [newRoom, ...prev]);
    setMessagesByRoom((prev) => ({ ...prev, [newRoom.id]: [] }));
    setActiveRoomId(newRoom.id);

    logMatrixEvent(
      'm.room.create',
      `/_matrix/client/v3/createRoom`,
      `Created room "${name}" (type: ${type})`
    );

    return newRoom;
  };

  const togglePinRoom = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, isPinned: !r.isPinned } : r))
    );
  };

  const toggleMuteRoom = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, isMuted: !r.isMuted } : r))
    );
  };

  const updateDisappearingTimer = (roomId: string, seconds: number) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, disappearingTimer: seconds } : r
      )
    );
  };

  // WebRTC & Jitsi Meet Call actions
  const startCall = (
    roomId: string,
    type: 'voice' | 'video',
    options?: {
      customDomain?: string;
      roomName?: string;
      mode?: 'jitsi_iframe' | 'interactive_mesh';
      isMobile?: boolean;
    }
  ) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    soundEngine.startRingingTone();

    const participants = room.memberIds.map((mId) => {
      const u = users.find((user) => user.id === mId) || {
        id: mId,
        name: 'Member',
        avatar: '',
      };
      return {
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        isSpeaking: u.id !== currentUser.id,
        isMuted: false,
        hasVideo: type === 'video',
      };
    });

    const cleanRoomName = options?.roomName || `wat-${room.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const domain = options?.customDomain || jitsiServerConfig.serverDomain || 'meet.jit.si';
    const isMobile = options?.isMobile ?? (typeof window !== 'undefined' && window.innerWidth < 768);

    const call: ActiveCall = {
      id: 'call_' + Date.now(),
      roomId: room.id,
      roomName: room.name,
      roomAvatar: room.avatar,
      type,
      status: 'ringing',
      duration: 0,
      isMuted: false,
      isCameraOff: false,
      isScreenSharing: false,
      isSpeakerOn: true,
      isE2EEEnabled: true,
      e2eeKey: 'wat_e2ee_' + Math.random().toString(36).substring(2, 10),
      jitsiDomain: domain,
      jitsiRoomName: cleanRoomName,
      conferenceMode: options?.mode || 'jitsi_iframe',
      isTileView: true,
      isLowBandwidth: false,
      isMobileLayout: isMobile,
      participants,
    };

    setActiveCall(call);

    logMatrixEvent(
      'm.call.invite',
      `/_matrix/client/v3/rooms/${room.id}/send/m.call.invite`,
      `Initiated Jitsi Meet & WebRTC ${type} call signaling session (room: ${cleanRoomName})`
    );

    // Auto-answer simulation after 1.8 seconds
    setTimeout(() => {
      soundEngine.stopRingingTone();
      soundEngine.playCallConnected();
      setActiveCall((prev) =>
        prev
          ? {
              ...prev,
              status: 'connected',
              startTime: Date.now(),
            }
          : null
      );
    }, 1800);
  };

  const startJitsiConference = (
    customRoomName?: string,
    type: 'voice' | 'video' = 'video',
    options?: {
      customDomain?: string;
      isMobile?: boolean;
    }
  ) => {
    soundEngine.startRingingTone();

    const cleanRoomName =
      customRoomName?.trim() ||
      `wat-matrix-conf-${Date.now().toString().slice(-5)}`;
    const domain = options?.customDomain || jitsiServerConfig.serverDomain || 'meet.jit.si';
    const isMobile = options?.isMobile ?? (typeof window !== 'undefined' && window.innerWidth < 768);

    const call: ActiveCall = {
      id: 'conf_' + Date.now(),
      roomId: 'conference_global',
      roomName: customRoomName || 'Jitsi Scalable Video Conference',
      roomAvatar: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=150&auto=format&fit=crop&q=80',
      type,
      status: 'ringing',
      duration: 0,
      isMuted: false,
      isCameraOff: false,
      isScreenSharing: false,
      isSpeakerOn: true,
      isE2EEEnabled: true,
      e2eeKey: 'wat_e2ee_' + Math.random().toString(36).substring(2, 10),
      jitsiDomain: domain,
      jitsiRoomName: cleanRoomName,
      conferenceMode: 'jitsi_iframe',
      isTileView: true,
      isLowBandwidth: false,
      isMobileLayout: isMobile,
      participants: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          isSpeaking: false,
          isMuted: false,
          hasVideo: type === 'video',
        },
        {
          id: 'user_speaker_1',
          name: 'Amara Diop (Video SFU)',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          isSpeaking: true,
          isMuted: false,
          hasVideo: true,
        },
        {
          id: 'user_speaker_2',
          name: 'Kwame Mensah (OCTO Node)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          isSpeaking: false,
          isMuted: false,
          hasVideo: true,
        }
      ],
    };

    setActiveCall(call);

    logMatrixEvent(
      'im.vector.modular.widgets.jitsi',
      `/_matrix/client/v3/rooms/global/jitsi_widget`,
      `Created scalable Jitsi Meet conference: ${cleanRoomName} on ${domain}`
    );

    setTimeout(() => {
      soundEngine.stopRingingTone();
      soundEngine.playCallConnected();
      setActiveCall((prev) =>
        prev
          ? {
              ...prev,
              status: 'connected',
              startTime: Date.now(),
            }
          : null
      );
    }, 1200);
  };

  const endCall = () => {
    soundEngine.stopRingingTone();
    if (activeCall) {
      logMatrixEvent(
        'm.call.hangup',
        `/_matrix/client/v3/rooms/${activeCall.roomId}/send/m.call.hangup`,
        `Ended Jitsi WebRTC call duration: ${activeCall.duration}s`
      );
    }
    setActiveCall(null);
  };

  const toggleMute = () => {
    setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  };

  const toggleCamera = () => {
    setActiveCall((prev) =>
      prev ? { ...prev, isCameraOff: !prev.isCameraOff } : null
    );
  };

  const toggleScreenShare = () => {
    setActiveCall((prev) =>
      prev ? { ...prev, isScreenSharing: !prev.isScreenSharing } : null
    );
  };

  const toggleCallTileView = () => {
    setActiveCall((prev) =>
      prev ? { ...prev, isTileView: !prev.isTileView } : null
    );
  };

  const toggleCallLowBandwidth = () => {
    setActiveCall((prev) =>
      prev ? { ...prev, isLowBandwidth: !prev.isLowBandwidth } : null
    );
  };

  const toggleMobileLayout = () => {
    setActiveCall((prev) =>
      prev ? { ...prev, isMobileLayout: !prev.isMobileLayout } : null
    );
  };

  const setConferenceMode = (mode: 'jitsi_iframe' | 'interactive_mesh') => {
    setActiveCall((prev) => (prev ? { ...prev, conferenceMode: mode } : null));
  };

  const setCallE2EEKey = (key: string) => {
    setActiveCall((prev) => (prev ? { ...prev, e2eeKey: key } : null));
  };

  const setCallPassword = (password: string) => {
    setActiveCall((prev) => (prev ? { ...prev, roomPassword: password } : null));
  };

  // Call duration counter
  useEffect(() => {
    if (!activeCall || activeCall.status !== 'connected') return;
    const interval = setInterval(() => {
      setActiveCall((prev) =>
        prev ? { ...prev, duration: prev.duration + 1 } : null
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCall?.status]);

  // Stories
  const addStory = (storyData: Omit<StoryStatus, 'id' | 'viewsCount' | 'viewed' | 'timestamp'>) => {
    const newStory: StoryStatus = {
      ...storyData,
      id: 'story_' + Date.now(),
      viewsCount: 1,
      viewed: false,
      timestamp: Date.now(),
    };
    setStories((prev) => [newStory, ...prev]);
  };

  const markStoryViewed = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, viewed: true } : s))
    );
  };

  // Business invoice creator in chat
  const createInvoiceInChat = (
    amount: number,
    currency: InvoiceInfo['currency'],
    description: string,
    paymentMethod: InvoiceInfo['paymentMethod']
  ) => {
    const invoice: InvoiceInfo = {
      invoiceId: 'WAT-INV-' + Math.floor(1000 + Math.random() * 9000),
      amount,
      currency,
      description,
      status: 'pending',
      paymentMethod,
    };
    sendMessage({
      text: `Invoice: ${currency} ${amount} for ${description}`,
      type: 'invoice',
      invoiceInfo: invoice,
    });
  };

  // Share product in chat
  const shareProductInChat = (product: ProductInfo) => {
    sendMessage({
      text: `🛍️ Product: ${product.name} - ${product.currency} ${product.price}`,
      type: 'product_card',
      productInfo: product,
    });
  };

  // AI Helpers
  const summarizeCurrentRoom = async (): Promise<string> => {
    if (!activeRoom) return 'No active room.';
    const roomMsgs = messages.slice(-20);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: activeRoom.name,
          messages: roomMsgs,
        }),
      });
      const data = await res.json();
      return data.summary || 'Summary unavailable.';
    } catch (e) {
      return 'Could not summarize conversation.';
    }
  };

  const generateSmartReplies = async (lastMsg: string): Promise<string[]> => {
    try {
      const res = await fetch('/api/ai/smart-replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastMessage: lastMsg }),
      });
      const data = await res.json();
      return data.suggestions || ['Sounds great!', 'Received 👍', 'Will check shortly'];
    } catch (e) {
      return ['Sounds good!', 'Understood 👍', 'Let me review'];
    }
  };

  const rewriteText = async (text: string, tone: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tone }),
      });
      const data = await res.json();
      return data.rewrittenText || text;
    } catch (e) {
      return text;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUserById,
        rooms,
        activeRoomId,
        activeRoom,
        setActiveRoomId,
        createRoom,
        togglePinRoom,
        toggleMuteRoom,
        updateDisappearingTimer,
        messages,
        allMessages: messagesByRoom,
        sendMessage,
        toggleReaction,
        toggleStar,
        togglePinMessage,
        editMessage,
        deleteMessage,
        translateMessage,
        transcribeMessage,
        payInvoice,
        activeCall,
        startCall,
        startJitsiConference,
        endCall,
        toggleMute,
        toggleCamera,
        toggleScreenShare,
        toggleCallTileView,
        toggleCallLowBandwidth,
        toggleMobileLayout,
        setConferenceMode,
        setCallE2EEKey,
        setCallPassword,
        stories,
        communities,
        addStory,
        markStoryViewed,
        products,
        createInvoiceInChat,
        shareProductInChat,
        matrixLogs,
        logMatrixEvent,
        activeTab,
        setActiveTab,
        isBlueprintOpen,
        setIsBlueprintOpen,
        isE2EEOpen,
        setIsE2EEOpen,
        isUVSModalOpen,
        setIsUVSModalOpen,
        isBusinessSuiteOpen,
        setIsBusinessSuiteOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isUserSwitcherOpen,
        setIsUserSwitcherOpen,
        isNewChatModalOpen,
        setIsNewChatModalOpen,
        isStarredDrawerOpen,
        setIsStarredDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        isStoryViewerOpen,
        setIsStoryViewerOpen,
        selectedStoryIndex,
        setSelectedStoryIndex,
        isJitsiDevOpsOpen,
        setIsJitsiDevOpsOpen,
        jitsiServerConfig,
        setJitsiServerConfig,
        summarizeCurrentRoom,
        generateSmartReplies,
        rewriteText,
        typingUsers,
        sendTypingNotification,
        simulatePeerTyping,
        markRoomAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
