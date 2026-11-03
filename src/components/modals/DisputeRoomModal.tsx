import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Send,
  Upload,
  CheckCircle2,
  Lock,
  ArrowRight,
  Gavel,
  Check,
  FileText,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { Dispute } from '../../types';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';

interface DisputeRoomModalProps {
  dispute: Dispute;
  isOpen: boolean;
  onClose: () => void;
}

export const DisputeRoomModal: React.FC<DisputeRoomModalProps> = ({
  dispute,
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { sendDisputeMessage, submitDisputeEvidence, resolveDispute } = usePlatform();

  const [messageInput, setMessageInput] = useState('');
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [showEvidenceUpload, setShowEvidenceUpload] = useState(false);
  const [moderatorVerdictNote, setModeratorVerdictNote] = useState('');
  const [showVerdictConfirm, setShowVerdictConfirm] = useState<null | 'resolved_refund' | 'resolved_release' | 'resolved_split' | 'dismissed'>(null);

  if (!isOpen) return null;

  const isModerator =
    currentUser.adminRole === 'super_admin' ||
    currentUser.adminRole === 'head_admin' ||
    currentUser.adminRole === 'moderator';

  const isResolved =
    dispute.status === 'resolved_refund' ||
    dispute.status === 'resolved_release' ||
    dispute.status === 'resolved_split' ||
    dispute.status === 'dismissed';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendDisputeMessage(dispute.id, messageInput.trim());
    setMessageInput('');
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim() || !evidenceUrl.trim()) return;
    submitDisputeEvidence(dispute.id, evidenceTitle.trim(), evidenceUrl.trim(), 'Yangi dalil taqdim etildi');
    setEvidenceTitle('');
    setEvidenceUrl('');
    setShowEvidenceUpload(false);
  };

  const handleExecuteVerdict = (decision: 'resolved_refund' | 'resolved_release' | 'resolved_split' | 'dismissed') => {
    resolveDispute(
      dispute.id,
      decision,
      moderatorVerdictNote.trim() || 'Moderator tomonidan tekshirildi va tegishli qaror qabul qilindi.'
    );
    setShowVerdictConfirm(null);
  };

  const statusBadge = () => {
    switch (dispute.status) {
      case 'open':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800">Ochiq (Awaiting)</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800">Ko‘rib Chiqilmoqda</span>;
      case 'resolved_refund':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">Xaridorga Qaytarildi (Refunded)</span>;
      case 'resolved_release':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800">Sotuvchiga O‘tkazildi (Released)</span>;
      case 'resolved_split':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-800">Taqsimlandi (50/50 Split)</span>;
      case 'dismissed':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">Rad Etildi (Dismissed)</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#090f1d] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e1628] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">
                  Dispute #{dispute.disputeNumber}
                </h2>
                {statusBadge()}
              </div>
              <p className="text-xs text-slate-400">
                Buyurtma: <strong className="text-slate-200">#{dispute.orderNumber}</strong> • Qiymati:{' '}
                <strong className="text-emerald-400 font-mono">${dispute.amount} {dispute.currency}</strong> • Escrow Holati:{' '}
                <span className="text-amber-300 font-medium">Muzlatilgan (Escrow Protected)</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Grid: Left Evidence & Overview, Right 3-Way Chat */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Left Column (5 cols): Case File & Evidence */}
          <div className="md:col-span-5 p-5 overflow-y-auto space-y-4 bg-[#0a1222]/50">
            {/* Case Overview Box */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Da'vo Asosi</span>
                <span className="text-[11px] text-amber-400 font-mono capitalize">
                  {dispute.category.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                "{dispute.reason}"
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                <div>
                  <span className="block text-slate-500">Xaridor:</span>
                  <strong className="text-slate-200">{dispute.buyerName}</strong>
                </div>
                <div>
                  <span className="block text-slate-500">Sotuvchi / Tashuvchi:</span>
                  <strong className="text-slate-200">{dispute.sellerName}</strong>
                </div>
              </div>
            </div>

            {/* Evidence Gallery */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Dalillar Galereyasi ({dispute.evidence.length})
                </h3>
                {!isResolved && (
                  <button
                    onClick={() => setShowEvidenceUpload(!showEvidenceUpload)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    <Upload className="w-3 h-3" />
                    + Dalil Qo‘shish
                  </button>
                )}
              </div>

              {/* Upload form toggle */}
              {showEvidenceUpload && (
                <form onSubmit={handleAddEvidence} className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                  <input
                    type="text"
                    value={evidenceTitle}
                    onChange={(e) => setEvidenceTitle(e.target.value)}
                    placeholder="Dalil nomi (masalan: Buzilgan detallar)"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                    required
                  />
                  <input
                    type="url"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder="Rasm yoki fayl havolasi (URL)"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                    required
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowEvidenceUpload(false)}
                      className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white"
                    >
                      Bekor
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium"
                    >
                      Yuklash
                    </button>
                  </div>
                </form>
              )}

              {/* Evidence cards */}
              {dispute.evidence.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  Hozircha hech qanday dalil yuklanmagan.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {dispute.evidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-200">{ev.title}</span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {ev.senderRole} • {ev.timestamp}
                        </span>
                      </div>
                      {ev.fileUrl && (
                        <div className="rounded-lg overflow-hidden border border-slate-800 max-h-40 bg-black">
                          <img
                            src={ev.fileUrl}
                            alt={ev.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {ev.description && (
                        <p className="text-[11px] text-slate-400 italic">"{ev.description}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Final Verdict Banner (If decided) */}
            {dispute.resolutionNote && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-700/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                  <Gavel className="w-4 h-4 text-indigo-400" />
                  Moderator Yakuniy Qarori:
                </div>
                <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  {dispute.resolutionNote}
                </p>
                <div className="text-[10px] text-slate-400">
                  Moderator: {dispute.moderatorName} • Sana: {dispute.resolvedAt}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (7 cols): 3-Way Communication Thread */}
          <div className="md:col-span-7 flex flex-col h-full bg-[#080d19]">
            {/* Thread Header */}
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span className="flex items-center gap-2 font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Uch Tomonlama Hakamlik Muloqoti
              </span>
              <span>Xaridor • Sotuvchi • Hakam Moderator</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
              {dispute.messages.map((msg) => {
                const isMod = msg.senderRole === 'moderator';
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isMe ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700"
                    />
                    <div
                      className={`max-w-[78%] rounded-2xl p-3 text-xs space-y-1 shadow ${
                        isMod
                          ? 'bg-amber-950/60 border border-amber-700/70 text-amber-100'
                          : isMe
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800/90 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] opacity-75">
                        <span className="font-semibold">
                          {msg.senderName} {isMod && ' (NEXORA Moderator)'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed text-[12px]">{msg.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            {!isResolved ? (
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-slate-800 bg-[#0d1424] flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Xabaringizni yozing yoki dalillarga munosabat bildiring..."
                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="p-3 border-t border-slate-800 bg-slate-900/50 text-center text-xs text-slate-500">
                Ushbu e'tiroz yopilgan. Yangi xabar yuborish to‘xtatildi.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Moderator Verdict Dock (Only for Super Admin, Head Admin, or Moderator) */}
        {isModerator && !isResolved && (
          <div className="p-4 border-t border-slate-800 bg-[#0e172a] shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Gavel className="w-4 h-4 text-amber-400" />
                <span>Moderator Hakamlik Paneli: Escrow To‘lovini Ijro Etish</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowVerdictConfirm('resolved_refund')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                >
                  Xaridorga 100% Refund
                </button>
                <button
                  onClick={() => setShowVerdictConfirm('resolved_release')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow"
                >
                  Sotuvchiga Release
                </button>
                <button
                  onClick={() => setShowVerdictConfirm('resolved_split')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow"
                >
                  50/50 Split
                </button>
                <button
                  onClick={() => setShowVerdictConfirm('dismissed')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Rad Etish (Dismiss)
                </button>
              </div>
            </div>

            {/* Verdict Confirmation Box */}
            {showVerdictConfirm && (
              <div className="mt-3 p-3 bg-slate-950 border border-amber-600/50 rounded-xl space-y-2.5 animate-fade-in">
                <div className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Qarorni tasdiqlaysizmi: {showVerdictConfirm.replace(/_/g, ' ').toUpperCase()}?
                </div>
                <input
                  type="text"
                  value={moderatorVerdictNote}
                  onChange={(e) => setModeratorVerdictNote(e.target.value)}
                  placeholder="Qarorning rasmiy asosi va izohini kiriting (Ixtiyoriy)..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowVerdictConfirm(null)}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Bekor
                  </button>
                  <button
                    onClick={() => handleExecuteVerdict(showVerdictConfirm)}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow"
                  >
                    Qarorni Ijro Etish
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
