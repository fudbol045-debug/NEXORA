import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MarketListing,
  ServiceListing,
  CargoListing,
  Order,
  Message,
  Conversation,
  CommunityPost,
  CommunityGroup,
  AuditLogEntry,
  OrderStatus,
  CargoStatus,
  Dispute,
  DisputeStatus,
  DisputeCategory,
  DisputeEvidence,
  DisputeMessage,
  VerificationRequest,
  VerificationTier,
  VerificationStatus,
  VerificationDocument,
} from '../types';
import { useAuth } from './AuthContext';

// Initial seed disputes
const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'dsp-001',
    disputeNumber: 'DSP-10492',
    orderId: 'ord-001',
    orderNumber: 'NXO-98241',
    listingType: 'market',
    listingTitle: 'Apple MacBook Pro 16" M3 Max',
    amount: 3495,
    currency: 'USD',
    buyerId: 'user-003',
    buyerName: 'David Zhang',
    buyerNexoraId: '729103847562',
    sellerId: 'user-001',
    sellerName: 'Nurbek Yuldashov',
    sellerNexoraId: '582941736205',
    category: 'damaged_in_transit',
    reason: 'Tovarni qabul qilib olganimda quti burchagi qattiq ezilgan holda yetib keldi. Ekran chetida mikroyoriq bor.',
    desiredOutcome: 'replacement',
    evidence: [
      {
        id: 'ev-001',
        senderId: 'user-003',
        senderName: 'David Zhang',
        senderRole: 'buyer',
        title: 'Shikastlangan quti va ekran fotosurati',
        fileUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
        fileType: 'image',
        description: 'Bojxona omborida ochish vaqtida qayd etilgan fotosurat',
        timestamp: '2025-02-23 11:45',
      },
    ],
    messages: [
      {
        id: 'dmsg-001',
        senderId: 'user-003',
        senderName: 'David Zhang',
        senderRole: 'buyer',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        message: 'Assalomu alaykum. MacBook qutisida kuchli ezilish bor, ekranda yoriq sezildi. Shuni almashtirib berishingizni yoki kompensatsiya qilishni so‘rayman.',
        timestamp: '11:46',
      },
      {
        id: 'dmsg-002',
        senderId: 'user-001',
        senderName: 'Nurbek Yuldashov',
        senderRole: 'seller',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        message: 'Hurmatli David, biz tovar jo‘natishdan oldin mukammal holda topshirganmiz. Hozir CARGO logistika kompaniyasi (Elena Rostova) bilan sug‘urta dalolatnomasini ko‘rib chiqyapmiz.',
        timestamp: '12:05',
      },
      {
        id: 'dmsg-003',
        senderId: 'user-002',
        senderName: 'Elena Rostova (Moderator & Cargo)',
        senderRole: 'moderator',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        message: '[NEXORA MODERATOR]: Ish ko‘rib chiqishga qabul qilindi. Escrow to‘lovi muzlatilgan. Ikkala tomon dalolatnomalarini taqdim etdi, tezkor yechim e’lon qilinadi.',
        timestamp: '12:30',
      },
    ],
    status: 'under_review',
    moderatorId: 'user-002',
    moderatorName: 'Elena Rostova (TransEurasia Moderator)',
    createdAt: '2025-02-23 11:40',
    updatedAt: '2025-02-23 12:30',
  },
];

// Initial seed verification requests
const INITIAL_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'vr-001',
    userId: 'user-001',
    userName: 'Nurbek Yuldashov',
    userUsername: '@nurbek',
    userNexoraId: '582941736205',
    requestedTier: 'tier_2_business',
    companyName: 'SilkRoad Global Commerce LLC',
    taxNumber: 'UZ-TAX-309182341',
    documents: [
      {
        id: 'vdoc-001',
        type: 'business_license',
        docNumber: 'LIC-2024-99812',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
        uploadedAt: '2024-03-15',
      },
    ],
    status: 'approved',
    reviewedBy: 'Super Admin',
    submittedAt: '2024-03-14',
    decidedAt: '2024-03-15',
  },
  {
    id: 'vr-002',
    userId: 'user-002',
    userName: 'Elena Rostova',
    userUsername: '@elena_cargo',
    userNexoraId: '491028374619',
    requestedTier: 'tier_3_enterprise_cargo',
    companyName: 'TransEurasia Logistics Group',
    taxNumber: 'RU-INN-7701928374',
    documents: [
      {
        id: 'vdoc-002',
        type: 'carrier_cmr',
        docNumber: 'CMR-TRANS-8812',
        fileUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
        uploadedAt: '2024-02-01',
      },
    ],
    status: 'approved',
    reviewedBy: 'Super Admin',
    submittedAt: '2024-01-25',
    decidedAt: '2024-02-01',
  },
  {
    id: 'vr-003',
    userId: 'user-003',
    userName: 'David Zhang',
    userUsername: '@david_tech',
    userNexoraId: '729103847562',
    requestedTier: 'tier_2_business',
    companyName: 'Shanghai CloudTech Systems Ltd.',
    taxNumber: 'CN-USCI-91310000X81',
    documents: [
      {
        id: 'vdoc-003',
        type: 'passport_id',
        docNumber: 'P-CN-E8921832',
        fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
        uploadedAt: '2025-02-23',
      },
    ],
    status: 'pending',
    submittedAt: '2025-02-23 15:10',
  },
];

