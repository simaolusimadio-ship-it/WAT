import React, { useState } from 'react';
import {
  CreditCard,
  ShoppingBag,
  Plus,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  PackageCheck,
  Send,
  Sparkles,
  Bot,
  Tag,
  Shield,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { ProductInfo } from '../types';

export const BusinessSuiteView: React.FC = () => {
  const { products, shareProductInChat, createInvoiceInChat, setActiveTab } = useChat();

  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'invoicing' | 'analytics'>('catalog');
  const [invoiceAmount, setInvoiceAmount] = useState('120');
  const [invoiceDesc, setInvoiceDesc] = useState('Custom Handcrafted Textile Order');
  const [invoiceCurrency, setInvoiceCurrency] = useState<'USD' | 'KES' | 'NGN' | 'GHS'>('USD');
  const [invoiceMethod, setInvoiceMethod] = useState<'M-Pesa' | 'MTN MoMo' | 'Card'>('M-Pesa');
  const [createdNotice, setCreatedNotice] = useState(false);

  const handleGenerateAndShareInvoice = () => {
    createInvoiceInChat(
      parseFloat(invoiceAmount) || 100,
      invoiceCurrency,
      invoiceDesc,
      invoiceMethod
    );
    setCreatedNotice(true);
    setTimeout(() => {
      setCreatedNotice(false);
      setActiveTab('chats');
    }, 1200);
  };

  return (
    <div className="flex-1 bg-neutral-100 flex flex-col h-full overflow-y-auto select-none p-4 md:p-8 pb-20 md:pb-8 text-neutral-900">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header with Sub Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              WAT Business & Commerce Suite
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              African artisan commerce, instant Mobile Money gateways, staff roles & AI Copilot
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl border border-black/[0.08] shadow-sm self-start md:self-auto">
            {(['catalog', 'invoicing', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  activeSubTab === tab
                    ? 'bg-black text-white font-bold shadow-sm'
                    : 'text-neutral-600 hover:text-black hover:bg-black/[0.04]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Snapshot Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.06)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 font-bold uppercase">
                30-Day Revenue
              </div>
              <div className="text-lg font-black text-neutral-900">$4,850.00</div>
              <span className="text-[10px] text-neutral-600 font-medium">⚡ 100% Mobile Money (M-Pesa/MoMo)</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.06)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 font-bold uppercase">
                Settled Orders
              </div>
              <div className="text-lg font-black text-neutral-900">84 Invoices</div>
              <span className="text-[10px] text-neutral-600 font-medium">Instant on-chain & bank sync</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.06)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 font-bold uppercase">
                Conversion Rate
              </div>
              <div className="text-lg font-black text-neutral-900">68.4%</div>
              <span className="text-[10px] text-neutral-600 font-medium">Conversational sales checkout</span>
            </div>
          </div>
        </div>

        {/* Catalog Tab */}
        {activeSubTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">
                Product Catalog ({products.length} Items)
              </h3>
              <button
                onClick={() => alert('New product added to AfroArtisan catalog!')}
                className="px-3.5 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-3xl bg-white/90 border border-black/[0.08] overflow-hidden flex flex-col justify-between hover:border-black/20 transition-all shadow-sm hover:shadow-md group"
                >
                  <div className="relative h-48 bg-neutral-100 overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black text-white text-[11px] font-mono font-bold shadow-md">
                      {prod.currency} {prod.price}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          {prod.category}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          Stock: {prod.stockCount}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-neutral-900">{prod.name}</h4>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center justify-between">
                      <button
                        onClick={() => {
                          shareProductInChat(prod);
                          setActiveTab('chats');
                        }}
                        className="w-full py-2.5 px-3 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                      >
                        <Send className="w-3 h-3" />
                        <span>Share in Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invoicing Tab */}
        {activeSubTab === 'invoicing' && (
          <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-2xl border border-black/[0.08] rounded-3xl p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.06)] space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-black/[0.06]">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                Generate Instant Mobile Money Invoice
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Amount & Currency
                </label>
                <div className="flex gap-2 mt-1.5">
                  <select
                    value={invoiceCurrency}
                    onChange={(e: any) => setInvoiceCurrency(e.target.value)}
                    className="bg-black/[0.03] border border-black/[0.08] rounded-2xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-black"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="KES">KES (KSh)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="GHS">GHS (GH₵)</option>
                  </select>
                  <input
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    className="flex-1 bg-black/[0.03] border border-black/[0.08] rounded-2xl px-4 py-2 text-base font-bold text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Item / Service Description
                </label>
                <input
                  type="text"
                  value={invoiceDesc}
                  onChange={(e) => setInvoiceDesc(e.target.value)}
                  className="w-full mt-1.5 bg-black/[0.03] border border-black/[0.08] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Target Mobile Payment Provider
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {(['M-Pesa', 'MTN MoMo', 'Card'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setInvoiceMethod(method)}
                      className={`py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                        invoiceMethod === method
                          ? 'bg-black text-white border-black shadow-sm'
                          : 'bg-black/[0.03] border-black/[0.08] text-neutral-600 hover:text-black hover:bg-black/[0.06]'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {createdNotice && (
              <div className="p-3 rounded-2xl bg-black/[0.04] border border-black/[0.08] text-neutral-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Invoice created and dispatched to active room!</span>
              </div>
            )}

            <button
              onClick={handleGenerateAndShareInvoice}
              className="w-full py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Mobile Pay Invoice to Chat</span>
            </button>
          </div>
        )}

        {/* Analytics Tab */}
        {activeSubTab === 'analytics' && (
          <div className="p-6 bg-white/90 backdrop-blur-2xl border border-black/[0.08] rounded-3xl space-y-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <h3 className="text-sm font-bold text-neutral-900">
              Payment Gateway Settlements (Live Webhooks)
            </h3>
            <div className="space-y-2 font-mono text-xs text-neutral-700">
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-neutral-900 font-bold">M-PESA C2B</span>: 12,500 KES from +254712***890
                </div>
                <span className="text-emerald-600 font-bold">CONFIRMED (TXN #R89QW2)</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-neutral-900 font-bold">MTN MOMO</span>: 450 GHS from +233244***112
                </div>
                <span className="text-emerald-600 font-bold">CONFIRMED (TXN #MM991A)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
