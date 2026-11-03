import React, { useState } from 'react';
import {
  ShoppingBag,
  Globe,
  MapPin,
  Sparkles,
  Search,
  Filter,
  PlusCircle,
  ShieldCheck,
  Truck,
  DollarSign,
  MessageSquare,
  Gift,
  CheckCircle2,
  X,
  Tag,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { MarketListing, MarketType, ItemCondition } from '../../types';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';
import { TrustBadge } from '../common/TrustBadge';

interface MarketModuleProps {
  onOpenConnect?: (sellerId: string) => void;
  onOrderCreated?: (orderId: string) => void;
}

export const MarketModule: React.FC<MarketModuleProps> = ({
  onOpenConnect,
  onOrderCreated,
}) => {
  const { currentUser, redeemPoints } = useAuth();
  const { marketListings, addMarketListing, updateListingPrice, createOrder } = usePlatform();

  const [activeTab, setActiveTab] = useState<MarketType>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<MarketListing | null>(null);

  // New Listing Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Computers & Electronics');
  const [newPrice, setNewPrice] = useState<number>(350);
  const [newCurrency, setNewCurrency] = useState<'USD' | 'EUR' | 'UZS' | 'CNY'>('USD');
  const [newCondition, setNewCondition] = useState<ItemCondition>('new');
  const [newQuantity, setNewQuantity] = useState<number>(5);
  const [newDesc, setNewDesc] = useState('');
  const [newDelivery, setNewDelivery] = useState('NEXORA CARGO tezkor yetkazish');
  const [imageUrl, setImageUrl] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Checkout modal
  const [checkoutItem, setCheckoutItem] = useState<MarketListing | null>(null);
  const [useLoyaltyDiscount, setUseLoyaltyDiscount] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Price modification inline
  const [editingPriceListingId, setEditingPriceListingId] = useState<string | null>(null);
  const [newPriceValue, setNewPriceValue] = useState<number>(0);
  const [priceUpdateResult, setPriceUpdateResult] = useState<{ success: boolean; message: string } | null>(null);

  const categories = [
    'all',
    'Computers & Electronics',
    'Phones',
    'Furniture',
    'Clothing & Fashion',
    'Vehicles & Auto',
    'Home Appliances',
    'Real Estate',
    'Sports Equipment',
  ];

  const filtered = marketListings.filter((item) => {
    if (item.marketType !== activeTab) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.sellerName.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAiAutoFill = async () => {
    if (!newTitle.trim()) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleType: 'market',
          itemName: newTitle,
          category: newCategory,
          details: newDesc,
          targetLanguage: 'uz',
        }),
      });
      const data = await res.json();
      if (data.description) setNewDesc(data.description);
      if (data.suggestedPrice) setNewPrice(data.suggestedPrice);
      if (data.title) setNewTitle(data.title);
    } catch (err) {
      console.error('AI autofill failed:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newPrice <= 0) return;

    addMarketListing({
      sellerId: currentUser.id,
      sellerNexoraId: currentUser.nexoraId,
      sellerName: currentUser.name,
      sellerUsername: currentUser.username,
      sellerAvatar: currentUser.avatar,
      sellerRating: currentUser.rating,
      sellerVerificationTier: currentUser.verificationTier,
      marketType: activeTab,
      title: newTitle,
      description: newDesc || `${newTitle} — ajoyib holatda, NEXORA kafolati bilan.`,
      category: newCategory,
      price: newPrice,
      currency: newCurrency,
      condition: newCondition,
      quantity: newQuantity,
      images: [
        imageUrl.trim() ||
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      ],
      country: currentUser.country,
      region: currentUser.region,
      city: currentUser.address.city,
      deliveryTerms: newDelivery,
      estimatedDeliveryDays: activeTab === 'global' ? 4 : 1,
      trackingAvailable: true,
      tags: ['nexora', newCategory.toLowerCase()],
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleConfirmOrder = () => {
    if (!checkoutItem) return;

    const pointsToUse = useLoyaltyDiscount ? Math.min(currentUser.loyaltyPoints, 500) : 0;
    const discountVal = pointsToUse / 100;

    if (pointsToUse > 0) {
      redeemPoints(pointsToUse, discountVal, 'CHECKOUT');
    }

    const created = createOrder({
      buyerId: currentUser.id,
      buyerNexoraId: currentUser.nexoraId,
      buyerName: currentUser.name,
      sellerId: checkoutItem.sellerId,
      sellerNexoraId: checkoutItem.sellerNexoraId,
      sellerName: checkoutItem.sellerName,
      listingType: 'market',
      listingId: checkoutItem.id,
      listingTitle: checkoutItem.title,
      listingImage: checkoutItem.images[0],
      quantity: 1,
      unitPrice: checkoutItem.price,
      shippingFee: activeTab === 'global' ? 25 : 5,
      discountAmount: discountVal,
      pointsRedeemed: pointsToUse,
      totalAmount: Math.max(0, checkoutItem.price + (activeTab === 'global' ? 25 : 5) - discountVal),
      currency: checkoutItem.currency,
      status: 'confirmed',
      paymentMethod: 'escrow',
      isEscrowProtected: true,
      deliveryAddress: currentUser.address,
    });

    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setCheckoutItem(null);
      setSelectedListing(null);
      onOrderCreated?.(created.id);
    }, 1200);
  };

  const handleExecutePriceUpdate = (listingId: string) => {
    const res = updateListingPrice(listingId, newPriceValue);
    setPriceUpdateResult(res);
    setTimeout(() => {
      setPriceUpdateResult(null);
      setEditingPriceListingId(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Market Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0b1324] border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-400" />
            NEXORA MARKET
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mahalliy va xalqaro tovarlar savdosi. Narxni har doim sotuvchining o‘zi belgilaydi.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Market Tab Switcher (LOCAL vs GLOBAL) */}
          <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('local')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'local'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              LOCAL MARKET
            </button>
            <button
              onClick={() => setActiveTab('global')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'global'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              GLOBAL MARKET
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            E'lon Berish
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${activeTab.toUpperCase()} bozorda qidiruv (tovar nomi, shahar, sotuvchi)...`}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-indigo-400 font-semibold border border-indigo-700/60'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'Barcha Toifalar' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedListing(item)}
            className="group rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 hover:shadow-xl transition overflow-hidden cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Image banner */}
              <div className="relative w-full h-44 bg-black overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/75 backdrop-blur text-white border border-white/10">
                    {item.condition}
                  </span>
                  {item.minOrderQuantity && item.minOrderQuantity > 1 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                      MOQ: {item.minOrderQuantity}
                    </span>
                  )}
                </div>
              </div>

              {/* Info Area */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">{item.category}</span>
                  <span className="font-mono text-slate-500">{item.city}</span>
                </div>

                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-400 transition line-clamp-2">
                  {item.title}
                </h3>

                {/* Seller snippet with verification badge */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <img
                      src={item.sellerAvatar}
                      alt={item.sellerName}
                      className="w-4 h-4 rounded-full object-cover shrink-0"
                    />
                    <span className="text-slate-300 truncate">{item.sellerName}</span>
                    <TrustBadge tier={item.sellerVerificationTier} size="sm" showLabel={false} />
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Buy footer */}
            <div className="p-4 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Narxi</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  ${item.price.toLocaleString()} {item.currency}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCheckoutItem(item);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
              >
                Xarid Qilish
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Listing Details Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#090f1d] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e172a] shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-indigo-950 text-indigo-300 border border-indigo-700">
                  {selectedListing.marketType}
                </span>
                <h2 className="text-base font-bold text-slate-100 truncate max-w-md">
                  {selectedListing.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Image */}
                <div className="rounded-xl overflow-hidden bg-black border border-slate-800 max-h-72">
                  <img
                    src={selectedListing.images[0]}
                    alt={selectedListing.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Specs */}
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 uppercase text-[10px] tracking-wider">
                      Narxi (Sotuvchi tomonidan belgilangan):
                    </span>
                    <div className="text-2xl font-bold font-mono text-emerald-400">
                      ${selectedListing.price.toLocaleString()} {selectedListing.currency}
                    </div>
                  </div>

                  {/* Seller Info Card */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={selectedListing.sellerAvatar}
                          alt={selectedListing.sellerName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-slate-200">
                            {selectedListing.sellerName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            ID: {selectedListing.sellerNexoraId}
                          </div>
                        </div>
                      </div>
                      <TrustBadge tier={selectedListing.sellerVerificationTier} size="sm" />
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span>Joylashuv: {selectedListing.city}, {selectedListing.country}</span>
                      <span className="text-amber-400">★ {selectedListing.sellerRating}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Yetkazib berish:</span>
                    <p className="text-slate-300">{selectedListing.deliveryTerms}</p>
                  </div>

                  {/* Requirement 4 & 12: Price Editing Authorization Check */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] space-y-2">
                    <span className="font-semibold text-slate-400 block">
                      Sotuvchi Boshqaruvi: Narxni O‘zgartirish
                    </span>
                    {editingPriceListingId === selectedListing.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={newPriceValue}
                          onChange={(e) => setNewPriceValue(Number(e.target.value))}
                          placeholder="Yangi narx"
                          className="w-28 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none"
                        />
                        <button
                          onClick={() => handleExecutePriceUpdate(selectedListing.id)}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-semibold text-xs"
                        >
                          Saqlash
                        </button>
                        <button
                          onClick={() => setEditingPriceListingId(null)}
                          className="text-slate-400 hover:text-white text-xs"
                        >
                          Bekor
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingPriceListingId(selectedListing.id);
                          setNewPriceValue(selectedListing.price);
                        }}
                        className="text-indigo-400 hover:text-indigo-300 font-medium underline"
                      >
                        Ushbu mahsulot narxini o‘zgartirish (Vakolat tekshiriladi)
                      </button>
                    )}

                    {priceUpdateResult && (
                      <div
                        className={`p-2 rounded text-[11px] ${
                          priceUpdateResult.success
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {priceUpdateResult.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 text-xs">
                <h4 className="font-semibold text-slate-300 uppercase tracking-wider">
                  Batafsil Tavsifi
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  {selectedListing.description}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedListing(null);
                    onOpenConnect?.(selectedListing.sellerId);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  Sotuvchiga Yozish (CONNECT)
                </button>
                <button
                  onClick={() => {
                    setCheckoutItem(selectedListing);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-900/40 transition"
                >
                  Buyurtma Berish (Escrow Himoyasi)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal with Loyalty Points Redemption */}
      {checkoutItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0e172a] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4 text-xs">
            {checkoutSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-base font-bold">Buyurtma Rasmiylashtirildi!</h3>
                <p className="text-slate-400">Escrow to‘lovi kafolatlangan. Orders bo‘limiga o‘tkazilmoqda...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Xavfsiz Escrow Xarid
                  </h3>
                  <button onClick={() => setCheckoutItem(null)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3">
                  <img
                    src={checkoutItem.images[0]}
                    alt={checkoutItem.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-semibold text-slate-100">{checkoutItem.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      ${checkoutItem.price} {checkoutItem.currency}
                    </div>
                  </div>
                </div>

                {/* Loyalty points toggle in checkout */}
                <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-200 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-amber-400" />
                      NEXORA Sodiqlik Ballarini Ishlatish
                    </span>
                    <span className="font-mono text-amber-300 font-bold">{currentUser.loyaltyPoints} pts</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 text-[11px]">
                    <input
                      type="checkbox"
                      checked={useLoyaltyDiscount}
                      onChange={(e) => setUseLoyaltyDiscount(e.target.checked)}
                      className="rounded bg-slate-800 text-amber-500"
                    />
                    <span>
                      250 ball ishlatish (-$2.50 USD chegirma)
                    </span>
                  </label>
                </div>

                <div className="space-y-1.5 text-slate-400 pt-1">
                  <div className="flex justify-between">
                    <span>Tovar narxi:</span>
                    <span className="font-mono text-slate-200">${checkoutItem.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yetkazib berish (CARGO):</span>
                    <span className="font-mono text-slate-200">${activeTab === 'global' ? 25 : 5}</span>
                  </div>
                  {useLoyaltyDiscount && (
                    <div className="flex justify-between text-amber-400">
                      <span>Sodiqlik chegirmasi:</span>
                      <span className="font-mono">-$2.50</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-emerald-400">
                    <span>Jami To‘lov:</span>
                    <span className="font-mono">
                      ${checkoutItem.price + (activeTab === 'global' ? 25 : 5) - (useLoyaltyDiscount ? 2.5 : 0)} USD
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    onClick={() => setCheckoutItem(null)}
                    className="px-3.5 py-2 text-slate-400 hover:text-white"
                  >
                    Bekor
                  </button>
                  <button
                    onClick={handleConfirmOrder}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow"
                  >
                    Escrow orqali To‘lash
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Post Listing Modal with AI Assistant */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-[#0e172a] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4 text-xs max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-indigo-400" />
                Yangi E'lon Joylashtirish ({activeTab.toUpperCase()})
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-medium">Mahsulot Nomi *</label>
                  <button
                    type="button"
                    onClick={handleAiAutoFill}
                    disabled={isAiGenerating || !newTitle.trim()}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 text-[11px] disabled:opacity-40"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isAiGenerating ? 'AI yozmoqda...' : 'NEXORA AI bilan to‘ldirish'}
                  </button>
                </div>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Masalan: Sony WH-1000XM5 Shovqinsiz Naushnik"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Kategoriya</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                  >
                    {categories.filter((c) => c !== 'all').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Narx (Siz belgilaysiz) *</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Tavsifi</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Xususiyatlari, kafolati va to‘plam tarkibi..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Rasm Havolasi (URL)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 text-slate-400 hover:text-white"
                >
                  Bekor
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow"
                >
                  E'lonni Joylashtirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
