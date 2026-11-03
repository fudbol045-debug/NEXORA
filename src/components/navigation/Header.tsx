import React, { useState } from 'react';
import {
  Globe2,
  Sparkles,
  ShieldCheck,
  Award,
  Sun,
  Moon,
  Palette,
  Bell,
  Menu,
  X,
  Copy,
  Check,
  ChevronDown,
  User as UserIcon,
  Search,
  ExternalLink,
  ShieldAlert,
  Coins,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, ThemeInfo } from '../../context/ThemeContext';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import { usePlatform } from '../../context/PlatformContext';
import TrustBadge from '../common/TrustBadge';

interface HeaderProps {
  onOpenLoyaltyModal: () => void;
  onOpenVerificationModal: () => void;
  onNavigateToModule: (module: string) => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export default function Header({
  onOpenLoyaltyModal,
  onOpenVerificationModal,
  onNavigateToModule,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}: HeaderProps) {
  const { currentUser, loginAs } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { disputes, verificationRequests } = usePlatform();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const activeDisputesCount = disputes.filter(
    (d) => d.status === 'open' || d.status === 'under_review' || d.status === 'awaiting_evidence'
  ).length;

  const pendingVerificationCount = verificationRequests.filter((v) => v.status === 'pending').length;

  const handleCopyId = () => {
    if (!currentUser?.nexoraId) return;
    navigator.clipboard.writeText(currentUser.nexoraId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];
  const currentThemeObj = themes.find((th: ThemeInfo) => th.id === theme) || themes[0];

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-lg text-muted-foreground hover:bg-accent md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => onNavigateToModule('market')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-all">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-lg tracking-tight text-foreground">NEXORA</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 uppercase tracking-wider">
                  Global
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-muted-foreground font-medium truncate max-w-[210px] mt-0.5">
                {t('slogan')}
              </span>
            </div>
          </button>
        </div>

        {/* Center: Search trigger & 12-digit ID Badge */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => onNavigateToModule('search')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/60 border border-border text-xs text-muted-foreground hover:border-blue-500 hover:text-foreground transition-all w-64 text-left"
          >
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="truncate">NEXORA bo'ylab qidirish...</span>
            <kbd className="ml-auto text-[10px] bg-background border border-border px-1.5 py-0.5 rounded font-mono">
              /
            </kbd>
          </button>

          {/* User 12-digit ID Pill */}
          {currentUser && (
            <button
              onClick={handleCopyId}
              title="12 xonali NEXORA ID raqamini nusxalash"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all"
            >
              <span className="text-[10px] uppercase font-sans font-bold text-blue-500">ID:</span>
              <span>{currentUser.nexoraId}</span>
              {copiedId ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <Copy className="w-3 h-3 text-blue-400 shrink-0" />
              )}
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Loyalty Points Button */}
          {currentUser && (
            <button
              onClick={onOpenLoyaltyModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-all text-xs font-bold shadow-sm"
              title="NEXORA REWARDS ballari balansi"
            >
              <Coins className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-extrabold">{currentUser.loyaltyPoints.toLocaleString()}</span>
              <span className="hidden sm:inline text-[10px] uppercase opacity-80">Ball</span>
            </button>
          )}

          {/* Verification Badge / KYC trigger */}
          {currentUser && (
            <button
              onClick={onOpenVerificationModal}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-accent transition-all"
              title="Profilni tasdiqlash (KYC/KYB)"
            >
              <TrustBadge tier={currentUser.verificationTier} size="sm" showLabel={false} />
              <span className="hidden xl:inline text-[11px] font-bold text-foreground">
                {currentUser.verificationTier === 'tier_0_unverified'
                  ? 'Tasdiqlash'
                  : currentUser.verificationTier === 'tier_1_identity'
                  ? 'Shaxsiy'
                  : currentUser.verificationTier === 'tier_2_business'
                  ? 'Biznes'
                  : 'Kargo'}
              </span>
            </button>
          )}

          {/* Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsThemeDropdownOpen(!isThemeDropdownOpen);
                setIsLangDropdownOpen(false);
                setIsUserDropdownOpen(false);
              }}
              className="p-2 rounded-lg text-foreground hover:bg-accent transition-all flex items-center gap-1 text-xs font-semibold"
              title="Rang mavzusini tanlash (6 ta rejim)"
            >
              <Palette className="w-4 h-4 text-muted-foreground" />
              <span className="hidden md:inline capitalize text-[11px]">{currentThemeObj.name}</span>
            </button>

            {isThemeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Rang Mavzusi
                </div>
                {themes.map((th: ThemeInfo) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setTheme(th.id);
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                      theme === th.id
                        ? 'bg-blue-500/10 text-blue-600 font-bold'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    <span>{th.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{th.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                setIsThemeDropdownOpen(false);
                setIsUserDropdownOpen(false);
              }}
              className="p-2 rounded-lg text-foreground hover:bg-accent transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Tilni o'zgartirish (16 til)"
            >
              <span className="text-base leading-none">{currentLangObj.flag}</span>
              <span className="hidden sm:inline text-[11px] font-bold uppercase">{currentLangObj.code}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 max-h-96 overflow-y-auto bg-card border border-border rounded-xl shadow-xl py-2 z-50">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Tilni Tanlang (16 Til)
                </div>
                {LANGUAGES.map((lng) => (
                  <button
                    key={lng.code}
                    onClick={() => {
                      setLanguage(lng.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                      currentLanguage === lng.code
                        ? 'bg-blue-500/10 text-blue-600 font-bold'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lng.flag}</span>
                      <span>{lng.nativeName}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase">{lng.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Admin Badge (if super_admin) */}
          {currentUser?.adminRole && (
            <button
              onClick={() => onNavigateToModule('admin')}
              className="relative p-2 rounded-lg text-foreground hover:bg-accent transition-all"
              title="NEXORA ADMIN Boshqaruv Markazi"
            >
              <ShieldAlert className="w-4 h-4 text-red-500" />
              {(activeDisputesCount > 0 || pendingVerificationCount > 0) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-card animate-pulse" />
              )}
            </button>
          )}

          {/* User Account Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserDropdownOpen(!isUserDropdownOpen);
                setIsLangDropdownOpen(false);
                setIsThemeDropdownOpen(false);
              }}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500/50 transition-all"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
              />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-2xl shadow-2xl p-3 z-50">
                {currentUser && (
                  <div className="pb-3 border-b border-border mb-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/40"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-foreground truncate">{currentUser.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{currentUser.username}</div>
                        <div className="text-[10px] font-mono text-blue-600 font-semibold">
                          ID: {currentUser.nexoraId}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 px-1">
                  Tezkor Akkaunt O'zgartirish (Test uchun)
                </div>

                <div className="space-y-1">
                  {[
                    { id: 'user-001', name: 'Nurbek Yuldashov (Admin & Sotuvchi)', role: 'super_admin' },
                    { id: 'user-002', name: 'Elena Rostova (Kargo & Moderator)', role: 'moderator' },
                    { id: 'user-003', name: 'David Zhang (Xaridor - Xitoy)', role: 'user' },
                    { id: 'user-004', name: 'Aliya Karimova (Xizmat Provayderi)', role: 'user' },
                  ].map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        loginAs(acc.id);
                        setIsUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                        currentUser?.id === acc.id
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      <span className="truncate">{acc.name}</span>
                      {currentUser?.id === acc.id && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-border mt-3 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onNavigateToModule('core');
                      setIsUserDropdownOpen(false);
                    }}
                    className="text-xs text-blue-600 hover:underline font-bold"
                  >
                    To'liq Profilga O'tish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
