import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Package,
  Wrench,
  Truck,
  Users,
  UserCheck,
  ShieldCheck,
  Star,
  MapPin,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { VerificationTier } from '../../types';
import TrustBadge from '../common/TrustBadge';

interface SearchModuleProps {
  onNavigateToModule?: (module: string) => void;
  onOpenOrderModal?: (item: any, type: 'market' | 'service' | 'cargo') => void;
  onOpenChatWith?: (userId: string) => void;
}

export default function SearchModule({
  onNavigateToModule,
  onOpenOrderModal,
  onOpenChatWith,
}: SearchModuleProps) {
  const { t } = useLanguage();
  const { marketListings, serviceListings, cargoListings, communityGroups } = usePlatform();
  const { currentUser } = useAuth();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'services' | 'cargo' | 'people' | 'groups'>('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [showFilters, setShowFilters] = useState(false);

  // Sample mock users for people search
  const knownUsers: Array<{
    id: string;
    nexoraId: string;
    name: string;
    username: string;
    role: string;
    country: string;
    city: string;
    avatar: string;
    rating: number;
    reviewsCount: number;
    tier: VerificationTier;
    loyaltyPoints: number;
  }> = useMemo(
    () => [
      {
        id: 'user-001',
        nexoraId: '582941736205',
        name: 'Nurbek Yuldashov',
        username: '@nurbek',
        role: 'Verified Global Exporter & Tech Seller',
        country: "O'zbekiston",
        city: 'Toshkent',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviewsCount: 142,
        tier: 'tier_2_business',
        loyaltyPoints: 3450,
      },
      {
        id: 'user-002',
        nexoraId: '491028374619',
        name: 'Elena Rostova',
        username: '@elena_cargo',
        role: 'TransEurasia Logistics Enterprise Dispatcher',
        country: 'Rossiya',
        city: 'Moskva',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        rating: 4.98,
        reviewsCount: 88,
        tier: 'tier_3_enterprise_cargo',
        loyaltyPoints: 7820,
      },
      {
        id: 'user-003',
        nexoraId: '729103847562',
        name: 'David Zhang',
        username: '@david_tech',
        role: 'Hardware Importer & Systems Architect',
        country: 'Xitoy',
        city: 'Shenzhen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        rating: 4.85,
        reviewsCount: 64,
        tier: 'tier_1_identity',
        loyaltyPoints: 1200,
      },
      {
        id: 'user-004',
        nexoraId: '819203948571',
        name: 'Aliya Karimova',
        username: '@aliya_design',
        role: 'Senior UI/UX & Brand Identity Specialist',
        country: "Qozog'iston",
        city: 'Olmaota',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        rating: 5.0,
        reviewsCount: 39,
        tier: 'tier_1_identity',
        loyaltyPoints: 950,
      },
    ],
    []
  );

  const cleanQuery = query.toLowerCase().trim();
  const is12DigitSearch = /^\d{1,12}$/.test(cleanQuery);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return marketListings.filter((item) => {
      if (onlyVerified && !item.sellerNexoraId) return false;
      if (selectedCountry !== 'all' && item.country !== selectedCountry) return false;
      if (!cleanQuery) return true;
      return (
        item.title.toLowerCase().includes(cleanQuery) ||
        item.description.toLowerCase().includes(cleanQuery) ||
        item.sellerName.toLowerCase().includes(cleanQuery) ||
        item.sellerNexoraId.includes(cleanQuery) ||
        item.category.toLowerCase().includes(cleanQuery)
      );
    });
  }, [marketListings, cleanQuery, onlyVerified, selectedCountry]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return serviceListings.filter((srv) => {
      if (selectedCountry !== 'all' && !srv.coverageArea.toLowerCase().includes(selectedCountry.toLowerCase())) return false;
      if (!cleanQuery) return true;
      return (
        srv.title.toLowerCase().includes(cleanQuery) ||
        srv.description.toLowerCase().includes(cleanQuery) ||
        srv.providerName.toLowerCase().includes(cleanQuery) ||
        srv.providerNexoraId.includes(cleanQuery) ||
        srv.category.toLowerCase().includes(cleanQuery)
      );
    });
  }, [serviceListings, cleanQuery, selectedCountry]);

  // Filtered Cargo
  const filteredCargo = useMemo(() => {
    return cargoListings.filter((crg) => {
      if (!cleanQuery) return true;
      return (
        crg.cargoType.toLowerCase().includes(cleanQuery) ||
        crg.fromCity.toLowerCase().includes(cleanQuery) ||
        crg.fromCountry.toLowerCase().includes(cleanQuery) ||
        crg.toCity.toLowerCase().includes(cleanQuery) ||
        crg.toCountry.toLowerCase().includes(cleanQuery) ||
        crg.carrierName.toLowerCase().includes(cleanQuery) ||
        crg.carrierNexoraId.includes(cleanQuery) ||
        crg.trackingNumber.toLowerCase().includes(cleanQuery)
      );
    });
  }, [cargoListings, cleanQuery]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return knownUsers.filter((usr) => {
      if (onlyVerified && usr.tier === 'tier_0_unverified') return false;
      if (selectedCountry !== 'all' && usr.country !== selectedCountry) return false;
      if (!cleanQuery) return true;
      return (
        usr.name.toLowerCase().includes(cleanQuery) ||
        usr.username.toLowerCase().includes(cleanQuery) ||
        usr.nexoraId.includes(cleanQuery) ||
        usr.role.toLowerCase().includes(cleanQuery)
      );
    });
  }, [knownUsers, cleanQuery, onlyVerified, selectedCountry]);

  // Filtered Groups
  const filteredGroups = useMemo(() => {
    return communityGroups.filter((grp) => {
      if (!cleanQuery) return true;
      return (
        grp.name.toLowerCase().includes(cleanQuery) ||
        grp.description.toLowerCase().includes(cleanQuery) ||
        grp.category.toLowerCase().includes(cleanQuery)
      );
    });
  }, [communityGroups, cleanQuery]);

  const totalResultsCount =
    filteredProducts.length +
    filteredServices.length +
    filteredCargo.length +
    filteredUsers.length +
    filteredGroups.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Search Hero */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2 text-blue-200 text-sm font-semibold tracking-wider uppercase">
            <Search className="w-4 h-4 text-cyan-300" />
            NEXORA Universal Search Engine
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Bir joyda hamma narsani toping
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mb-6 leading-relaxed">
            Mahsulotlar, xizmatlar, xalqaro yuk reyslari, jamoalar va 12 xonali NEXORA ID yoki @username orqali tekshirilgan foydalanuvchilarni izlang.
          </p>

          {/* Search Input Bar */}
          <div className="relative flex items-center bg-white rounded-xl shadow-2xl p-1.5 focus-within:ring-4 focus-within:ring-cyan-300 transition-all text-neutral-900">
            <Search className="w-5 h-5 ml-3 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Masalan: MacBook, 582941736205, @nurbek, Toshkent - Frankfurt, UI Dizayn..."
              className="w-full px-3 py-2 text-sm sm:text-base bg-transparent border-0 focus:outline-none focus:ring-0 text-neutral-900 placeholder-neutral-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="px-2 text-xs font-bold text-neutral-400 hover:text-neutral-700 mr-2"
              >
                Tozalash
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                showFilters
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtrlar</span>
            </button>
          </div>

          {/* 12-digit search indicator badge */}
          {is12DigitSearch && (
            <div className="mt-3 inline-flex items-center gap-2 bg-blue-900/60 border border-cyan-400/50 backdrop-blur px-3 py-1 rounded-lg text-xs text-cyan-200">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>12 xonali NEXORA ID qidiruvi faollashdi: <strong>{cleanQuery}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Filter drawer / bar */}
      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
              Davlat / Hudud
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full text-xs rounded-lg border border-border bg-background px-3 py-2 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Barcha davlatlar (Dunyo)</option>
              <option value="O'zbekiston">O'zbekiston</option>
              <option value="Xitoy">Xitoy</option>
              <option value="Rossiya">Rossiya</option>
              <option value="Turkiya">Turkiya</option>
              <option value="Qozog'iston">Qozog'iston</option>
              <option value="Germaniya">Germaniya</option>
              <option value="BAA">BAA</option>
            </select>
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded border-border text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Faqat tasdiqlangan (Verified) hisoblar</span>
            </label>
          </div>

          <div className="flex items-center justify-end pt-5">
            <button
              onClick={() => {
                setSelectedCountry('all');
                setOnlyVerified(false);
                setPriceSort('none');
              }}
              className="text-xs text-muted-foreground hover:text-foreground font-medium underline"
            >
              Filtrlarni bekor qilish
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-border overflow-x-auto pb-1 gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            Hammasi ({totalResultsCount})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white shadow'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Mahsulotlar ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white shadow'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Xizmatlar ({filteredServices.length})
          </button>
          <button
            onClick={() => setActiveTab('cargo')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cargo'
                ? 'bg-blue-600 text-white shadow'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            CARGO ({filteredCargo.length})
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'people'
                ? 'bg-blue-600 text-white shadow'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Foydalanuvchilar ({filteredUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'groups'
                ? 'bg-blue-600 text-white shadow'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Jamoalar ({filteredGroups.length})
          </button>
        </div>
      </div>

      {/* Results Rendering */}
      <div className="space-y-8">
        {/* People Results */}
        {(activeTab === 'all' || activeTab === 'people') && filteredUsers.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Foydalanuvchilar & Bizneslar ({filteredUsers.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map((usr) => (
                <div
                  key={usr.id}
                  className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-blue-500/50 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={usr.avatar}
                      alt={usr.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-border shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-foreground truncate">{usr.name}</span>
                        <span className="text-xs text-muted-foreground">{usr.username}</span>
                        <TrustBadge tier={usr.tier} size="sm" />
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{usr.role}</div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                        <span className="font-mono text-blue-600 font-semibold bg-blue-500/10 px-1.5 py-0.5 rounded">
                          ID: {usr.nexoraId}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {usr.city}, {usr.country}
                        </span>
                        <span className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {usr.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenChatWith?.(usr.id)}
                      className="p-2 rounded-lg border border-border text-foreground hover:bg-accent hover:text-blue-600 transition-all"
                      title="Xabar yuborish"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigateToModule?.('core')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all"
                    >
                      Profil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Products Results */}
        {(activeTab === 'all' || activeTab === 'products') && filteredProducts.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                NEXORA MARKET Mahsulotlari ({filteredProducts.length})
              </h2>
              {activeTab === 'all' && (
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                >
                  Barchasini ko'rish <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative h-44 bg-neutral-100 overflow-hidden">
                    <img
                      src={item.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-neutral-900/80 text-white backdrop-blur">
                        {item.marketType === 'global' ? 'Global Savdo' : 'Mahalliy'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600/90 text-white backdrop-blur">
                        {item.condition === 'new' ? 'Yangi' : 'Ishlatilgan'}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 backdrop-blur text-white text-xs font-black">
                      {item.price.toLocaleString()} {item.currency}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-foreground line-clamp-1 mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{item.city}, {item.country}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-foreground truncate max-w-[110px]">
                          {item.sellerName}
                        </span>
                        <TrustBadge tier={item.sellerVerificationTier} size="sm" showLabel={false} />
                      </div>
                      <button
                        onClick={() => onOpenOrderModal?.(item, 'market')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        Sotib olish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Services Results */}
        {(activeTab === 'all' || activeTab === 'services') && filteredServices.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Wrench className="w-4 h-4 text-purple-600" />
                NEXORA SERVICES Xizmatlari ({filteredServices.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-purple-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-600">
                        {srv.category}
                      </span>
                      <span className="text-xs font-extrabold text-foreground">
                        {srv.price} {srv.currency} / {srv.priceType}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-foreground mb-1">{srv.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{srv.description}</p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-foreground">{srv.providerName}</span>
                      <TrustBadge tier={srv.providerVerificationTier} size="sm" showLabel={false} />
                    </div>
                    <button
                      onClick={() => onOpenOrderModal?.(srv, 'service')}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all"
                    >
                      Buyurtma
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cargo Results */}
        {(activeTab === 'all' || activeTab === 'cargo') && filteredCargo.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-600" />
                Xalqaro Logistika Reyslari ({filteredCargo.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCargo.map((crg) => (
                <div
                  key={crg.id}
                  className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-400">
                      {crg.transportType} logistika ({crg.scope})
                    </span>
                    <span className="font-bold text-xs text-foreground">
                      {crg.pricePerKg} {crg.currency} / kg
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-foreground mb-1">
                    {crg.fromCity} ({crg.fromCountry}) → {crg.toCity} ({crg.toCountry})
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Yuk turi: {crg.cargoType} • Trek: {crg.trackingNumber} • {crg.estimatedDays} kun
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{crg.carrierName}</span>
                      <TrustBadge tier={crg.carrierVerificationTier} size="sm" />
                    </div>
                    <button
                      onClick={() => onOpenOrderModal?.(crg, 'cargo')}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all"
                    >
                      Yuk Biriktirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Groups Results */}
        {(activeTab === 'all' || activeTab === 'groups') && filteredGroups.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Jamoalar & Hamjamiyatlar ({filteredGroups.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGroups.map((grp) => (
                <div
                  key={grp.id}
                  className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={grp.avatar}
                      alt={grp.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-border"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-foreground truncate">{grp.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{grp.description}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {grp.membersCount.toLocaleString()} a'zolar
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateToModule?.('community')}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-foreground hover:bg-accent shrink-0"
                  >
                    O'tish
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {totalResultsCount === 0 && (
          <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl p-8">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-foreground mb-1">
              "{query}" bo'yicha hech qanday natija topilmadi
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mb-4">
              Qidiruv so'zini o'zgartirib ko'ring yoki 12 xonali NEXORA ID raqamini aniqroq kiriting.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedCountry('all');
                setOnlyVerified(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow"
            >
              Qidiruvni tozalash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
