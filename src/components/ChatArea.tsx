import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Video,
  ShieldCheck,
  Sparkles,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  X,
  Pin,
  Clock,
  ChevronDown,
  Trash2,
  Check,
  CreditCard,
  Image as ImageIcon,
  FileText,
  MapPin,
  ShoppingBag,
  Wand2,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { MessageItem } from './MessageItem';
import { Message, ProductInfo } from '../types';
import { soundEngine } from '../utils/audioSynth';
import { EmojibasePicker } from './EmojibasePicker';
import { extractActiveShortcode, searchEmojibase } from '../utils/emojibaseData';

export const ChatArea: React.FC = () => {
  const {
    activeRoom,
    messages,
    sendMessage,
    currentUser,
    users,
    typingUsers,
    sendTypingNotification,
    simulatePeerTyping,
    startCall,
    setIsE2EEOpen,
    setIsBlueprintOpen,
    updateDisappearingTimer,
    summarizeCurrentRoom,
    generateSmartReplies,
    rewriteText,
    products,
    createInvoiceInChat,
    shareProductInChat,
    jitsiServerConfig,
  } = useChat();

  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDisappearingMenu, setShowDisappearingMenu] = useState(false);
  const [showSmartReplies, setShowSmartReplies] = useState(true);
  const [smartReplies, setSmartReplies] = useState<string[]>([
    'Sounds great! 👍',
    'Received with thanks',
    'Let me check on this 🚀',
  ]);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

  // Invoice creation mini-modal
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState('50');
  const [invoiceDesc, setInvoiceDesc] = useState('Consultation & Architecture Review');
  const [invoiceCurrency, setInvoiceCurrency] = useState<'USD' | 'KES' | 'NGN' | 'GHS'>('USD');
  const [invoiceMethod, setInvoiceMethod] = useState<'M-Pesa' | 'MTN MoMo' | 'Card'>('M-Pesa');

  // Product share mini-modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Active Emojibase shortcode autocomplete
  const activeShortcode = extractActiveShortcode(inputText);
  const shortcodeSuggestions = activeShortcode
    ? searchEmojibase(activeShortcode.activeQuery).slice(0, 6)
    : [];

  const handleApplyShortcode = (emojiStr: string) => {
    if (!activeShortcode) return;
    const newText =
      inputText.slice(0, activeShortcode.startIndex) + emojiStr + ' ';
    setInputText(newText);
    textareaRef.current?.focus();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  // Voice recording timer
  useEffect(() => {
    let interval: any = null;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Load smart replies when new message arrives
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.senderId !== currentUser.id && lastMsg.type === 'text') {
      generateSmartReplies(lastMsg.text).then((replies) => {
        if (replies && replies.length > 0) {
          setSmartReplies(replies);
          setShowSmartReplies(true);
        }
      });
    }
  }, [messages.length]);

  if (!activeRoom) {
    return (
      <div className="flex-1 bg-neutral-950 flex flex-col items-center justify-center text-center p-8 select-none">
        <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 mb-4 shadow-xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-100">Welcome to WAT Messenger</h2>
        <p className="text-sm text-neutral-400 max-w-sm mt-1">
          Select a room or contact on the left to start end-to-end encrypted Matrix messaging.
        </p>
      </div>
    );
  }

  // Find peer user
  const peerId =
    activeRoom.type === 'direct'
      ? activeRoom.memberIds.find((id) => id !== currentUser.id) || activeRoom.memberIds[0]
      : null;
  const peer = peerId ? users.find((u) => u.id === peerId) : null;

  // Pinned message
  const pinnedMessage = messages.find((m) => m.isPinned);

  const handleSend = () => {
    if (!inputText.trim()) return;

    if (editingMessage) {
      // Edit mode
      // handled via context
      setEditingMessage(null);
    } else {
      sendMessage({
        text: inputText.trim(),
        type: 'text',
        replyTo: replyingTo || undefined,
      });
    }

    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
    setShowSmartReplies(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartVoiceRecord = () => {
    soundEngine.playRecordBeep();
    setIsRecordingVoice(true);
  };

  const handleCancelVoiceRecord = () => {
    setIsRecordingVoice(false);
  };

  const handleSendVoiceRecord = () => {
    setIsRecordingVoice(false);
    soundEngine.playMessageSent();
    sendMessage({
      text: 'Voice message',
      type: 'audio',
      mediaUrl: 'simulated_voice_note.mp3',
      mediaInfo: {
        duration: Math.max(3, recordingSeconds),
        waveform: [0.2, 0.5, 0.9, 0.6, 0.8, 1.0, 0.4, 0.7, 0.9, 0.3, 0.6, 0.8, 0.4],
        fileName: `Voice_note_${new Date().toLocaleTimeString().replace(/:/g, '')}.wav`,
        fileSize: `${Math.round(recordingSeconds * 24 + 80)} KB`,
      },
    });
  };

  const handleAIMagicRewrite = async (tone: string) => {
    if (!inputText.trim()) return;
    setIsRewriting(true);
    const rewritten = await rewriteText(inputText, tone);
    setInputText(rewritten);
    setIsRewriting(false);
  };

  const handleOpenSummarize = async () => {
    setIsSummarizing(true);
    setSummaryModalOpen(true);
    const summary = await summarizeCurrentRoom();
    setSummaryText(summary);
    setIsSummarizing(false);
  };

  const handleSendLocation = () => {
    setShowAttachmentMenu(false);
    sendMessage({
      text: '📍 Live location shared',
      type: 'location',
      locationInfo: {
        latitude: -1.2921,
        longitude: 36.8219,
        title: 'WAT Nairobi Engineering Lab',
        address: 'Riverside Drive, Westlands, Nairobi, Kenya',
      },
    });
  };

  const handleSendPhoto = (photoUrl: string, caption: string) => {
    setShowAttachmentMenu(false);
    sendMessage({
      text: caption || 'Shared photo',
      type: 'image',
      mediaUrl: photoUrl,
      mediaInfo: {
        fileName: 'IMG_' + Date.now().toString().slice(-4) + '.jpg',
        fileSize: '1.8 MB',
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950 min-w-0 relative">
      {/* Top Header */}
      <header className="h-16 px-4 bg-neutral-900/90 backdrop-blur border-b border-neutral-800 flex items-center justify-between z-20 shrink-0 select-none">
        {/* Room Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={activeRoom.avatar}
              alt={activeRoom.name}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-800"
            />
            {activeRoom.type === 'direct' && peer && (
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-neutral-900 ${
                  peer.isOnline ? 'bg-emerald-500' : 'bg-neutral-600'
                }`}
              />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-neutral-100 truncate">
                {activeRoom.name}
              </h2>
              {activeRoom.isEncrypted && (
                <button
                  onClick={() => setIsE2EEOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300"
                  title="E2EE Olm/Megolm Encrypted"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Subtitle / typing indicator */}
            <div className="text-[11px] text-neutral-400 truncate flex items-center gap-1">
              {typingUsers.length > 0 ? (
                <span className="text-emerald-400 font-medium animate-pulse">
                  {typingUsers.join(', ')} is typing...
                </span>
              ) : activeRoom.type === 'direct' && peer ? (
                <span>{peer.isOnline ? 'Active now' : `Last seen ${peer.lastSeen || 'recently'}`}</span>
              ) : (
                <span>{activeRoom.memberIds.length} participants</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Voice Call, Video Call, AI Summary, Menu */}
        <div className="flex items-center gap-1">
          {/* AI Summarize Button */}
          <button
            onClick={handleOpenSummarize}
            className="px-2.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            title="Generate AI Conversation Summary"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">AI Summary</span>
          </button>

          {/* WebRTC Voice Call */}
          <button
            onClick={() => startCall(activeRoom.id, 'voice')}
            className="p-2 rounded-xl text-neutral-300 hover:text-emerald-400 hover:bg-neutral-800 transition-colors"
            title="Start WebRTC Voice Call"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* WebRTC Video Call */}
          <button
            onClick={() => startCall(activeRoom.id, 'video')}
            className="p-2 rounded-xl text-neutral-300 hover:text-emerald-400 hover:bg-neutral-800 transition-colors"
            title="Start WebRTC Video Call"
          >
            <Video className="w-4 h-4" />
          </button>

          {/* Options Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showOptionsMenu && (
              <div className="absolute right-0 top-11 bg-neutral-900 border border-neutral-800 rounded-xl p-1 shadow-2xl min-w-[180px] z-30 flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setShowDisappearingMenu(true);
                  }}
                  className="text-left px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800 rounded-lg flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Disappearing Messages</span>
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {activeRoom.disappearingTimer === 0
                      ? 'Off'
                      : activeRoom.disappearingTimer === 86400
                      ? '24h'
                      : `${activeRoom.disappearingTimer}s`}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setIsE2EEOpen(true);
                  }}
                  className="text-left px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verify Encryption Keys</span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    simulatePeerTyping();
                  }}
                  className="text-left px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Simulate Peer Typing</span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setIsBlueprintOpen(true);
                  }}
                  className="text-left px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspect Matrix Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Disappearing timer selector banner if opened */}
      {showDisappearingMenu && (
        <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center justify-between text-xs z-10 animate-fade-in">
          <div className="flex items-center gap-2 text-neutral-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Set Disappearing Messages Timer:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { label: 'Off', seconds: 0 },
              { label: '30s (Demo)', seconds: 30 },
              { label: '24 Hours', seconds: 86400 },
              { label: '7 Days', seconds: 604800 },
            ].map((t) => (
              <button
                key={t.seconds}
                onClick={() => {
                  updateDisappearingTimer(activeRoom.id, t.seconds);
                  setShowDisappearingMenu(false);
                }}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  activeRoom.disappearingTimer === t.seconds
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                {t.label}
              </button>
            ))}
            <button
              onClick={() => setShowDisappearingMenu(false)}
              className="p-1 text-neutral-400 hover:text-neutral-200 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Pinned Message Alert Header */}
      {pinnedMessage && (
        <div className="bg-neutral-900/70 border-b border-neutral-800/80 px-4 py-1.5 flex items-center justify-between text-xs text-neutral-300 z-10">
          <div className="flex items-center gap-2 min-w-0">
            <Pin className="w-3.5 h-3.5 text-emerald-400 rotate-45 shrink-0" />
            <span className="font-semibold text-emerald-400 shrink-0 text-[11px]">
              Pinned:
            </span>
            <span className="truncate text-neutral-300 text-[11px]">
              {pinnedMessage.text}
            </span>
          </div>
          <button
            onClick={() => {
              // scroll to pinned message
              scrollToBottom();
            }}
            className="text-[10px] text-emerald-400 hover:underline shrink-0 ml-2 font-mono"
          >
            View
          </button>
        </div>
      )}

      {/* Messages Scroll Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* E2EE Security Intro Banner */}
        <div className="my-3 mx-auto max-w-md p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center text-xs text-neutral-400 shadow-sm select-none">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Matrix End-to-End Encrypted</span>
          </div>
          <p className="text-[11px] leading-relaxed text-neutral-400">
            Messages and calls are encrypted with Olm/Megolm. Only you and recipients hold the cryptographic keys.
          </p>
        </div>

        {/* Render all messages in room */}
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === currentUser.id}
            onReply={(m) => setReplyingTo(m)}
            onStartEdit={(m) => {
              setEditingMessage(m);
              setInputText(m.text);
              textareaRef.current?.focus();
            }}
          />
        ))}

        {/* Subtle Matrix 'is typing...' Animated Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 py-1.5 px-3 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 w-fit max-w-[90%] select-none animate-in fade-in slide-in-from-bottom-1 duration-200">
            <div className="relative shrink-0">
              {peer?.avatar ? (
                <img
                  src={peer.avatar}
                  alt={peer.name}
                  className="w-5 h-5 rounded-full object-cover border border-emerald-400/60"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-[9px]">
                  {typingUsers[0]?.charAt(0) || 'U'}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-neutral-950 animate-pulse" />
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-emerald-300 font-medium text-[11px] truncate">
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing
              </span>

              {/* 3 Bouncing Dots */}
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              </div>
            </div>

            <span className="text-[9px] font-mono text-neutral-500 ml-1">
              m.typing
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Smart Replies Suggestions Chip Bar */}
      {showSmartReplies && smartReplies.length > 0 && (
        <div className="px-4 py-1.5 bg-neutral-900/60 border-t border-neutral-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar select-none">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Smart Reply:
          </span>
          {smartReplies.map((replyText, i) => (
            <button
              key={i}
              onClick={() => {
                sendMessage({ text: replyText, type: 'text' });
                setShowSmartReplies(false);
              }}
              className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700/80 whitespace-nowrap transition-transform active:scale-95 shadow-sm"
            >
              {replyText}
            </button>
          ))}
          <button
            onClick={() => setShowSmartReplies(false)}
            className="p-1 text-neutral-500 hover:text-neutral-300 ml-auto shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Quoted reply banner in composer */}
      {replyingTo && (
        <div className="px-4 py-2 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
            <div className="min-w-0">
              <span className="font-semibold text-emerald-400 text-[11px] block">
                Replying to {replyingTo.senderName}
              </span>
              <span className="text-neutral-400 truncate block text-[11px]">
                {replyingTo.text}
              </span>
            </div>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 text-neutral-400 hover:text-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Composer Input Bar */}
      <div className="p-3 bg-neutral-900 border-t border-neutral-800 relative select-none">
        {/* Emojibase Shortcode Autocomplete Dropdown */}
        {shortcodeSuggestions.length > 0 && (
          <div className="absolute bottom-16 left-16 bg-neutral-900 border border-neutral-700 rounded-2xl p-1.5 shadow-2xl z-40 flex flex-col gap-1 min-w-[200px] animate-scale">
            <div className="px-2.5 py-1 text-[10px] font-mono text-emerald-400 font-bold border-b border-neutral-800 flex items-center justify-between">
              <span>Matrix Emojibase</span>
              <span className="text-[9px] text-neutral-500">Tab / Tap to insert</span>
            </div>
            {shortcodeSuggestions.map((item) => (
              <button
                key={item.hexcode}
                type="button"
                onClick={() => handleApplyShortcode(item.emoji)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-neutral-800 text-left transition-colors"
              >
                <span className="text-base">{item.emoji}</span>
                <span className="text-xs font-mono text-neutral-200">
                  :{item.shortcodes[0]}:
                </span>
                <span className="text-[10px] text-neutral-500 truncate ml-auto">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Full Emojibase Picker Popover */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 right-4 z-50">
            <EmojibasePicker
              onSelectEmoji={(emoji) => {
                setInputText((prev) => prev + emoji);
                setShowEmojiPicker(false);
              }}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        )}

        {/* Attachment Drawer Popover */}
        {showAttachmentMenu && (
          <div className="absolute bottom-16 left-4 bg-neutral-900 border border-neutral-700 rounded-2xl p-2 shadow-2xl z-30 grid grid-cols-3 gap-2 w-72 animate-scale">
            {/* Photo / Video */}
            <button
              onClick={() => {
                handleSendPhoto(
                  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
                  'African Tech Summit team demo! 🌍✨'
                );
              }}
              className="flex flex-col items-center p-2.5 rounded-xl hover:bg-neutral-800 text-neutral-200 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Photo / Media</span>
            </button>

            {/* Document */}
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                sendMessage({
                  text: 'Attached proposal document',
                  type: 'file',
                  mediaUrl: '#',
                  mediaInfo: {
                    fileName: 'WAT_Matrix_Synapse_Audit_v2.pdf',
                    fileSize: '3.1 MB',
                    mimeType: 'application/pdf',
                  },
                });
              }}
              className="flex flex-col items-center p-2.5 rounded-xl hover:bg-neutral-800 text-neutral-200 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Document</span>
            </button>

            {/* Live Location */}
            <button
              onClick={handleSendLocation}
              className="flex flex-col items-center p-2.5 rounded-xl hover:bg-neutral-800 text-neutral-200 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Location</span>
            </button>

            {/* Mobile Money Invoice */}
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                setIsInvoiceModalOpen(true);
              }}
              className="flex flex-col items-center p-2.5 rounded-xl hover:bg-neutral-800 text-neutral-200 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Invoice Pay</span>
            </button>

            {/* Product Catalog */}
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                setIsProductModalOpen(true);
              }}
              className="flex flex-col items-center p-2.5 rounded-xl hover:bg-neutral-800 text-neutral-200 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Catalog Item</span>
            </button>

            {/* Voice Clip */}
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                handleStartVoiceRecord();
              }}
              className="flex flex-col items-center p-2.5 rounded-xl hover:bg-neutral-800 text-neutral-200 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Voice Note</span>
            </button>

            {/* Jitsi Video Meeting Invitation */}
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                const roomClean = `wat-${activeRoom.id.replace(/[^a-zA-Z0-9]/g, '')}`;
                sendMessage(
                  activeRoom.id,
                  `📹 Jitsi Video Conference Meeting Link: https://${jitsiServerConfig.serverDomain}/${roomClean}\nJoin securely via web or Jitsi Meet mobile app (E2EE Active).`
                );
              }}
              className="flex flex-col items-center p-2.5 rounded-xl hover:bg-neutral-800 text-neutral-200 gap-1 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Jitsi Meeting</span>
            </button>
          </div>
        )}

        {/* Voice Recording Active UI Bar */}
        {isRecordingVoice ? (
          <div className="flex items-center justify-between bg-neutral-950 border border-rose-500/50 rounded-2xl px-4 py-2.5 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-rose-400">
                Recording: 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
              </span>
              <span className="text-[11px] text-neutral-400 italic">
                Live audio capture active...
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelVoiceRecord}
                className="p-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                title="Cancel recording"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleSendVoiceRecord}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Voice Note</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            {/* Attachment Button */}
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-2.5 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              title="Add attachment (Photo, Audio, Location, Invoice, Product)"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Input Container */}
            <div className="flex-1 bg-neutral-950 border border-neutral-800 focus-within:border-emerald-500/50 rounded-2xl px-3 py-1.5 flex items-center gap-2 transition-colors">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (e.target.value.length > 0) {
                    sendTypingNotification(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  editingMessage
                    ? 'Editing message...'
                    : activeRoom.isEncrypted
                    ? 'Type end-to-end encrypted message...'
                    : 'Type a message...'
                }
                rows={1}
                className="flex-1 bg-transparent text-xs md:text-sm text-neutral-100 placeholder-neutral-500 resize-none focus:outline-none max-h-28"
              />

              {/* AI Tone Rewriter Dropdown */}
              {inputText.trim().length > 3 && (
                <div className="relative group">
                  <button
                    onClick={() => handleAIMagicRewrite('professional')}
                    disabled={isRewriting}
                    className="p-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-colors"
                    title="AI Polish Tone (Professional, Casual, Friendly)"
                  >
                    <Wand2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Emojibase Picker Toggle */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-1.5 rounded-xl transition-colors ${
                  showEmojiPicker
                    ? 'text-emerald-400 bg-emerald-500/20'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
                title="Matrix Emojibase & Custom Emotes Picker"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            {/* Mic / Send Button */}
            {inputText.trim().length > 0 ? (
              <button
                onClick={handleSend}
                className="p-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-transform active:scale-95 shadow-md shadow-emerald-500/20"
                title="Send Message"
              >
                <Send className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleStartVoiceRecord}
                className="p-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 transition-transform active:scale-95"
                title="Hold to record voice note"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* AI Summary Modal */}
      {summaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-scale">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-neutral-100">
                  AI Conversation Recap
                </h3>
              </div>
              <button
                onClick={() => setSummaryModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              {isSummarizing ? (
                <div className="py-8 flex flex-col items-center gap-3 text-neutral-400 text-xs">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Gemini AI is analyzing room messages...</span>
                </div>
              ) : (
                <div className="text-xs md:text-sm text-neutral-200 leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap">
                  {summaryText}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-mono">
                Powered by Gemini 3.7 Flash & Matrix Engine
              </span>
              <button
                onClick={() => setSummaryModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Mobile Money Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-neutral-100">
                  Create Mobile Pay Invoice
                </h3>
              </div>
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-4">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Amount
                </label>
                <div className="flex gap-2 mt-1">
                  <select
                    value={invoiceCurrency}
                    onChange={(e: any) => setInvoiceCurrency(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="KES">KES (KSh)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="GHS">GHS (GH₵)</option>
                  </select>
                  <input
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Description / Service
                </label>
                <input
                  type="text"
                  value={invoiceDesc}
                  onChange={(e) => setInvoiceDesc(e.target.value)}
                  className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Preferred Settlement Gateway
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(['M-Pesa', 'MTN MoMo', 'Card'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setInvoiceMethod(method)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        invoiceMethod === method
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  createInvoiceInChat(
                    parseFloat(invoiceAmount) || 50,
                    invoiceCurrency,
                    invoiceDesc,
                    invoiceMethod
                  );
                  setIsInvoiceModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-400"
              >
                Send Invoice to Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-neutral-100">
                  Select Product to Share
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 py-4 max-h-72 overflow-y-auto">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    shareProductInChat(prod);
                    setIsProductModalOpen(false);
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 cursor-pointer transition-colors"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-neutral-100 truncate">
                      {prod.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 truncate">
                      {prod.category}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 shrink-0">
                    ${prod.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
