import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Activity,
  Gavel,
  DollarSign,
  FileCheck,
  Check,
  X,
  AlertTriangle,
  FileText,
  Lock,
  Unlock,
  Eye,
  Building,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import { Dispute, VerificationRequest, BusinessAdminPermission } from '../../types';
import { TrustBadge } from '../common/TrustBadge';
import { DisputeRoomModal } from '../modals/DisputeRoomModal';

export const AdminModule: React.FC = () => {
  const { currentUser, switchUser, subAdmins, updateSubAdminPermissions, removeSubAdmin } = useAuth();
  const {
    disputes,
    verificationRequests,
    reviewVerificationRequest,
    auditLogs,
    marketListings,
    orders,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'disputes' | 'kyc' | 'subadmins' | 'audit' | 'overview'>('disputes');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');

  const openDisputes = disputes.filter((d) => d.status === 'open' || d.status === 'under_review');
  const pendingKyc = verificationRequests.filter((r) => r.status === 'pending');

  const totalGmv = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner with Admin Roles Switcher */}
      <div className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-indigo-400" />
              NEXORA ADMIN & Boshqaruv Markazi
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-700 uppercase">
              {currentUser.adminRole?.replace('_', ' ') || 'Super Admin'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hakamlik nizolari (Disputes), foydalanuvchilar verifikatsiyasi (KYC/KYB), biznes sub-administratorlari va tizim auditini boshqarish.
          </p>
        </div>

        {/* Demo Switcher for Evaluation */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-500 px-2">Rolni almashtirish:</span>
          <button
            onClick={() => switchUser('user-001')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              currentUser.id === 'user-001' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Super Admin (Nurbek)
          </button>
          <button
            onClick={() => switchUser('user-002')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              currentUser.id === 'user-002' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Head Admin (Elena)
          </button>
          <button
            onClick={() => switchUser('user-003')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              currentUser.id === 'user-003' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tech Admin (David)
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Ochiq Nizolar (Disputes)</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {openDisputes.length}
          </div>
          <span className="text-[11px] text-slate-400">Escrow mablag‘i nazoratda</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Kutilayotgan KYC Hujjatlari</span>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
            {pendingKyc.length}
          </div>
          <span className="text-[11px] text-slate-400">Tekshirishga tayyor</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Platforma Tranzaksiyalari</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            ${totalGmv.toLocaleString()} USD
          </div>
          <span className="text-[11px] text-slate-400">Jami buyurtmalar aylanmasi</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Faol E'lonlar Soni</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {marketListings.length}
          </div>
          <span className="text-[11px] text-slate-400">Local + Global bozor</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 text-xs">
        {[
          { id: 'disputes', label: `Dispute Nizolar Navbati (${openDisputes.length})` },
          { id: 'kyc', label: `Verifikatsiya / KYC Navbati (${pendingKyc.length})` },
          { id: 'subadmins', label: `Biznes Sub-Admin Ruxsatlari (${subAdmins.length})` },
          { id: 'audit', label: `Audit Jurnali (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-3.5 font-medium transition border-b-2 ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DISPUTES QUEUE */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Gavel className="w-4 h-4 text-amber-400" />
              Nizolar va Hakamlik Ishlari Ro‘yxati
            </h2>
            <span className="text-xs text-slate-400">Escrow pul mablag‘lari xavfsiz muzlatilgan</span>
          </div>

          <div className="space-y-3">
            {disputes.map((dsp) => {
              const isPending = dsp.status === 'open' || dsp.status === 'under_review';

              return (
                <div
                  key={dsp.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-slate-200 text-sm">
                        #{dsp.disputeNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        Order #{dsp.orderNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[11px] capitalize ${
                          isPending
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {dsp.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-slate-300 font-medium">
                      Tovar/Xizmat: <strong>{dsp.listingTitle}</strong>
                    </div>

                    <div className="text-slate-400 text-[11px]">
                      Sabab: <span className="text-amber-200">"{dsp.reason}"</span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Da'vogar: <strong>{dsp.buyerName}</strong> • Javobgar: <strong>{dsp.sellerName}</strong> • Dalillar:{' '}
                      <strong className="text-indigo-400">{dsp.evidence.length} ta</strong>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2 shrink-0">
                    <span className="text-base font-bold font-mono text-emerald-400">
                      ${dsp.amount} {dsp.currency}
                    </span>
                    <button
                      onClick={() => setSelectedDispute(dsp)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ishni Ko‘rib Chiqish (Hakamlik Xonasi)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: KYC & USER VERIFICATION QUEUE */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              Sotuvchilar va Tashuvchilar Verifikatsiya Arizalari (KYC / KYB)
            </h2>
            <span className="text-xs text-slate-400">Hujjatlarni ko‘rib chiqish va rasmiy nishon berish</span>
          </div>

          <div className="space-y-3">
            {verificationRequests.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                Hozircha verifikatsiya arizalari yo‘q.
              </div>
            ) : (
              verificationRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100 text-sm">{req.userName}</span>
                      <span className="text-slate-400 font-mono">({req.userNexoraId})</span>
                      <TrustBadge tier={req.requestedTier} size="sm" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px] font-mono">{req.submittedAt}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          req.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : req.status === 'rejected'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>

                  {/* Company & Document details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                    {req.companyName && (
                      <div>
                        <span className="text-slate-500 block text-[11px]">Kompaniya Nomi:</span>
                        <strong>{req.companyName}</strong>
                      </div>
                    )}
                    {req.taxNumber && (
                      <div>
                        <span className="text-slate-500 block text-[11px]">Soliq / Registratsiya No:</span>
                        <strong className="font-mono">{req.taxNumber}</strong>
                      </div>
                    )}
                  </div>

                  {/* Attached Documents */}
                  {req.documents.length > 0 && (
                    <div className="flex items-center gap-3 pt-1">
                      {req.documents.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Hujjat: {doc.docNumber}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Decision Controls */}
                  {req.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                      {rejectingRequestId === req.id ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={rejectionNote}
                            onChange={(e) => setRejectionNote(e.target.value)}
                            placeholder="Rad etish sababi (masalan: Hujjat xira tushgan)..."
                            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              reviewVerificationRequest(req.id, 'rejected', rejectionNote);
                              setRejectingRequestId(null);
                              setRejectionNote('');
                            }}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold shrink-0"
                          >
                            Rad Etishni Tasdiqlash
                          </button>
                          <button
                            onClick={() => setRejectingRequestId(null)}
                            className="px-2.5 py-1.5 text-slate-400 hover:text-white"
                          >
                            Bekor
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => setRejectingRequestId(req.id)}
                            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 rounded-lg font-medium transition"
                          >
                            Rad Etish
                          </button>
                          <button
                            onClick={() => reviewVerificationRequest(req.id, 'approved')}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition flex items-center gap-1.5 shadow"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Arizani Tasdiqlash & Nishon Berish
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BUSINESS SUB-ADMIN PERMISSIONS (Requirement 12) */}
      {activeTab === 'subadmins' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" />
                Biznes Sub-Administratorlari va Vakolatlar Boshqaruvi
              </h2>
              <p className="text-xs text-slate-400">
                Do‘kon yoki CARGO egasi o‘z do‘koniga menejer tayinlashi va unga granular huquqlar (ayniqsa <strong>Narxni o‘zgartirish</strong>) berishi mumkin.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {subAdmins.map((sub) => (
              <div
                key={sub.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={sub.subAdminAvatar}
                      alt={sub.subAdminName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-slate-100 text-sm">{sub.subAdminName}</div>
                      <div className="text-slate-400 text-[11px]">
                        {sub.subAdminUsername} • Nexora ID: <span className="font-mono">{sub.subAdminNexoraId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-medium">
                      {sub.roleTitle}
                    </span>
                    <button
                      onClick={() => removeSubAdmin(sub.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 transition"
                    >
                      O‘chirish
                    </button>
                  </div>
                </div>

                {/* Granular Permissions Checkboxes */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
                    Vakolatlar (Permissions Matrix):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    {[
                      { key: 'canAddProducts', label: 'Mahsulot qo‘shish' },
                      { key: 'canEditProducts', label: 'Tahrirlash' },
                      { key: 'canDeleteProducts', label: 'O‘chirish' },
                      {
                        key: 'canChangePrice',
                        label: 'Narxni o‘zgartirish (!)',
                        highlight: true,
                      },
                      { key: 'canManageOrders', label: 'Buyurtmalarni boshqarish' },
                      { key: 'canReplyToCustomers', label: 'Mijozlarga javob berish' },
                      { key: 'canViewReports', label: 'Hisobotlarni ko‘rish' },
                    ].map((perm) => {
                      const isChecked = !!sub.permissions[perm.key as keyof BusinessAdminPermission];

                      return (
                        <label
                          key={perm.key}
                          className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer select-none transition ${
                            isChecked
                              ? perm.highlight
                                ? 'bg-amber-950/40 border-amber-600 text-amber-200'
                                : 'bg-indigo-950/30 border-indigo-700 text-indigo-200'
                              : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              updateSubAdminPermissions(sub.id, {
                                [perm.key]: e.target.checked,
                              })
                            }
                            className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                          />
                          <span className="font-medium">{perm.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Tizim Audit Jurnali (Immutable Event Logs)
            </h2>
            <span className="text-xs text-slate-400 font-mono">Barcha harakatlar qayd etiladi</span>
          </div>

          <div className="divide-y divide-slate-800 rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/30 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                        log.severity === 'security'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : log.severity === 'warning'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-200">{log.target}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{log.details}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-slate-300 font-medium">
                    {log.actorName} <span className="text-slate-500 font-mono">({log.actorNexoraId})</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dispute Room Modal */}
      {selectedDispute && (
        <DisputeRoomModal
          dispute={selectedDispute}
          isOpen={!!selectedDispute}
          onClose={() => setSelectedDispute(null)}
        />
      )}
    </div>
  );
};
