import React, { useState } from 'react';
import {
  Truck,
  Plane,
  Anchor,
  Train,
  MapPin,
  Search,
  PlusCircle,
  ShieldCheck,
  Award,
  Navigation,
  Compass,
  ArrowRight,
  Package,
  Phone,
  Clock,
  X,
  Layers,
} from 'lucide-react';
import { CargoListing, TransportType, CargoScope } from '../../types';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';
import { TrustBadge } from '../common/TrustBadge';
import { GlobeLogisticsScene } from '../three/GlobeLogisticsScene';

interface CargoModuleProps {
  onOpenConnect?: (carrierId: string) => void;
  onOrderCreated?: (orderId: string) => void;
}

export const CargoModule: React.FC<CargoModuleProps> = ({
  onOpenConnect,
  onOrderCreated,
}) => {
  const { currentUser } = useAuth();
  const { cargoListings, addCargoListing, createOrder } = usePlatform();

  const [scopeFilter, setScopeFilter] = useState<'all' | CargoScope>('all');
  const [transportFilter, setTransportFilter] = useState<'all' | TransportType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingSearch, setTrackingSearch] = useState('');
  const [foundCargo, setFoundCargo] = useState<CargoListing | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [show3DMap, setShow3DMap] = useState(true);

  // New Cargo Form
  const [fromCity, setFromCity] = useState('');
  const [fromCountry, setFromCountry] = useState("O'zbekiston");
  const [toCity, setToCity] = useState('');
  const [toCountry, setToCountry] = useState('Xitoy');
  const [transportType, setTransportType] = useState<TransportType>('air');
  const [scope, setScope] = useState<CargoScope>('international');
  const [cargoType, setCargoType] = useState('Har qanday xavfsiz tovarlar');
  const [maxWeight, setMaxWeight] = useState(5000);
  const [pricePerKg, setPricePerKg] = useState(4.5);
  const [estimatedDays, setEstimatedDays] = useState(3);

  const filtered = cargoListings.filter((item) => {
    if (scopeFilter !== 'all' && item.scope !== scopeFilter) return false;
    if (transportFilter !== 'all' && item.transportType !== transportFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.fromCity.toLowerCase().includes(q) ||
        item.toCity.toLowerCase().includes(q) ||
        item.carrierName.toLowerCase().includes(q) ||
        item.trackingNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingSearch.trim()) return;
    const found = cargoListings.find(
      (c) => c.trackingNumber.toLowerCase() === trackingSearch.trim().toLowerCase()
    );
    setFoundCargo(found || null);
  };

  const handleBookCargo = (c: CargoListing) => {
    const created = createOrder({
      buyerId: currentUser.id,
      buyerNexoraId: currentUser.nexoraId,
      buyerName: currentUser.name,
      sellerId: c.carrierId,
      sellerNexoraId: c.carrierNexoraId,
      sellerName: c.carrierName,
      listingType: 'cargo',
      listingId: c.id,
      listingTitle: `${c.fromCity} ➔ ${c.toCity} (${c.transportType.toUpperCase()} Yuk Tashish)`,
      listingImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      quantity: 1,
      unitPrice: c.minPrice,
      shippingFee: 0,
      totalAmount: c.minPrice,
      currency: c.currency,
      status: 'confirmed',
      paymentMethod: 'escrow',
      isEscrowProtected: true,
      trackingNumber: c.trackingNumber,
      deliveryAddress: currentUser.address,
    });

    onOrderCreated?.(created.id);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCity.trim() || !toCity.trim()) return;

    addCargoListing({
      carrierId: currentUser.id,
      carrierNexoraId: currentUser.nexoraId,
      carrierName: currentUser.businessName || currentUser.name,
      carrierAvatar: currentUser.avatar,
      carrierRating: currentUser.rating,
      carrierVerificationTier: currentUser.verificationTier,
      scope,
      transportType,
      cargoType,
      fromCountry,
      fromCity,
      toCountry,
      toCity,
      maxWeightKg: maxWeight,
      pricePerKg,
      minPrice: Math.round(pricePerKg * 10),
      currency: 'USD',
      estimatedDays,
      status: 'booked',
      currentLocation: `${fromCity} terminali`,
      additionalServices: ['Eshikdan eshikkacha yetkazish', 'Yuk sug‘urtasi'],
      contactPhone: currentUser.phone,
    });

    setShowAddModal(false);
    setFromCity('');
    setToCity('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Truck className="w-6 h-6 text-cyan-400" />
            NEXORA CARGO — Xalqaro Yuk Tashish & Logistika
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Avia, Dengiz, Temiryo‘l va Avtomobil yuk tashuvchilari yagona intermodal platformada.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShow3DMap(!show3DMap)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              show3DMap
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            {show3DMap ? '3D Xaritani Yashirish' : '3D Xaritani Ko‘rsatish'}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
          >
            <PlusCircle className="w-4 h-4" />
            Yuk Tashish E'loni
          </button>
        </div>
      </div>

      {/* 3D Interactive World Globe (Three.js integration) */}
      {show3DMap && (
        <div className="animate-fade-in">
          <GlobeLogisticsScene />
        </div>
      )}

      {/* Live Tracking Number Lookup Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Navigation className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">Tezkor Yuk Kuzatuv (Live Tracking):</span>
        </div>

        <form onSubmit={handleTrackSearch} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={trackingSearch}
            onChange={(e) => setTrackingSearch(e.target.value)}
            placeholder="Kuzatuv kodi (masalan: NX-CRG-882194)..."
            className="px-3.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-400 w-full sm:w-64 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold shrink-0"
          >
            Kuzatish
          </button>
        </form>
      </div>

      {/* Tracking Result Modal/Banner */}
      {foundCargo && (
        <div className="p-5 rounded-2xl bg-[#091528] border border-cyan-800/80 space-y-3 text-xs text-slate-200 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-cyan-300 text-sm">
              Yuk Holati: {foundCargo.trackingNumber}
            </span>
            <button onClick={() => setFoundCargo(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <span className="text-slate-400 block text-[11px]">Yo‘nalish:</span>
              <strong>{foundCargo.fromCity} ➔ {foundCargo.toCity}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Joriy Joylashuv:</span>
              <strong className="text-cyan-300">{foundCargo.currentLocation}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Holat:</span>
              <strong className="capitalize text-emerald-400">{foundCargo.status.replace(/_/g, ' ')}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Tashuvchi:</span>
              <strong>{foundCargo.carrierName}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Scope & Modality Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Scope */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          {[
            { id: 'all', label: 'Barcha Yo‘nalishlar' },
            { id: 'international', label: 'Xalqaro (Global)' },
            { id: 'interstate', label: 'Davlatlararo' },
            { id: 'intercity', label: 'Shaharlararo' },
            { id: 'city', label: 'Shahar ichida' },
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => setScopeFilter(sc.id as any)}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                scopeFilter === sc.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Transport Type */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          {[
            { id: 'all', label: 'Hammasi', icon: Layers },
            { id: 'air', label: 'Avia', icon: Plane },
            { id: 'road', label: 'Avto', icon: Truck },
            { id: 'rail', label: 'Poyezd', icon: Train },
            { id: 'sea', label: 'Kema', icon: Anchor },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setTransportFilter(m.id as any)}
                className={`px-2.5 py-1.5 rounded-lg transition font-medium flex items-center gap-1 ${
                  transportFilter === m.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cargo Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:shadow-xl transition space-y-4 text-xs"
          >
            {/* Header: Route & Transport Badge */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-cyan-400 text-xs font-bold">
                {item.trackingNumber}
              </span>
              <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-slate-800 text-slate-300">
                {item.transportType} • {item.scope}
              </span>
            </div>

            {/* Route from -> to */}
            <div className="flex items-center justify-between bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Qayerdan</span>
                <strong className="text-slate-100 text-sm">{item.fromCity}</strong>
                <span className="text-[10px] text-slate-400 block">{item.fromCountry}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase">Qayerga</span>
                <strong className="text-slate-100 text-sm">{item.toCity}</strong>
                <span className="text-[10px] text-slate-400 block">{item.toCountry}</span>
              </div>
            </div>

            {/* Carrier info with verification */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <img
                  src={item.carrierAvatar}
                  alt={item.carrierName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="font-semibold text-slate-200">{item.carrierName}</div>
                  <div className="text-[10px] text-slate-400">★ {item.carrierRating}</div>
                </div>
              </div>
              <TrustBadge tier={item.carrierVerificationTier} size="sm" />
            </div>

            {/* Pricing per kg and min price */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Tarif:</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  ${item.pricePerKg} / kg
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenConnect?.(item.carrierId)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  title="Tashuvchi bilan bog‘lanish"
                >
                  Aloqa
                </button>
                <button
                  onClick={() => handleBookCargo(item)}
                  className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold shadow transition"
                >
                  Yukni Buyurtma Qilish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Cargo Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0e172a] border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                Yangi Yuk Tashish Reysini Joylashtirish
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Qayerdan (Shahar) *</label>
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="Masalan: Toshkent"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Qayerga (Shahar) *</label>
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="Masalan: Dubay"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Transport Turi</label>
                  <select
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                  >
                    <option value="air">Havo Transporti (Air Cargo)</option>
                    <option value="road">Avtomobil (Trucking)</option>
                    <option value="rail">Temiryo‘l (Railway)</option>
                    <option value="sea">Dengiz Kema (Sea Freight)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Qamrov (Scope)</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                  >
                    <option value="international">Xalqaro (Global)</option>
                    <option value="interstate">Davlatlararo</option>
                    <option value="intercity">Shaharlararo</option>
                    <option value="city">Shahar ichida</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">1 kg uchun narx ($ USD) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Yetkazish muddati (kun)</label>
                  <input
                    type="number"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                  />
                </div>
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
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow"
                >
                  Reysni E'lon Qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
