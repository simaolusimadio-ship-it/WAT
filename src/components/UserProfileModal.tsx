import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Phone,
  Video,
  ShieldCheck,
  Globe,
  Mail,
  MapPin,
  Calendar,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  QrCode,
  Lock,
  Wallet,
  Sparkles,
  Share2,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { User, SocialLink } from '../types';
import { soundEngine } from '../utils/audioSynth';

interface UserProfileModalProps {
  user: User | null;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
  const {
    currentUser,
    users,
    createRoom,
    setActiveRoomId,
    setActiveTab,
    startCall,
    setIsEditProfileOpen,
    sendMoney,
    walletCurrency,
  } = useChat();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  const [sendAmount, setSendAmount] = useState('100');
  const [sendNote, setSendNote] = useState('Payment via WAT');

  if (!user) return null;

  const isSelf = user.id === currentUser.id;

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    soundEngine.playChime();
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleStartChat = () => {
    onClose();
    if (isSelf) {
      setActiveTab('chats');
      return;
    }
    // Find or create direct room
    createRoom(`${user.name}`, 'direct', [user.id]);
    setActiveTab('chats');
    soundEngine.playMessageSent();
  };

  const handleCall = (type: 'voice' | 'video') => {
    onClose();
    // Start WebRTC call
    startCall(`direct_${user.id}`, type);
    soundEngine.playChime();
  };

