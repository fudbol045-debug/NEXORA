import React, { useState } from 'react';
import {
  Briefcase,
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  PlusCircle,
  MessageSquare,
  ShieldCheck,
  Search,
  DollarSign,
  X,
  Sparkles,
} from 'lucide-react';
import { ServiceListing } from '../../types';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';
import { TrustBadge } from '../common/TrustBadge';

interface ServicesModuleProps {
  onOpenConnect?: (providerId: string) => void;
  onOrderCreated?: (orderId: string) => void;
}

export const ServicesModule: React.FC<ServicesModuleProps> = ({
  onOpenConnect,
  onOrderCreated,
}) => {
  const { currentUser } = useAuth();
  const { serviceListings, addServiceListing, createOrder } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceListing | null>(null);

  // Add service form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Programming & Web');
  const [price, setPrice] = useState(50);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'UZS'>('USD');
  const [priceType, setPriceType] = useState<'fixed' | 'hourly' | 'negotiable'>('fixed');
  const [deliveryDays, setDeliveryDays] = useState(5);
  const [coverageArea, setCoverageArea] = useState('Global (Online)');
  const [desc, setDesc] = useState('');

  const serviceCategories = [
    'all',
    'Programming & Web',
    'Consulting & Business',
    'Graphic Design & 3D',
    'Translation & Languages',
    'Video & Animation',
    'Education & Tutoring',
    'Home & Auto Repairs',
  ];

  const filtered = serviceListings.filter((srv) => {
    if (selectedCategory !== 'all' && srv.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        srv.title.toLowerCase().includes(q) ||
        srv.description.toLowerCase().includes(q) ||
        srv.providerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleBookService = (srv: ServiceListing) => {
    const created = createOrder({
      buyerId: currentUser.id,
      buyerNexoraId: currentUser.nexoraId,
      buyerName: currentUser.name,
      sellerId: srv.providerId,
      sellerNexoraId: srv.providerNexoraId,
      sellerName: srv.providerName,
      listingType: 'service',
      listingId: srv.id,
      listingTitle: srv.title,
      listingImage: srv.portfolio[0] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      quantity: 1,
      unitPrice: srv.price,
      shippingFee: 0,
      totalAmount: srv.price,
      currency: srv.currency,
      status: 'confirmed',
      paymentMethod: 'escrow',
      isEscrowProtected: true,
      deliveryAddress: currentUser.address,
    });

    setSelectedService(null);
    onOrderCreated?.(created.id);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || price <= 0) return;

    addServiceListing({
      providerId: currentUser.id,
      providerNexoraId: currentUser.nexoraId,
      providerName: currentUser.name,
      providerUsername: currentUser.username,
      providerAvatar: currentUser.avatar,
      providerRating: currentUser.rating,
      providerVerificationTier: currentUser.verificationTier,
      category,
      title,
      description: desc || `${title} xizmati bo‘yicha professional buyurtmalar qabul qilinadi.`,
      price,
      currency,
      priceType,
      deliveryTimeDays: deliveryDays,
      coverageArea,
      portfolio: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      ],
      workingHours: '09:00 - 18:00',
    });

    setShowAddModal(false);
    setTitle('');
    setDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            NEXORA SERVICES — Xizmatlar Bozori
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dasturlash, dizayn, tarjima, konsalting va ta'mirlash xizmatlari. Xizmat narxini mutaxassis belgilaydi.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Xizmat Joylashtirish
        </button>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Xizmat nomi, toifasi yoki mutaxassis bo‘yicha qidirish..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {serviceCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-indigo-400 font-semibold border border-indigo-700/60'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'Barcha Xizmatlar' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((srv) => (
          <div
            key={srv.id}
            onClick={() => setSelectedService(srv)}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:shadow-xl transition cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded border border-indigo-800/60">
                  {srv.category}
                </span>
                <span className="text-amber-400 text-xs font-semibold flex items-center gap-1">
                  ★ {srv.providerRating} ({srv.completedJobs} ish)
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-100 hover:text-indigo-400 transition line-clamp-2">
                {srv.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {srv.description}
              </p>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80 text-xs text-slate-300">
                <img
                  src={srv.providerAvatar}
                  alt={srv.providerName}
                  className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0"
                />
                <span className="truncate">{srv.providerName}</span>
                <TrustBadge tier={srv.providerVerificationTier} size="sm" showLabel={false} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Narxi ({srv.priceType})</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  ${srv.price} {srv.currency}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenConnect?.(srv.providerId);
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Xizmat egasiga yozish"
                >
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookService(srv);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow transition"
                >
                  Buyurtma
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#090f1d] border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4 text-xs max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-700">
                {selectedService.category}
              </span>
              <button onClick={() => setSelectedService(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-lg font-bold text-white">{selectedService.title}</h2>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedService.providerAvatar}
                  alt={selectedService.providerName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                    {selectedService.providerName}
                    <TrustBadge tier={selectedService.providerVerificationTier} size="sm" />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ID: <span className="font-mono">{selectedService.providerNexoraId}</span> • Hudud: {selectedService.coverageArea}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold font-mono text-emerald-400">
                  ${selectedService.price} {selectedService.currency}
                </div>
                <div className="text-[10px] text-slate-400 capitalize">{selectedService.priceType} to‘lov</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">Xizmat Tavsifi:</span>
              <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {selectedService.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-400 text-[11px]">
              <div>
                <span className="block text-slate-500">Muddati:</span>
                <strong className="text-slate-200">{selectedService.deliveryTimeDays} ish kuni</strong>
              </div>
              <div>
                <span className="block text-slate-500">Ish vaqti:</span>
                <strong className="text-slate-200">{selectedService.workingHours}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedService(null);
                  onOpenConnect?.(selectedService.providerId);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                Bog‘lanish (CONNECT)
              </button>
              <button
                onClick={() => handleBookService(selectedService)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow"
              >
                Xizmatni Buyurtma Qilish (Escrow)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0e172a] border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-indigo-400" />
                Yangi Xizmat Taklifini Qo‘shish
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Xizmat Nomi *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Professional Video Montaj va Rang Korreksiyasi"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Kategoriya</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                  >
                    {serviceCategories.filter((c) => c !== 'all').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Narx ($ USD) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Tavsif va Tajriba</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Qanday natijalar taqdim etasiz, portfoliongiz..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-slate-400 hover:text-white"
                >
                  Bekor
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow"
                >
                  Xizmatni E'lon Qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