// Seed initial Market Listings with Verification Tiers
const INITIAL_MARKET_LISTINGS: MarketListing[] = [
  {
    id: 'mkt-001',
    sellerId: 'user-001',
    sellerNexoraId: '582941736205',
    sellerName: 'Nurbek Yuldashov',
    sellerUsername: '@nurbek',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    sellerRating: 4.95,
    sellerVerificationTier: 'tier_2_business',
    marketType: 'global',
    title: 'Apple MacBook Pro 16" M3 Max (36GB / 1TB SSD)',
    description: 'Xalqaro kafolatga ega, original qutisida muhrlangan holda. Rasmiy xalqaro yetkazib berish (CARGO orqali Toshkent, Dubay, Istanbul va Moskvaga 3 kunda).',
    category: 'Computers & Electronics',
    price: 3450,
    currency: 'USD',
    condition: 'new',
    quantity: 12,
    minOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    ],
    country: "O'zbekiston",
    region: 'Toshkent',
    city: 'Toshkent',
    deliveryTerms: 'NEXORA CARGO xalqaro yetkazib berish bilan',
    estimatedDeliveryDays: 3,
    trackingAvailable: true,
    createdAt: '2025-02-15',
    views: 430,
    tags: ['macbook', 'apple', 'm3max', 'electronics', 'laptop'],
  },
  {
    id: 'mkt-002',
    sellerId: 'user-001',
    sellerNexoraId: '582941736205',
    sellerName: 'Nurbek Yuldashov',
    sellerUsername: '@nurbek',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    sellerRating: 4.95,
    sellerVerificationTier: 'tier_2_business',
    marketType: 'local',
    title: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
    description: 'Ideal holatda, IMEI ro‘yxatidan o‘tgan. 1 yillik rasmiy servis kafolati bilan. Toshkent shahri ichida bepul kuryer yetkazib beradi.',
    category: 'Phones',
    price: 1180,
    currency: 'USD',
    condition: 'new',
    quantity: 5,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    ],
    country: "O'zbekiston",
    region: 'Toshkent',
    city: 'Toshkent',
    deliveryTerms: 'Shahar ichida 2 soatda tezkor yetkazib berish',
    estimatedDeliveryDays: 1,
    trackingAvailable: true,
    createdAt: '2025-02-20',
    views: 290,
    tags: ['samsung', 's24ultra', 'smartphone', 'tashkent'],
  },
  {
    id: 'mkt-003',
    sellerId: 'user-003',
    sellerNexoraId: '729103847562',
    sellerName: 'David Zhang',
    sellerUsername: '@david_tech',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    sellerRating: 5.0,
    sellerVerificationTier: 'tier_1_identity',
    marketType: 'global',
    title: 'DJI Inspire 3 Cinema Drone 8K Full-Frame Kit',
    description: 'Professional kino va monitoring uchun DJI Inspire 3 to‘plami. Shanxay omboridan butun dunyo bo‘ylab eksport. Ulgurji va chakana savdo.',
    category: 'Computers & Electronics',
    price: 12500,
    currency: 'USD',
    condition: 'new',
    quantity: 3,
    minOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    ],
    country: 'Xitoy',
    region: 'Shanxay',
    city: 'Shanxay',
    deliveryTerms: 'Avia yuk tashish (Air Cargo) orqali 5-7 ish kuni',
    estimatedDeliveryDays: 6,
    trackingAvailable: true,
    createdAt: '2025-02-18',
    views: 610,
    tags: ['drone', 'dji', 'camera', 'cinema', '8k'],
  },
  {
    id: 'mkt-004',
    sellerId: 'user-002',
    sellerNexoraId: '491028374619',
    sellerName: 'Elena Rostova',
    sellerUsername: '@elena_cargo',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    sellerRating: 4.9,
    sellerVerificationTier: 'tier_3_enterprise_cargo',
    marketType: 'local',
    title: 'Ergonomik charm ofis kreslosi Herman Miller Aeron',
    description: 'Ajoyib holatda, barcha sozlamalari ishlaydi. Uzoq soatli ish va sog‘lom bel uchun eng yaxshi tanlov.',
    category: 'Furniture',
    price: 890,
    currency: 'USD',
    condition: 'used',
    quantity: 2,
    images: [
      'https://images.unsplash.com/photo-1580481077195-c54d394b9170?auto=format&fit=crop&w=800&q=80',
    ],
    country: 'Rossiya',
    region: 'Moskva',
    city: 'Moskva',
    deliveryTerms: 'Olib ketish yoki shahar ichida yuk tashish',
    estimatedDeliveryDays: 1,
    trackingAvailable: false,
    createdAt: '2025-02-10',
    views: 185,
    tags: ['office', 'chair', 'hermanmiller', 'furniture'],
  },
];

