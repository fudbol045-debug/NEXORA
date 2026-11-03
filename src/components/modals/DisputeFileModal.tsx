import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, Upload, CheckCircle2, Lock } from 'lucide-react';
import { Order, DisputeCategory } from '../../types';
import { usePlatform } from '../../context/PlatformContext';

interface DisputeFileModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onDisputeCreated?: (disputeId: string) => void;
}

export const DisputeFileModal: React.FC<DisputeFileModalProps> = ({
  order,
  isOpen,
  onClose,
  onDisputeCreated,
}) => {
  const { fileDispute } = usePlatform();

  const [category, setCategory] = useState<DisputeCategory>('damaged_in_transit');
  const [desiredOutcome, setDesiredOutcome] = useState<'full_refund' | 'partial_refund' | 'replacement' | 'cancel_order'>('full_refund');
  const [reason, setReason] = useState('');
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);

    try {
      const initialEvidence = evidenceTitle.trim() && evidenceUrl.trim()
        ? {
            title: evidenceTitle.trim(),
            fileUrl: evidenceUrl.trim(),
            description: evidenceDesc.trim() || 'Foydalanuvchi tomonidan yuklangan boshlang‘ich dalil',
          }
        : undefined;

      const created = fileDispute(
        order.id,
        category,
        reason,
        desiredOutcome,
        initialEvidence
      );

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        onDisputeCreated?.(created.id);
      }, 1200);
    } catch (err) {
      console.error('Error filing dispute:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleEvidenceImages = [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e1626] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#131d31]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                E'tiroz / Dispute Ochish (Escrow Himoyasi)
              </h2>
              <p className="text-xs text-slate-400">
                Buyurtma #{order.orderNumber} • ${order.totalAmount} {order.currency}
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-semibold text-slate-100">E'tiroz Muvaffaqiyatli Ro‘yxatga Olindi!</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Escrow to‘lovi muzlatildi. Ish moderatorga topshirildi va uch tomonlama muloqot xonasi ochildi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Notice Banner */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200/90 text-xs">
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Escrow Muzlatilishi:</strong> E'tiroz berilgach, buyurtma bo‘yicha to‘lov darhol
                  muzlatiladi. Sotuvchi yoki tashuvchiga mablag‘ moderator qarori qabul qilinguncha berilmaydi.
                </div>
              </div>

              {/* Order Info Strip */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Tovarlar / Xizmat:</span>{' '}
                  <span className="font-medium text-slate-200">{order.listingTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400">Tomonlar:</span>{' '}
                  <span className="text-indigo-400">{order.sellerName}</span> &harr; <span className="text-slate-300">{order.buyerName}</span>
                </div>
              </div>

              {/* Dispute Category */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  E'tiroz Sababi (Kategoriya) *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DisputeCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="item_not_received">Tovar / Jo‘natma yetib kelmadi</option>
                  <option value="damaged_in_transit">Tashish vaqtida shikastlangan (CARGO zarari)</option>
                  <option value="not_as_described">Tavsifga mos emas yoki nuqsonli tovar</option>
                  <option value="service_incomplete">Xizmat to‘liq yoki sifatli bajarilmadi</option>
                  <option value="unauthorized_fee">Kelishilmagan qo‘shimcha to‘lov talab qilindi</option>
                  <option value="other">Boshqa jiddiy sabab</option>
                </select>
              </div>

              {/* Desired Outcome */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Kutilayotgan Yechim *
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'full_refund', label: 'To‘liq pulni qaytarish (100% Refund)' },
                    { id: 'partial_refund', label: 'Qisman kompensatsiya (Split)' },
                    { id: 'replacement', label: 'Tovarni almashtirib berish' },
                    { id: 'cancel_order', label: 'Buyurtmani bekor qilish' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDesiredOutcome(opt.id as any)}
                      className={`p-2.5 rounded-xl text-left border transition ${
                        desiredOutcome === opt.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Reason */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Vaziyat Tavsifi va Da'vo Mazmuni *
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Muammoni batafsil tushuntiring: yetkazib berish holati, nuqsonlar, sotuvchi bilan avvalgi kelishuvlar..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Evidence Upload */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-indigo-400" />
                    Birlamchi Dalil Qo‘shish (Fotosurat / Skrinshot)
                  </span>
                  <span className="text-[11px] text-slate-500">Ixtiyoriy, keyin ham qo‘shish mumkin</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={evidenceTitle}
                    onChange={(e) => setEvidenceTitle(e.target.value)}
                    placeholder="Dalil nomi (masalan: Buzilgan ekran rasmi)"
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
                  />
                  <input
                    type="url"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder="Rasm havolasi (URL)"
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                {/* Quick Presets for Demo */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Demo namunalar:</span>
                  {sampleEvidenceImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setEvidenceUrl(img);
                        setEvidenceTitle(`Dalil #${i + 1} - Tekshiruv fotosurati`);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      Rasm {i + 1}
                    </button>
                  ))}
                </div>

                {evidenceUrl && (
                  <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-700">
                    <img src={evidenceUrl} alt="Evidence preview" className="w-full h-full object-cover" />
                  </div>
                )}
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
                  disabled={isSubmitting || !reason.trim()}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition disabled:opacity-50 shadow-lg shadow-amber-900/30 flex items-center gap-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Rasmiylashtirilmoqda...' : "E'tirozni Yuborish (Escrow Muzlatish)"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
