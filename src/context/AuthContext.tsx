import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  BusinessSubAdmin,
  Address,
  VerificationTier,
  VerificationStatus,
  LoyaltyTier,
  LoyaltyLedgerEntry,
} from '../types';

export const INITIAL_LOYALTY_LEDGER: LoyaltyLedgerEntry[] = [
  {
    id: 'led-001',
    userId: 'user-001',
    pointsDelta: 500,
    actionType: 'purchase_reward',
    description: 'Xalqaro tovar xaridi uchun bonus ballar',
    referenceId: 'NXO-98241',
    timestamp: '2025-02-21 11:22',
  },
  {
    id: 'led-002',
    userId: 'user-001',
    pointsDelta: 250,
    actionType: 'referral_bonus',
    description: 'Yangi foydalanuvchini platformaga taklif qilish bonusi (@david_tech)',
    timestamp: '2025-02-18 14:05',
  },
  {
    id: 'led-003',
    userId: 'user-001',
    pointsDelta: 50,
    actionType: 'review_reward',
    description: 'CARGO xizmatiga batafsil baho va fotosurat qoldirganingiz uchun',
    timestamp: '2025-02-15 09:30',
  },
];

export const DEMO_USERS: User[] = [
  {
    id: 'user-001',
    nexoraId: '582941736205',
    name: 'Nurbek Yuldashov',
    username: '@nurbek',
    email: 'nurbek.yuldashov@nexora.global',
    phone: '+998 90 123 45 67',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Xalqaro savdo va elektronika eksportchisi. Nexora Market va Cargo aʼzosi.',
    country: "O'zbekiston",
    region: 'Toshkent shahri',
    address: {
      country: "O'zbekiston",
      region: 'Toshkent shahri',
      city: 'Mirobod tumani',
      street: 'Amir Temur shoh ko‘chasi',
      houseNumber: '42',
      apartmentNumber: '15',
      postalCode: '100015',
    },
    createdAt: '2024-03-12',
    rating: 4.95,
    reviewCount: 148,
    followersCount: 1840,
    followingCount: 230,
    isVerified: true,
    verificationTier: 'tier_2_business',
    verificationStatus: 'approved',
    loyaltyPoints: 1250,
    loyaltyTier: 'silver',
    referralCode: 'NEX-582941',
    isBusiness: true,
    businessName: 'SilkRoad Global Commerce LLC',
    privacy: {
      allowMessagesFrom: 'everyone',
      allowAudioCallsFrom: 'everyone',
      allowVideoCallsFrom: 'everyone',
      showOnlineStatus: true,
      showLastSeen: true,
      showAddressPublicly: false,
      twoFactorEnabled: true,
    },
    preferredTheme: 'dark',
    preferredLanguage: 'uz',
    adminRole: 'super_admin',
  },
  {
    id: 'user-002',
    nexoraId: '491028374619',
    name: 'Elena Rostova',
    username: '@elena_cargo',
    email: 'elena@eurasiacargo.com',
    phone: '+7 916 555 0199',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Avia va temiryo‘l logistikasi koordinatori. Yevroosiyo bo‘ylab yuk tashish.',
    country: 'Rossiya',
    region: 'Moskva',
    address: {
      country: 'Rossiya',
      region: 'Moskva',
      city: 'Tverskoy',
      street: 'Tverskaya ulitsa',
      houseNumber: '12',
      apartmentNumber: '4',
      postalCode: '125009',
    },
    createdAt: '2024-01-20',
    rating: 4.9,
    reviewCount: 89,
    followersCount: 920,
    followingCount: 140,
    isVerified: true,
    verificationTier: 'tier_3_enterprise_cargo',
    verificationStatus: 'approved',
    loyaltyPoints: 3400,
    loyaltyTier: 'gold',
    referralCode: 'NEX-491028',
    isBusiness: true,
    businessName: 'TransEurasia Logistics Group',
    privacy: {
      allowMessagesFrom: 'everyone',
      allowAudioCallsFrom: 'everyone',
      allowVideoCallsFrom: 'contacts',
      showOnlineStatus: true,
      showLastSeen: true,
      showAddressPublicly: false,
      twoFactorEnabled: false,
    },
    preferredTheme: 'ocean',
    preferredLanguage: 'ru',
    adminRole: 'head_admin',
  },
  {
    id: 'user-003',
    nexoraId: '729103847562',
    name: 'David Zhang',
    username: '@david_tech',
    email: 'david.zhang@nexora.io',
    phone: '+86 138 0013 8000',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Fullstack web & mobile dasturchi, AI va WebRTC arxitektori.',
    country: 'Xitoy',
    region: 'Shanxay',
    address: {
      country: 'Xitoy',
      region: 'Shanxay',
      city: 'Pudong',
      street: 'Century Avenue',
      houseNumber: '100',
      apartmentNumber: '3201',
      postalCode: '200120',
    },
    createdAt: '2024-05-18',
    rating: 5.0,
    reviewCount: 64,
    followersCount: 1250,
    followingCount: 180,
    isVerified: true,
    verificationTier: 'tier_1_identity',
    verificationStatus: 'approved',
    loyaltyPoints: 850,
    loyaltyTier: 'silver',
    referralCode: 'NEX-729103',
    isBusiness: false,
    privacy: {
      allowMessagesFrom: 'everyone',
      allowAudioCallsFrom: 'contacts',
      allowVideoCallsFrom: 'nobody',
      showOnlineStatus: true,
      showLastSeen: false,
      showAddressPublicly: false,
      twoFactorEnabled: true,
    },
    preferredTheme: 'neon',
    preferredLanguage: 'en',
    adminRole: 'technical_admin',
  },
];

