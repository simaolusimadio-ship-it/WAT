import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  FileAudio,
  CheckCheck,
} from 'lucide-react';
import { Message } from '../types';
import { soundEngine } from '../utils/audioSynth';

interface AudioVoicePlayerProps {
  message: Message;
  isOwn: boolean;
  onTranscribe?: () => void;
  isTranscribing?: boolean;
}

export const AudioVoicePlayer: React.FC<AudioVoicePlayerProps> = ({
  message,
  isOwn,
  onTranscribe,
  isTranscribing,
}) => {
  const duration = message.mediaInfo?.duration || 18;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isHoveringSeek, setIsHoveringSeek] = useState(false);
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);
  const [showTranscription, setShowTranscription] = useState(true);

  const timerRef = useRef<any>(null);
  const seekContainerRef = useRef<HTMLDivElement>(null);

  // Normalised waveform data (fallback if not provided in message)
  const waveform = message.mediaInfo?.waveform || [
    0.25, 0.45, 0.75, 0.9, 0.6, 0.35, 0.8, 1.0, 0.85, 0.55, 0.35, 0.7, 0.95,
    0.75, 0.45, 0.25, 0.5, 0.85, 0.4, 0.65, 0.9, 0.5, 0.3,
  ];

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = Math.floor(sec % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Playback timer & synth audio sync
  useEffect(() => {
    if (isPlaying) {
      if (!isMuted) {
        soundEngine.startVoicePlayback();
      }

      const stepIntervalMs = 50;
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const nextTime = prev + (stepIntervalMs / 1000) * playbackRate;
          if (nextTime >= duration) {
            setIsPlaying(false);
            soundEngine.stopVoicePlayback();
            return 0;
          }
          return nextTime;
        });
      }, stepIntervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      soundEngine.stopVoicePlayback();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      soundEngine.stopVoicePlayback();
    };
  }, [isPlaying, playbackRate, isMuted, duration]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentTime >= duration) {
        setCurrentTime(0);
      }
      setIsPlaying(true);
    }
  };

  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(duration, newTime));
    setCurrentTime(clamped);
    soundEngine.playSeekTick();
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekContainerRef.current) return;
    const rect = seekContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    handleSeek(ratio * duration);
  };

  const handleWaveformMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekContainerRef.current) return;
    const rect = seekContainerRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, hoverX / rect.width));
    setHoverSeekTime(ratio * duration);
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    soundEngine.playSeekTick();
  };

  const skipRelative = (delta: number) => {
    handleSeek(currentTime + delta);
  };

  const progressRatio = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="my-1 w-full max-w-[320px] sm:max-w-[360px] select-none">
      {/* Audio Player Card Frame */}
      <div
        className={`rounded-2xl p-3 border transition-colors ${
          isOwn
            ? 'bg-neutral-950/40 border-emerald-500/30 text-neutral-100'
            : 'bg-neutral-900/90 border-neutral-700/70 text-neutral-100'
        }`}
      >
        {/* Top Header: Voice Note Tag & Codec Details */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-700/40 text-[11px]">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <FileAudio className="w-3.5 h-3.5" />
            <span>Matrix Voice Note</span>
            <span className="text-[9px] font-mono px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded">
              Opus 48kHz
            </span>
          </div>

          <div className="flex items-center gap-2 text-neutral-400 text-[10px]">
            <span>{message.mediaInfo?.fileSize || '380 KB'}</span>
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 hover:text-neutral-200 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-neutral-300" />
              )}
            </button>
          </div>
        </div>

        {/* Core Controls Row: Play/Pause Button, Interactive Waveform Seekbar */}
        <div className="flex items-center gap-2.5">
          {/* Main Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 hover:from-emerald-500 hover:to-teal-300 text-neutral-950 flex items-center justify-center font-bold shadow-lg transition-transform active:scale-90 shrink-0"
            title={isPlaying ? 'Pause' : 'Play Voice Note'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
            {isPlaying && (
              <span className="absolute -inset-0.5 rounded-full border border-emerald-400 animate-ping opacity-30" />
            )}
          </button>

          {/* Waveform & Scrub Area */}
          <div className="flex-1 flex flex-col justify-center min-w-0">
            {/* Interactive Waveform Container */}
            <div
              ref={seekContainerRef}
              onClick={handleWaveformClick}
              onMouseEnter={() => setIsHoveringSeek(true)}
              onMouseLeave={() => {
                setIsHoveringSeek(false);
                setHoverSeekTime(null);
              }}
              onMouseMove={handleWaveformMouseMove}
              className="relative flex items-center gap-0.5 h-9 px-1 rounded-xl cursor-pointer hover:bg-neutral-800/50 transition-colors group"
              title="Click or drag to seek voice note"
            >
              {/* Hover seek time preview tooltip */}
              {isHoveringSeek && hoverSeekTime !== null && (
                <div
                  className="absolute -top-5 transform -translate-x-1/2 bg-neutral-900 border border-neutral-700 text-emerald-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-lg pointer-events-none z-10"
                  style={{
                    left: `${(hoverSeekTime / duration) * 100}%`,
                  }}
                >
                  {formatSeconds(hoverSeekTime)}
                </div>
              )}

              {/* Waveform Bars with dynamic Played / Unplayed coloring */}
              {waveform.map((barHeight, i) => {
                const barPositionRatio = (i + 0.5) / waveform.length;
                const isPlayed = barPositionRatio <= progressRatio;
                const isCurrent =
                  Math.abs(barPositionRatio - progressRatio) < 0.05 && isPlaying;

                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-150 ${
                      isPlayed
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                        : 'bg-neutral-600/70 group-hover:bg-neutral-500'
                    } ${isCurrent ? 'scale-y-125 bg-white' : ''}`}
                    style={{
                      height: `${Math.max(18, barHeight * 100)}%`,
                    }}
                  />
                );
              })}
            </div>

            {/* Continuous Seek Track Bar underneath */}
            <div className="relative mt-1 px-1">
              <input
                type="range"
                min={0}
                max={duration}
                step={0.1}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer: Elapsed / Duration Time, Quick Skip, Speed Pill */}
        <div className="flex items-center justify-between mt-2 pt-1.5 text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-1">
            <span className="font-bold text-emerald-400">
              {formatSeconds(currentTime)}
            </span>
            <span>/</span>
            <span>{formatSeconds(duration)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Rewind 5s */}
            <button
              type="button"
              onClick={() => skipRelative(-5)}
              className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors rounded hover:bg-neutral-800"
              title="Rewind 5 seconds"
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            {/* Playback speed toggle */}
            <button
              type="button"
              onClick={cyclePlaybackRate}
              className="px-2 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[10px] border border-emerald-500/40 transition-colors active:scale-95"
              title="Change playback speed"
            >
              {playbackRate}x
            </button>
          </div>
        </div>

        {/* AI Voice Note Transcription Section */}
        {message.transcription ? (
          <div className="mt-2.5 pt-2 border-t border-neutral-700/50">
            <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-400 mb-1">
              <button
                type="button"
                onClick={() => setShowTranscription(!showTranscription)}
                className="flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>AI Transcript {showTranscription ? '▼' : '▶'}</span>
              </button>
              <span className="text-[9px] text-neutral-500 font-mono">
                Whisper AI
              </span>
            </div>

            {showTranscription && (
              <p className="italic text-[11px] leading-relaxed text-neutral-200 bg-neutral-900/80 p-2 rounded-xl border border-neutral-700/50">
                "{message.transcription}"
              </p>
            )}
          </div>
        ) : onTranscribe ? (
          <div className="mt-2 pt-2 border-t border-neutral-700/40">
            <button
              type="button"
              onClick={onTranscribe}
              disabled={isTranscribing}
              className="w-full flex items-center justify-center gap-1.5 py-1 px-2 text-[11px] text-cyan-300 hover:text-cyan-100 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-colors font-medium disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isTranscribing
                  ? 'Transcribing audio via AI...'
                  : 'Transcribe with AI'}
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