// Seed initial Services
const INITIAL_SERVICE_LISTINGS: ServiceListing[] = [
  {
    id: 'srv-001',
    providerId: 'user-003',
    providerNexoraId: '729103847562',
    providerName: 'David Zhang',
    providerUsername: '@david_tech',
    providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    providerRating: 5.0,
    providerVerificationTier: 'tier_1_identity',
    category: 'Programming & Web',
    title: 'Yuqori yuklamali SaaS va Web Platformalar Ishlab Chiqish',
    description: 'React, Next.js, Node.js, WebRTC va AI integratsiyalari bilan to‘liq arxitektura va kodlash. Loyiha xavfsizligi va tezkorligi kafolatlanadi.',
    price: 65,
    currency: 'USD',
    priceType: 'hourly',
    deliveryTimeDays: 14,
    coverageArea: 'Global (Online / Remote)',
    portfolio: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    ],
    workingHours: '09:00 - 18:00 (UTC+8)',
    completedJobs: 42,
    createdAt: '2024-11-01',
  },
  {
    id: 'srv-002',
    providerId: 'user-001',
    providerNexoraId: '582941736205',
    providerName: 'Nurbek Yuldashov',
    providerUsername: '@nurbek',
    providerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    providerRating: 4.95,
    providerVerificationTier: 'tier_2_business',
    category: 'Consulting & Business',
    title: 'Xitoy va BAA bilan Xalqaro Import-Eksport Konsaltingi',
    description: 'Bojxona rasmiylashtiruvi, shartnomalar tuzish, logistika marshrutlarini optimallashtirish va ishonchli zavodlarni tanlashda professional yordam.',
    price: 300,
    currency: 'USD',
    priceType: 'fixed',
    deliveryTimeDays: 3,
    coverageArea: "O'zbekiston, Xitoy, BAA, Turkiya",
    portfolio: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    ],
    workingHours: '10:00 - 19:00 (UTC+5)',
    completedJobs: 98,
    createdAt: '2024-09-15',
  },
];

// Seed initial Cargo Listings
const INITIAL_CARGO_LISTINGS: CargoListing[] = [
  {
    id: 'crg-001',
    carrierId: 'user-002',
    carrierNexoraId: '491028374619',
    carrierName: 'Elena Rostova (TransEurasia)',
    carrierAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    carrierRating: 4.9,
    carrierVerificationTier: 'tier_3_enterprise_cargo',
    trackingNumber: 'NX-CRG-882194',
    scope: 'international',
    transportType: 'air',
    cargoType: 'Elektronika, Ehtiyot qismlar, Shoshilinch tovarlar',
    fromCountry: 'Xitoy',
    fromCity: 'Shanxay (PVG)',
    toCountry: "O'zbekiston",
    toCity: 'Toshkent (TAS)',
    maxWeightKg: 15000,
    pricePerKg: 4.8,
    minPrice: 50,
    currency: 'USD',
    estimatedDays: 3,
    status: 'in_transit',
    currentLocation: 'Urumchi tranzit aeroportida, bojxona tekshiruvida',
    additionalServices: ['Eshikdan eshikkacha (Door-to-door)', 'Yuk sug‘urtasi 100%', 'Termo-nazorat'],
    contactPhone: '+7 916 555 0199',
    createdAt: '2025-02-22',
  },
  {
    id: 'crg-002',
    carrierId: 'user-002',
    carrierNexoraId: '491028374619',
    carrierName: 'Elena Rostova (TransEurasia)',
    carrierAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    carrierRating: 4.9,
    carrierVerificationTier: 'tier_3_enterprise_cargo',
    trackingNumber: 'NX-CRG-771923',
    scope: 'interstate',
    transportType: 'rail',
    cargoType: 'Konteynerli yuklar, Qurilish mollari, Kimyoviy tovarlar',
    fromCountry: 'Rossiya',
    fromCity: 'Moskva',
    toCountry: "O'zbekiston",
    toCity: 'Samarqand',
    maxWeightKg: 65000,
    pricePerKg: 0.95,
    minPrice: 300,
    currency: 'USD',
    estimatedDays: 8,
    status: 'transit_hub',
    currentLocation: 'Orenburg saralash temiryo‘l stansiyasi',
    additionalServices: ['Og‘ir texnikani joylashtirish', 'GPS plombasi'],
    contactPhone: '+7 916 555 0199',
    createdAt: '2025-02-18',
  },
  {
    id: 'crg-003',
    carrierId: 'user-001',
    carrierNexoraId: '582941736205',
    carrierName: 'Nurbek Yuldashov (Express Cargo)',
    carrierAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    carrierRating: 4.95,
    carrierVerificationTier: 'tier_2_business',
    trackingNumber: 'NX-CRG-551029',
    scope: 'intercity',
    transportType: 'road',
    cargoType: 'Har qanday xavfsiz tovarlar, mebellar, kuryerlik jo‘natmalari',
    fromCountry: "O'zbekiston",
    fromCity: 'Toshkent',
    toCountry: "O'zbekiston",
    toCity: 'Buxoro',
    maxWeightKg: 5000,
    pricePerKg: 0.35,
    minPrice: 15,
    currency: 'USD',
    estimatedDays: 1,
    status: 'in_transit',
    currentLocation: 'Navoiy aylanma yo‘lida',
    additionalServices: ['Yuklash va tushirish xizmati', 'Tezkor yetkazish'],
    contactPhone: '+998 90 123 45 67',
    createdAt: '2025-02-23',
  },
];

