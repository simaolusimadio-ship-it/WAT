import React, { useState, useRef } from 'react';
import {
  Check,
  CheckCheck,
  Lock,
  Sparkles,
  Download,
  MapPin,
  ExternalLink,
  CreditCard,
  ShoppingBag,
  MoreVertical,
  Reply,
  Smile,
  Star,
  Pin,
  Edit2,
  Trash2,
  Globe,
  Clock,
  CheckCircle2,
  Plus,
  Info,
} from 'lucide-react';
import { Message, InvoiceInfo } from '../types';
import { useChat } from '../context/ChatContext';
import { EmojibasePicker } from './EmojibasePicker';
import { AudioVoicePlayer } from './AudioVoicePlayer';
import { soundEngine } from '../utils/audioSynth';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  onReply: (msg: Message) => void;
  onStartEdit: (msg: Message) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isOwn,
  onReply,
  onStartEdit,
}) => {
  const {
    users,
    currentUser,
    activeRoom,
    toggleReaction,
    toggleStar,
    togglePinMessage,
    deleteMessage,
    translateMessage,
    transcribeMessage,
    payInvoice,
  } = useChat();

  const [showActions, setShowActions] = useState(false);
  const [showTranslateMenu, setShowTranslateMenu] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showReactionTray, setShowReactionTray] = useState(false);
  const [showReceiptDetails, setShowReceiptDetails] = useState(false);
  const [hoveredReactionEmoji, setHoveredReactionEmoji] = useState<string | null>(null);

  const longPressTimerRef = useRef<any>(null);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleTranslate = async (lang: string) => {
    setIsTranslating(true);
    setShowTranslateMenu(false);
    await translateMessage(message.id, lang);
    setIsTranslating(false);
  };

  const handleTranscribe = async () => {
    setIsTranscribing(true);
    await transcribeMessage(message.id);
    setIsTranscribing(false);
  };

  // Quick reactions array
  const quickReactions = ['❤️', '👍', '🔥', '😂', '🚀', '💡', '🎉', '🙏'];

  // Long-press detection for touch & desktop click-and-hold
  const startLongPress = () => {
    longPressTimerRef.current = setTimeout(() => {
      setShowReactionTray(true);
      soundEngine.playReactionPop();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }
    }, 420);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleSelectReaction = (emoji: string) => {
    soundEngine.playReactionPop();
    toggleReaction(message.id, emoji);
    setShowReactionTray(false);
    setShowReactionPicker(false);
  };

  // Format who reacted for tooltip
  const getReactionUserNames = (userIds: string[] = []) => {
    if (!userIds || userIds.length === 0) return 'No reactions yet';
    return userIds
      .map((uid) => {
        if (uid === currentUser.id) return 'You';
        const u = users.find((usr) => usr.id === uid);
        return u ? u.name : uid;
      })
      .join(', ');
  };

  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowTranslateMenu(false);
        setShowReceiptDetails(false);
      }}
      className={`group relative flex flex-col mb-3.5 ${
        isOwn ? 'items-end' : 'items-start'
      }`}
    >
      {/* Sender name for group chats if not own */}
      {!isOwn && (
        <span className="text-[11px] font-semibold text-emerald-400 mb-1 ml-1 flex items-center gap-1">
          {message.senderName}
          {message.senderId.includes('ai') && (
            <span className="px-1 bg-cyan-500/20 text-cyan-300 text-[9px] rounded font-mono">
              AI BOT
            </span>
          )}
        </span>
      )}

      <div className="relative max-w-[90%] md:max-w-[72%]">
        {/* Floating Quick Action Bar on Hover (Desktop) */}
        {showActions && !showReactionTray && (
          <div
            className={`absolute -top-9 z-20 flex items-center gap-1 bg-neutral-900/95 border border-neutral-700/80 rounded-full px-2 py-1 shadow-xl backdrop-blur animate-fade-in ${
              isOwn ? 'right-0' : 'left-0'
            }`}
          >
            {/* Quick emoji reacts */}
            {quickReactions.slice(0, 5).map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelectReaction(emoji)}
                className="hover:scale-130 transition-transform text-xs p-1 active:scale-95"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}

            {/* Reaction Picker Button */}
            <button
              type="button"
              onClick={() => setShowReactionTray(true)}
              className="p-1 text-neutral-400 hover:text-emerald-400 transition-colors"
              title="Add reaction"
            >
              <Smile className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onReply(message)}
              className="p-1 text-neutral-400 hover:text-emerald-400 transition-colors"
              title="Reply"
            >
              <Reply className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => toggleStar(message.id)}
              className={`p-1 transition-colors ${
                message.isStarred
                  ? 'text-amber-400'
                  : 'text-neutral-400 hover:text-amber-400'
              }`}
              title={message.isStarred ? 'Unstar' : 'Star message'}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  message.isStarred ? 'fill-current' : ''
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => togglePinMessage(message.id)}
              className={`p-1 transition-colors ${
                message.isPinned
                  ? 'text-emerald-400'
                  : 'text-neutral-400 hover:text-emerald-400'
              }`}
              title={message.isPinned ? 'Unpin' : 'Pin message'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTranslateMenu(!showTranslateMenu)}
                className="p-1 text-neutral-400 hover:text-cyan-400 transition-colors"
                title="Translate"
              >
                <Globe className="w-3.5 h-3.5" />
              </button>

              {showTranslateMenu && (
                <div
                  className={`absolute bottom-8 z-30 w-32 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-1 text-xs text-neutral-200 ${
                    isOwn ? 'right-0' : 'left-0'
                  }`}
                >
                  <div className="text-[10px] font-semibold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                    Translate to
                  </div>
                  {['English', 'Swahili', 'Yoruba', 'French', 'Arabic', 'Spanish'].map(
                    (lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleTranslate(lang)}
                        className="w-full text-left px-2 py-1 rounded hover:bg-neutral-800 hover:text-emerald-400 flex items-center justify-between"
                      >
                        <span>{lang}</span>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {isOwn && (
              <>
                <button
                  type="button"
                  onClick={() => onStartEdit(message)}
                  className="p-1 text-neutral-400 hover:text-cyan-400 transition-colors"
                  title="Edit message"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteMessage(message.id)}
                  className="p-1 text-neutral-400 hover:text-rose-400 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Long-Press & Full Reaction Tray Popup Overlay */}
        {showReactionTray && (
          <div
            className={`absolute -top-12 z-40 flex items-center gap-1.5 bg-neutral-900/95 border border-emerald-500/40 rounded-2xl p-1.5 shadow-2xl backdrop-blur animate-in zoom-in-95 duration-150 ${
              isOwn ? 'right-0' : 'left-0'
            }`}
          >
            {quickReactions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelectReaction(emoji)}
                className="hover:scale-135 active:scale-95 transition-transform text-lg p-1"
                title={`React ${emoji}`}
              >
                {emoji}
              </button>
            ))}

            {/* Custom Emoji Picker Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-emerald-400 flex items-center justify-center transition-colors shadow"
                title="More Emojis"
              >
                <Plus className="w-4 h-4" />
              </button>

              {showReactionPicker && (
                <div className="absolute bottom-10 right-0 z-50">
                  <EmojibasePicker
                    compact
                    onSelectEmoji={(emoji) => handleSelectReaction(emoji)}
                    onClose={() => {
                      setShowReactionPicker(false);
                      setShowReactionTray(false);
                    }}
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowReactionTray(false)}
              className="text-neutral-500 hover:text-neutral-300 text-xs px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* The Message Bubble with Long-Press Handlers */}
        <div
          onTouchStart={startLongPress}
          onTouchEnd={cancelLongPress}
          onTouchMove={cancelLongPress}
          onMouseDown={startLongPress}
          onMouseUp={cancelLongPress}
          onMouseLeave={cancelLongPress}
          className={`relative rounded-2xl px-3.5 py-2.5 shadow-md select-text transition-all ${
            isOwn
              ? 'bg-emerald-600 text-white rounded-tr-sm'
              : 'bg-neutral-800/90 text-neutral-100 border border-neutral-700/60 rounded-tl-sm'
          }`}
        >
          {/* Quoted message if replied */}
          {message.replyTo && (
            <div
              className={`mb-2 p-2 rounded-lg text-xs border-l-4 ${
                isOwn
                  ? 'bg-emerald-700/60 border-emerald-300 text-emerald-100'
                  : 'bg-neutral-900/60 border-emerald-500 text-neutral-300'
              }`}
            >
              <div className="font-semibold text-[11px] text-emerald-300">
                {message.replyTo.senderName}
              </div>
              <div className="truncate opacity-90">{message.replyTo.text}</div>
            </div>
          )}

          {/* 1. Image Media */}
          {message.type === 'image' && message.mediaUrl && (
            <div className="my-1 rounded-xl overflow-hidden max-w-sm border border-black/20">
              <img
                src={message.mediaUrl}
                alt="Shared attachment"
                className="w-full h-auto max-h-72 object-cover"
                referrerPolicy="no-referrer"
              />
              {message.text && (
                <p className="p-2 text-xs md:text-sm font-medium">
                  {message.text}
                </p>
              )}
            </div>
          )}

          {/* 2. Voice Note / Audio Player (Custom Audio Player UI) */}
          {message.type === 'audio' && (
            <AudioVoicePlayer
              message={message}
              isOwn={isOwn}
              onTranscribe={handleTranscribe}
              isTranscribing={isTranscribing}
            />
          )}

          {/* 3. Invoice & Payment Card */}
          {message.type === 'invoice' && message.invoiceInfo && (
            <div className="my-1 p-3.5 rounded-xl bg-neutral-900/90 border border-emerald-500/40 w-72 md:w-80 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CreditCard className="w-4 h-4" />
                  <span>Invoice {message.invoiceInfo.invoiceId}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    message.invoiceInfo.status === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {message.invoiceInfo.status}
                </span>
              </div>

              <div className="py-2.5">
                <div className="text-2xl font-black text-neutral-100">
                  ${message.invoiceInfo.amount}{' '}
                  <span className="text-xs font-normal text-neutral-400">
                    {message.invoiceInfo.currency}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-1">
                  {message.invoiceInfo.description}
                </p>
              </div>

              {message.invoiceInfo.status === 'unpaid' ? (
                <button
                  type="button"
                  onClick={() => payInvoice(message.id, 'MTN MoMo')}
                  className="w-full mt-1 py-2 px-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-neutral-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition-transform active:scale-95"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay with MTN MoMo / M-Pesa</span>
                </button>
              ) : (
                <div className="mt-1 py-1 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Paid via {message.invoiceInfo.paymentMethod || 'MoMo'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 4. Product Showcase Card */}
          {message.type === 'product' && message.productInfo && (
            <div className="my-1 rounded-xl bg-neutral-900 border border-neutral-700 overflow-hidden w-64 md:w-72 shadow-lg">
              <img
                src={message.productInfo.image}
                alt={message.productInfo.name}
                className="w-full h-36 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-3">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-100 mb-1">
                  <span className="truncate">{message.productInfo.name}</span>
                  <span className="text-emerald-400 shrink-0 ml-1">
                    ${message.productInfo.price}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2 mb-2">
                  {message.productInfo.description}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onReply(message)}
                    className="flex-1 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-semibold text-center transition-colors"
                  >
                    Inquire in Chat
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Location Card */}
          {message.type === 'location' && message.locationInfo && (
            <div className="my-1 p-3 rounded-xl bg-neutral-900 border border-neutral-700 w-64 md:w-72 shadow">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                <MapPin className="w-4 h-4" />
                <span>{message.locationInfo.name}</span>
              </div>
              <p className="text-[11px] text-neutral-300 mb-2">
                {message.locationInfo.address}
              </p>
              <div className="w-full h-24 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs text-neutral-400 font-mono">
                GPS: {message.locationInfo.latitude.toFixed(4)},{' '}
                {message.locationInfo.longitude.toFixed(4)}
              </div>
            </div>
          )}

          {/* Primary Text Content */}
          {message.text &&
            message.type !== 'invoice' &&
            message.type !== 'location' &&
            message.type !== 'audio' && (
              <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words select-text">
                {message.text}
              </p>
            )}

          {/* AI Translated Text Box if present */}
          {message.translatedText && (
            <div className="mt-2 pt-2 border-t border-neutral-700/50 text-xs">
              <div className="flex items-center gap-1 text-[10px] font-semibold text-cyan-400 mb-1">
                <Globe className="w-3 h-3" />
                <span>
                  Translated into {message.translatedLang || 'Language'}:
                </span>
              </div>
              <p className="italic text-neutral-200 leading-relaxed bg-black/20 p-2 rounded-lg">
                {message.translatedText}
              </p>
            </div>
          )}

          {/* Metadata Footer: Timestamp, Edited badge, Star, Disappearing, Read status */}
          <div
            className={`flex items-center gap-1.5 mt-1 text-[10px] select-none ${
              isOwn
                ? 'text-emerald-200/80 justify-end'
                : 'text-neutral-400 justify-start'
            }`}
          >
            {message.isEdited && (
              <span className="italic text-[9px] text-neutral-400 font-mono">
                (edited)
              </span>
            )}
            {message.isStarred && (
              <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
            )}
            {message.isPinned && (
              <Pin className="w-2.5 h-2.5 text-emerald-400 rotate-45" />
            )}
            {message.expiresAt && (
              <Clock
                className="w-2.5 h-2.5 text-amber-400"
                title="Disappearing message"
              />
            )}
            <span className="font-mono">{formatTime(message.timestamp)}</span>
            {message.isEncrypted && (
              <Lock
                className="w-2.5 h-2.5 text-emerald-400/80"
                title="Megolm Encrypted"
              />
            )}

            {/* Visual Read Receipt Markers for Outgoing Messages */}
            {isOwn && (
              <div className="relative inline-flex items-center ml-0.5">
                <button
                  type="button"
                  onClick={() => setShowReceiptDetails(!showReceiptDetails)}
                  className="hover:opacity-80 transition-opacity focus:outline-none"
                  title={
                    message.status === 'read'
                      ? 'Read by recipient (Matrix m.receipt)'
                      : message.status === 'delivered'
                      ? 'Delivered to recipient device'
                      : message.status === 'sent'
                      ? 'Sent to Synapse homeserver'
                      : 'Sending message...'
                  }
                >
                  {message.status === 'read' ? (
                    <span className="flex items-center text-emerald-300 font-bold drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]">
                      <CheckCheck className="w-3.5 h-3.5 inline" />
                    </span>
                  ) : message.status === 'delivered' ? (
                    <span className="flex items-center text-neutral-300">
                      <CheckCheck className="w-3.5 h-3.5 inline" />
                    </span>
                  ) : message.status === 'sent' ? (
                    <span className="flex items-center text-neutral-400">
                      <Check className="w-3.5 h-3.5 inline" />
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-300 animate-pulse">
                      <Clock className="w-3 h-3 inline" />
                    </span>
                  )}
                </button>

                {/* Interactive Read Receipt Details Popover */}
                {showReceiptDetails && (
                  <div className="absolute bottom-6 right-0 z-40 w-52 p-2.5 bg-neutral-900/95 border border-emerald-500/40 rounded-xl shadow-2xl backdrop-blur text-left text-neutral-200 text-[11px] animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between font-semibold text-emerald-400 pb-1.5 mb-1.5 border-b border-neutral-800">
                      <div className="flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        <span>Matrix Read Receipt</span>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-1 bg-emerald-500/20 text-emerald-300 rounded">
                        m.receipt
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Status:</span>
                        <span className="font-bold text-emerald-300 capitalize">
                          {message.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Sent:</span>
                        <span className="font-mono text-[10px]">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      {message.status === 'read' && (
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400">Read by:</span>
                          <span className="text-emerald-400 font-medium">
                            {activeRoom?.name || 'Recipient'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reaction Chips Underneath the Bubble */}
        <div
          className={`flex flex-wrap items-center gap-1.5 mt-1 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}
        >
          {Object.values(message.reactions || {}).map((reaction: any) => {
            const hasReacted = reaction?.userIds?.includes(currentUser.id);
            const userNames = getReactionUserNames(reaction.userIds);

            return (
              <div key={reaction.emoji} className="relative group/react">
                <button
                  type="button"
                  onClick={() => handleSelectReaction(reaction.emoji)}
                  onMouseEnter={() => setHoveredReactionEmoji(reaction.emoji)}
                  onMouseLeave={() => setHoveredReactionEmoji(null)}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs transition-all shadow-sm active:scale-90 ${
                    hasReacted
                      ? 'bg-emerald-500/25 border border-emerald-400/70 text-emerald-300 font-bold shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                      : 'bg-neutral-800/90 border border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600'
                  }`}
                  title={userNames}
                >
                  <span className="text-sm">{reaction.emoji}</span>
                  <span className="text-[11px] font-mono">{reaction.count}</span>
                </button>

                {/* Tooltip on hover showing names of who reacted */}
                {hoveredReactionEmoji === reaction.emoji && (
                  <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 z-30 bg-neutral-900 border border-neutral-700 text-neutral-200 text-[10px] px-2 py-1 rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                    {userNames}
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Plus Reaction Button when message already has reactions or on hover */}
          {Object.keys(message.reactions || {}).length > 0 && (
            <button
              type="button"
              onClick={() => setShowReactionTray(true)}
              className="w-6 h-6 rounded-full bg-neutral-800/70 hover:bg-neutral-700 border border-neutral-700/60 text-neutral-400 hover:text-emerald-400 flex items-center justify-center text-xs transition-colors shadow-sm"
              title="Add another reaction"
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
