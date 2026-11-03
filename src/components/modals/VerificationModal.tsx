import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Award,
  CheckCircle2,
  Upload,
  Building2,
  FileCheck,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { VerificationTier, VerificationDocument } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, requestVerification } = useAuth();
  const { submitVerificationRequest } = usePlatform();

  const [selectedTier, setSelectedTier] = useState<VerificationTier>('tier_2_business');
  const [companyName, setCompanyName] = useState(currentUser.businessName || '');
  const [taxNumber, setTaxNumber] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const demoDocPresets = [
    { name: 'Guvohnoma (Tadbirkorlik)', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Pasport / ID Card', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80' },
    { name: 'Logistika CMR Litsenziyasi', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const docList: VerificationDocument[] = docUrl.trim()
      ? [
          {
            id: `vdoc-${Date.now()}`,
            type: selectedTier === 'tier_1_identity' ? 'passport_id' : selectedTier === 'tier_3_enterprise_cargo' ? 'carrier_cmr' : 'business_license',
            docNumber: docNumber.trim() || 'DOC-998241',
            fileUrl: docUrl.trim(),
            uploadedAt: new Date().toISOString().split('T')[0],
          },
        ]
      : [];

    submitVerificationRequest(selectedTier, companyName, taxNumber, docList);
    requestVerification(selectedTier, companyName, taxNumber);

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#090f1e] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e172a]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                NEXORA Ishonch & Verifikatsiya Markazi (KYC / KYB)
              </h2>
              <p className="text-xs text-slate-400">
                Rasmiy tasdiqlangan nishon oling va xaridorlar ishonchini 300% ga oshiring
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-slate-100">Arizangiz Qabul Qilindi!</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Hujjatlaringiz NEXORA moderatorlariga yuborildi. Tekshiruv 1-2 soat ichida yakunlanib, profilingizga rasmiy tasdiqlangan nishon biriktiriladi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tier Cards Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Verifikatsiya Darajasini Tanlang:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Tier 1 */}
                  <div
                    onClick={() => setSelectedTier('tier_1_identity')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      selectedTier === 'tier_1_identity'
                        ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-950/50'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        ID Verified
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Shaxsiy pasport / ID karta va telefon orqali tasdiqlash.
                      </p>
                    </div>
                    <span className="text-[10px] text-blue-300 mt-2 font-medium">Barcha sotuvchilar uchun</span>
                  </div>

                  {/* Tier 2 */}
                  <div
                    onClick={() => setSelectedTier('tier_2_business')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      selectedTier === 'tier_2_business'
                        ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-950/50'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs mb-1">
                        <ShieldCheck className="w-4 h-4" />
                        Business Verified
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Do‘kon, MChJ/YTT va soliq ma'lumotlari tekshirilgan.
                      </p>
                    </div>
                    <span className="text-[10px] text-amber-300 mt-2 font-medium">Do‘kon & Xizmatlar uchun</span>
                  </div>

                  {/* Tier 3 */}
                  <div
                    onClick={() => setSelectedTier('tier_3_enterprise_cargo')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      selectedTier === 'tier_3_enterprise_cargo'
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950/50'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs mb-1">
                        <Award className="w-4 h-4" />
                        Enterprise Carrier
                      </div>
                      <p className="text-[11px] text-slate-400">
                        CMR, xalqaro avia/temiryo‘l logistika sertifikati.
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-300 mt-2 font-medium">CARGO tashuvchilar uchun</span>
                  </div>
                </div>
              </div>

              {/* Business Info (If tier 2 or 3) */}
              {(selectedTier === 'tier_2_business' || selectedTier === 'tier_3_enterprise_cargo') && (
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    Kompaniya / Yuridik Shaxs Ma'lumotlari
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Kompaniya yoki Do‘kon Nomi</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Masalan: SilkRoad Global LLC"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Soliq / Registratsiya Raqami (INN / VAT)</label>
                      <input
                        type="text"
                        value={taxNumber}
                        onChange={(e) => setTaxNumber(e.target.value)}
                        placeholder="Masalan: UZ-309182341"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Document Upload Area */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-indigo-400" />
                    Hujjat Nusxasi (Rasm yoki PDF Havolasi)
                  </span>
                  <span className="text-[11px] text-slate-500">Maxfiy saqlanadi</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Hujjat seriya raqami (masalan: AA 1234567)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                    required
                  />
                  <input
                    type="url"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                    placeholder="Hujjat rasmi havolasi (URL)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                    required
                  />
                </div>

                {/* Demo Presets */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                  <span>Demo namunalar:</span>
                  {demoDocPresets.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setDocUrl(item.url);
                        setDocNumber(`REG-2024-00${i + 1}`);
                      }}
                      className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>

                {docUrl && (
                  <div className="mt-2 relative w-36 h-24 rounded-lg overflow-hidden border border-slate-700">
                    <img src={docUrl} alt="Document preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Confidentiality Notice */}
              <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Barcha kiritilgan shaxsiy va yuridik hujjatlar xalqaro GDPR va shaxsiy ma'lumotlarni himoya qilish standartlariga muvofiq qat'iy shifrlangan holda saqlanadi va uchinchi shaxslarga berilmaydi.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition"
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-lg shadow-indigo-900/30 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verifikatsiyaga Yuborish
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
