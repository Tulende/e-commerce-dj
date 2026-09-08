import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { AIService, DEFAULT_PROMPT_SUGGESTIONS } from '../services/aiService';
import { ChatMessage } from '../types/ai';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';
import { StockBadge } from './StockBadge';
import { 
  Bot, 
  X, 
  Send, 
  ShoppingBag, 
  Plus, 
  ChevronRight, 
  PackageCheck
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const { products, addToCart, setSelectedProductForModal, setIsCartOpen } = useCart();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      text: 'Halo! Saya **SoundBot AI**, asisten gear & audio engineer virtual Anda di SoundRent PRO. 🎧\n\n' +
        'Ceritakan konsep acara Anda (Party DJ, Konser Band, Akustik Kafe, atau Wedding) atau budget yang Anda siapkan. Saya siap merekomendasikan setup alat musik dan audio terbaik!',
      suggestedPrompts: [
        'Rekomendasikan paket DJ lengkap untuk party',
        'Paket alat live band kafe 50-100 orang',
        'Sound system dan mic wireless wedding',
        'Sewa alat hemat budget di bawah Rp 300rb'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiServiceRef = useRef<AIService>(new AIService(products));

  useEffect(() => {
    aiServiceRef.current = new AIService(products);
  }, [products]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userTimestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: userTimestamp,
      text: query.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    try {
      const aiResponse = await aiServiceRef.current.generateResponse(query, messages);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          text: 'Maaf, terjadi kendala saat memproses konsultasi. Silakan ulangi pertanyaan Anda.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleBookBundle = (productIds: string[]) => {
    let addedCount = 0;
    productIds.forEach((id) => {
      const prod = products.find((p) => p.id === id);
      if (prod && prod.stock > 0) {
        addToCart(prod, 1);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      onClose();
      setIsCartOpen(true);
    }
  };

  const handleQuickAdd = (product: Product) => {
    const res = addToCart(product, 1);
    if (res.success) {
      // Optional: keep modal open or give feedback
    }
  };

  // Simple renderer to format bold **text** and bullet points
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Parse **bold** parts
          const parts = line.split(/(\*\*.*?\*\*)/g);
          const formattedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="text-white font-bold">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return <code key={pIdx} className="px-1.5 py-0.5 rounded bg-slate-950 font-mono text-cyan-300 font-bold border border-slate-700">{part.slice(1, -1)}</code>;
            }
            return part;
          });

          return (
            <p key={idx} className="text-slate-300">
              {formattedLine}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full sm:w-[480px] h-[92vh] sm:h-[650px] bg-[#131B2E] border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#0B0F19] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-fuchsia-600/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-fuchsia-400" />
              </div>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white font-['Outfit']">SoundBot AI</h3>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800/60">
                  GEAR EXPERT
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online &bull; Siap Rekomendasi 24 Jam
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Tutup Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Sender label and time */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1 px-1">
                <span>{msg.sender === 'user' ? 'Anda' : 'SoundBot AI'}</span>
                <span>&bull;</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Chat Bubble */}
              <div
                className={`p-4 rounded-2xl max-w-[90%] sm:max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-tr-sm shadow-md'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-sm shadow-inner'
                }`}
              >
                {renderFormattedText(msg.text)}

                {/* Bundle Box Action (if applicable) */}
                {msg.bundleSummary && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-fuchsia-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-fuchsia-300 uppercase tracking-wider flex items-center gap-1">
                        <PackageCheck className="w-3.5 h-3.5 text-cyan-400" />
                        {msg.bundleSummary.packageName}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-400">Total Tarif Paket:</span>
                      <div className="flex items-baseline gap-2">
                        {msg.bundleSummary.discountedDailyPrice && (
                          <span className="font-mono font-bold text-emerald-400">
                            {formatRupiah(msg.bundleSummary.discountedDailyPrice)} / hari
                          </span>
                        )}
                        <span className={`font-mono ${msg.bundleSummary.discountedDailyPrice ? 'line-through text-slate-500 text-[10px]' : 'font-bold text-white'}`}>
                          {formatRupiah(msg.bundleSummary.totalDailyPrice)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookBundle(msg.bundleSummary!.productIds)}
                      className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Sewa Paket Bundling Lengkap</span>
                    </button>
                  </div>
                )}

                {/* Recommended Product Cards Carousel/List */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-cyan-300 block uppercase tracking-wider">
                      Alat Yang Direkomendasikan:
                    </span>
                    <div className="space-y-2">
                      {msg.recommendedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">
                              {product.name}
                            </h5>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-mono text-fuchsia-400 font-bold">
                                {formatRupiah(product.dailyPrice)}/hr
                              </span>
                              <StockBadge stock={product.stock} />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              onClick={() => setSelectedProductForModal(product)}
                              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 hover:text-white"
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => handleQuickAdd(product)}
                              disabled={product.stock <= 0}
                              className="px-2 py-1 rounded-md bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-[10px] font-bold flex items-center gap-1 disabled:opacity-30"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Sewa</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Prompt Chips */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {msg.suggestedPrompts.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-left flex items-center gap-1"
                      >
                        <span>{prompt}</span>
                        <ChevronRight className="w-3 h-3 text-slate-500" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-fuchsia-400" />
              </div>
              <span className="flex items-center gap-1 font-medium">
                SoundBot sedang menganalisis katalog alat...
                <span className="inline-flex gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Quick Chips Bar */}
        <div className="px-4 py-2 bg-[#0B0F19]/90 border-t border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-2">
          {DEFAULT_PROMPT_SUGGESTIONS.map((sug) => (
            <button
              key={sug.id}
              onClick={() => handleSendMessage(sug.prompt)}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 font-medium"
            >
              <span>{sug.icon}</span>
              <span>{sug.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-[#0B0F19] border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Tanyakan rekomendasi alat musik, DJ, atau sound..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-fuchsia-600/30 shrink-0"
            aria-label="Kirim Pesan"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
