import React, { useState } from 'react';
import {
  User as UserIcon,
  ShieldCheck,
  Award,
  Gift,
  MapPin,
  Calendar,
  Lock,
  Unlock,
  Edit3,
  Copy,
  Check,
  Star,
  Package,
  Briefcase,
  Truck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import { TrustBadge } from '../common/TrustBadge';
import { VerificationModal } from '../modals/VerificationModal';
import { LoyaltyRewardsModal } from '../modals/LoyaltyRewardsModal';

export const CoreProfileModule: React.FC = () => {
  const { currentUser, updateProfile, updateAddress } = useAuth();
  const { marketListings, serviceListings, cargoListings } = usePlatform();

  const [copiedId, setCopiedId] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddr, setEditAddr] = useState({ ...currentUser.address });

  const copyId = () => {
    navigator.clipboard?.writeText(currentUser.nexoraId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const myListings = marketListings.filter((l) => l.sellerId === currentUser.id);
  const myServices = serviceListings.filter((s) => s.providerId === currentUser.id);
  const myCargo = cargoListings.filter((c) => c.carrierId === currentUser.id);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateAddress(editAddr);
    setIsEditingAddress(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Hero Card (BOTH Real Name + Username displayed!) */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0e172a] to-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1">
                <TrustBadge tier={currentUser.verificationTier} size="sm" showLabel={false} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* BOTH: Real Name + Unique Username */}
                <h1 className="text-xl font-bold text-slate-100">{currentUser.name}</h1>
                <span className="text-indigo-400 font-mono text-sm font-semibold">
                  {currentUser.username}
                </span>
                <TrustBadge tier={currentUser.verificationTier} size="sm" />
              </div>

              {/* 12-Digit NEXORA ID (Unique requirement!) */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-xs text-slate-400">12-Xonali NEXORA ID:</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 font-mono font-bold text-slate-200 text-xs shadow-inner">
                  <span>{currentUser.nexoraId}</span>
                  <button
                    onClick={copyId}
                    title="ID raqamidan nusxa olish"
                    className="text-slate-400 hover:text-white transition ml-1"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Location & Bio */}
              <p className="text-xs text-slate-300 max-w-xl pt-1 leading-relaxed">
                {currentUser.bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {currentUser.country}, {currentUser.region}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  A'zo: {currentUser.createdAt}
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {currentUser.rating} ({currentUser.reviewCount} baho)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Hub Trigger Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => setShowRewardsModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition"
            >
              <Gift className="w-4 h-4" />
              <span>Sodiqlik Ballari: <strong className="font-mono text-yellow-200">{currentUser.loyaltyPoints}</strong> pts</span>
            </button>

            <button
              onClick={() => setShowVerificationModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Verifikatsiya (KYC)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Mandatory Address & Privacy Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mandatory Address Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <h2 className="font-semibold text-slate-200 text-sm">
                Majburiy Manzil Ma'lumotlari (REQUIRED)
              </h2>
            </div>
            <button
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditingAddress ? 'Bekor Qilish' : 'Tahrirlash'}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-400 flex items-start gap-2">
            <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>
              <strong>Maxfiylik Kafolati:</strong> Manzil ma'lumotlari xavfsiz saqlanadi va yetkazib berish jarayonidan tashqari ommaga to‘liq oshkor qilinmaydi.
            </span>
          </div>

          {isEditingAddress ? (
            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Davlat</label>
                  <input
                    type="text"
                    value={editAddr.country}
                    onChange={(e) => setEditAddr({ ...editAddr, country: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Viloyat / Hudud</label>
                  <input
                    type="text"
                    value={editAddr.region}
                    onChange={(e) => setEditAddr({ ...editAddr, region: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Shahar / Tuman</label>
                  <input
                    type="text"
                    value={editAddr.city}
                    onChange={(e) => setEditAddr({ ...editAddr, city: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Ko‘cha</label>
                  <input
                    type="text"
                    value={editAddr.street}
                    onChange={(e) => setEditAddr({ ...editAddr, street: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Uy raqami</label>
                  <input
                    type="text"
                    value={editAddr.houseNumber}
                    onChange={(e) => setEditAddr({ ...editAddr, houseNumber: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Xonadon</label>
                  <input
                    type="text"
                    value={editAddr.apartmentNumber || ''}
                    onChange={(e) => setEditAddr({ ...editAddr, apartmentNumber: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Pochta indeksi</label>
                  <input
                    type="text"
                    value={editAddr.postalCode || ''}
                    onChange={(e) => setEditAddr({ ...editAddr, postalCode: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
                >
                  Manzilni Saqlash
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[11px]">Davlat & Hudud:</span>
                <strong>{currentUser.address.country}, {currentUser.address.region}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Shahar & Tuman:</span>
                <strong>{currentUser.address.city}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Ko‘cha & Uy:</span>
                <strong>{currentUser.address.street}, {currentUser.address.houseNumber}-uy</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Pochta Indeksi:</span>
                <strong className="font-mono">{currentUser.address.postalCode || 'Mavjud emas'}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Security & Privacy Settings */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-indigo-400" />
            <h2 className="font-semibold text-slate-200 text-sm">
              Maxfiylik & Xavfsizlik Sozlamalari
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="font-medium text-slate-200">Xabarlar Qabul Qilish (Connect)</div>
                <div className="text-[11px] text-slate-400">Kimlar sizga xabar yoza oladi</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-indigo-300 font-semibold uppercase text-[11px]">
                {currentUser.privacy.allowMessagesFrom}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="font-medium text-slate-200">Audio & Video Qo‘ng‘iroqlar</div>
                <div className="text-[11px] text-slate-400">Ruxsat berilgan qo‘ng‘iroqlar</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-indigo-300 font-semibold uppercase text-[11px]">
                {currentUser.privacy.allowAudioCallsFrom}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="font-medium text-slate-200">Ikki Bosqichli Himoya (2FA)</div>
                <div className="text-[11px] text-slate-400">SMS yoki Authenticator orqali tasdiqlash</div>
              </div>
              <button
                onClick={() =>
                  updateProfile({
                    privacy: {
                      ...currentUser.privacy,
                      twoFactorEnabled: !currentUser.privacy.twoFactorEnabled,
                    },
                  })
                }
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  currentUser.privacy.twoFactorEnabled
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {currentUser.privacy.twoFactorEnabled ? 'Yoqilgan' : 'O‘chirilgan'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User's Activity Tabs (Listings, Services, Cargo) */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Mening Faoliyatim ({myListings.length} tovar • {myServices.length} xizmat • {myCargo.length} yuk yo‘nalishi)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {myListings.map((l) => (
            <div key={l.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <img src={l.images[0]} alt={l.title} className="w-full h-28 object-cover rounded-lg" />
              <div className="font-semibold text-slate-200 truncate">{l.title}</div>
              <div className="flex justify-between text-slate-400">
                <span>{l.marketType.toUpperCase()}</span>
                <span className="font-bold text-emerald-400 font-mono">${l.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showVerificationModal && (
        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
        />
      )}

      {showRewardsModal && (
        <LoyaltyRewardsModal
          isOpen={showRewardsModal}
          onClose={() => setShowRewardsModal(false)}
        />
      )}
    </div>
  );
};
