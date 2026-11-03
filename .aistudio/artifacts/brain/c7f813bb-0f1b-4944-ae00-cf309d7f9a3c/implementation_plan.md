# NEXORA Dispute Resolution, Verification & Loyalty Systems

An integrated expansion to the NEXORA international universal platform ("One World. One Platform. Infinite Possibilities."), adding multi-party Dispute Resolution with evidence submission & escrow arbitration, a 4-tier User Verification System with official trust badges, and a comprehensive Loyalty & Rewards Program with activity-based points accumulation and checkout redemption.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural decisions below establish the governance, arbitration, and reward mechanics across NEXORA Market, Services, and Cargo transactions:

- **Confirmed Decision 1 (Dispute Arbitration & Escrow Release)**: Automatic escrow resolution. Once a moderator reviews the case, logs, and evidence, their verdict directly executes the escrow action (full refund to buyer, release to seller/carrier, or designated compromise split).
- **Confirmed Decision 2 (Loyalty & Rewards Model)**: Dual-utility points. Points earned through completed transactions, referrals, and verified reviews can be redeemed directly as currency discounts at checkout or applied toward platform VIP tier perks and fee waivers.
- **Confirmed Decision 3 (Verification & Trust Badges)**: Multi-tiered verification framework:
  - *Tier 0 (Unverified)*: Standard registered user with mandatory address on file.
  - *Tier 1 (Identity Verified - Blue Shield)*: Government ID / Passport + live phone confirmation.
  - *Tier 2 (Business Verified - Gold Shield)*: Legal entity registration, tax ID, physical facility proof.
  - *Tier 3 (Enterprise Logistics / Cargo Carrier - Emerald Star)*: Fleet licensing, CMR/Bill of Lading certification, bonded escrow backing.

---

## 1. Overview & Core Concept

### A. Dispute Resolution System (NEXORA DISPUTES)
Allows buyers, clients, and shippers to dispute Market orders, Services deliverables, or Cargo shipments. Features:
- Structured dispute filing with categorical grounds (Item Not Received, Defective/Counterfeit, Significant Delay, Service Not Rendered, Cargo Damage).
- Multi-party evidence room supporting photo attachments, tracking logs, invoice documents, and timestamped three-way chat (Buyer, Seller/Carrier, Moderator).
- Moderator Review Console inside NEXORA ADMIN with case audit trails, resolution actions (Full Refund, Release Escrow, Mutual Settlement, Dismiss), and automated status updates.

### B. User Verification System (NEXORA TRUST & VERIFY)
Empowers sellers, service providers, and transport operators to earn customer confidence:
- Self-service verification portal with encrypted document upload (ID, business certificates, trade licenses).
- Real-time verification status tracker (Pending Review, Additional Info Requested, Approved, Rejected).
- Profile trust badges displayed prominently on profiles, product listings, service cards, and search result filters.
- Moderator verification queue for KYC/KYB compliance with secure preview and decision logging.

### C. Loyalty & Rewards Program (NEXORA REWARDS)
Incentivizes ecosystem participation:
- Points earning engine: +10 pts per $10 spent, +250 pts per referred friend, +50 pts per detailed verified review with photo, +25 pts per on-time cargo delivery confirmation.
- Tier progression: Bronze (0–499 pts), Silver (500–1,999 pts), Gold (2,000–4,999 pts), Platinum (5,000+ pts).
- Point redemption in checkout: 100 points = $1.00 USD discount (up to 20% order subtotal), plus VIP perk toggles (Zero Cargo Insurance Fee, Priority Connect Support).

---

## 2. User Experience & Visual Design

### Key User Flows

```
[Buyer / Shipper Order View]
            │
            ▼
   "Open Dispute" Button
            │
            ├─► 1. Select Reason & Desired Outcome (Refund / Replacement / Compensation)
            ├─► 2. Upload Photo / Video / Document Evidence
            └─► 3. Submit ──► Case Created with Escrow Hold
                                    │
                                    ▼
       [Multi-Party Dispute Room (Connect & Admin)]
       ├─ Three-way messaging (Buyer + Seller + Moderator)
       ├─ Evidence gallery with metadata timestamps
       └─ Moderator Actions:
            ├─ [Approve Full Refund to Buyer] ──► Escrow Returned
            ├─ [Release Escrow to Seller]     ──► Payment Completed
            └─ [Custom Settlement / Split]    ──► Pro-rated Release

[Profile / Trust & Verify Hub]
            │
            ▼
   "Apply for Verification"
            │
            ├─ Tier 1 (Personal ID) or Tier 2 (Business / Enterprise License)
            ├─ Document upload dropzone & identity number input
            └─ Status: Under Review ──► Admin Approves ──► Shield Badge Live!

[NEXORA Loyalty Center]
            │
            ▼
   "Rewards Dashboard"
            │
            ├─ Dynamic Points Balance & Tier Meter (Bronze / Silver / Gold / Platinum)
            ├─ Unique Referral Code & 1-Click Invite Link generator
            ├─ Activity Ledger showing points earned / spent
            └─ Checkout Integration: "Apply 250 Points (-$2.50 USD)" toggle
```