export const INITIAL_SUB_ADMINS: BusinessSubAdmin[] = [
  {
    id: 'sub-001',
    businessOwnerId: 'user-001',
    subAdminId: 'user-003',
    subAdminNexoraId: '729103847562',
    subAdminName: 'David Zhang',
    subAdminUsername: '@david_tech',
    subAdminAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    roleTitle: 'Do‘kon boshqaruvchisi (Store Manager)',
    permissions: {
      canAddProducts: true,
      canEditProducts: true,
      canDeleteProducts: false,
      canChangePrice: true,
      canManageOrders: true,
      canReplyToCustomers: true,
      canViewReports: true,
    },
    assignedAt: '2024-06-10',
  },
];

interface AuthContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  loginAs: (userId: string) => void;
  updateProfile: (updated: Partial<User>) => void;
  updateAddress: (address: Address) => void;
  subAdmins: BusinessSubAdmin[];
  addSubAdmin: (subAdmin: Omit<BusinessSubAdmin, 'id' | 'assignedAt'>) => void;
  updateSubAdminPermissions: (id: string, permissions: Partial<BusinessSubAdmin['permissions']>) => void;
  removeSubAdmin: (id: string) => void;
  registerUser: (newUser: Omit<User, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'followersCount' | 'followingCount' | 'isVerified' | 'verificationTier' | 'verificationStatus' | 'loyaltyPoints' | 'loyaltyTier' | 'referralCode'>) => void;
  // Loyalty methods
  loyaltyLedger: LoyaltyLedgerEntry[];
  earnPoints: (amount: number, reason: string, actionType: LoyaltyLedgerEntry['actionType'], refId?: string) => void;
  redeemPoints: (amount: number, discountValue: number, orderId?: string) => boolean;
  // Verification methods
  requestVerification: (tier: VerificationTier, companyName?: string, taxNumber?: string) => void;
  setUserVerificationTier: (userId: string, tier: VerificationTier, status: VerificationStatus) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('nexora_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEMO_USERS[0];
  });

  const [loyaltyLedger, setLoyaltyLedger] = useState<LoyaltyLedgerEntry[]>(() => {
    const saved = localStorage.getItem('nexora_loyalty_ledger');
    return saved ? JSON.parse(saved) : INITIAL_LOYALTY_LEDGER;
  });

  const [subAdmins, setSubAdmins] = useState<BusinessSubAdmin[]>(() => {
    const saved = localStorage.getItem('nexora_sub_admins');
    return saved ? JSON.parse(saved) : INITIAL_SUB_ADMINS;
  });

  useEffect(() => {
    localStorage.setItem('nexora_active_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexora_loyalty_ledger', JSON.stringify(loyaltyLedger));
  }, [loyaltyLedger]);

  useEffect(() => {
    localStorage.setItem('nexora_sub_admins', JSON.stringify(subAdmins));
  }, [subAdmins]);

  const switchUser = (userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const updateProfile = (updated: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  const updateAddress = (address: Address) => {
    setCurrentUser((prev) => ({ ...prev, address }));
  };

  const earnPoints = (amount: number, reason: string, actionType: LoyaltyLedgerEntry['actionType'], refId?: string) => {
    const entry: LoyaltyLedgerEntry = {
      id: `led-${Date.now()}`,
      userId: currentUser.id,
      pointsDelta: amount,
      actionType,
      description: reason,
      referenceId: refId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setLoyaltyLedger((prev) => [entry, ...prev]);

    const newPoints = currentUser.loyaltyPoints + amount;
    let newTier: LoyaltyTier = 'bronze';
    if (newPoints >= 5000) newTier = 'platinum';
    else if (newPoints >= 2000) newTier = 'gold';
    else if (newPoints >= 500) newTier = 'silver';

    setCurrentUser((prev) => ({
      ...prev,
      loyaltyPoints: newPoints,
      loyaltyTier: newTier,
    }));
  };

  const redeemPoints = (amount: number, discountValue: number, orderId?: string): boolean => {
    if (currentUser.loyaltyPoints < amount) return false;

    const entry: LoyaltyLedgerEntry = {
      id: `led-${Date.now()}`,
      userId: currentUser.id,
      pointsDelta: -amount,
      actionType: 'checkout_redeem',
      description: `Buyurtma uchun chegirma (-$${discountValue.toFixed(2)})`,
      referenceId: orderId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setLoyaltyLedger((prev) => [entry, ...prev]);

    setCurrentUser((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints - amount,
    }));

    return true;
  };

  const requestVerification = (tier: VerificationTier, companyName?: string, taxNumber?: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      verificationTier: tier,
      verificationStatus: 'pending',
      businessName: companyName || prev.businessName,
    }));
  };

  const setUserVerificationTier = (userId: string, tier: VerificationTier, status: VerificationStatus) => {
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({
        ...prev,
        verificationTier: tier,
        verificationStatus: status,
        isVerified: status === 'approved' && tier !== 'tier_0_unverified',
      }));
    }
  };

  const addSubAdmin = (newAdmin: Omit<BusinessSubAdmin, 'id' | 'assignedAt'>) => {
    const item: BusinessSubAdmin = {
      ...newAdmin,
      id: `sub-${Date.now()}`,
      assignedAt: new Date().toISOString().split('T')[0],
    };
    setSubAdmins((prev) => [...prev, item]);
  };

  const updateSubAdminPermissions = (id: string, permissions: Partial<BusinessSubAdmin['permissions']>) => {
    setSubAdmins((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, permissions: { ...sub.permissions, ...permissions } } : sub))
    );
  };

  const removeSubAdmin = (id: string) => {
    setSubAdmins((prev) => prev.filter((sub) => sub.id !== id));
  };

  const registerUser = (data: Omit<User, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'followersCount' | 'followingCount' | 'isVerified' | 'verificationTier' | 'verificationStatus' | 'loyaltyPoints' | 'loyaltyTier' | 'referralCode'>) => {
    const random12DigitId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const newUser: User = {
      ...data,
      id: `user-${Date.now()}`,
      nexoraId: random12DigitId,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewCount: 0,
      followersCount: 0,
      followingCount: 0,
      isVerified: false,
      verificationTier: 'tier_0_unverified',
      verificationStatus: 'none',
      loyaltyPoints: 100, // Welcome gift points
      loyaltyTier: 'bronze',
      referralCode: `NEX-${random12DigitId.substring(0, 6)}`,
    };
    DEMO_USERS.push(newUser);
    setCurrentUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        loginAs: switchUser,
        updateProfile,
        updateAddress,
        subAdmins,
        addSubAdmin,
        updateSubAdminPermissions,
        removeSubAdmin,
        registerUser,
        loyaltyLedger,
        earnPoints,
        redeemPoints,
        requestVerification,
        setUserVerificationTier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
