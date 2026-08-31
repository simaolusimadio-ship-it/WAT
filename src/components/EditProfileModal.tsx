import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  Globe,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Link as LinkIcon,
  Phone,
  Mail,
  MapPin,
  Image as ImageIcon,
  User as UserIcon,
  ShieldCheck,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { SocialLink } from '../types';
import { soundEngine } from '../utils/audioSynth';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useChat();

  const [name, setName] = useState(currentUser.name || '');
  const [handle, setHandle] = useState(currentUser.handle || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [statusMessage, setStatusMessage] = useState(currentUser.statusMessage || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [website, setWebsite] = useState(currentUser.website || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    currentUser.socialLinks ? [...currentUser.socialLinks] : []
  );

  // New social link input state
  const [newPlatform, setNewPlatform] = useState<SocialLink['platform']>('twitter');
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
          soundEngine.playChime();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
          soundEngine.playChime();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSocialLink = () => {
    if (!newUrl.trim()) return;
    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newLink: SocialLink = {
      platform: newPlatform,
      url: formattedUrl,
      label: newLabel.trim() || undefined,
    };

    setSocialLinks([...socialLinks, newLink]);
    setNewUrl('');
    setNewLabel('');
    soundEngine.playChime();
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, idx) => idx !== index));
    soundEngine.playChime();
  };

  const handleSave = () => {
    updateUserProfile({
      name: name.trim(),
      handle: handle.trim(),
      avatar: avatar.trim(),
      statusMessage: statusMessage.trim(),
      bio: bio.trim(),
      website: website.trim(),
      phone: phone.trim(),
      email: email.trim(),
      location: location.trim(),
      socialLinks: socialLinks,
    });
    soundEngine.playMessageSent();
    onClose();
  };

  return (
    <div
      id="edit-profile-modal-overlay"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        id="edit-profile-modal-container"
        className="bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.14)] relative my-auto max-h-[92vh] flex flex-col text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white/80 border-b border-black/[0.06] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-900">
                Edit User Profile
              </h2>
              <p className="text-xs text-neutral-500">
                Customize your identity, bio, avatar, and contact channels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit / Preview Tabs */}
            <div className="flex bg-black/[0.04] p-1 rounded-2xl border border-black/[0.06] text-xs font-bold">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 rounded-xl transition-all ${
                  activeTab === 'edit'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1 ${
                  activeTab === 'preview'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-neutral-400 hover:text-black hover:bg-black/[0.04] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
          {activeTab === 'edit' ? (
            <>
              {/* 1. Avatar Upload & Presets */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                  Profile Photo / Avatar
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Current Avatar Preview */}
                  <div className="relative group shrink-0">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-2 ring-black/10 shadow-md bg-neutral-100"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 rounded-3xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                    >
                      <Camera className="w-5 h-5 mb-1" />
                      <span>Change</span>
                    </button>
                  </div>

                  {/* Drag and Drop Zone & File Upload */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                      isDragOver
                        ? 'border-black bg-black/[0.05] text-black'
                        : 'border-black/[0.12] hover:border-black/40 bg-black/[0.02] text-neutral-600'
                    }`}
                  >
                    <Upload className="w-5 h-5 mb-1.5 text-neutral-800" />
                    <p className="text-xs font-semibold text-neutral-900">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      PNG, JPG, or GIF up to 5MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Preset Avatars Selection */}
                <div>
                  <span className="text-[11px] text-neutral-500 font-medium block mb-2">
                    Or choose a verified profile avatar:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatar(url);
                          soundEngine.playChime();
                        }}
                        className={`w-12 h-12 rounded-2xl overflow-hidden ring-2 shrink-0 transition-all ${
                          avatar === url
                            ? 'ring-black scale-105 shadow-md'
                            : 'ring-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Core Identity Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                    Display Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lusimadio"
                    className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                    Matrix ID / Handle <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@lusimadio:wat.chat"
                    className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* 3. Status & Bio */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                    Status Message / Tagline
                  </label>
                  <input
                    type="text"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="Available • Innovating sovereign comms"
                    className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                    Extended Bio & Background
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell your contacts and clients about your expertise, background, or current focus..."
                    className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black resize-none"
                  />
                </div>
              </div>

              {/* 4. Contact & Location Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-neutral-600" />
                    <span>Website</span>
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="lusimadio.africa"
                    className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-neutral-600" />
                    <span>Phone</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 82 555 0199"
                    className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-600" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Cape Town, SA"
                    className="w-full bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* 5. Social & Channels Links Manager */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                  Social Channels & Official Links ({socialLinks.length})
                </label>

                {/* Existing Links List */}
                <div className="space-y-2">
                  {socialLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-black/[0.02] rounded-2xl border border-black/[0.06] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="px-2 py-0.5 rounded-lg bg-black text-white font-mono font-bold uppercase text-[9px]">
                          {link.platform}
                        </span>
                        <span className="text-xs font-medium text-neutral-900 truncate">
                          {link.label ? `${link.label}: ` : ''}
                          {link.url}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSocialLink(idx)}
                        className="p-1 text-neutral-400 hover:text-rose-500 transition-colors"
                        title="Remove Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new link row */}
                <div className="p-3 bg-black/[0.02] rounded-2xl border border-black/[0.08] flex flex-col sm:flex-row items-center gap-2">
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as any)}
                    className="bg-white border border-black/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-neutral-900 outline-none w-full sm:w-auto shadow-sm"
                  >
                    <option value="twitter">X / Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="custom">Custom Web</option>
                  </select>

                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="URL (e.g. twitter.com/username)"
                    className="flex-1 bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-neutral-900 outline-none w-full shadow-sm"
                  />

                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Label (optional)"
                    className="w-full sm:w-28 bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-neutral-900 outline-none shadow-sm"
                  />

                  <button
                    type="button"
                    onClick={handleAddSocialLink}
                    disabled={!newUrl.trim()}
                    className="w-full sm:w-auto px-4 py-1.5 bg-black hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Link
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Live Preview View */
            <div className="space-y-4">
              <div className="p-3 bg-black/[0.04] border border-black/[0.06] rounded-2xl text-xs text-neutral-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neutral-800 shrink-0" />
                <span>
                  This is how your profile appears to other users when they chat with you or view
                  your contact card.
                </span>
              </div>

              {/* Preview Card */}
              <div className="rounded-3xl bg-white border border-black/[0.08] overflow-hidden shadow-sm">
                <div className="h-24 bg-black p-4 flex justify-between items-start text-white">
                  <span className="px-2.5 py-1 rounded-xl bg-white/15 backdrop-blur text-[11px] font-bold text-white border border-white/20 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Matrix Sovereign Identity
                  </span>
                </div>

                <div className="px-5 pb-5 pt-0 -mt-10">
                  <div className="flex items-end justify-between gap-4 mb-3">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-20 h-20 rounded-3xl object-cover ring-4 ring-white shadow-md bg-neutral-100"
                    />
                    <span className="px-3 py-1.5 rounded-2xl bg-black/[0.04] text-neutral-800 border border-black/[0.06] text-xs font-bold">
                      Verified Member
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-neutral-900">{name || 'Your Name'}</h3>
                  <p className="text-xs text-neutral-600 font-mono">{handle || '@handle:wat.chat'}</p>
                  <p className="text-xs text-neutral-500 italic mt-1">"{statusMessage}"</p>

                  {bio && (
                    <div className="mt-3 p-3 rounded-2xl bg-black/[0.02] border border-black/[0.06]">
                      <h4 className="text-[10px] font-bold uppercase text-neutral-500 mb-1">Bio</h4>
                      <p className="text-xs text-neutral-800 whitespace-pre-wrap">{bio}</p>
                    </div>
                  )}

                  {/* Links Preview */}
                  <div className="mt-3 space-y-2">
                    {website && (
                      <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/[0.02] border border-black/[0.06] text-xs text-neutral-800">
                        <Globe className="w-3.5 h-3.5 text-neutral-800" />
                        <span className="truncate font-medium">{website}</span>
                      </div>
                    )}

                    {socialLinks.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {socialLinks.map((s, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-2 rounded-2xl bg-black/[0.02] border border-black/[0.06] text-xs text-neutral-700 truncate"
                          >
                            <LinkIcon className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                            <span className="truncate">{s.label || s.platform}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white/80 border-t border-black/[0.06] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-neutral-700 font-bold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