### Visual Identity & Theme Integration
All new dispute modals, verification queues, and loyalty widgets inherit NEXORA's 6 dynamic themes (`light`, `dark`, `ocean`, `warm`, `neon`, `nature`) and 16 international languages with full RTL support for Arabic.

- **Trust & Verification Badges**:
  - Personal ID Verified: Cobalt shield with checkmark.
  - Business Verified: Amber-gold double crest.
  - Enterprise Logistics Carrier: Emerald star emblem.
- **Dispute Urgency Hierarchy**:
  - Escalated / Under Review: Warm amber indicator with countdown timer.
  - Resolved / Refunded: Muted teal completion marker.
  - Dismissed: Slate neutral marker with reason tooltip.
- **Rewards Visuals**:
  - Sleek metallic gradient cards for VIP tiers.
  - Tabular numerals (`font-mono tabular-nums`) on points ledger and reward redemption sliders.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Escrow Integration vs. Direct User Negotiation**:
  - *Chosen Approach*: Ties disputes directly to the existing `Order` escrow status. Opening a dispute locks the escrow payment so the seller cannot withdraw until resolved.
  - *Why*: Eliminates fraud risk and gives the buyer total peace of mind for both physical goods and cross-border CARGO shipments.
- **Decision 2: Centralized Moderator Queue vs. Pure Peer Review**:
  - *Chosen Approach*: Official platform moderator role with full audit logging in `NEXORA ADMIN`.
  - *Why*: Neutral third-party arbitration ensures fair decisions, maintains platform accountability, and records every moderator action in the immutable audit log.
- **Decision 3: Tiered Verification vs. Universal Mandatory ID**:
  - *Chosen Approach*: Graduated tiers. Browsing, local messaging, and purchasing remain accessible to all with mandatory address; selling high-value goods, global trade, and freight shipping require Tier 1 or Tier 2 verification.
  - *Why*: Maximizes onboarding conversion while providing rigorous protection where financial risk is concentrated.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          NEXORA FULL-STACK ROOT                        │
│                                                                        │
│   ┌────────────────────┐   ┌───────────────────┐   ┌───────────────┐   │
│   │   AuthContext      │   │  PlatformContext  │   │  Admin Console │   │
│   │  - User Profile    │   │  - Orders/Escrow  │   │  - Disputes   │   │
│   │  - Verification Lvl│   │  - Disputes Store │   │  - KYC Queue  │   │
│   │  - Loyalty Points  │   │  - Loyalty Ledger │   │  - Audit Logs │   │
│   └─────────┬──────────┘   └─────────┬─────────┘   └───────┬───────┘   │
│             │                        │                     │           │
│             ▼                        ▼                     ▼           │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                   NEW & ENHANCED MODULES                       │   │
│   │  1. DisputeRoomModal & DisputeFileModal                        │   │
│   │  2. TrustVerifyCenter & VerificationAdminQueue                 │   │
│   │  3. RewardsHub & CheckoutLoyaltyRedemption                     │   │
│   │  4. AdminDisputesManager & AdminKYCReview                      │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │                                   │
│                                    ▼                                   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │  Full-Stack Express API Proxy Routes (/api/ai/chat, server.ts) │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema Extensions (`src/types/index.ts`)

```typescript
// Disputes
export type DisputeStatus = 'open' | 'under_review' | 'awaiting_evidence' | 'resolved_refund' | 'resolved_release' | 'resolved_split' | 'dismissed';
export type DisputeCategory = 'item_not_received' | 'not_as_described' | 'damaged_in_transit' | 'service_incomplete' | 'unauthorized_fee';

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
  disputeNumber: string; // e.g., "DSP-10492"
  orderId: string;
  orderNumber: string;
  listingType: 'market' | 'service' | 'cargo';
  listingTitle: string;
  amount: number;
  currency: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  category: DisputeCategory;
  reason: string;
  evidence: DisputeEvidence[];
  messages: DisputeMessage[];
  status: DisputeStatus;
  moderatorId?: string;
  moderatorName?: string;
  resolutionNote?: string;
  createdAt: string;
  updatedAt: string;
}

// User Verification (KYC/KYB)
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
```