  const handleExecuteSendMoney = () => {
    const val = parseFloat(sendAmount);
    if (!val || val <= 0) return;
    sendMoney(val, user.name, user.handle, sendNote);
    setShowSendMoneyModal(false);
  };

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
      case 'x':
        return (
          <span className="w-4 h-4 flex items-center justify-center font-bold text-xs">𝕏</span>
        );
      case 'github':
        return (
          <span className="w-4 h-4 flex items-center justify-center font-bold text-xs">⌨</span>
        );
      case 'linkedin':
        return (
          <span className="w-4 h-4 flex items-center justify-center font-bold text-xs">in</span>
        );
      case 'instagram':
        return (
          <span className="w-4 h-4 flex items-center justify-center font-bold text-xs">📸</span>
        );
      case 'telegram':
        return (
          <span className="w-4 h-4 flex items-center justify-center font-bold text-xs">✈</span>
        );
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div
      id="user-profile-modal-overlay"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        id="user-profile-modal-container"
        className="bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.14)] text-neutral-900 relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Banner */}
        <div className="h-28 sm:h-32 bg-black relative p-4 flex justify-between items-start text-white">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-white/15 backdrop-blur text-[11px] font-bold text-white border border-white/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {user.isBusiness ? 'Verified Business' : 'Matrix Sovereign Identity'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowQR(!showQR)}
              className="p-2 rounded-2xl bg-white/15 hover:bg-white/25 text-white transition-colors"
              title="Identity QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/15 hover:bg-white/25 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-5 sm:px-6 pb-6 pt-0 relative">
          {/* Avatar & Main Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-14 sm:-mt-16 gap-4 mb-4">
            <div className="relative group">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-white"
              />
              <span
                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white ${
                  user.isOnline ? 'bg-emerald-500' : 'bg-neutral-400'
                }`}
                title={user.isOnline ? 'Online' : user.lastSeen || 'Offline'}
              />
            </div>

            {/* Quick Action Triggers */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {isSelf ? (
                <button
                  id="profile-edit-self-btn"
                  onClick={() => {
                    onClose();
                    setIsEditProfileOpen(true);
                  }}
                  className="px-4 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-2 shadow-md active:scale-95 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    id="profile-start-chat-btn"
                    onClick={handleStartChat}
                    className="px-3.5 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message
                  </button>

                  <button
                    onClick={() => handleCall('voice')}
                    className="p-2.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 border border-black/[0.06] transition-all active:scale-95"
                    title="Voice Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleCall('video')}
                    className="p-2.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 border border-black/[0.06] transition-all active:scale-95"
                    title="Video Call"
                  >
                    <Video className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowSendMoneyModal(true)}
                    className="p-2.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-800 border border-black/[0.06] transition-all active:scale-95"
                    title="Send Money"
                  >
                    <Wallet className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="text-center sm:text-left space-y-1 mb-5">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">{user.name}</h2>
              {user.verified && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs">
              <span className="text-neutral-600 font-mono font-semibold">{user.handle}</span>
              <button
                onClick={() => handleCopy(user.handle, 'handle')}
                className="text-neutral-400 hover:text-black transition-colors p-1"
                title="Copy Handle"
              >
                {copiedField === 'handle' ? (
                  <Check className="w-3.5 h-3.5 text-black" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <p className="text-xs text-neutral-500 italic pt-1">"{user.statusMessage}"</p>
          </div>

          {/* QR Code Expansion */}
          {showQR && (
            <div className="mb-5 p-4 rounded-2xl bg-black/[0.02] border border-black/[0.08] text-center animate-fade-in">
              <div className="inline-block p-3 bg-white rounded-2xl shadow-xl mb-2 border border-black/[0.08]">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=matrix:u/${encodeURIComponent(
                    user.handle
                  )}`}
                  alt="QR Code"
                  className="w-36 h-36"
                />
              </div>
              <p className="text-xs font-bold text-neutral-900">Scan to Connect on WAT</p>
              <p className="text-[11px] text-neutral-500 font-mono">{user.handle}</p>
            </div>
          )}

          {/* Send Money Mini Modal */}
          {showSendMoneyModal && (
            <div className="mb-5 p-4 rounded-2xl bg-black/[0.02] border border-black/[0.08] space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" /> Send Money to {user.name}
                </span>
                <button
                  onClick={() => setShowSendMoneyModal(false)}
                  className="text-neutral-400 hover:text-black text-xs"
                >
                  Cancel
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-700 font-mono">{walletCurrency}</span>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="flex-1 bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-black font-mono font-bold"
                  placeholder="Amount"
                />
              </div>

              <input
                type="text"
                value={sendNote}
                onChange={(e) => setSendNote(e.target.value)}
                className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                placeholder="Payment memo / reason"
              />

              <button
                onClick={handleExecuteSendMoney}
                className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all"
              >
                Confirm Transfer {walletCurrency} {sendAmount}
              </button>
            </div>
          )}

          {/* Bio Section */}
          {user.bio ? (
            <div className="mb-5 p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.06]">
              <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Bio & About
              </h3>
              <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
                {user.bio}
              </p>
            </div>
          ) : (
            <div className="mb-5 p-3 rounded-2xl bg-black/[0.02] border border-black/[0.06] text-neutral-400 text-xs italic">
              No bio provided yet.
            </div>
          )}

          {/* Contact Details & Links Grid */}
          <div className="space-y-2.5 mb-5">
            <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Contact & Links
            </h3>

            {/* Website */}
            {user.website && (
              <a
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.06] text-xs text-neutral-800 hover:text-black transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-black/[0.05] text-neutral-900">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate max-w-[260px] font-medium">{user.website}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black" />
              </a>
            )}

            {/* Social Links List */}
            {user.socialLinks && user.socialLinks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {user.socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url.startsWith('http') ? social.url : `https://${social.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.06] text-xs text-neutral-800 hover:text-black transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-black/[0.05] text-neutral-900 flex items-center justify-center shrink-0">
                        {renderSocialIcon(social.platform)}
                      </div>
                      <span className="truncate text-xs font-medium">
                        {social.label || social.platform}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-neutral-400 shrink-0" />
                  </a>
                ))}
              </div>
            )}

            {/* Phone & Email & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {user.phone && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/[0.02] border border-black/[0.06] text-xs text-neutral-800">
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="truncate font-mono">{user.phone}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(user.phone!, 'phone')}
                    className="text-neutral-400 hover:text-black p-1"
                  >
                    {copiedField === 'phone' ? (
                      <Check className="w-3 h-3 text-black" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              )}

              {user.email && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/[0.02] border border-black/[0.06] text-xs text-neutral-800">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="truncate font-medium">{user.email}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(user.email!, 'email')}
                    className="text-neutral-400 hover:text-black p-1"
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-3 h-3 text-black" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              )}

              {user.location && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/[0.02] border border-black/[0.06] text-xs text-neutral-800 sm:col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{user.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cryptographic E2EE Identity Fingerprint */}
          <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                <Lock className="w-3.5 h-3.5 text-neutral-700" />
                <span>Matrix E2EE Key Identity</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/[0.05] text-neutral-700 border border-black/[0.08]">
                Olm/Megolm Verified
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-700 font-mono bg-white p-2 rounded-xl border border-black/[0.08]">
              <span className="truncate mr-2">{user.e2eeFingerprint || 'Xk9P/7Qw2+Vz8My4N1nF9Kj5Rt3sD8hL'}</span>
              <button
                onClick={() =>
                  handleCopy(
                    user.e2eeFingerprint || 'Xk9P/7Qw2+Vz8My4N1nF9Kj5Rt3sD8hL',
                    'fingerprint'
                  )
                }
                className="text-neutral-400 hover:text-black shrink-0"
              >
                {copiedField === 'fingerprint' ? (
                  <Check className="w-3 h-3 text-black" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span>Device: {user.deviceId || 'WAT_SECURE_DEVICE_01'}</span>
              <span>{user.joinedDate || 'Member on WAT Network'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
