import React, { useState } from 'react';
import {
  Store,
  CreditCard,
  ShoppingBag,
  Plus,
  Sparkles,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  PackageCheck,
  Send,
  MessageSquare,
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
    <div className="flex-1 bg-neutral-950 flex flex-col h-full overflow-y-auto select-none p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                  <span>WAT Business & Commerce Suite</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                    MERCHANT HUB
                  </span>
                </h1>
                <p className="text-xs text-neutral-400">
                  Mobile Money checkout, conversational catalog, and automated customer bots
                </p>
              </div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-2xl border border-neutral-800 self-start md:self-auto">
            {(['catalog', 'invoicing', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                  activeSubTab === tab
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Snapshot Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-neutral-400 font-semibold uppercase">
                30-Day Revenue
              </div>
              <div className="text-lg font-bold text-neutral-100">$4,850.00</div>
              <span className="text-[10px] text-emerald-400">⚡ 100% Mobile Money (M-Pesa/MoMo)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-neutral-400 font-semibold uppercase">
                Settled Orders
              </div>
              <div className="text-lg font-bold text-neutral-100">84 Invoices</div>
              <span className="text-[10px] text-cyan-400">Instant on-chain & bank sync</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-neutral-400 font-semibold uppercase">
                Conversion Rate
              </div>
              <div className="text-lg font-bold text-neutral-100">68.4%</div>
              <span className="text-[10px] text-amber-400">Conversational sales checkout</span>
            </div>
          </div>
        </div>

        {/* Catalog Tab */}
        {activeSubTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-200">
                Product Catalog ({products.length} Items)
              </h3>
              <button
                onClick={() => alert('New product added to AfroArtisan catalog!')}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1 shadow-md shadow-amber-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all group"
                >
                  <div className="relative h-44 bg-neutral-950 overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur text-[10px] font-mono text-emerald-400 font-bold">
                      {prod.currency} {prod.price}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                          {prod.category}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          Stock: {prod.stockCount}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-100">{prod.name}</h4>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                        {prod.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                      <button
                        onClick={() => {
                          shareProductInChat(prod);
                          setActiveTab('chats');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-emerald-600 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
          <div className="max-w-xl mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-100">
                Generate Instant Mobile Money Invoice
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Amount & Currency
                </label>
                <div className="flex gap-2 mt-1.5">
                  <select
                    value={invoiceCurrency}
                    onChange={(e: any) => setInvoiceCurrency(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
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
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-base font-bold text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Item / Service Description
                </label>
                <input
                  type="text"
                  value={invoiceDesc}
                  onChange={(e) => setInvoiceDesc(e.target.value)}
                  className="w-full mt-1.5 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Target Mobile Payment Provider
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {(['M-Pesa', 'MTN MoMo', 'Card'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setInvoiceMethod(method)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        invoiceMethod === method
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {createdNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Invoice created and dispatched to active room!</span>
              </div>
            )}

            <button
              onClick={handleGenerateAndShareInvoice}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Mobile Pay Invoice to Chat</span>
            </button>
          </div>
        )}

        {/* Analytics Tab */}
        {activeSubTab === 'analytics' && (
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-neutral-100">
              Payment Gateway Settlements (Live Webhooks)
            </h3>
            <div className="space-y-2 font-mono text-xs text-neutral-300">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-emerald-400 font-bold">M-PESA C2B</span>: 12,500 KES from +254712***890
                </div>
                <span className="text-emerald-400 font-bold">CONFIRMED (TXN #R89QW2)</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-amber-400 font-bold">MTN MOMO</span>: 450 GHS from +233244***112
                </div>
                <span className="text-emerald-400 font-bold">CONFIRMED (TXN #MM991A)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
