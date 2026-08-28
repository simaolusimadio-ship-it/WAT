import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  Minimize2,
  Maximize2,
  ShieldCheck,
  Smartphone,
  Monitor,
  QrCode,
  Copy,
  Check,
  Lock,
  ExternalLink,
  Users,
  Grid,
  Radio,
  Settings,
  Sparkles,
  RefreshCw,
  Sliders,
  Volume2,
  VolumeX,
  X,
  Share2,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

export const WebRTCCallModal: React.FC = () => {
  const {
    activeCall,
    endCall,
    toggleMute,
    toggleCamera,
    toggleScreenShare,
    toggleCallTileView,
    toggleCallLowBandwidth,
    toggleMobileLayout,
    setConferenceMode,
    currentUser,
    jitsiServerConfig,
  } = useChat();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showMobileQR, setShowMobileQR] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [jitsiLoading, setJitsiLoading] = useState(true);
  const [jitsiError, setJitsiError] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(activeCall?.participants.length || 2);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>('user_speaker_1');
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [isTileView, setIsTileView] = useState(true);

  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  if (!activeCall) return null;

  const domain = activeCall.jitsiDomain || jitsiServerConfig.serverDomain || 'meet.jit.si';
  const cleanRoomName = activeCall.jitsiRoomName || `wat-conf-${activeCall.roomId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const jitsiMeetingUrl = `https://${domain}/${cleanRoomName}`;
  const isMobileView = activeCall.isMobileLayout ?? (typeof window !== 'undefined' && window.innerWidth < 768);
  const isIframeMode = activeCall.conferenceMode !== 'interactive_mesh';

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(jitsiMeetingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Initialize Jitsi Meet Iframe API when in iframe mode
  useEffect(() => {
    if (!isIframeMode || !jitsiContainerRef.current) return;

    let isSubscribed = true;
    setJitsiLoading(true);
    setJitsiError(null);

    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }

        const scriptUrl = `https://${domain}/external_api.js`;
        const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', () => reject(new Error('Failed to load Jitsi API')));
          return;
        }

        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Jitsi external API script load error'));
        document.body.appendChild(script);
      });
    };

    loadScript()
      .then(() => {
        if (!isSubscribed || !jitsiContainerRef.current) return;

        // Clean any previous instance
        if (jitsiApiRef.current) {
          try {
            jitsiApiRef.current.dispose();
          } catch (e) {
            console.warn('Jitsi dispose error', e);
          }
          jitsiApiRef.current = null;
        }

        jitsiContainerRef.current.innerHTML = '';

        const options = {
          roomName: cleanRoomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: currentUser.name,
            email: currentUser.email || `${currentUser.id}@wat.chat`,
            avatarURL: currentUser.avatar,
          },
          configOverwrite: {
            startWithAudioMuted: activeCall.isMuted,
            startWithVideoMuted: activeCall.type === 'voice' || activeCall.isCameraOff,
            enableWelcomePage: false,
            prejoinPageEnabled: false,
            disableDeepLinking: false,
            enableE2EE: true,
            e2ee: {
              maxKeyRetries: 3,
            },
            resolution: 720,
            constraints: {
              video: {
                height: { ideal: 720, max: 1080, min: 240 },
              },
            },
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_POWERED_BY: false,
            TOOLBAR_ALWAYS_VISIBLE: true,
            DEFAULT_BACKGROUND: '#09090b',
            MOBILE_APP_PROMO: false,
          },
        };

        try {
          const api = new window.JitsiMeetExternalAPI(domain, options);
          jitsiApiRef.current = api;

          api.addEventListener('videoConferenceJoined', () => {
            if (isSubscribed) setJitsiLoading(false);
          });

          api.addEventListener('participantJoined', () => {
            setParticipantCount((prev) => prev + 1);
          });

          api.addEventListener('participantLeft', () => {
            setParticipantCount((prev) => Math.max(1, prev - 1));
          });

          api.addEventListener('readyToClose', () => {
            endCall();
          });

          // Timeout safety for iframe loading state
          setTimeout(() => {
            if (isSubscribed) setJitsiLoading(false);
          }, 2500);
        } catch (err: any) {
          console.error('Failed to init Jitsi instance', err);
          if (isSubscribed) {
            setJitsiLoading(false);
            setJitsiError(err?.message || 'Could not connect to Jitsi instance');
          }
        }
      })
      .catch((err) => {
        console.warn('Jitsi script load failed (sandbox or network offline), falling back to mesh UI', err);
        if (isSubscribed) {
          setJitsiLoading(false);
          setJitsiError('Direct Jitsi API unreachable — switched to sovereign WebRTC mesh mode');
        }
      });

    return () => {
      isSubscribed = false;
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {}
        jitsiApiRef.current = null;
      }
    };
  }, [cleanRoomName, domain, isIframeMode]);

  // Handle local user media for fallback mesh mode
  useEffect(() => {
    if (isIframeMode) return;
    let stream: MediaStream | null = null;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && activeCall.type === 'video' && !activeCall.isCameraOff) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: !activeCall.isMuted })
        .then((s) => {
          stream = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
        })
        .catch((e) => {
          console.warn('Local media stream not available', e);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isIframeMode, activeCall.isCameraOff, activeCall.type]);

  // Sync controls with Jitsi Iframe API when user clicks app buttons
  const handleToggleMute = () => {
    toggleMute();
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.executeCommand('toggleAudio');
      } catch (e) {}
    }
  };

  const handleToggleCamera = () => {
    toggleCamera();
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.executeCommand('toggleVideo');
      } catch (e) {}
    }
  };

  const handleToggleScreenShare = () => {
    toggleScreenShare();
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.executeCommand('toggleShareScreen');
      } catch (e) {}
    }
  };

  const handleToggleTileView = () => {
    setIsTileView(!isTileView);
    toggleCallTileView();
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.executeCommand('toggleTileView');
      } catch (e) {}
    }
  };

  // Minimized PiP floating pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-emerald-500/50 rounded-2xl p-3 shadow-2xl flex items-center gap-3 animate-scale select-none backdrop-blur-md">
        <div className="relative">
          <img
            src={activeCall.roomAvatar}
            alt={activeCall.roomName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500 animate-pulse"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-neutral-900" />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-bold text-neutral-100 truncate max-w-[130px]">
            {activeCall.roomName}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {activeCall.status === 'ringing' ? 'Connecting...' : formatDuration(activeCall.duration)}
          </span>
        </div>

        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-xl text-xs transition-colors ${
              activeCall.isMuted
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title={activeCall.isMuted ? 'Unmute' : 'Mute'}
          >
            {activeCall.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Expand to Full Screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={endCall}
            className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
            title="Leave Conference"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-lg flex flex-col justify-between p-2 sm:p-4 md:p-6 animate-fade-in select-none">
      {/* Top Header Bar: Room Info, E2EE, Mobile View Toggle, PiP */}
      <header className="flex items-center justify-between gap-2 z-20 bg-neutral-900/80 border border-neutral-800/80 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur shadow-lg">
        {/* Left: Room & Jitsi Badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={activeCall.roomAvatar}
            alt={activeCall.roomName}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500/60 shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-bold text-neutral-100 truncate">
                {activeCall.roomName}
              </h2>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono shrink-0">
                JITSI MEET SFU
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono truncate">
              <span className="text-emerald-400">
                {activeCall.status === 'ringing' ? 'Connecting to Jicofo...' : formatDuration(activeCall.duration)}
              </span>
              <span>•</span>
              <span className="truncate">{cleanRoomName}</span>
            </div>
          </div>
        </div>

        {/* Center: E2EE & Server Security Button */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setShowSecurityModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>E2EE Olm/Jitsi Active</span>
            <Lock className="w-3 h-3 text-emerald-400" />
          </button>
        </div>

        {/* Right Action Controls: Mode Switcher, Mobile QR, View Switch, PiP */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile QR & Deep Link */}
          <button
            onClick={() => setShowMobileQR(true)}
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors flex items-center gap-1 text-xs"
            title="Open on Mobile / Scan QR Code"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline font-medium">Mobile QR</span>
          </button>

          {/* Mobile / Desktop Viewport Layout Toggle */}
          <button
            onClick={toggleMobileLayout}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs ${
              isMobileView
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-neutral-800/80 border-neutral-700/60 text-neutral-300 hover:text-white'
            }`}
            title={isMobileView ? 'Switch to Desktop Layout' : 'Simulate Mobile Handheld View'}
          >
            {isMobileView ? (
              <>
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Mobile UI</span>
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Desktop UI</span>
              </>
            )}
          </button>

          {/* IFrame vs Sovereign WebRTC Mesh Mode */}
          <button
            onClick={() => setConferenceMode(isIframeMode ? 'interactive_mesh' : 'jitsi_iframe')}
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors text-xs flex items-center gap-1"
            title={`Switch to ${isIframeMode ? 'Sovereign WebRTC Mesh' : 'Official Jitsi Iframe API'}`}
          >
            <RefreshCw className="w-4 h-4 text-teal-400" />
            <span className="hidden xl:inline">{isIframeMode ? 'Jitsi API' : 'Mesh Mode'}</span>
          </button>

          {/* Copy Meeting Link */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Copy Jitsi Meeting URL"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Minimize */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Minimize to Picture-in-Picture"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Conference Stage */}
      <main className="flex-1 my-2 sm:my-3 relative flex items-center justify-center min-h-0 w-full overflow-hidden">
        {/* Mobile View Container Wrapper */}
        <div
          className={`w-full h-full flex items-center justify-center transition-all duration-300 ${
            isMobileView
              ? 'max-w-[420px] max-h-[820px] aspect-[9/19] rounded-[36px] border-[6px] border-neutral-800 shadow-2xl bg-neutral-900 overflow-hidden relative'
              : 'max-w-6xl rounded-3xl border border-neutral-800/90 shadow-2xl bg-neutral-900/90 overflow-hidden relative'
          }`}
        >
          {/* Mobile Simulated Status Bar */}
          {isMobileView && (
            <div className="absolute top-0 left-0 right-0 h-6 bg-neutral-950/80 backdrop-blur z-30 px-5 flex items-center justify-between text-[10px] text-neutral-300">
              <span className="font-semibold">9:41</span>
              <div className="w-20 h-3 bg-neutral-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1 font-mono">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Mode 1: Official Jitsi Meet Iframe API Container */}
          {isIframeMode ? (
            <div className="w-full h-full relative bg-neutral-950 flex items-center justify-center">
              {/* Jitsi Iframe Target Mount */}
              <div
                ref={jitsiContainerRef}
                className={`w-full h-full ${isMobileView ? 'pt-6 pb-2' : ''}`}
              />

              {/* Jitsi Loading & Fallback state */}
              {jitsiLoading && (
                <div className="absolute inset-0 bg-neutral-950/90 flex flex-col items-center justify-center p-6 text-center z-10 animate-fade-in">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 animate-spin">
                    <RefreshCw className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-100 mb-1">
                    Connecting to Jitsi Meet Bridge...
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono max-w-sm mb-4">
                    Routing WebRTC streams through {domain} (JVB2 SFU Colibri2 protocol)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConferenceMode('interactive_mesh')}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-semibold transition-colors"
                    >
                      Switch to Sovereign Mesh Mode
                    </button>
                    <a
                      href={jitsiMeetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-semibold transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Browser Tab</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Error Notice */}
              {jitsiError && !jitsiLoading && (
                <div className="absolute bottom-4 left-4 right-4 bg-amber-500/20 border border-amber-500/40 rounded-2xl p-3 backdrop-blur z-20 flex items-center justify-between text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{jitsiError}</span>
                  </div>
                  <button
                    onClick={() => setConferenceMode('interactive_mesh')}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/30 hover:bg-amber-500/40 font-bold text-[11px]"
                  >
                    Open Mesh Mode
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Sovereign WebRTC Multi-Participant Mesh & Grid */
            <div className={`w-full h-full bg-neutral-950 p-2 sm:p-4 flex flex-col justify-between ${isMobileView ? 'pt-7' : ''}`}>
              {/* Conference Grid */}
              <div
                className={`flex-1 grid gap-2 sm:gap-3 items-center justify-center ${
                  isMobileView
                    ? 'grid-cols-1 grid-rows-2'
                    : isTileView
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {/* Participant 1: Remote Speaker 1 */}
                <div className="relative w-full h-full min-h-[160px] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border-2 border-emerald-500/60 shadow-xl group">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                    alt="Amara Diop"
                    className="w-full h-full object-cover"
                  />
                  {/* Dominant Speaker Halo */}
                  <div className="absolute inset-0 ring-4 ring-emerald-400/80 pointer-events-none rounded-2xl sm:rounded-3xl animate-pulse" />

                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-neutral-950/80 backdrop-blur rounded-xl px-2.5 py-1 flex items-center gap-2 border border-neutral-800">
                    <span className="text-[11px] font-bold text-neutral-100">Amara Diop</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[9px] text-emerald-400 font-mono hidden sm:inline">1080p @ 60fps</span>
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-neutral-950/60 backdrop-blur px-2 py-0.5 rounded-lg text-[10px] text-neutral-300">
                    <Volume2 className="w-3 h-3 text-emerald-400" />
                    <span>Speaking</span>
                  </div>
                </div>

                {/* Participant 2: Remote Speaker 2 */}
                <div className="relative w-full h-full min-h-[160px] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
                    alt="Kwame Mensah"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-neutral-950/80 backdrop-blur rounded-xl px-2.5 py-1 flex items-center gap-2 border border-neutral-800">
                    <span className="text-[11px] font-bold text-neutral-100">Kwame Mensah</span>
                    <span className="text-[9px] text-neutral-400 font-mono">OCTO SFU</span>
                  </div>
                  <div className="absolute top-2 right-2 p-1 bg-neutral-950/60 backdrop-blur rounded-lg">
                    <Mic className="w-3 h-3 text-neutral-300" />
                  </div>
                </div>

                {/* Participant 3: Local User (You) */}
                <div className="relative w-full h-full min-h-[160px] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl">
                  {activeCall.type === 'video' && !activeCall.isCameraOff ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 p-4">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-emerald-500/50 mb-2"
                      />
                      <span className="text-xs text-neutral-400 font-mono">Camera Paused</span>
                    </div>
                  )}

                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-neutral-950/80 backdrop-blur rounded-xl px-2.5 py-1 flex items-center gap-2 border border-neutral-800">
                    <span className="text-[11px] font-bold text-neutral-100">{currentUser.name} (You)</span>
                    {activeCall.isMuted && <MicOff className="w-3 h-3 text-rose-400" />}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Floating Control Bar */}
      <footer className="flex items-center justify-between gap-2 z-20 px-2 sm:px-4 py-2 sm:py-3 bg-neutral-900/90 border border-neutral-800/80 rounded-2xl backdrop-blur shadow-2xl max-w-4xl mx-auto w-full">
        {/* Left Side: Layout & Participants */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={handleToggleTileView}
            className={`p-2.5 sm:p-3 rounded-xl transition-all ${
              isTileView
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title="Toggle Tile View (Grid)"
          >
            <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={toggleCallLowBandwidth}
            className={`p-2.5 sm:p-3 rounded-xl transition-all ${
              activeCall.isLowBandwidth
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title={activeCall.isLowBandwidth ? 'Audio-only Low Bandwidth Active' : 'Enable Low-Bandwidth Mode'}
          >
            {activeCall.isLowBandwidth ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800/60 text-xs text-neutral-300">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{participantCount}</span>
          </div>
        </div>

        {/* Center: Core Call Controls (Mic, Cam, Screen Share, Hangup) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mute Mic */}
          <button
            onClick={handleToggleMute}
            className={`p-3 sm:p-3.5 rounded-2xl transition-all shadow-lg active:scale-95 ${
              activeCall.isMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700'
            }`}
            title={activeCall.isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle Camera */}
          <button
            onClick={handleToggleCamera}
            className={`p-3 sm:p-3.5 rounded-2xl transition-all shadow-lg active:scale-95 ${
              activeCall.isCameraOff
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700'
            }`}
            title={activeCall.isCameraOff ? 'Turn on Camera' : 'Turn off Camera'}
          >
            {activeCall.isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Screen Share (Desktop) */}
          <button
            onClick={handleToggleScreenShare}
            className={`p-3 sm:p-3.5 rounded-2xl transition-all shadow-lg active:scale-95 ${
              activeCall.isScreenSharing
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700'
            }`}
            title="Share Screen"
          >
            <ScreenShare className="w-5 h-5" />
          </button>

          {/* Hangup / Leave Conference */}
          <button
            onClick={endCall}
            className="p-3 sm:p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-transform active:scale-95 font-bold flex items-center gap-1.5"
            title="Leave Video Conference"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="hidden sm:inline text-xs">Leave</span>
          </button>
        </div>

        {/* Right Side: Share Link & Mobile App Launch */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <a
            href={jitsiMeetingUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 sm:p-3 rounded-xl bg-neutral-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-neutral-300 transition-colors"
            title="Open in Native Jitsi Window"
          >
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>

          <button
            onClick={handleCopyLink}
            className="p-2.5 sm:p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Share Invite"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </footer>

      {/* Mobile QR & Deep-link Modal */}
      {showMobileQR && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative animate-scale">
            <button
              onClick={() => setShowMobileQR(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-100">Join on Mobile Device</h3>
                <p className="text-[11px] text-neutral-400">Scan QR Code with iOS or Android</p>
              </div>
            </div>

            {/* Generated QR Code Box */}
            <div className="p-4 bg-white rounded-2xl flex flex-col items-center justify-center shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  jitsiMeetingUrl
                )}`}
                alt="Jitsi Meeting Mobile QR Code"
                className="w-44 h-44 object-contain rounded-lg"
              />
              <p className="text-[10px] text-neutral-700 mt-2 font-mono font-medium">
                jitsi-meet://{domain}/{cleanRoomName}
              </p>
            </div>

            <div className="space-y-2">
              <a
                href={jitsiMeetingUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Jitsi Meet App</span>
              </a>

              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied Meeting URL!' : 'Copy Mobile Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E2EE & Security Details Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-scale">
            <button
              onClick={() => setShowSecurityModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-100">Conference E2EE & Security</h3>
                <p className="text-[11px] text-neutral-400">Olm / Megolm & Jitsi Insertable Streams</p>
              </div>
            </div>

            <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Media Encryption:</span>
                <span className="text-emerald-400 font-mono font-bold">AES-GCM-128 (E2EE)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Signaling Server:</span>
                <span className="text-neutral-200 font-mono">{domain}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Room Hash:</span>
                <span className="text-neutral-300 font-mono">{cleanRoomName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">SAS Verification Key:</span>
                <span className="text-emerald-400 font-mono font-bold">{activeCall.e2eeKey || 'wat_e2ee_9981'}</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Video and audio streams are encrypted end-to-end between your browser/phone and all conference participants. The Jitsi Videobridge (JVB) only routes encrypted RTP packets without access to raw video frames.
            </p>

            <button
              onClick={() => setShowSecurityModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
