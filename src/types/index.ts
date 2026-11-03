export type ThemeMode = 'light' | 'dark' | 'ocean' | 'warm' | 'neon' | 'nature';

export type LanguageCode =
  | 'uz' // O'zbek
  | 'en' // English
  | 'ru' // Русский
  | 'zh' // 中文
  | 'tr' // Türkçe
  | 'kk' // Қазақша
  | 'ky' // Кыргызча
  | 'tg' // Тоҷикӣ
  | 'ar' // العربية (RTL)
  | 'es' // Español
  | 'fr' // Français
  | 'de' // Deutsch
  | 'ja' // 日本語
  | 'ko' // 한국어
  | 'hi' // हिन्दी
  | 'pt'; // Português

export interface Address {
  country: string;
  region: string;
  city: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  postalCode?: string;
}

export interface UserPrivacySettings {
  allowMessagesFrom: 'everyone' | 'contacts' | 'nobody';
  allowAudioCallsFrom: 'everyone' | 'contacts' | 'nobody';
  allowVideoCallsFrom: 'everyone' | 'contacts' | 'nobody';
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  showAddressPublicly: boolean;
  twoFactorEnabled: boolean;
}

// Verification Tiers & Statuses
export type VerificationTier = 'tier_0_unverified' | 'tier_1_identity' | 'tier_2_business' | 'tier_3_enterprise_cargo';
export type VerificationStatus = 'none' | 'pending' | 'action_required' | 'approved' | 'rejected';

export interface VerificationDocument {
  id: string;
  type: 'passport_id' | 'business_license' | 'tax_cert' | 'carrier_cmr' | 'utility_bill';
  docNumber: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  userNexoraId: string;
  requestedTier: VerificationTier;
  companyName?: string;
  taxNumber?: string;
  documents: VerificationDocument[];
  status: VerificationStatus;
  reviewedBy?: string;
  rejectionReason?: string;
  submittedAt: string;
  decidedAt?: string;
}

// Loyalty & Rewards
export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LoyaltyLedgerEntry {
  id: string;
  userId: string;
  pointsDelta: number; // e.g. +100 or -50
  actionType: 'purchase_reward' | 'referral_bonus' | 'review_reward' | 'checkout_redeem' | 'tier_bonus';
  description: string;
  referenceId?: string;
  timestamp: string;
}

export interface User {
  id: string; // Internal id
  nexoraId: string; // 12-digit unique ID e.g. "582941736205"
  name: string; // Full real name e.g. "Nurbek Yuldashov"
  username: string; // @username e.g. "@nurbek"
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  country: string;
  region: string;
  address: Address; // Mandatory
  createdAt: string;
  rating: number; // e.g. 4.9
  reviewCount: number;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  verificationTier: VerificationTier;
  verificationStatus: VerificationStatus;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  referralCode: string;
  isBusiness: boolean;
  businessName?: string;
  privacy: UserPrivacySettings;
  preferredTheme: ThemeMode;
  preferredLanguage: LanguageCode;
  adminRole?: 'super_admin' | 'head_admin' | 'moderator' | 'technical_admin' | 'finance_admin';
}

export type MarketType = 'local' | 'global';
export type ItemCondition = 'new' | 'used';

export interface MarketListing {
  id: string;
  sellerId: string;
  sellerNexoraId: string;
  sellerName: string;
  sellerUsername: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerVerificationTier: VerificationTier;
  marketType: MarketType;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: 'USD' | 'EUR' | 'UZS' | 'CNY';
  condition: ItemCondition;
  quantity: number;
  minOrderQuantity?: number; // For global wholesale
  images: string[];
  country: string;
  region: string;
  city: string;
  deliveryTerms: string;
  estimatedDeliveryDays?: number;
  trackingAvailable: boolean;
  createdAt: string;
  views: number;
  tags: string[];
}

export interface ServiceListing {
  id: string;
  providerId: string;
  providerNexoraId: string;
  providerName: string;
  providerUsername: string;
  providerAvatar: string;
  providerRating: number;
  providerVerificationTier: VerificationTier;
  category: string;
  title: string;
  description: string;
  price: number;
  currency: 'USD' | 'EUR' | 'UZS';
  priceType: 'fixed' | 'hourly' | 'negotiable';
  deliveryTimeDays: number;
  coverageArea: string;
  portfolio: string[];
  workingHours: string;
  completedJobs: number;
  createdAt: string;
}