// Seed initial Community Posts
const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-001',
    authorId: 'user-001',
    authorNexoraId: '582941736205',
    authorName: 'Nurbek Yuldashov',
    authorUsername: '@nurbek',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authorIsBusiness: true,
    content: 'NEXORA xalqaro platformasida yangi SilkRoad eksport loyihamiz ishga tushdi! Endilikda Yevroosiyo va O‘rta Osiyo bo‘ylab tovarlarni yagona interfeys orqali sotish va CARGO tizimi orqali kuzatish ancha tez va shaffof bo‘ldi.',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['NEXORA', 'GlobalTrade', 'Export', 'Logistics', 'Ecommerce'],
    likesCount: 142,
    likedByMe: true,
    commentsCount: 28,
    sharesCount: 19,
    createdAt: '2025-02-20 14:30',
  },
  {
    id: 'post-002',
    authorId: 'user-003',
    authorNexoraId: '729103847562',
    authorName: 'David Zhang',
    authorUsername: '@david_tech',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    content: 'NEXORA AI yordamida har qanday mahsulot tavsifini soniyalar ichida professional darajada tayyorlash mumkin. Dasturchi va sotuvchilar uchun haqiqiy universal platforma. 16 ta til qo‘llab-quvvatlanishi esa xalqaro mijozlar bilan to‘siqsiz ishlashga imkon bermoqda!',
    tags: ['NEXORA_AI', 'WebDev', 'Innovation', 'Future'],
    likesCount: 89,
    likedByMe: false,
    commentsCount: 12,
    sharesCount: 7,
    createdAt: '2025-02-22 09:15',
  },
];

const INITIAL_GROUPS: CommunityGroup[] = [
  {
    id: 'grp-001',
    name: 'Xalqaro Eksportchilar va Importchilar',
    description: 'Dunyo bo‘ylab tovar ayirboshlash, bojxona masalalari va yangi bozorlar.',
    avatar: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    membersCount: 4320,
    isPrivate: false,
    category: 'Trade & Business',
    isJoined: true,
  },
  {
    id: 'grp-002',
    name: 'CARGO & Avtotransport Hamjamiyati',
    description: 'Haydovchilar, transport kompaniyalari va yuk jo‘natuvchilar ochiq kanali.',
    avatar: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
    membersCount: 2890,
    isPrivate: false,
    category: 'Logistics',
    isJoined: false,
  },
  {
    id: 'grp-003',
    name: 'IT Freelancers & Digital Creators',
    description: 'Dasturchilar, dizaynerlar va masofaviy xizmat ko‘rsatuvchilar klubi.',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    membersCount: 5610,
    isPrivate: true,
    category: 'Technology',
    isJoined: true,
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'NXO-98241',
    buyerId: 'user-003',
    buyerNexoraId: '729103847562',
    buyerName: 'David Zhang',
    sellerId: 'user-001',
    sellerNexoraId: '582941736205',
    sellerName: 'Nurbek Yuldashov',
    listingType: 'market',
    listingId: 'mkt-001',
    listingTitle: 'Apple MacBook Pro 16" M3 Max',
    listingImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    unitPrice: 3450,
    shippingFee: 45,
    discountAmount: 0,
    pointsRedeemed: 0,
    totalAmount: 3495,
    currency: 'USD',
    status: 'disputed',
    disputeId: 'dsp-001',
    paymentMethod: 'escrow',
    isEscrowProtected: true,
    trackingNumber: 'NX-CRG-882194',
    deliveryAddress: {
      country: 'Xitoy',
      region: 'Shanxay',
      city: 'Pudong',
      street: 'Century Avenue',
      houseNumber: '100',
      apartmentNumber: '3201',
      postalCode: '200120',
    },
    createdAt: '2025-02-21 11:20',
    updatedAt: '2025-02-23 11:40',
  },
  {
    id: 'ord-002',
    orderNumber: 'NXO-98115',
    buyerId: 'user-001',
    buyerNexoraId: '582941736205',
    buyerName: 'Nurbek Yuldashov',
    sellerId: 'user-003',
    sellerNexoraId: '729103847562',
    sellerName: 'David Zhang',
    listingType: 'service',
    listingId: 'srv-001',
    listingTitle: 'Yuqori yuklamali SaaS va Web Platformalar Ishlab Chiqish',
    listingImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    quantity: 10,
    unitPrice: 65,
    shippingFee: 0,
    discountAmount: 20,
    pointsRedeemed: 200,
    totalAmount: 630,
    currency: 'USD',
    status: 'confirmed',
    paymentMethod: 'card',
    isEscrowProtected: true,
    deliveryAddress: {
      country: "O'zbekiston",
      region: 'Toshkent shahri',
      city: 'Mirobod tumani',
      street: 'Amir Temur shoh ko‘chasi',
      houseNumber: '42',
      apartmentNumber: '15',
      postalCode: '100015',
    },
    createdAt: '2025-02-19 18:00',
    updatedAt: '2025-02-20 10:00',
  },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    participantIds: ['user-001', 'user-003'],
    lastMessage: 'MacBook Pro jo‘natildi, kuzatuv raqami NX-CRG-882194',
    lastMessageTime: '16:42',
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: 'conv-002',
    participantIds: ['user-001', 'user-002'],
    lastMessage: 'Xitoydan Toshkentga avia reys ertaga ertalab uchadi.',
    lastMessageTime: '14:10',
    unreadCount: 1,
    isGroup: false,
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-001',
    conversationId: 'conv-001',
    senderId: 'user-003',
    senderNexoraId: '729103847562',
    senderName: 'David Zhang',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    text: 'Salom Nurbek! MacBook Pro 16" modeli omborda bormi?',
    createdAt: '16:30',
    isRead: true,
  },
  {
    id: 'msg-002',
    conversationId: 'conv-001',
    senderId: 'user-001',
    senderNexoraId: '582941736205',
    senderName: 'Nurbek Yuldashov',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    text: 'Assalomu alaykum! Ha, original muhrlangan holda mavjud. Bugun buyurtma qilsangiz zudlik bilan jo‘natamiz.',
    createdAt: '16:35',
    isRead: true,
  },
  {
    id: 'msg-003',
    conversationId: 'conv-001',
    senderId: 'user-001',
    senderNexoraId: '582941736205',
    senderName: 'Nurbek Yuldashov',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    text: 'MacBook Pro jo‘natildi, kuzatuv raqami NX-CRG-882194',
    createdAt: '16:42',
    isRead: true,
  },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2025-02-23 15:40:12',
    actorId: 'user-001',
    actorNexoraId: '582941736205',
    actorName: 'Nurbek Yuldashov',
    action: 'PRICE_UPDATE_PERMISSION_GRANTED',
    target: 'David Zhang (@david_tech)',
    details: 'Do‘kon egasi mahsulot narxlarini o‘zgartirish huquqini taqdim etdi.',
    severity: 'info',
  },
  {
    id: 'log-002',
    timestamp: '2025-02-23 16:10:05',
    actorId: 'user-003',
    actorNexoraId: '729103847562',
    actorName: 'David Zhang',
    action: 'PRICE_MODIFIED',
    target: 'Samsung Galaxy S24 Ultra',
    details: 'Narx $1,250 dan $1,180 ga o‘zgartirildi (Chegirma aksiyasi).',
    severity: 'info',
  },
  {
    id: 'log-003',
    timestamp: '2025-02-23 18:22:45',
    actorId: 'user-001',
    actorNexoraId: '582941736205',
    actorName: 'Nurbek Yuldashov',
    action: 'SUPER_ADMIN_SECURITY_AUDIT',
    target: 'Security Rules & IP Firewall',
    details: 'Barcha 10 ta asosiy modul xavfsizlik tekshiruvidan muvaffaqiyatli o‘tdi.',
    severity: 'info',
  },
];

