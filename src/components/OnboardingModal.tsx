import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Search,
  Camera,
  Check,
  Lock,
  ArrowLeft,
  Smartphone,
  RefreshCw,
  Sparkles,
  Key,
  Globe,
  User,
  CheckCircle2,
  X,
} from 'lucide-react';
import { COUNTRIES, PRESET_AVATARS, STATUS_PRESETS, Country } from '../data/countries';
import { useChat } from '../context/ChatContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { completeOnboarding, currentUser } = useChat();

  // Steps: 1 = Welcome, 2 = Phone Input, 3 = OTP Verification, 4 = Profile Info, 5 = Initializing Keys
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form states
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showConfirmNumberDialog, setShowConfirmNumberDialog] = useState(false);

  // OTP state
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(45);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Profile setup
  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0]);
  const [statusMessage, setStatusMessage] = useState('Available');
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Initialization progress
  const [initStage, setInitStage] = useState(0);

  // Resend timer countdown
  useEffect(() => {
    let interval: any = null;
    if (step === 3 && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Step 5: Sequential initialization animation
  useEffect(() => {
    if (step === 5) {
      const timers = [
        setTimeout(() => setInitStage(1), 700),
        setTimeout(() => setInitStage(2), 1500),
        setTimeout(() => setInitStage(3), 2300),
        setTimeout(() => {
          setInitStage(4);
          setTimeout(() => {
            const cleanPhone = `${selectedCountry.dialCode} ${phoneNumber.trim() || '802 345 6789'}`;
            completeOnboarding({
              name: name.trim() || 'WAT User',
              phone: cleanPhone,
              avatar: avatar,
              statusMessage: statusMessage,
              countryCode: selectedCountry.code,
            });
            if (onClose) onClose();
          }, 800);
        }, 3200),
      ];

      return () => timers.forEach(clearTimeout);
    }
  }, [step, name, avatar, statusMessage, selectedCountry, phoneNumber]);

  if (!isOpen) return null;

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dialCode.includes(countrySearch) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handlePhoneSubmit = () => {
    if (!phoneNumber.trim()) {
      setPhoneNumber('802 345 6789'); // Demo fallback
    }
    setShowConfirmNumberDialog(true);
  };

  const handleConfirmNumber = () => {
    setShowConfirmNumberDialog(false);
    setStep(3);
    setResendTimer(45);
    // Autofill demo OTP after 1.2s for effortless flow
    setTimeout(() => {
      setOtp(['4', '8', '2', '9', '1', '7']);
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(pasted.length, 5);
      otpInputsRef.current[nextIdx]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setIsOtpVerifying(true);
    setTimeout(() => {
      setIsOtpVerifying(false);
      setStep(4);
    }, 800);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep(5);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      {/* WhatsApp Modal Container */}
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[540px] max-h-[92vh] relative">
        {/* Step 1: Welcome & Terms (WhatsApp Style) */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 text-center animate-in fade-in duration-300">
            {/* Top Branding */}
            <div className="space-y-4 pt-4">
              <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-center shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center font-black text-2xl tracking-tighter shadow-lg shadow-emerald-500/30">
                  WAT
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20 animate-ping" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">
                  Welcome to WAT
                </h1>
                <p className="text-xs text-neutral-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Simple, reliable, private messaging and high-definition voice & video calling.
                </p>
              </div>
            </div>

            {/* Privacy Guarantee Card */}
            <div className="my-6 p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 text-left space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>End-to-End Encrypted</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Your personal messages and calls are secured with Olm/Megolm encryption. No one outside of your chats, not even WAT, can read or listen to them.
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
              >
                <span>Agree & Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-neutral-500">
                By tapping Agree & Continue, you accept the{' '}
                <span className="text-emerald-400 hover:underline cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-emerald-400 hover:underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Phone Number Entry */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-300">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-bold text-neutral-200">Enter your phone number</h2>
                <div className="w-7" />
              </div>

              <p className="text-xs text-neutral-400 text-center mb-6 leading-relaxed">
                WAT will verify your phone number. Carrier SMS charges may apply.
              </p>

              {/* Country Selector Button */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setShowCountryPicker(true)}
                  className="w-full flex items-center justify-between p-3.5 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-2xl text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="text-xs font-semibold text-neutral-200 truncate">
                      {selectedCountry.name}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                </button>

                {/* Phone Number Input */}
                <div className="flex items-center gap-2">
                  <div className="w-24 p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-center text-xs font-mono font-bold text-neutral-200">
                    {selectedCountry.dialCode}
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={selectedCountry.format || 'Phone number'}
                    className="flex-1 p-3.5 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-2xl text-xs font-mono text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            {/* Bottom Submit */}
            <div className="pt-6">
              <button
                onClick={handlePhoneSubmit}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 6-Digit SMS / OTP Verification */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 text-center animate-in fade-in duration-300">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setStep(2)}
                  className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-bold text-neutral-200">Verifying your number</h2>
                <div className="w-7" />
              </div>

              <p className="text-xs text-neutral-400 mb-1">
                Waiting to automatically detect an SMS sent to
              </p>
              <div className="flex items-center justify-center gap-1.5 mb-6">
                <span className="text-xs font-mono font-bold text-neutral-100">
                  {selectedCountry.dialCode} {phoneNumber || '802 345 6789'}
                </span>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-emerald-400 hover:underline font-medium"
                >
                  Wrong number?
                </button>
              </div>

              {/* 6 Digit OTP Inputs */}
              <div className="flex items-center justify-center gap-2 my-6">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className={`w-11 h-12 text-center text-lg font-bold font-mono rounded-xl bg-neutral-950 border transition-all focus:outline-none ${
                      digit
                        ? 'border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10'
                        : 'border-neutral-800 text-neutral-100 focus:border-neutral-700'
                    }`}
                  />
                ))}
              </div>

              <div className="text-xs text-neutral-500 space-y-2">
                <p>Enter 6-digit code</p>
                {resendTimer > 0 ? (
                  <p className="text-[11px] font-mono text-neutral-400">
                    Resend SMS in <span className="text-emerald-400">0:{resendTimer < 10 ? '0' : ''}{resendTimer}</span>
                  </p>
                ) : (
                  <button
                    onClick={() => setResendTimer(45)}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    Resend SMS Code
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6">
              <button
                onClick={handleVerifyOtp}
                disabled={isOtpVerifying}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
              >
                {isOtpVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Profile Information (WhatsApp Style) */}
        {step === 4 && (
          <form
            onSubmit={handleProfileSubmit}
            className="flex-1 flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-300"
          >
            <div>
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-base font-bold text-neutral-100">Profile info</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Please provide your name and an optional profile photo
                </p>
              </div>

              {/* Avatar Selector */}
              <div className="flex flex-col items-center mb-6">
                <div
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="relative group cursor-pointer"
                >
                  <img
                    src={avatar}
                    alt="Your Avatar"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-neutral-800 group-hover:ring-emerald-500 transition-all shadow-xl"
                  />
                  <div className="absolute bottom-0 right-0 p-2 bg-emerald-500 text-neutral-950 rounded-full shadow-lg ring-2 ring-neutral-900 group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>

                {/* Avatar Presets Drawer */}
                {showAvatarPicker && (
                  <div className="mt-4 p-3 bg-neutral-950 border border-neutral-800 rounded-2xl w-full space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 font-semibold">
                      <span>Choose Avatar Preset</span>
                      <button
                        type="button"
                        onClick={() => setShowAvatarPicker(false)}
                        className="text-neutral-500 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_AVATARS.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt="Preset avatar"
                          onClick={() => {
                            setAvatar(url);
                            setShowAvatarPicker(false);
                          }}
                          className={`w-12 h-12 rounded-full object-cover cursor-pointer hover:scale-105 transition-transform ${
                            avatar === url ? 'ring-2 ring-emerald-400' : 'opacity-70 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Name & Status Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Type your name here"
                    className="w-full p-3.5 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-2xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                    About / Status
                  </label>
                  <input
                    type="text"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="Available"
                    className="w-full p-3 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-2xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none transition-colors mb-2"
                  />

                  {/* Status Presets Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {STATUS_PRESETS.slice(0, 4).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setStatusMessage(preset)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] transition-colors ${
                          statusMessage === preset
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Next Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 5: Initializing Cryptographic Keys & Matrix Sync */}
        {step === 5 && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-spin">
                <RefreshCw className="w-8 h-8" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-emerald-400 font-bold text-xs">
                {initStage * 25}%
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-bold text-neutral-100">Initializing...</h2>
              <p className="text-xs text-neutral-400">Please wait a moment</p>
            </div>

            {/* Verification checklist items */}
            <div className="w-full max-w-xs space-y-2.5 text-left text-xs bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
              <div className="flex items-center gap-2.5">
                {initStage >= 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-neutral-700 shrink-0" />
                )}
                <span className={initStage >= 1 ? 'text-neutral-200' : 'text-neutral-500'}>
                  Generating Curve25519 device keys
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {initStage >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-neutral-700 shrink-0" />
                )}
                <span className={initStage >= 2 ? 'text-neutral-200' : 'text-neutral-500'}>
                  Configuring Megolm E2EE ratchet
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {initStage >= 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-neutral-700 shrink-0" />
                )}
                <span className={initStage >= 3 ? 'text-neutral-200' : 'text-neutral-500'}>
                  Connecting to Synapse homeserver
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {initStage >= 4 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-neutral-700 shrink-0" />
                )}
                <span className={initStage >= 4 ? 'text-neutral-200' : 'text-neutral-500'}>
                  Loading secure rooms & contacts
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Country Picker Slide-over Dialog */}
        {showCountryPicker && (
          <div className="absolute inset-0 bg-neutral-900 z-50 flex flex-col p-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
              <h3 className="text-sm font-bold text-neutral-100">Choose a country</h3>
              <button
                onClick={() => setShowCountryPicker(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder="Search country or code..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/60 no-scrollbar">
              {filteredCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setSelectedCountry(c);
                    setShowCountryPicker(false);
                    setCountrySearch('');
                  }}
                  className="w-full flex items-center justify-between p-3 hover:bg-neutral-800/60 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{c.flag}</span>
                    <span className="text-xs text-neutral-200">{c.name}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-400">
                    {c.dialCode}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Number Confirmation Prompt Modal */}
        {showConfirmNumberDialog && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-100">Is this the correct number?</h4>
                <p className="text-xs font-mono font-bold text-emerald-400">
                  {selectedCountry.dialCode} {phoneNumber}
                </p>
              </div>

              <p className="text-[11px] text-neutral-400">
                A verification SMS with a 6-digit code will be sent to this number.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmNumberDialog(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleConfirmNumber}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  Yes, OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
