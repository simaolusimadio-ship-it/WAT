import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Key,
  Lock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Server,
  RefreshCw,
  Terminal,
  UserCheck,
  Layers,
  Radio,
  FileCode,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { matrixUVS } from '../utils/matrixUVS';
import { OpenIDToken, UVSVerificationResult } from '../types';

export const UserVerificationServiceModal: React.FC = () => {
  const { isUVSModalOpen, setIsUVSModalOpen, currentUser, activeRoom, users } = useChat();

  const [selectedUser, setSelectedUser] = useState(currentUser);
  const [currentToken, setCurrentToken] = useState<OpenIDToken | null>(null);
  const [uvsResult, setUvsResult] = useState<UVSVerificationResult | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isUVSModalOpen) return null;

  const handleGenerateAndVerifyToken = () => {
    setIsVerifying(true);
    const token = matrixUVS.generateOpenIDToken(selectedUser.handle || selectedUser.id);
    setCurrentToken(token);

    setTimeout(() => {
      const result = matrixUVS.auditUserVerification(
        selectedUser.handle || selectedUser.id,
        activeRoom?.id || '!main:wat.chat'
      );
      setUvsResult(result);
      setIsVerifying(false);
    }, 600);
  };

  const copyTokenJSON = () => {
    if (!currentToken) return;
    navigator.clipboard.writeText(JSON.stringify(currentToken, null, 2));
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-100">
                  Matrix User Verification Service (UVS)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/40">
                  RFC OpenID Connect & MSK
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                S2S OpenID token verification, cross-signing keys, and room power level authorization
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUVSModalOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Persona selector for UVS audit */}
          <div>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Select Matrix Identity to Verify
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {users.map((u) => {
                const isSel = u.id === selectedUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      setSelectedUser(u);
                      setCurrentToken(null);
                      setUvsResult(null);
                    }}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      isSel
                        ? 'bg-cyan-500/15 border-cyan-400/80 ring-1 ring-cyan-400'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-100 truncate">{u.name}</div>
                      <div className="text-[10px] font-mono text-cyan-400 truncate">{u.handle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action to Request OpenID Token & Run UVS Audit */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-neutral-200">
                Execute C2S OpenID $\rightarrow$ S2S UVS Verification
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Calls <code className="text-cyan-300 font-mono">/_matrix/client/v3/user/openid/request_token</code> and audits against Synapse S2S
              </p>
            </div>
            <button
              onClick={handleGenerateAndVerifyToken}
              disabled={isVerifying}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-neutral-950 font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all shrink-0"
            >
              {isVerifying ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UserCheck className="w-3.5 h-3.5" />
              )}
              <span>{isVerifying ? 'Auditing...' : 'Run UVS Verification'}</span>
            </button>
          </div>

          {/* OpenID Token Display */}
          {currentToken && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Issued OpenID Connect Token (C2S)</span>
                </span>
                <button
                  onClick={copyTokenJSON}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                >
                  {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedToken ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-neutral-800 font-mono text-[11px] text-neutral-300 overflow-x-auto space-y-1">
                <div><span className="text-cyan-400">access_token:</span> &quot;{currentToken.accessToken}&quot;</div>
                <div><span className="text-cyan-400">token_type:</span> &quot;{currentToken.tokenType}&quot;</div>
                <div><span className="text-cyan-400">matrix_server_name:</span> &quot;{currentToken.matrixServerName}&quot;</div>
                <div><span className="text-cyan-400">expires_in:</span> {currentToken.expiresIn}s</div>
              </div>
            </div>
          )}

          {/* UVS Verification Results Breakdown */}
          {uvsResult && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-emerald-500/30">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">
                    Trust Score
                  </div>
                  <div className="text-2xl font-black text-emerald-400 mt-0.5">
                    {uvsResult.trustScore}%
                  </div>
                  <span className="text-[10px] text-emerald-300">🟢 Fully Validated</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">
                    Cross-Signing Keys
                  </div>
                  <div className="text-xs font-bold text-neutral-200 mt-1">
                    MSK + SSK + USK
                  </div>
                  <span className="text-[10px] text-cyan-400">
                    {uvsResult.crossSigningStatus.verifiedDevicesCount} Verified Devices
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">
                    Room Power Level
                  </div>
                  <div className="text-xs font-bold text-neutral-200 mt-1 font-mono">
                    PL {uvsResult.roomPermissions?.powerLevel} ({uvsResult.roomPermissions?.powerLevel === 100 ? 'Admin' : uvsResult.roomPermissions?.powerLevel === 50 ? 'Moderator' : 'Member'})
                  </div>
                  <span className="text-[10px] text-amber-400">
                    Jitsi / MatrixRTC Authorized
                  </span>
                </div>
              </div>

              {/* Cryptographic Key Hierarchy Graph */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span>Matrix Cross-Signing Trust Chain</span>
                </h4>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-neutral-200 font-bold">Master Key (MSK)</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {uvsResult.crossSigningStatus.masterKeyId}
                    </span>
                  </div>

                  <div className="pl-6 border-l-2 border-dashed border-neutral-800 ml-4 space-y-2">
                    <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-neutral-300">Self-Signing Key (SSK)</span>
                      </div>
                      <span className="text-[10px] text-emerald-400">Verifies local devices</span>
                    </div>

                    <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-neutral-300">User-Signing Key (USK)</span>
                      </div>
                      <span className="text-[10px] text-emerald-400">Verifies cross-federation users</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>UVS Endpoint: https://uvs.matrix.wat.chat</span>
          </div>
          <button
            onClick={() => setIsUVSModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
