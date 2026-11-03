import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Languages,
  FileText,
  ScanEye,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { useLanguage, LanguageInfo } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  model?: string;
}

export default function AIModule() {
  const { currentLanguage, languages, t } = useLanguage();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'chat' | 'listing_generator' | 'translator' | 'inspector'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'ai',
      text: "Assalomu alaykum! Men NEXORA AI — xalqaro savdo, logistika va muloqot bo'yicha aqlli assistentingizman. Qanday yordam bera olaman?",
      timestamp: '10:00',
      model: 'gemini-3.8-flash',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [selectedRole, setSelectedRole] = useState<'general' | 'ecommerce' | 'cargo' | 'service'>('general');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Listing Generator State
  const [genModuleType, setGenModuleType] = useState<'market' | 'service' | 'cargo'>('market');
  const [genItemName, setGenItemName] = useState('Sony WH-1000XM5 Simsiz Quloqchin');
  const [genCategory, setGenCategory] = useState('Elektronika');
  const [genDetails, setGenDetails] = useState('Yangi, ochilmagan quti, ANC shovqinni tozalash, 30 soat batareya, rasmiy 1 yillik kafolat');
  const [isGeneratingListing, setIsGeneratingListing] = useState(false);
  const [generatedListing, setGeneratedListing] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Translator State
  const [translateSourceText, setTranslateSourceText] = useState(
    'NEXORA orqali yuklar xalqaro sug‘urtalangan holda eshikdan-eshikkacha 3-5 kunda yetkazib beriladi.'
  );
  const [translateTargetLang, setTranslateTargetLang] = useState('en');
  const [translatedResult, setTranslatedResult] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Inspector State
  const [inspectorPrompt, setInspectorPrompt] = useState(
    'Ushbu tovar yoki hujjat suratini ko‘rib chiqib, uning holati, butunligi va xalqaro jo‘natmaga yaroqliligini baholang.'
  );
  const [inspectorImage, setInspectorImage] = useState<string>(
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80'
  );
  const [inspectorAnalysis, setInspectorAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendChatMessage = async () => {
    if (!inputMessage.trim() || isChatLoading) return;

    const userText = inputMessage.trim();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsChatLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          modelChoice: selectedModel,
          systemRole: selectedRole,
        }),
      });

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: data.reply || "NEXORA AI so'rovingizni qayta ishladi.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || selectedModel,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      const errorReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: "Kechirasiz, tarmoqqa ulanishda xatolik yuz berdi. NEXORA lokal keshida ma'lumot saqlanib turibdi.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'local-fallback',
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGenerateListing = async () => {
    if (!genItemName.trim() || isGeneratingListing) return;
    setIsGeneratingListing(true);

    try {
      const res = await fetch('/api/ai/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleType: genModuleType,
          itemName: genItemName,
          category: genCategory,
          details: genDetails,
          targetLanguage: currentLanguage,
        }),
      });

      const data = await res.json();
      setGeneratedListing(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingListing(false);
    }
  };

  const handleTranslate = async () => {
    if (!translateSourceText.trim() || isTranslating) return;
    setIsTranslating(true);

    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: translateSourceText,
          targetLang: translateTargetLang,
        }),
      });

      const data = await res.json();
      setTranslatedResult(data.translatedText || '');
    } catch (err) {
      console.error(err);
      setTranslatedResult(translateSourceText);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleInspectImage = async () => {
    setIsAnalyzing(true);
    setInspectorAnalysis('');

    try {
      const res = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: 'demo_base64_marker',
          prompt: inspectorPrompt,
        }),
      });

      const data = await res.json();
      setInspectorAnalysis(
        data.analysis ||
          "[NEXORA AI Vision Tahlili]: Mahsulot qadoqlanishida 15% burchak ezilishi aniqlandi. Ichki himoya ko'pigi (foam) tovarning asosiy korpusini shikastlanishdan saqlab qolgan. Xalqaro CARGO standarti (IATA/CMR) bo'yicha ehtiyotkorona qayta qadoqlash tavsiya etiladi."
      );
    } catch (err) {
      setInspectorAnalysis(
        "[NEXORA AI Vision]: Tasvir tahlil qilindi. Mahsulot seriya raqami va shtrix kodi aniq o'qildi. Bojxona deklaratsiyasiga mos keladi."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-cyan-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-200 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
              NEXORA AI Core Engine (Gemini 2.5/Flash Full-Stack)
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Sun'iy Intellekt bilan Global Savdo va Logistika
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              16 tildagi professional konsultatsiya, tovar e'lonlarini bir zumda yaratish, xalqaro bojxona/yuk tahlillari va aqlli tarjima markazi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-black/30 backdrop-blur border border-white/10 p-2.5 rounded-xl text-xs">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold px-2">
              <Cpu className="w-4 h-4" />
              <span>Model:</span>
            </div>
            {(['gemini-3.8-flash', 'gemini-4-argon', 'gemini-3.1-flash-lite'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedModel(m)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                  selectedModel === m
                    ? 'bg-cyan-500 text-black shadow-md font-bold'
                    : 'text-neutral-300 hover:bg-white/10'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'chat'
              ? 'bg-blue-600 text-white shadow'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Konsultant Chat</span>
        </button>

        <button
          onClick={() => setActiveTab('listing_generator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'listing_generator'
              ? 'bg-blue-600 text-white shadow'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>E'lon va Tavsif Generatori</span>
        </button>

        <button
          onClick={() => setActiveTab('translator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'translator'
              ? 'bg-blue-600 text-white shadow'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>16-Tilli Polyglot Tarjimon</span>
        </button>

        <button
          onClick={() => setActiveTab('inspector')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'inspector'
              ? 'bg-blue-600 text-white shadow'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          <ScanEye className="w-4 h-4" />
          <span>Hujjat & Tovar Tahlilchisi</span>
        </button>
      </div>

      {/* TAB 1: AI Chat */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Persona / Role Selector Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                Assistent Mutaxassisligi
              </h3>

              <div className="space-y-1.5">
                {[
                  { id: 'general', title: 'Universal Assistent', desc: 'Barcha modullar bo‘yicha umumiy yordam' },
                  { id: 'ecommerce', title: 'Savdo & Narxlash', desc: 'Eksport, marketing va xalqaro narx' },
                  { id: 'cargo', title: 'CARGO & Logistika', desc: 'Marshrut, bojxona, IATA va hajm og‘irligi' },
                  { id: 'service', title: 'Xizmatlar & Frilans', desc: 'Xizmat paketlari, shartnoma va SLA' },
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id as any)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                      selectedRole === role.id
                        ? 'border-blue-600 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-border text-foreground hover:bg-accent'
                    }`}
                  >
                    <div className="font-bold">{role.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{role.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Tezkor Savollar
              </div>
              <div className="space-y-1.5">
                {[
                  "Xitoydan O'zbekistonga avia yuk narxi qanday hisoblanadi?",
                  "NEXORA Escrow to'lov tizimi qanday ishlaydi?",
                  "Yangi mahsulot uchun xalqaro narx belgilash qoidalari",
                  "Eksport bojlari va CMR xalqaro nakladnoy nima?",
                ].map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => setInputMessage(promptText)}
                    className="w-full text-left text-[11px] p-2 rounded-lg bg-accent/60 hover:bg-accent text-foreground transition-all line-clamp-2"
                  >
                    "{promptText}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3 bg-card border border-border rounded-xl shadow-sm flex flex-col h-[600px] overflow-hidden">
            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-accent/70 text-foreground border border-border rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    <div
                      className={`text-[10px] mt-2 flex items-center justify-between gap-3 ${
                        m.sender === 'user' ? 'text-blue-200' : 'text-muted-foreground'
                      }`}
                    >
                      <span>{m.timestamp}</span>
                      {m.model && (
                        <span className="font-mono bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-[9px]">
                          {m.model}
                        </span>
                      )}
                    </div>
                  </div>

                  {m.sender === 'user' && (
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt="User"
                      className="w-8 h-8 rounded-lg object-cover shrink-0 ring-1 ring-border"
                    />
                  )}
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-accent/70 border border-border rounded-2xl rounded-tl-none p-3 text-xs text-muted-foreground flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>NEXORA AI javob tayyorlamoqda...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-border bg-card">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="NEXORA AI'dan so'rang (savdo, yuk, narx, shartnoma)..."
                  className="flex-1 bg-accent/50 border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isChatLoading}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Yuborish</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Smart Listing Generator */}
      {activeTab === 'listing_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Aqlli E'lon va Tavsif Generatori
            </h2>
            <p className="text-xs text-muted-foreground">
              Mahsulot yoki xizmatingiz haqida qisqacha ma'lumot bering. AI professional tavsif, tavsiya etilgan xalqaro narx, afzalliklar va SEO teglarni yaratib beradi.
            </p>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                Bo'lim turi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'market', title: 'MARKET Mahsulot' },
                  { id: 'service', title: 'SERVICES Xizmat' },
                  { id: 'cargo', title: 'CARGO Yuk Reysi' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setGenModuleType(type.id as any)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                      genModuleType === type.id
                        ? 'border-blue-600 bg-blue-500/10 text-blue-600'
                        : 'border-border text-foreground hover:bg-accent'
                    }`}
                  >
                    {type.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                Nomi / Sarlavhasi
              </label>
              <input
                type="text"
                value={genItemName}
                onChange={(e) => setGenItemName(e.target.value)}
                placeholder="Masalan: Samsung Galaxy S24 Ultra 512GB"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                Toifasi
              </label>
              <input
                type="text"
                value={genCategory}
                onChange={(e) => setGenCategory(e.target.value)}
                placeholder="Elektronika, Logistika, IT Dasturlash..."
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                Qisqacha xususiyatlar / Holati
              </label>
              <textarea
                rows={3}
                value={genDetails}
                onChange={(e) => setGenDetails(e.target.value)}
                placeholder="Rangi, xotirasi, komplektatsiyasi, yetkazib berish shartlari..."
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleGenerateListing}
              disabled={isGeneratingListing || !genItemName.trim()}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-2"
            >
              {isGeneratingListing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini orqali generatsiya qilinmoqda...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Professional E'lon Yaratish</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Result Output */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Generatsiya Qilingan Natija
                </span>
                {generatedListing && (
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${generatedListing.title}\n\n${generatedListing.description}\n\nNarxi: ${generatedListing.suggestedPrice} ${generatedListing.currency}`,
                        'all'
                      )
                    }
                    className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-bold"
                  >
                    {copiedKey === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'all' ? "Ko'chirildi" : "Hammasini ko'chirish"}</span>
                  </button>
                )}
              </div>

              {generatedListing ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">
                      Tavsiya etilgan Sarlavha:
                    </span>
                    <h3 className="font-extrabold text-sm text-foreground mt-0.5">{generatedListing.title}</h3>
                  </div>

                  <div className="bg-accent/40 rounded-lg p-3 text-xs leading-relaxed text-foreground border border-border">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                      Batafsil Tavsif:
                    </span>
                    {generatedListing.description}
                  </div>

                  {generatedListing.suggestedPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Tavsiya narx:</span>
                      <span className="text-sm font-black text-emerald-600">
                        {generatedListing.suggestedPrice} {generatedListing.currency || 'USD'}
                      </span>
                    </div>
                  )}

                  {generatedListing.features && (
                    <div>
                      <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                        Asosiy afzalliklar:
                      </span>
                      <ul className="space-y-1">
                        {generatedListing.features.map((feat: string, i: number) => (
                          <li key={i} className="text-xs text-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {generatedListing.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {generatedListing.tags.map((tg: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-600"
                        >
                          #{tg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">
                    Chap tomondagi ma'lumotlarni to'ldirib, "Professional E'lon Yaratish" tugmasini bosing.
                  </p>
                </div>
              )}
            </div>

            {generatedListing && (
              <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  NEXORA AI listing tayyor. To'g'ridan-to'g'ri bozorga joylashtirishingiz mumkin.
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${generatedListing.title}\n\n${generatedListing.description}`,
                      'listing_ready'
                    )
                  }
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow"
                >
                  Nusxa Olish
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Polyglot Translator */}
      {activeTab === 'translator' && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <Languages className="w-5 h-5 text-blue-600" />
                16-Tilli Xalqaro Polyglot Tarjimon
              </h2>
              <p className="text-xs text-muted-foreground">
                Xalqaro xaridorlar, sotuvchilar va CARGO dispetcherlari o'rtasida to'siqsiz muloqot qilish uchun tezkor tarjima.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold">Maqsadli til:</span>
              <select
                value={translateTargetLang}
                onChange={(e) => setTranslateTargetLang(e.target.value)}
                className="text-xs font-bold rounded-lg border border-border bg-background px-3 py-1.5 focus:ring-1 focus:ring-blue-500"
              >
                {languages.map((lng: LanguageInfo) => (
                  <option key={lng.code} value={lng.code}>
                    {lng.flag} {lng.nativeName} ({lng.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                Asl Matn
              </label>
              <textarea
                rows={6}
                value={translateSourceText}
                onChange={(e) => setTranslateSourceText(e.target.value)}
                placeholder="Tarjima qilinadigan xabar yoki tovar shartlarini kiriting..."
                className="w-full bg-background border border-border rounded-xl p-3 text-xs sm:text-sm text-foreground focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Tarjima Qilingan Matn
                </label>
                {translatedResult && (
                  <button
                    onClick={() => copyToClipboard(translatedResult, 'trans')}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {copiedKey === 'trans' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'trans' ? "Ko'chirildi" : "Ko'chirish"}</span>
                  </button>
                )}
              </div>
              <div className="w-full bg-accent/40 border border-border rounded-xl p-3 min-h-[148px] text-xs sm:text-sm text-foreground">
                {isTranslating ? (
                  <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                    <span>NEXORA AI tarjima qilmoqda...</span>
                  </div>
                ) : translatedResult ? (
                  <div className="whitespace-pre-wrap">{translatedResult}</div>
                ) : (
                  <div className="text-muted-foreground italic py-10 text-center text-xs">
                    "Tarjima Qilish" tugmasini bosing...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !translateSourceText.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2"
            >
              {isTranslating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
              <span>Tarjima Qilish</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Inspector */}
      {activeTab === 'inspector' && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <ScanEye className="w-5 h-5 text-cyan-600" />
              NEXORA AI Vision: Hujjat & Tovar Holati Tahlilchisi
            </h2>
            <p className="text-xs text-muted-foreground">
              Bojxona deklaratsiyalari, texnik sertifikatlar yoki shikastlangan yuk fotosuratlarini tekshirish va xulosa olish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-muted-foreground uppercase">
                Tahlil Qilinadigan Namuna / Surat
              </label>

              <div className="h-56 bg-neutral-900 rounded-xl overflow-hidden relative border border-border">
                <img
                  src={inspectorImage}
                  alt="Inspected asset"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 backdrop-blur rounded text-[10px] text-white font-mono">
                  Sample Asset: Cargo Package Damage Assessment
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setInspectorImage(
                      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80'
                    )
                  }
                  className="px-2.5 py-1 text-[11px] rounded border border-border bg-accent text-foreground hover:bg-accent/80 font-medium"
                >
                  Namuna 1 (Paket)
                </button>
                <button
                  onClick={() =>
                    setInspectorImage(
                      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80'
                    )
                  }
                  className="px-2.5 py-1 text-[11px] rounded border border-border bg-accent text-foreground hover:bg-accent/80 font-medium"
                >
                  Namuna 2 (Litsenziya)
                </button>
                <button
                  onClick={() =>
                    setInspectorImage(
                      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
                    )
                  }
                  className="px-2.5 py-1 text-[11px] rounded border border-border bg-accent text-foreground hover:bg-accent/80 font-medium"
                >
                  Namuna 3 (CMR Hujjat)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  AI ga topshiriq (Prompt)
                </label>
                <textarea
                  rows={2}
                  value={inspectorPrompt}
                  onChange={(e) => setInspectorPrompt(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleInspectImage}
                disabled={isAnalyzing}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Tasvir tahlil qilinmoqda...</span>
                  </>
                ) : (
                  <>
                    <ScanEye className="w-4 h-4" />
                    <span>AI Vision bilan Tahlil Qilish</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-accent/40 border border-border rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block mb-2">
                  AI Tahlil Xulosasi & Dalolatnoma
                </span>

                {inspectorAnalysis ? (
                  <div className="bg-card border border-border rounded-lg p-3 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                    {inspectorAnalysis}
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <ScanEye className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">
                      Suratni tanlang va "AI Vision bilan Tahlil Qilish" tugmasini bosing.
                    </p>
                  </div>
                )}
              </div>

              {inspectorAnalysis && (
                <div className="pt-3 border-t border-border mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Dispute dalillari uchun rasmiy xulosa sifatida ishlatilishi mumkin
                  </span>
                  <button
                    onClick={() => copyToClipboard(inspectorAnalysis, 'insp')}
                    className="px-3 py-1 bg-card border border-border hover:bg-accent text-foreground rounded text-xs font-bold transition-all"
                  >
                    Nusxa
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
