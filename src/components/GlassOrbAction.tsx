import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Camera,
  Mic,
  UserPlus,
  MessageSquarePlus,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { soundEngine } from '../utils/audioSynth';

export const GlassOrbAction: React.FC = () => {
  const {
    setIsNewChatOpen,
    setActiveTab,
    setIsWebRTCCallOpen,
    setCallType,
  } = useChat();

  const [isOpen, setIsOpen] = useState(false);
  const [activeActionLabel, setActiveActionLabel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveActionLabel(null);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOrb = () => {
    setIsOpen(!isOpen);
    soundEngine.playPop();
  };

  const handleAction = (type: 'camera' | 'voice' | 'contact' | 'message') => {
    soundEngine.playChime();
    setIsOpen(false);
    setActiveActionLabel(null);

    if (type === 'message' || type === 'contact') {
      setIsNewChatOpen(true);
    } else if (type === 'voice') {
      setCallType('audio');
      setIsWebRTCCallOpen(true);
    } else if (type === 'camera') {
      setActiveTab('stories');
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-20 md:bottom-7 left-1/2 -translate-x-1/2 z-50 select-none flex flex-col items-center"
    >
      {/* Expanded Arc Radial Options (Expands smoothly upwards from the center) */}
      {isOpen && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center">
          {/* Ambient crystal glow aura */}
          <div className="absolute -inset-32 bg-white/70 backdrop-blur-2xl rounded-full -z-10 animate-fade-in pointer-events-none shadow-[0_20px_60px_rgba(0,0,0,0.12)]" />

          {/* 1. Voice & Calls (Far Left Arc) */}
          <button
            onClick={() => handleAction('voice')}
            onMouseEnter={() => setActiveActionLabel('Voice & Calls')}
            onMouseLeave={() => setActiveActionLabel(null)}
            className="pointer-events-auto absolute -top-16 -left-20 p-3.5 rounded-full bg-black hover:bg-neutral-800 text-white border border-white/25 shadow-[0_12px_32px_rgba(0,0,0,0.30)] hover:scale-115 active:scale-95 transition-all duration-200 group flex items-center justify-center animate-fade-in"
            title="Instant Voice & Calls"
          >
            <Mic className="w-5 h-5 text-white group-hover:text-emerald-400 transition-colors" />
          </button>

          {/* 2. Camera & QR (Center-Left Arc) */}
          <button
            onClick={() => handleAction('camera')}
            onMouseEnter={() => setActiveActionLabel('Camera & QR')}
            onMouseLeave={() => setActiveActionLabel(null)}
            className="pointer-events-auto absolute -top-24 -left-7 p-3.5 rounded-full bg-black hover:bg-neutral-800 text-white border border-white/25 shadow-[0_12px_32px_rgba(0,0,0,0.30)] hover:scale-115 active:scale-95 transition-all duration-200 group flex items-center justify-center animate-fade-in"
            title="Camera & QR"
          >
            <Camera className="w-5 h-5 text-white group-hover:text-emerald-400 transition-colors" />
          </button>

          {/* 3. New Message (Center-Right Arc) */}
          <button
            onClick={() => handleAction('message')}
            onMouseEnter={() => setActiveActionLabel('New Message')}
            onMouseLeave={() => setActiveActionLabel(null)}
            className="pointer-events-auto absolute -top-24 left-7 p-3.5 rounded-full bg-black hover:bg-neutral-800 text-white border border-white/25 shadow-[0_12px_32px_rgba(0,0,0,0.30)] hover:scale-115 active:scale-95 transition-all duration-200 group flex items-center justify-center animate-fade-in"
            title="New Message"
          >
            <MessageSquarePlus className="w-5 h-5 text-white group-hover:text-emerald-400 transition-colors" />
          </button>

          {/* 4. Add Contact (Far Right Arc) */}
          <button
            onClick={() => handleAction('contact')}
            onMouseEnter={() => setActiveActionLabel('Add Contact')}
            onMouseLeave={() => setActiveActionLabel(null)}
            className="pointer-events-auto absolute -top-16 left-20 p-3.5 rounded-full bg-black hover:bg-neutral-800 text-white border border-white/25 shadow-[0_12px_32px_rgba(0,0,0,0.30)] hover:scale-115 active:scale-95 transition-all duration-200 group flex items-center justify-center animate-fade-in"
            title="Add Contact"
          >
            <UserPlus className="w-5 h-5 text-white group-hover:text-emerald-400 transition-colors" />
          </button>

          {/* Active Hover Label Pill */}
          {activeActionLabel && (
            <div className="absolute -top-36 whitespace-nowrap bg-black text-white text-xs font-bold tracking-wide px-3.5 py-1.5 rounded-full shadow-2xl border border-white/20 animate-fade-in">
              {activeActionLabel}
            </div>
          )}
        </div>
      )}

      {/* Central Signature WAT Crystal Orb Action Button */}
      <button
        id="wat-glass-orb-btn"
        onClick={toggleOrb}
        className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-[0_16px_40px_rgba(0,0,0,0.28)] border transition-all duration-300 active:scale-90 ${
          isOpen
            ? 'bg-black text-white border-white/40 rotate-45 scale-105 ring-4 ring-black/10'
            : 'bg-black text-white border-white/25 hover:scale-108 ring-4 ring-black/5 hover:ring-black/15'
        }`}
        title="WAT Crystal Orb (Quick Actions)"
      >
        {/* Subtle crystal refraction gradient inside */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-emerald-400/20 pointer-events-none" />

        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5]" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-black animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
};
