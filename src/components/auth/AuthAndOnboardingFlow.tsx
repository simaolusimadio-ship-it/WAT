import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Key,
  QrCode,
  Globe,
  Sparkles,
  User as UserIcon,
  Briefcase,
  Building,
  MapPin,
  Check,
  Copy,
  ChevronRight,
  Shield,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { COUNTRIES, Country } from '../../data/countries';
import { soundEngine } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
];

const CORRIDOR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz' },
];

const TOPICS = [
  'Fintech & Mobile Money',
  'Decentralized Matrix 2.0',
  'Post-Quantum Cryptography',
  'WebRTC Voice/Video Mesh',
  'Pan-African B2B Trade',
  'AI Intelligence & Agents',
];

export const AuthAndOnboardingFlow: React.FC = () => {
  const {
    authStatus,
    mfaStatus,
    onboardingStatus,
    currentUser,
    signUp,
    signIn,
    verifyLoginMfa,
    activateMfa,
    skipMfa,
    saveOnboardingStep,
    finishOnboarding,
    users,
    setCurrentUserById,
  } = useChat();

  // Internal sub-screen routing:
  // 'auth' (Sign in / Sign up)
  // 'login_mfa' (MFA challenge during sign in)
  // 'mfa_decision' ("Protect Your Account" decision)
  // 'mfa_setup' (MFA setup & verification)
  // 'mfa_activated' (Success banner)
  // 'onboarding' (Step 1 to 5)
  type FlowStage =
    | 'auth'
    | 'login_mfa'
    | 'mfa_decision'
    | 'mfa_setup'
    | 'mfa_activated'
    | 'onboarding';

  const [flowStage, setFlowStage] = useState<FlowStage>('auth');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  // Sign In Form
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Sign Up Form States
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState<Country>(COUNTRIES[3]); // Default South Africa
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpErrors, setSignUpErrors] = useState<Record<string, string>>({});
  const [isSubmittingSignUp, setIsSubmittingSignUp] = useState(false);

  // Login MFA Challenge State
  const [loginMfaCode, setLoginMfaCode] = useState(['', '', '', '', '', '']);
  const [loginMfaError, setLoginMfaError] = useState('');
  const loginMfaRefs = useRef<(HTMLInputElement | null)[]>([]);

  // MFA Setup State
  const [mfaMethod, setMfaMethod] = useState<'authenticator' | 'sms'>('authenticator');
  const [mfaSetupCode, setMfaSetupCode] = useState(['', '', '', '', '', '']);
  const [mfaSetupError, setMfaSetupError] = useState('');
  const [mfaSecretKey] = useState('JBSW Y3DP EHPK 3PXP');
  const [copiedMfaSecret, setCopiedMfaSecret] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const mfaSetupRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Onboarding Steps (1 to 5)
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [obHandle, setObHandle] = useState('');
  const [obAvatar, setObAvatar] = useState(PRESET_AVATARS[0]);
  const [obStatusMsg, setObStatusMsg] = useState('Available ✦ Building on WAT');
  const [obHeadline, setObHeadline] = useState('');
  const [obBio, setObBio] = useState('');
  const [obPosition, setObPosition] = useState('');
  const [obCompany, setObCompany] = useState('');
  const [obIndustry, setObIndustry] = useState('Fintech & Technology');
  const [obLocation, setObLocation] = useState('');
  const [obCurrency, setObCurrency] = useState('USD');
  const [obSelectedTopics, setObSelectedTopics] = useState<string[]>([
    'Fintech & Mobile Money',
    'Decentralized Matrix 2.0',
  ]);
  const [obFederationEnabled, setObFederationEnabled] = useState(true);
  const [obDiscoveryEnabled, setObDiscoveryEnabled] = useState(true);
  const [obKeyProgress, setObKeyProgress] = useState(0);

  // Sync initial state with context
  useEffect(() => {
    if (authStatus === 'UNAUTHENTICATED') {
      setFlowStage('auth');
    } else if (authStatus === 'AUTHENTICATED') {
      if (mfaStatus === 'MFA_NOT_CONFIGURED') {
        setFlowStage('mfa_decision');
      } else if (onboardingStatus !== 'ONBOARDING_COMPLETED') {
        setFlowStage('onboarding');
      }
    }
  }, [authStatus, mfaStatus, onboardingStatus]);

  // Handle countdown timer for SMS resend
  useEffect(() => {
    let timer: any = null;
    if (flowStage === 'mfa_setup' && mfaMethod === 'sms' && resendCountdown > 0) {
      timer = setInterval(() => setResendCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [flowStage, mfaMethod, resendCountdown]);

  // Onboarding Step 5 key generation simulation
  useEffect(() => {
    if (flowStage === 'onboarding' && onboardingStep === 5) {
      setObKeyProgress(0);
      const interval = setInterval(() => {
        setObKeyProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            try {
              confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
            } catch {}
            return 100;
          }
          return prev + 25;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [flowStage, onboardingStep]);

  // Password strength calculation
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-neutral-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score === 3 || score === 4) return { score, label: 'Moderate', color: 'bg-amber-500' };
    return { score, label: 'Strong & Secure', color: 'bg-emerald-500' };
  };

  const passStrength = calculatePasswordStrength(password);

  // Validate Sign Up inline
  const validateSignUp = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Full Name must be at least 2 characters';
    }

    if (!dob) {
      errors.dob = 'Date of Birth is required';
    } else {
      const birthDate = new Date(dob);
      const today = new Date();
      if (isNaN(birthDate.getTime())) {
        errors.dob = 'Invalid date';
      } else if (birthDate > today) {
        errors.dob = 'Date of birth cannot be in the future';
      } else {
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 16) {
          errors.dob = 'You must be at least 16 years of age to register';
        }
      }
    }

    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (phone.replace(/\D/g, '').length < 6) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      errors.password = 'Password must include uppercase letter and number';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm your password';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setSignUpErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Sign Up Submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) {
      soundEngine.playChime();
      return;
    }

    setIsSubmittingSignUp(true);
    const cleanPhone = `${country.dialCode} ${phone.trim()}`;
    const result = await signUp({
      name: fullName.trim(),
      dob,
      country: country.name,
      phone: cleanPhone,
      password,
    });
    setIsSubmittingSignUp(false);

    if (result.success) {
      soundEngine.playMessageSent();
      setObHandle(
        `@${fullName.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}:wat.chat`
      );
      setObLocation(`${country.name}`);
      setFlowStage('mfa_decision');
    } else {
      setSignUpErrors({ form: result.error || 'Failed to create account' });
    }
  };

  // Sign In Submission
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInIdentifier.trim()) {
      setSignInError('Please enter your phone number, email or Matrix handle');
      return;
    }

    setIsSigningIn(true);
    setSignInError('');
    const result = await signIn(signInIdentifier.trim(), signInPassword);
    setIsSigningIn(false);

    if (result.success) {
      soundEngine.playMessageSent();
      if (result.requiresMfa) {
        setFlowStage('login_mfa');
      } else {
        // Logged in directly
      }
    } else {
      setSignInError(result.error || 'Invalid credentials');
      soundEngine.playChime();
    }
  };

  // Fast demo user login for quick testing
  const handleQuickDemoLogin = (userId: string) => {
    setCurrentUserById(userId);
    soundEngine.playMessageSent();
  };

  // Verify Login MFA
  const handleVerifyLoginMfa = async () => {
    const code = loginMfaCode.join('');
    if (code.length < 6) {
      setLoginMfaError('Enter complete 6-digit code');
      return;
    }
    const res = await verifyLoginMfa(code);
    if (res.success) {
      soundEngine.playMessageSent();
    } else {
      setLoginMfaError(res.error || 'Invalid MFA code');
      soundEngine.playChime();
    }
  };

  // Handle MFA Setup Activation
  const handleActivateMfa = async () => {
    const code = mfaSetupCode.join('');
    if (code.length < 6) {
      setMfaSetupError('Enter the 6-digit verification code');
      return;
    }
    const res = await activateMfa(mfaMethod, code);
    if (res.success) {
      soundEngine.playMessageSent();
      setFlowStage('mfa_activated');
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      } catch {}
    } else {
      setMfaSetupError(res.error || 'Invalid verification code');
      soundEngine.playChime();
    }
  };

  // OTP box helper for MFA inputs
  const handleOtpBoxChange = (
    index: number,
    value: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 1) {
      const newArr = [...state];
      for (let i = 0; i < 6; i++) {
        newArr[i] = digits[i] || '';
      }
      setState(newArr);
      refs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }

    const nextArr = [...state];
    nextArr[index] = digits;
    setState(nextArr);

    if (digits && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  return (
    <div
      id="auth-and-onboarding-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none animate-fade-in text-neutral-900"
    >
      <div
        id="auth-onboarding-card"
        className="w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.18)] overflow-hidden my-auto max-h-[92vh] flex flex-col relative"
      >
        {/* ========================================================= */}
        {/* 1. AUTHENTICATION (SIGN IN & SIGN UP)                     */}
        {/* ========================================================= */}
        {flowStage === 'auth' && (
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Header / Brand Banner */}
            <div className="p-6 pb-4 bg-black text-white text-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <span className="font-black text-lg tracking-tight">WAT</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Sovereign Matrix Network
              </h2>
              <p className="text-xs text-neutral-300 mt-1 max-w-sm mx-auto">
                End-to-End Encrypted Communications, Matrix 2.0 Federation & Pan-African Mobile Payments
              </p>

              {/* Toggle Sign In / Sign Up */}
              <div className="flex items-center justify-center gap-1 bg-white/10 p-1 rounded-2xl max-w-xs mx-auto mt-4 border border-white/10">
                <button
                  type="button"
                  id="auth-tab-signup"
                  onClick={() => {
                    setAuthMode('signup');
                    soundEngine.playChime();
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    authMode === 'signup'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  id="auth-tab-signin"
                  onClick={() => {
                    setAuthMode('signin');
                    soundEngine.playChime();
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    authMode === 'signin'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5 flex-1 overflow-y-auto">
              {/* SIGN UP FORM */}
              {authMode === 'signup' ? (
                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  {signUpErrors.form && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{signUpErrors.form}</span>
                    </div>
                  )}

                  {/* 1. Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="signup-fullname"
                      type="text"
                      placeholder="e.g. Amara Okafor"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (signUpErrors.fullName) setSignUpErrors((p) => ({ ...p, fullName: '' }));
                      }}
                      className={`w-full bg-black/[0.02] border rounded-2xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none transition-colors ${
                        signUpErrors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-black/[0.1] focus:border-black'
                      }`}
                    />
                    {signUpErrors.fullName && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium">{signUpErrors.fullName}</p>
                    )}
                  </div>

                  {/* 2. Date of Birth & Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Date of Birth <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="signup-dob"
                        type="date"
                        value={dob}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          setDob(e.target.value);
                          if (signUpErrors.dob) setSignUpErrors((p) => ({ ...p, dob: '' }));
                        }}
                        className={`w-full bg-black/[0.02] border rounded-2xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none transition-colors ${
                          signUpErrors.dob ? 'border-rose-400 bg-rose-50/30' : 'border-black/[0.1] focus:border-black'
                        }`}
                      />
                      {signUpErrors.dob && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">{signUpErrors.dob}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Country <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="signup-country"
                        value={country.code}
                        onChange={(e) => {
                          const found = COUNTRIES.find((c) => c.code === e.target.value);
                          if (found) setCountry(found);
                        }}
                        className="w-full bg-black/[0.02] border border-black/[0.1] rounded-2xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black font-medium"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name} ({c.dialCode})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 3. Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="px-3.5 py-2.5 rounded-2xl bg-black/[0.05] border border-black/[0.1] text-xs font-mono font-bold text-neutral-800 shrink-0">
                        {country.flag} {country.dialCode}
                      </span>
                      <input
                        id="signup-phone"
                        type="tel"
                        placeholder={country.format || '82 123 4567'}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (signUpErrors.phone) setSignUpErrors((p) => ({ ...p, phone: '' }));
                        }}
                        className={`flex-1 bg-black/[0.02] border rounded-2xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none font-mono transition-colors ${
                          signUpErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-black/[0.1] focus:border-black'
                        }`}
                      />
                    </div>
                    {signUpErrors.phone && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium">{signUpErrors.phone}</p>
                    )}
                  </div>

                  {/* 4. Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-neutral-700">
                          Password <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[11px] text-neutral-500 hover:text-black"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 8 chars"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (signUpErrors.password) setSignUpErrors((p) => ({ ...p, password: '' }));
                          }}
                          className={`w-full bg-black/[0.02] border rounded-2xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none transition-colors ${
                            signUpErrors.password ? 'border-rose-400 bg-rose-50/30' : 'border-black/[0.1] focus:border-black'
                          }`}
                        />
                      </div>
                      {signUpErrors.password && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">{signUpErrors.password}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-neutral-700">
                          Confirm Password <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-[11px] text-neutral-500 hover:text-black"
                        >
                          {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (signUpErrors.confirmPassword) setSignUpErrors((p) => ({ ...p, confirmPassword: '' }));
                        }}
                        className={`w-full bg-black/[0.02] border rounded-2xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none transition-colors ${
                          signUpErrors.confirmPassword ? 'border-rose-400 bg-rose-50/30' : 'border-black/[0.1] focus:border-black'
                        }`}
                      />
                      {signUpErrors.confirmPassword && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">{signUpErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 font-bold">
                        <span>Strength: {passStrength.label}</span>
                        <span>{password.length >= 8 ? '✓ Min 8 chars' : '× Min 8 chars'}</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 rounded-full ${passStrength.score >= 1 ? passStrength.color : 'bg-neutral-200'}`} />
                        <div className={`h-full flex-1 rounded-full ${passStrength.score >= 3 ? passStrength.color : 'bg-neutral-200'}`} />
                        <div className={`h-full flex-1 rounded-full ${passStrength.score >= 5 ? passStrength.color : 'bg-neutral-200'}`} />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    id="signup-submit-btn"
                    type="submit"
                    disabled={isSubmittingSignUp}
                    className="w-full py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
                  >
                    <span>{isSubmittingSignUp ? 'Creating Sovereign Account...' : 'Continue to Security Setup'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* SIGN IN FORM */
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {signInError && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{signInError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Phone Number, Matrix ID or Email
                    </label>
                    <input
                      id="signin-identifier"
                      type="text"
                      placeholder="e.g. +27 82 555 0199 or @lusimadio:wat.chat"
                      value={signInIdentifier}
                      onChange={(e) => setSignInIdentifier(e.target.value)}
                      className="w-full bg-black/[0.02] border border-black/[0.1] rounded-2xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-neutral-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[11px] text-neutral-500 hover:text-black"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your account password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full bg-black/[0.02] border border-black/[0.1] rounded-2xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <button
                    id="signin-submit-btn"
                    type="submit"
                    disabled={isSigningIn}
                    className="w-full py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all mt-2"
                  >
                    <span>{isSigningIn ? 'Authenticating...' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Fast Demo Account Switcher for Instant Evaluation */}
                  <div className="pt-4 border-t border-black/[0.06]">
                    <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2.5 text-center">
                      Quick Demo Switcher
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {users.slice(0, 4).map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => handleQuickDemoLogin(u.id)}
                          className="p-2 rounded-xl bg-black/[0.02] hover:bg-black/[0.06] border border-black/[0.06] flex items-center gap-2 text-left transition-colors"
                        >
                          <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-neutral-900 truncate">{u.name}</p>
                            <p className="text-[10px] text-neutral-500 font-mono truncate">{u.handle}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. LOGIN MFA CHALLENGE                                    */}
        {/* ========================================================= */}
        {flowStage === 'login_mfa' && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-14 h-14 rounded-3xl bg-black text-white flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-black text-neutral-900">Two-Factor Authentication</h2>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Enter the 6-digit verification code from your Authenticator app or registered phone.
              </p>
            </div>

            {loginMfaError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginMfaError}</span>
              </div>
            )}

            {/* 6-digit Code Input */}
            <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
              {loginMfaCode.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => (loginMfaRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) =>
                    handleOtpBoxChange(idx, e.target.value, loginMfaCode, setLoginMfaCode, loginMfaRefs)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !loginMfaCode[idx] && idx > 0) {
                      loginMfaRefs.current[idx - 1]?.focus();
                    }
                  }}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-mono font-black bg-black/[0.03] border border-black/[0.1] rounded-2xl focus:border-black focus:outline-none"
                />
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleVerifyLoginMfa}
                className="w-full py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md"
              >
                Verify & Sign In
              </button>

              <button
                type="button"
                onClick={() => setFlowStage('auth')}
                className="text-xs text-neutral-500 hover:text-black font-semibold"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. MFA DECISION ("Protect Your Account")                  */}
        {/* ========================================================= */}
        {flowStage === 'mfa_decision' && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-black text-white flex items-center justify-center mx-auto shadow-xl">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 inline-block mb-1">
                Account Created Successfully
              </span>
              <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                Protect Your Account
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                Add an extra layer of security to your sovereign account by enabling Multi-Factor Authentication.
              </p>
            </div>

            {/* Security Guarantee Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.06] space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs font-bold text-neutral-900">Olm Key Protection</p>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Protects your cryptographic Matrix device keys from SIM swap and unauthorized access.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.06] space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs font-bold text-neutral-900">Wallet Authorization</p>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Required to authenticate high-value cross-border Mobile Money and Pan-African settlements.
                </p>
              </div>
            </div>

            {/* Decision Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                id="mfa-decision-enable-btn"
                type="button"
                onClick={() => {
                  setFlowStage('mfa_setup');
                  soundEngine.playChime();
                }}
                className="w-full py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Enable Multi-Factor Authentication</span>
              </button>

              <button
                id="mfa-decision-skip-btn"
                type="button"
                onClick={() => {
                  skipMfa();
                  setFlowStage('onboarding');
                  soundEngine.playChime();
                }}
                className="w-full py-2.5 rounded-2xl text-xs font-bold text-neutral-600 hover:text-black hover:bg-black/[0.03] transition-colors"
              >
                Skip for Now
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. MFA SETUP & VERIFICATION                               */}
        {/* ========================================================= */}
        {flowStage === 'mfa_setup' && (
          <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setFlowStage('mfa_decision')}
                className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-black/[0.04] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-bold text-neutral-900">MFA Setup</h3>
              <div className="w-8" />
            </div>

            {/* Method Tabs */}
            <div className="flex items-center gap-2 bg-black/[0.03] p-1.5 rounded-2xl border border-black/[0.06]">
              <button
                type="button"
                onClick={() => setMfaMethod('authenticator')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  mfaMethod === 'authenticator'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Authenticator App</span>
              </button>
              <button
                type="button"
                onClick={() => setMfaMethod('sms')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  mfaMethod === 'sms'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>SMS Code</span>
              </button>
            </div>

            {mfaMethod === 'authenticator' ? (
              <div className="space-y-4 text-center">
                <p className="text-xs text-neutral-600">
                  Scan this QR code with Google Authenticator, Microsoft Authenticator, or 1Password:
                </p>

                <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-2xl border border-black/[0.08] shadow-sm flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=otpauth://totp/WAT:${encodeURIComponent(
                      currentUser.name || 'User'
                    )}?secret=JBSWY3DPEHPK3PXP&issuer=WAT`}
                    alt="MFA QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-black/[0.03] border border-black/[0.06] flex items-center justify-between max-w-xs mx-auto text-xs font-mono">
                  <span className="text-neutral-700 font-bold">{mfaSecretKey}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('JBSWY3DPEHPK3PXP');
                      setCopiedMfaSecret(true);
                      setTimeout(() => setCopiedMfaSecret(false), 1500);
                    }}
                    className="p-1 text-neutral-500 hover:text-black"
                  >
                    {copiedMfaSecret ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] text-center space-y-2">
                <Smartphone className="w-8 h-8 text-neutral-700 mx-auto" />
                <p className="text-xs font-bold text-neutral-900">SMS Verification Code Sent</p>
                <p className="text-[11px] text-neutral-500">
                  A 6-digit verification code was dispatched to your phone ({currentUser.phone || '+27 82 555 0199'}).
                </p>
                <div className="pt-2">
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Didn’t receive it? (Code is 123456 in demo)'}
                  </span>
                </div>
              </div>
            )}

            {/* 6-digit Code Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-700 text-center">
                Enter 6-digit Code (Demo code: 123456)
              </label>

              {mfaSetupError && (
                <p className="text-[11px] text-rose-600 text-center font-medium">{mfaSetupError}</p>
              )}

              <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                {mfaSetupCode.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (mfaSetupRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpBoxChange(i, e.target.value, mfaSetupCode, setMfaSetupCode, mfaSetupRefs)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !mfaSetupCode[i] && i > 0) {
                        mfaSetupRefs.current[i - 1]?.focus();
                      }
                    }}
                    className="w-10 h-12 text-center text-lg font-mono font-black bg-black/[0.03] border border-black/[0.1] rounded-2xl focus:border-black focus:outline-none"
                  />
                ))}
              </div>
            </div>

            <button
              id="mfa-verify-code-btn"
              type="button"
              onClick={handleActivateMfa}
              className="w-full py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verify & Activate MFA</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. MFA ACTIVATED SUCCESS BANNER                           */}
        {/* ========================================================= */}
        {flowStage === 'mfa_activated' && (
          <div className="p-8 space-y-6 text-center my-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-neutral-900">MFA Protection Activated!</h2>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Your account is now protected by two-factor authentication. Let's finish personalizing your public profile.
              </p>
            </div>

            <button
              id="mfa-continue-to-onboarding-btn"
              type="button"
              onClick={() => {
                setFlowStage('onboarding');
                setOnboardingStep(1);
                soundEngine.playChime();
              }}
              className="w-full py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>Continue to Profile Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. ONBOARDING (STEPS 1 TO 5)                              */}
        {/* ========================================================= */}
        {flowStage === 'onboarding' && (
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Step Header & Progress Indicator */}
            <div className="px-6 pt-5 pb-3 border-b border-black/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {onboardingStep > 1 && onboardingStep < 5 && (
                  <button
                    type="button"
                    onClick={() => setOnboardingStep((s) => s - 1)}
                    className="p-1.5 rounded-xl hover:bg-black/[0.05] text-neutral-500 hover:text-black transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Step {onboardingStep} of 5
                  </span>
                  <h3 className="text-sm font-black text-neutral-900">
                    {onboardingStep === 1 && 'Welcome & Identity'}
                    {onboardingStep === 2 && 'Professional & Career'}
                    {onboardingStep === 3 && 'Regional & Currencies'}
                    {onboardingStep === 4 && 'Federation & Privacy'}
                    {onboardingStep === 5 && 'Initializing Keys'}
                  </h3>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-300"
                  style={{ width: `${(onboardingStep / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6 sm:p-8 space-y-5 flex-1 overflow-y-auto">
              {/* STEP 1: WELCOME & IDENTITY */}
              {onboardingStep === 1 && (
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-neutral-500">
                      Choose an avatar and confirm your unique Matrix federation address.
                    </p>
                  </div>

                  {/* Avatar Picker */}
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={obAvatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-3xl object-cover ring-4 ring-black/5 shadow-md bg-neutral-100"
                    />
                    <div className="flex items-center justify-center gap-2 flex-wrap max-w-xs">
                      {PRESET_AVATARS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setObAvatar(av)}
                          className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform ${
                            obAvatar === av ? 'border-black scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={av} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Handle reservation */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Matrix Handle Reservation
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={obHandle}
                        onChange={(e) => setObHandle(e.target.value)}
                        className="w-full bg-black/[0.02] border border-black/[0.1] rounded-2xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black font-bold"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Your globally routable Matrix 2.0 identifier across homeservers.
                    </p>
                  </div>

                  {/* Status message */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Status / Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Building Pan-African systems"
                      value={obStatusMsg}
                      onChange={(e) => setObStatusMsg(e.target.value)}
                      className="w-full bg-black/[0.02] border border-black/[0.1] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: PROFESSIONAL & CAREER */}
              {onboardingStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Systems Architect & Fintech Specialist"
                      value={obHeadline}
                      onChange={(e) => setObHeadline(e.target.value)}
                      className="w-full bg-black/[0.02] border border-black/[0.1] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Current Position
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Principal Consultant"
                        value={obPosition}
                        onChange={(e) => setObPosition(e.target.value)}
                        className="w-full bg-black/[0.02] border border-black/[0.1] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lusimadio Ventures"
                        value={obCompany}
                        onChange={(e) => setObCompany(e.target.value)}
                        className="w-full bg-black/[0.02] border border-black/[0.1] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Industry
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Decentralized Infrastructure"
                        value={obIndustry}
                        onChange={(e) => setObIndustry(e.target.value)}
                        className="w-full bg-black/[0.02] border border-black/[0.1] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        City & Country
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Johannesburg, South Africa"
                        value={obLocation}
                        onChange={(e) => setObLocation(e.target.value)}
                        className="w-full bg-black/[0.02] border border-black/[0.1] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Bio / Summary
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe your expertise, interests, or enterprise services..."
                      value={obBio}
                      onChange={(e) => setObBio(e.target.value)}
                      className="w-full bg-black/[0.02] border border-black/[0.1] rounded-2xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: REGIONAL & CURRENCIES */}
              {onboardingStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">
                      Primary Wallet Corridor Currency
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {CORRIDOR_CURRENCIES.map((cur) => (
                        <button
                          key={cur.code}
                          type="button"
                          onClick={() => setObCurrency(cur.code)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            obCurrency === cur.code
                              ? 'bg-black text-white border-black shadow-sm'
                              : 'bg-black/[0.02] text-neutral-700 border-black/[0.08] hover:border-black'
                          }`}
                        >
                          <span className="text-base font-black block">{cur.symbol}</span>
                          <span className="text-xs font-bold block">{cur.code}</span>
                          <span className="text-[10px] opacity-70 block truncate">{cur.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">
                      Channels & Focus Topics
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map((topic) => {
                        const selected = obSelectedTopics.includes(topic);
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => {
                              if (selected) {
                                setObSelectedTopics(obSelectedTopics.filter((t) => t !== topic));
                              } else {
                                setObSelectedTopics([...obSelectedTopics, topic]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              selected
                                ? 'bg-black text-white border-black shadow-sm'
                                : 'bg-black/[0.02] text-neutral-600 border-black/[0.08] hover:text-black'
                            }`}
                          >
                            {selected ? `✓ ${topic}` : `+ ${topic}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: FEDERATION & PRIVACY */}
              {onboardingStep === 4 && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Matrix Federation Routing</p>
                      <p className="text-[11px] text-neutral-500">
                        Allow verified homeservers to route messages to your sovereign account.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={obFederationEnabled}
                      onChange={(e) => setObFederationEnabled(e.target.checked)}
                      className="w-4 h-4 accent-black rounded"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Public Profile Discovery</p>
                      <p className="text-[11px] text-neutral-500">
                        Allow peers to discover your professional profile and send direct chats.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={obDiscoveryEnabled}
                      onChange={(e) => setObDiscoveryEnabled(e.target.checked)}
                      className="w-4 h-4 accent-black rounded"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-bold">E2EE Double Ratchet Security</p>
                      <p className="text-[11px] text-emerald-700">
                        Olm and Megolm ratchets will be generated locally on this client device.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: INITIALIZING KEYS */}
              {onboardingStep === 5 && (
                <div className="py-6 text-center space-y-5">
                  <div className="w-16 h-16 rounded-3xl bg-black text-white flex items-center justify-center mx-auto shadow-xl">
                    <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-neutral-900">
                      {obKeyProgress >= 100 ? 'Setup Complete!' : 'Establishing Sovereign Cryptography'}
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      Generating Olm identity keys, cross-signing certificates, and initializing your Pan-African wallet.
                    </p>
                  </div>

                  <div className="w-full max-w-xs mx-auto space-y-1.5">
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${obKeyProgress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-neutral-500">
                      {obKeyProgress}% Initialized
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Onboarding Navigation Footer */}
            <div className="p-4 sm:p-6 border-t border-black/[0.06] flex items-center justify-between">
              {onboardingStep < 5 ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      // Save partial progress and advance
                      saveOnboardingStep(onboardingStep + 1, {
                        handle: obHandle,
                        avatar: obAvatar,
                        statusMessage: obStatusMsg,
                        headline: obHeadline,
                        bio: obBio,
                        position: obPosition,
                        company: obCompany,
                        industry: obIndustry,
                        location: obLocation,
                      });
                      setOnboardingStep((s) => s + 1);
                      soundEngine.playChime();
                    }}
                    className="w-full py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  id="finish-onboarding-btn"
                  type="button"
                  disabled={obKeyProgress < 100}
                  onClick={() => {
                    finishOnboarding({
                      handle: obHandle,
                      avatar: obAvatar,
                      statusMessage: obStatusMsg,
                      headline: obHeadline,
                      bio: obBio,
                      position: obPosition,
                      company: obCompany,
                      industry: obIndustry,
                      location: obLocation,
                    });
                  }}
                  className={`w-full py-3 rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all ${
                    obKeyProgress >= 100
                      ? 'bg-black hover:bg-neutral-800 text-white active:scale-95'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Enter WAT Network</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