export type TransportType = 'air' | 'sea' | 'rail' | 'road';
export type CargoScope = 'city' | 'intercity' | 'interstate' | 'international';
export type CargoStatus = 'booked' | 'transit_hub' | 'customs_cleared' | 'in_transit' | 'delivered';

export interface CargoListing {
  id: string;
  carrierId: string;
  carrierNexoraId: string;
  carrierName: string;
  carrierAvatar: string;
  carrierRating: number;
  carrierVerificationTier: VerificationTier;
  trackingNumber: string;
  scope: CargoScope;
  transportType: TransportType;
  cargoType: string;
  fromCountry: string;
  fromCity: string;
  toCountry: string;
  toCity: string;
  maxWeightKg: number;
  pricePerKg: number;
  minPrice: number;
  currency: 'USD' | 'UZS' | 'EUR';
  estimatedDays: number;
  status: CargoStatus;
  currentLocation: string;
  additionalServices: string[];
  contactPhone: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderNexoraId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video' | 'file' | 'audio';
  replyToMessageId?: string;
  createdAt: string;
  isRead: boolean;
  isEdited?: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorNexoraId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorIsBusiness?: boolean;
  content: string;
  images?: string[];
  tags: string[];
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  avatar: string;
  coverImage: string;
  membersCount: number;
  isPrivate: boolean;
  category: string;
  isJoined: boolean;
}

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "NXO-98234"
  buyerId: string;
  buyerNexoraId: string;
  buyerName: string;
  sellerId: string;
  sellerNexoraId: string;
  sellerName: string;
  listingType: 'market' | 'service' | 'cargo';
  listingId: string;
  listingTitle: string;
  listingImage: string;
  quantity: number;
  unitPrice: number;
  shippingFee: number;
  discountAmount?: number;
  pointsRedeemed?: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: 'card' | 'bank_transfer' | 'payme_click' | 'escrow';
  isEscrowProtected: boolean;
  disputeId?: string;
  trackingNumber?: string;
  deliveryAddress: Address;
  createdAt: string;
  updatedAt: string;
}

// Dispute Resolution System Types
export type DisputeStatus =
  | 'open'
  | 'under_review'
  | 'awaiting_evidence'
  | 'resolved_refund'
  | 'resolved_release'
  | 'resolved_split'
  | 'dismissed';

export type DisputeCategory =
  | 'item_not_received'
  | 'not_as_described'
  | 'damaged_in_transit'
  | 'service_incomplete'
  | 'unauthorized_fee'
  | 'other';

export interface DisputeEvidence {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller' | 'carrier' | 'moderator';
  title: string;
  fileUrl: string;
  fileType: 'image' | 'document';
  description: string;
  timestamp: string;
}

export interface DisputeMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller' | 'carrier' | 'moderator';
  senderAvatar: string;
  message: string;
  timestamp: string;
}

export interface Dispute {
  id: string;
  disputeNumber: string; // e.g. "DSP-10492"
  orderId: string;
  orderNumber: string;
  listingType: 'market' | 'service' | 'cargo';
  listingTitle: string;
  amount: number;
  currency: string;
  buyerId: string;
  buyerName: string;
  buyerNexoraId: string;
  sellerId: string;
  sellerName: string;
  sellerNexoraId: string;
  category: DisputeCategory;
  reason: string;
  desiredOutcome: 'full_refund' | 'partial_refund' | 'replacement' | 'cancel_order';
  evidence: DisputeEvidence[];
  messages: DisputeMessage[];
  status: DisputeStatus;
  moderatorId?: string;
  moderatorName?: string;
  resolutionNote?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessAdminPermission {
  canAddProducts: boolean;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canChangePrice: boolean; // Special sensitive permission!
  canManageOrders: boolean;
  canReplyToCustomers: boolean;
  canViewReports: boolean;
}

export interface BusinessSubAdmin {
  id: string;
  businessOwnerId: string;
  subAdminId: string;
  subAdminNexoraId: string;
  subAdminName: string;
  subAdminUsername: string;
  subAdminAvatar: string;
  roleTitle: string;
  permissions: BusinessAdminPermission;
  assignedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorNexoraId: string;
  actorName: string;
  action: string;
  target: string;
  details: string;
  severity: 'info' | 'warning' | 'security';
}
