import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { WATUserSettings, WalletTransaction } from '../../types/watUserSettings';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const PaymentsTab: React.FC<Props> = ({ settings, updateSettings, showToast }) => {
  const pay = settings.payments;
  const [showSendModal, setShowSendModal] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSendPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || !recipient.trim()) return;

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      recipient: recipient.trim(),
      amount: num,
      type: 'sent',
      status: 'completed',
      method: pay.defaultMethod === 'mpesa' ? 'M-Pesa Direct' : 'Mobile Money',
      reference: `WAT-P2P-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    updateSettings((prev) => ({
      ...prev,
      payments: {
        ...prev.payments,
        walletBalance: prev.payments.walletBalance - num,
        transactions: [newTx, ...prev.payments.transactions],
      },
    }));

    showToast(`Transferred ${pay.currency} ${num.toLocaleString()} to ${recipient}!`);
    setRecipient('');
    setAmount('');
    setShowSendModal(false);
  };

  return (
    <div className="space-y-6 text-neutral-200 animate-fade-in">
      {/* 15. African Mobile Money & Card Payments */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">15. 💳 Mobile Money & Chat Payments</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">INSTANT SETTLEMENT</span>
        </div>

        {/* Balance Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-neutral-950 to-neutral-950 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-400">WAT Integrated Wallet Balance</span>
            <div className="text-2xl sm:text-3xl font-black text-neutral-100 mt-1 font-mono">
              {pay.currency} {pay.walletBalance.toLocaleString()}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Backed by Central Bank licensed escrow
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowSendModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Money</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Payment request link copied to clipboard!')}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-bold text-xs border border-neutral-700"
            >
              Request Money
            </button>
          </div>
        </div>

        {showSendModal && (
          <form onSubmit={handleSendPayment} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-neutral-200">Send Payment in Chat</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Recipient name or phone number"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 outline-none"
              />
              <input
                type="number"
                placeholder="Amount (e.g. 2500)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs"
              >
                Transfer Now
              </button>
              <button
                type="button"
                onClick={() => setShowSendModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Linked Accounts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
            <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" /> Safaricom M-Pesa Express
            </div>
            <div className="text-xs font-mono text-neutral-400">{pay.mpesaPhone}</div>
            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              PRIMARY METHOD
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
            <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-amber-400" /> MTN MoMo / Airtel Money
            </div>
            <div className="text-xs font-mono text-neutral-400">{pay.momoPhone}</div>
            <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
              LINKED
            </span>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Recent Transactions
          </div>

          {pay.transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    tx.type === 'received'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {tx.type === 'received' ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-200">{tx.recipient}</div>
                  <div className="text-[10px] text-neutral-400">
                    {tx.date} • {tx.method} • {tx.reference}
                  </div>
                </div>
              </div>

              <div
                className={`text-xs font-bold font-mono ${
                  tx.type === 'received' ? 'text-emerald-400' : 'text-neutral-200'
                }`}
              >
                {tx.type === 'received' ? '+' : '-'} {pay.currency} {tx.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
