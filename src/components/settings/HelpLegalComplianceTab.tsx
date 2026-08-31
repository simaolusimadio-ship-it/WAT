import React, { useState } from 'react';
import {
  HelpCircle,
  FileText,
  Shield,
  AlertTriangle,
  Download,
  ExternalLink,
  MessageSquare,
  Lock,
  Flag,
  UserX,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { WATUserSettings } from '../../types/watUserSettings';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const HelpLegalComplianceTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
}) => {
  const hl = settings.helpAndLegal;
  const [reportText, setReportText] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  const handleRequestDataExport = () => {
    updateSettings((prev) => ({
      ...prev,
      helpAndLegal: {
        ...prev.helpAndLegal,
        dataExportRequested: true,
        lastExportDate: new Date().toISOString().split('T')[0],
      },
    }));
    showToast('POPIA/GDPR Data Export archive generated and downloaded!');
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    showToast('Report submitted to WAT Trust & Safety team.');
    setReportText('');
    setShowReportModal(false);
  };

  return (
    <div className="space-y-6 text-neutral-200 animate-fade-in">
      {/* 30. Help & Support */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">30. 💡 Help, Support & FAQs</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">24/7 COPILOT SUPPORT</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://matrix.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between transition-colors"
          >
            <div className="space-y-1">
              <div className="text-xs font-bold text-neutral-200">Matrix Protocol Docs</div>
              <div className="text-[10px] text-neutral-400">Federation and encryption specs</div>
            </div>
            <ExternalLink className="w-4 h-4 text-emerald-400" />
          </a>

          <button
            type="button"
            onClick={() => showToast('Opening WAT AI Support Chatbot...')}
            className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-left transition-colors"
          >
            <div className="space-y-1">
              <div className="text-xs font-bold text-neutral-200">Contact Human & AI Support</div>
              <div className="text-[10px] text-neutral-400">Instant resolution for account & billing</div>
            </div>
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </section>

      {/* 31. Legal, POPIA & African Compliance */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-neutral-100">31. 📜 Legal & POPIA / GDPR Compliance</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
            COMPLIANT
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
          <div className="text-xs font-bold text-neutral-200">
            South African POPIA & Continental Data Privacy
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            WAT adheres strictly to the Protection of Personal Information Act (POPIA Act 4 of 2013) and the African Union Convention on Cyber Security and Personal Data Protection (Malabo Convention). Personal data remains encrypted on federated Matrix homeservers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              showToast('WAT Terms of Service v1.0 loaded.');
            }}
            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-xs font-semibold text-neutral-300 transition-colors"
          >
            <span>Terms of Service</span>
            <FileText className="w-4 h-4 text-neutral-500" />
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              showToast('WAT Privacy Policy v1.0 loaded.');
            }}
            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between text-xs font-semibold text-neutral-300 transition-colors"
          >
            <span>Privacy Policy</span>
            <Lock className="w-4 h-4 text-neutral-500" />
          </a>
        </div>
      </section>

      {/* 32 & 33. Report, Block & Data Management */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-neutral-100">32 & 33. Report Center & Data Rights</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center gap-3 text-left transition-colors"
          >
            <Flag className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-xs font-bold text-neutral-200">Report Spam, Fraud or Harassment</div>
              <div className="text-[10px] text-neutral-400">Confidential safety review</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleRequestDataExport}
            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center gap-3 text-left transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-xs font-bold text-neutral-200">Download Account & Message Data</div>
              <div className="text-[10px] text-neutral-400">POPIA Section 23 Data Portability</div>
            </div>
          </button>
        </div>

        {showReportModal && (
          <form onSubmit={handleSendReport} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-neutral-200">Submit Trust & Safety Report</h4>
            <textarea
              rows={3}
              placeholder="Describe the issue (e.g. fraudulent seller, impersonation, unsolicited spam)..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 outline-none resize-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
              >
                Send Report
              </button>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};