interface PlatformContextType {
  marketListings: MarketListing[];
  serviceListings: ServiceListing[];
  cargoListings: CargoListing[];
  orders: Order[];
  conversations: Conversation[];
  messages: Message[];
  communityPosts: CommunityPost[];
  communityGroups: CommunityGroup[];
  auditLogs: AuditLogEntry[];
  disputes: Dispute[];
  verificationRequests: VerificationRequest[];
  // Actions
  addMarketListing: (item: Omit<MarketListing, 'id' | 'createdAt' | 'views'>) => void;
  updateListingPrice: (listingId: string, newPrice: number) => { success: boolean; message: string };
  addServiceListing: (item: Omit<ServiceListing, 'id' | 'createdAt' | 'completedJobs'>) => void;
  addCargoListing: (item: Omit<CargoListing, 'id' | 'createdAt' | 'trackingNumber'>) => void;
  updateCargoStatus: (cargoId: string, status: CargoStatus, locationUpdate: string) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  sendMessage: (conversationId: string, text: string, attachmentUrl?: string, attachmentType?: 'image' | 'video' | 'file' | 'audio') => void;
  addCommunityPost: (content: string, images?: string[], tags?: string[]) => void;
  toggleLikePost: (postId: string) => void;
  joinGroup: (groupId: string) => void;
  logAction: (action: string, target: string, details: string, severity?: 'info' | 'warning' | 'security') => void;
  // Dispute Actions
  fileDispute: (
    orderId: string,
    category: DisputeCategory,
    reason: string,
    desiredOutcome: Dispute['desiredOutcome'],
    initialEvidence?: { title: string; fileUrl: string; description: string }
  ) => Dispute;
  submitDisputeEvidence: (disputeId: string, title: string, fileUrl: string, description: string) => void;
  sendDisputeMessage: (disputeId: string, text: string) => void;
  resolveDispute: (
    disputeId: string,
    decision: 'resolved_refund' | 'resolved_release' | 'resolved_split' | 'dismissed',
    moderatorNote: string
  ) => void;
  // Verification Actions
  submitVerificationRequest: (
    tier: VerificationTier,
    companyName?: string,
    taxNumber?: string,
    documentList?: VerificationDocument[]
  ) => void;
  reviewVerificationRequest: (requestId: string, status: VerificationStatus, rejectionReason?: string) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, subAdmins, earnPoints, setUserVerificationTier } = useAuth();

  const [marketListings, setMarketListings] = useState<MarketListing[]>(() => {
    const saved = localStorage.getItem('nexora_market');
    return saved ? JSON.parse(saved) : INITIAL_MARKET_LISTINGS;
  });

  const [serviceListings, setServiceListings] = useState<ServiceListing[]>(() => {
    const saved = localStorage.getItem('nexora_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_LISTINGS;
  });

  const [cargoListings, setCargoListings] = useState<CargoListing[]>(() => {
    const saved = localStorage.getItem('nexora_cargo');
    return saved ? JSON.parse(saved) : INITIAL_CARGO_LISTINGS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nexora_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('nexora_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('nexora_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('nexora_posts');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POSTS;
  });

  const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>(() => {
    const saved = localStorage.getItem('nexora_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('nexora_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    const saved = localStorage.getItem('nexora_disputes');
    return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
  });

  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(() => {
    const saved = localStorage.getItem('nexora_verification_requests');
    return saved ? JSON.parse(saved) : INITIAL_VERIFICATION_REQUESTS;
  });

  // LocalStorage persistence
  useEffect(() => {
    localStorage.setItem('nexora_market', JSON.stringify(marketListings));
  }, [marketListings]);

  useEffect(() => {
    localStorage.setItem('nexora_services', JSON.stringify(serviceListings));
  }, [serviceListings]);

  useEffect(() => {
    localStorage.setItem('nexora_cargo', JSON.stringify(cargoListings));
  }, [cargoListings]);

  useEffect(() => {
    localStorage.setItem('nexora_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nexora_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('nexora_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('nexora_posts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  useEffect(() => {
    localStorage.setItem('nexora_groups', JSON.stringify(communityGroups));
  }, [communityGroups]);

  useEffect(() => {
    localStorage.setItem('nexora_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('nexora_disputes', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('nexora_verification_requests', JSON.stringify(verificationRequests));
  }, [verificationRequests]);

  const logAction = (action: string, target: string, details: string, severity: 'info' | 'warning' | 'security' = 'info') => {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorId: currentUser.id,
      actorNexoraId: currentUser.nexoraId,
      actorName: currentUser.name,
      action,
      target,
      details,
      severity,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const addMarketListing = (item: Omit<MarketListing, 'id' | 'createdAt' | 'views'>) => {
    const newListing: MarketListing = {
      ...item,
      id: `mkt-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      views: 1,
    };
    setMarketListings((prev) => [newListing, ...prev]);
    logAction('CREATE_LISTING', item.title, `Yangi ${item.marketType} e'lon joylashtirildi. Narxi: ${item.price} ${item.currency}`);
  };

  const updateListingPrice = (listingId: string, newPrice: number): { success: boolean; message: string } => {
    const targetListing = marketListings.find((l) => l.id === listingId);
    if (!targetListing) {
      return { success: false, message: 'Mahsulot topilmadi' };
    }

    const isOwner = targetListing.sellerId === currentUser.id;
    const isSuperAdmin = currentUser.adminRole === 'super_admin';

    const subAdminGrant = subAdmins.find(
      (sub) => sub.businessOwnerId === targetListing.sellerId && sub.subAdminId === currentUser.id
    );
    const hasSubAdminPricePermission = subAdminGrant?.permissions?.canChangePrice;

    if (!isOwner && !isSuperAdmin && !hasSubAdminPricePermission) {
      logAction('PRICE_CHANGE_REJECTED', targetListing.title, `Foydalanuvchi ${currentUser.name} ruxsatsiz narx o'zgartirishga urindi`, 'warning');
      return {
        success: false,
        message: 'Ruxsat berilmadi: Narxni faqat mahsulot egasi yoki "Narxni o‘zgartirish" huquqi berilgan biznes-administrator o‘zgartirishi mumkin.',
      };
    }

    const oldPrice = targetListing.price;
    setMarketListings((prev) =>
      prev.map((item) => (item.id === listingId ? { ...item, price: newPrice } : item))
    );

    logAction(
      'PRICE_UPDATED',
      targetListing.title,
      `Narx ${oldPrice} dan ${newPrice} ${targetListing.currency} ga o‘zgartirildi (${isOwner ? 'Egasining o‘zi' : 'Vakolatli administrator'})`
    );

    return {
      success: true,
      message: `Narx muvaffaqiyatli ${newPrice} ${targetListing.currency} ga yangilandi.`,
    };
  };

  const addServiceListing = (item: Omit<ServiceListing, 'id' | 'createdAt' | 'completedJobs'>) => {
    const newService: ServiceListing = {
      ...item,
      id: `srv-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      completedJobs: 0,
    };
    setServiceListings((prev) => [newService, ...prev]);
    logAction('CREATE_SERVICE', item.title, `Yangi xizmat e'loni: ${item.price} ${item.currency}`);
  };

  const addCargoListing = (item: Omit<CargoListing, 'id' | 'createdAt' | 'trackingNumber'>) => {
    const randomTrack = `NX-CRG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCargo: CargoListing = {
      ...item,
      id: `crg-${Date.now()}`,
      trackingNumber: randomTrack,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCargoListings((prev) => [newCargo, ...prev]);
    logAction('CREATE_CARGO_ROUTE', `${item.fromCity} -> ${item.toCity}`, `Yangi yuk yo‘nalishi. Tracking: ${randomTrack}`);
  };

  const updateCargoStatus = (cargoId: string, status: CargoStatus, locationUpdate: string) => {
    setCargoListings((prev) =>
      prev.map((c) => (c.id === cargoId ? { ...c, status, currentLocation: locationUpdate } : c))
    );
    logAction('UPDATE_CARGO_STATUS', cargoId, `Status: ${status}. Joylashuv: ${locationUpdate}`);
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order => {
    const orderNumber = `NXO-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Earn loyalty points: 10 points per $10 spent
    const earned = Math.max(10, Math.floor(newOrder.totalAmount / 10) * 10);
    earnPoints(earned, `Buyurtma xaridi uchun bonus ballar (${orderNumber})`, 'purchase_reward', orderNumber);

    logAction('ORDER_CREATED', orderNumber, `Yangi buyurtma rasmiylashtirildi. Jami: $${newOrder.totalAmount} (Bonus: +${earned} ball)`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status, updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) }
          : ord
      )
    );
    logAction('ORDER_STATUS_CHANGED', orderId, `Buyurtma holati o‘zgardi: ${status}`);
  };

  // DISPUTE RESOLUTION ACTIONS
  const fileDispute = (
    orderId: string,
    category: DisputeCategory,
    reason: string,
    desiredOutcome: Dispute['desiredOutcome'],
    initialEvidence?: { title: string; fileUrl: string; description: string }
  ): Dispute => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) {
      throw new Error('Buyurtma topilmadi');
    }

    const disputeNumber = `DSP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newDispute: Dispute = {
      id: `dsp-${Date.now()}`,
      disputeNumber,
      orderId: targetOrder.id,
      orderNumber: targetOrder.orderNumber,
      listingType: targetOrder.listingType,
      listingTitle: targetOrder.listingTitle,
      amount: targetOrder.totalAmount,
      currency: targetOrder.currency,
      buyerId: targetOrder.buyerId,
      buyerName: targetOrder.buyerName,
      buyerNexoraId: targetOrder.buyerNexoraId,
      sellerId: targetOrder.sellerId,
      sellerName: targetOrder.sellerName,
      sellerNexoraId: targetOrder.sellerNexoraId,
      category,
      reason,
      desiredOutcome,
      evidence: initialEvidence
        ? [
            {
              id: `ev-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: 'buyer',
              title: initialEvidence.title,
              fileUrl: initialEvidence.fileUrl,
              fileType: 'image',
              description: initialEvidence.description,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            },
          ]
        : [],
      messages: [
        {
          id: `dmsg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: 'buyer',
          senderAvatar: currentUser.avatar,
          message: reason,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      status: 'open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setDisputes((prev) => [newDispute, ...prev]);

    // Freeze escrow and mark order disputed
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'disputed', disputeId: newDispute.id } : o))
    );

    logAction('DISPUTE_FILED', disputeNumber, `E'tiroz ochildi: ${targetOrder.orderNumber} ($${targetOrder.totalAmount}). Escrow muzlatildi.`, 'warning');

    return newDispute;
  };

  const submitDisputeEvidence = (disputeId: string, title: string, fileUrl: string, description: string) => {
    const targetDispute = disputes.find((d) => d.id === disputeId);
    if (!targetDispute) return;

    const role: DisputeEvidence['senderRole'] =
      currentUser.id === targetDispute.buyerId
        ? 'buyer'
        : currentUser.id === targetDispute.sellerId
        ? 'seller'
        : 'moderator';

    const newEv: DisputeEvidence = {
      id: `ev-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: role,
      title,
      fileUrl,
      fileType: 'image',
      description,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, evidence: [...d.evidence, newEv], updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) } : d))
    );

    logAction('DISPUTE_EVIDENCE_SUBMITTED', targetDispute.disputeNumber, `${currentUser.name} yangi dalil yukladi: "${title}"`);
  };

  const sendDisputeMessage = (disputeId: string, text: string) => {
    const targetDispute = disputes.find((d) => d.id === disputeId);
    if (!targetDispute) return;

    const role: DisputeMessage['senderRole'] =
      currentUser.id === targetDispute.buyerId
        ? 'buyer'
        : currentUser.id === targetDispute.sellerId
        ? 'seller'
        : 'moderator';

    const newMsg: DisputeMessage = {
      id: `dmsg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: role,
      senderAvatar: currentUser.avatar,
      message: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? { ...d, messages: [...d.messages, newMsg], updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) }
          : d
      )
    );
  };

  const resolveDispute = (
    disputeId: string,
    decision: 'resolved_refund' | 'resolved_release' | 'resolved_split' | 'dismissed',
    moderatorNote: string
  ) => {
    const targetDispute = disputes.find((d) => d.id === disputeId);
    if (!targetDispute) return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: decision,
              moderatorId: currentUser.id,
              moderatorName: currentUser.name,
              resolutionNote: moderatorNote,
              resolvedAt: now,
              updatedAt: now,
            }
          : d
      )
    );

    // Update the corresponding order based on decision
    let orderFinalStatus: OrderStatus = 'completed';
    if (decision === 'resolved_refund') {
      orderFinalStatus = 'cancelled';
    } else if (decision === 'resolved_release' || decision === 'dismissed') {
      orderFinalStatus = 'completed';
    } else if (decision === 'resolved_split') {
      orderFinalStatus = 'completed';
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === targetDispute.orderId ? { ...o, status: orderFinalStatus } : o))
    );

    logAction(
      'DISPUTE_RESOLVED',
      targetDispute.disputeNumber,
      `Moderator (${currentUser.name}) qarori: ${decision}. Izoh: "${moderatorNote}". Escrow to'lovi ijro etildi.`,
      'security'
    );
  };

  // VERIFICATION ACTIONS
  const submitVerificationRequest = (
    tier: VerificationTier,
    companyName?: string,
    taxNumber?: string,
    documentList: VerificationDocument[] = []
  ) => {
    const newReq: VerificationRequest = {
      id: `vr-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userUsername: currentUser.username,
      userNexoraId: currentUser.nexoraId,
      requestedTier: tier,
      companyName,
      taxNumber,
      documents: documentList,
      status: 'pending',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setVerificationRequests((prev) => [newReq, ...prev]);
    setUserVerificationTier(currentUser.id, tier, 'pending');

    logAction('VERIFICATION_REQUESTED', currentUser.username, `Yangi verifikatsiya arizasi: ${tier}`);
  };

  const reviewVerificationRequest = (requestId: string, status: VerificationStatus, rejectionReason?: string) => {
    const req = verificationRequests.find((r) => r.id === requestId);
    if (!req) return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setVerificationRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status, reviewedBy: currentUser.name, rejectionReason, decidedAt: now }
          : r
      )
    );

    // Update user's verification badge in active context
    setUserVerificationTier(req.userId, req.requestedTier, status);

    // Also update all listings by this seller/provider/carrier
    if (status === 'approved') {
      setMarketListings((prev) =>
        prev.map((l) => (l.sellerId === req.userId ? { ...l, sellerVerificationTier: req.requestedTier } : l))
      );
      setServiceListings((prev) =>
        prev.map((s) => (s.providerId === req.userId ? { ...s, providerVerificationTier: req.requestedTier } : s))
      );
      setCargoListings((prev) =>
        prev.map((c) => (c.carrierId === req.userId ? { ...c, carrierVerificationTier: req.requestedTier } : c))
      );
    }

    logAction(
      'VERIFICATION_DECIDED',
      req.userName,
      `Verifikatsiya ${status.toUpperCase()} qilindi (${req.requestedTier}) Moderator: ${currentUser.name}`,
      status === 'approved' ? 'info' : 'warning'
    );
  };

  const sendMessage = (conversationId: string, text: string, attachmentUrl?: string, attachmentType?: 'image' | 'video' | 'file' | 'audio') => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderNexoraId: currentUser.nexoraId,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      attachmentUrl,
      attachmentType,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setMessages((prev) => [...prev, newMsg]);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: text || (attachmentType ? `[${attachmentType}]` : ''), lastMessageTime: newMsg.createdAt }
          : c
      )
    );
  };

  const addCommunityPost = (content: string, images?: string[], tags: string[] = ['NEXORA']) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorNexoraId: currentUser.nexoraId,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorIsBusiness: currentUser.isBusiness,
      content,
      images,
      tags,
      likesCount: 0,
      likedByMe: false,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setCommunityPosts((prev) => [newPost, ...prev]);

    // Earn loyalty points for posting
    earnPoints(25, 'Hamjamiyatga yangi post ulashganingiz uchun', 'purchase_reward');

    logAction('COMMUNITY_POST', currentUser.username, 'Yangi ijtimoiy post e’lon qilindi (+25 ball)');
  };

  const toggleLikePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = p.likedByMe;
          return {
            ...p,
            likedByMe: !isLiked,
            likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1,
          };
        }
        return p;
      })
    );
  };

  const joinGroup = (groupId: string) => {
    setCommunityGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const newStatus = !g.isJoined;
          return {
            ...g,
            isJoined: newStatus,
            membersCount: newStatus ? g.membersCount + 1 : g.membersCount - 1,
          };
        }
        return g;
      })
    );
  };

  return (
    <PlatformContext.Provider
      value={{
        marketListings,
        serviceListings,
        cargoListings,
        orders,
        conversations,
        messages,
        communityPosts,
        communityGroups,
        auditLogs,
        disputes,
        verificationRequests,
        addMarketListing,
        updateListingPrice,
        addServiceListing,
        addCargoListing,
        updateCargoStatus,
        createOrder,
        updateOrderStatus,
        sendMessage,
        addCommunityPost,
        toggleLikePost,
        joinGroup,
        logAction,
        fileDispute,
        submitDisputeEvidence,
        sendDisputeMessage,
        resolveDispute,
        submitVerificationRequest,
        reviewVerificationRequest,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
