import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Gift,
  Share2,
  Copy,
  Check,
  TrendingUp,
  ShieldAlert,
  Award,
  Zap,
  ArrowRight,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoyaltyTier } from '../../types';

interface LoyaltyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToShop?: () => void;
}

export const LoyaltyRewardsModal: React.FC<LoyaltyRewardsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToShop,
}) => {
  const { currentUser, loyaltyLedger, earnPoints } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'earn' | 'redeem' | 'ledger'>('overview');
  const [simulatedReviewText, setSimulatedReviewText] = useState('');
  const [claimedBonus, setClaimedBonus] = useState(false);

  if (!isOpen) return null;

  const points = currentUser.loyaltyPoints;
  const tier = currentUser.loyaltyTier;

  const copyReferral = () => {
    navigator.clipboard?.writeText(`https://nexora.global/join?ref=${currentUser.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedReviewText.trim()) return;

    earnPoints(50, 'Yangi xarid uchun batafsil baho qoldirilganligi uchun bonus', 'review_reward');
    setSimulatedReviewText('');
    setClaimedBonus(true);
    setTimeout(() => setClaimedBonus(false), 3000);
  };

  const tierColors: Record<LoyaltyTier, { name: string; bg: string; text: string; next: number }> = {
    bronze: { name: 'Bronze', bg: 'from-amber-700 to-amber-900', text: 'text-amber-400', next: 500 },
    silver: { name: 'Silver', bg: 'from-slate-400 to-slate-600', text: 'text-slate-200', next: 2000 },
    gold: { name: 'Gold', bg: 'from-yellow-500 to-amber-600', text: 'text-yellow-300', next: 5000 },
    platinum: { name: 'Platinum VIP', bg: 'from-cyan-400 to-indigo-600', text: 'text-cyan-300', next: 10000 },
  };

  const nextTierProgress = Math.min(100, Math.floor((points / tierColors[tier].next) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#090f1e] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e172a] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                NEXORA Rewards & Sodiqlik Dasturi
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {tierColors[tier].name} Tier
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Xarid qiling, do‘stlarni taklif eting, ball to‘plang va chegirmalarga ega bo‘ling!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800/80 bg-[#0b1324] text-xs shrink-0 overflow-x-auto">
          {[
            { id: 'overview', label: 'Umumiy Holat (Overview)' },
            { id: 'earn', label: 'Ball To‘plash Usullari' },
            { id: 'redeem', label: 'Imtiyozlar & Ishlatish' },
            { id: 'ledger', label: `Ballar Tarixi (${loyaltyLedger.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {claimedBonus && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-600 rounded-xl text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Tabriklaymiz! +50 NEXORA ball hisobingizga qo‘shildi!
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Hero Points Card */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#121c35] to-[#1c233c] border border-slate-700/80 shadow-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                      Sizning Sodiqlik Balansingiz
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-extrabold text-amber-300 font-mono tracking-tight">
                        {points.toLocaleString()}
                      </span>
                      <span className="text-sm font-semibold text-slate-300">BALL (PTS)</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Ekvivalenti:{' '}
                      <strong className="text-emerald-400 font-mono">${(points / 100).toFixed(2)} USD</strong> chegirma
                    </p>
                  </div>

                  {/* Tier status box */}
                  <div className="bg-slate-900/80 border border-slate-700/80 p-3.5 rounded-xl min-w-[200px]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Joriy Daraja:</span>
                      <span className={`font-bold ${tierColors[tier].text}`}>{tierColors[tier].name}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-500"
                        style={{ width: `${nextTierProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{points} pts</span>
                      <span>Keyingi: {tierColors[tier].next} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Strip */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-semibold text-slate-200 flex items-center justify-center sm:justify-start gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                    Do‘stlarni Taklif Qiling (+250 ball har bir do‘st uchun)
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Sizning maxsus taklif kodingiz: <strong className="text-amber-300 font-mono">{currentUser.referralCode}</strong>
                  </p>
                </div>
                <button
                  onClick={copyReferral}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Nusxalandi!' : 'Havolani Nusxalash'}
                </button>
              </div>

              {/* Quick Perks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <DollarSignIcon className="w-3.5 h-3.5 text-emerald-400" />
                    Xarid Chegirmasi
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Har 100 ball buyurtma qiymatidan $1.00 USD gacha chegirma taqdim etadi.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    CARGO Sug‘urta Imtiyozi
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Gold va Platinum foydalanuvchilar uchun yuk sug‘urtasi rasmiylashtiruvi bepul.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    VIP Profil Ramkasi
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Barcha e'lonlar va qidiruv natijalarida ajralib turuvchi oltin nishon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'earn' && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Qanday Qilib Ball Yig‘ish Mumkin?
              </h3>

              <div className="space-y-3 text-xs">
                {/* Rule 1 */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-200">1. Mahsulot va Xizmatlar Xaridi</div>
                    <div className="text-slate-400 text-[11px]">
                      NEXORA MARKET yoki SERVICES orqali qilingan har $10 xarid uchun +10 ball beriladi.
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-sm shrink-0">+10 ball / $10</span>
                </div>

                {/* Rule 2 */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-200">2. Do‘stlarni Taklif Qilish (Referral)</div>
                    <div className="text-slate-400 text-[11px]">
                      Sizning havolangiz orqali ro‘yxatdan o‘tgan har bir yangi foydalanuvchi uchun.
                    </div>
                  </div>
                  <span className="font-mono font-bold text-amber-400 text-sm shrink-0">+250 ball</span>
                </div>

                {/* Rule 3 */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-200">3. Baholash va Sharh Qoldirish (Review)</div>
                    <div className="text-slate-400 text-[11px]">
                      Buyurtma yetkazilgach fotosuratli batafsil sharh yozganingiz uchun.
                    </div>
                  </div>
                  <span className="font-mono font-bold text-indigo-400 text-sm shrink-0">+50 ball</span>
                </div>

                {/* Rule 4 */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-200">4. CARGO Yetkazib Berish Tasdig‘i</div>
                    <div className="text-slate-400 text-[11px]">
                      Yuk qabul qilinganini tezkor tasdiqlab, kuryerga baho berish.
                    </div>
                  </div>
                  <span className="font-mono font-bold text-cyan-400 text-sm shrink-0">+25 ball</span>
                </div>
              </div>

              {/* Interactive Demo Simulation */}
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3 mt-4">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Sinov uchun sharh yozib ko‘ring (+50 ball darhol hisoblanadi):
                </div>
                <form onSubmit={handleSimulateReview} className="flex gap-2">
                  <input
                    type="text"
                    value={simulatedReviewText}
                    onChange={(e) => setSimulatedReviewText(e.target.value)}
                    placeholder="Masalan: Tovar ajoyib yetib keldi, sotuvchiga rahmat!..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!simulatedReviewText.trim()}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                  >
                    Sharhni Yuborish
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'redeem' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Ballarni Qayerda Ishlatish Mumkin?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100">Xarid Vaqtida To‘lov</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                      Avtomatik
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    NEXORA MARKET yoki CARGO buyurtmasini rasmiylashtirayotganda savatchada "Ballarni ishlatish" tugmasini yoqsangiz, umumiy summadan 20% gacha to‘g‘ridan-to‘g‘ri chegirma qilinadi.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100">E'lonlarni Tepaga Ko‘tarish</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px]">
                      500 ball
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Mahsulotingizni qidiruv va toifa ro‘yxatlarida 7 kunga eng yuqori qatorlarga olib chiqish imkoniyati.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100">NEXORA AI Cheksiz Rejim</span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800 text-[10px]">
                      1000 ball / oy
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    E'lonlar matnini professional generatsiya qilish, sun'iy intellekt tarjimoni va bozor tahlili cheklovlarsiz ishlaydi.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100">Nol Komissiya Rejimi</span>
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px]">
                      Platinum VIP
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Sotuvchi va tashuvchilar uchun platforma tranzaksiya to‘lovlaridan to‘liq ozod bo‘lish huquqi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Ballar Harakati Tarixi
              </h3>
              <div className="divide-y divide-slate-800/80 rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden text-xs">
                {loyaltyLedger.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between hover:bg-slate-800/40 transition">
                    <div>
                      <div className="font-medium text-slate-200">{item.description}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.timestamp}</div>
                    </div>
                    <span
                      className={`font-mono font-bold text-sm ${
                        item.pointsDelta > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {item.pointsDelta > 0 ? `+${item.pointsDelta}` : item.pointsDelta} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function DollarSignIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m0-10C9.79 6 8 7.79 8 10s1.79 4 4 4 4 1.79 4 4-1.79 4-4 4" />
    </svg>
  );
}
