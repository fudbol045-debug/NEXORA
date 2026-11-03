import React from 'react';
import {
  User,
  ShoppingBag,
  Wrench,
  Truck,
  MessageSquare,
  Users,
  Search,
  Sparkles,
  ClipboardList,
  ShieldCheck,
  Award,
  ShieldAlert,
  ChevronRight,
  Globe2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';

export type ModuleKey =
  | 'core'
  | 'market'
  | 'services'
  | 'cargo'
  | 'connect'
  | 'community'
  | 'search'
  | 'ai'
  | 'orders'
  | 'admin';

interface SidebarProps {
  activeModule: ModuleKey;
  onSelectModule: (module: ModuleKey) => void;
  onOpenLoyaltyModal: () => void;
  onOpenVerificationModal: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  activeModule,
  onSelectModule,
  onOpenLoyaltyModal,
  onOpenVerificationModal,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { disputes, verificationRequests, orders } = usePlatform();

  const activeDisputesCount = disputes.filter(
    (d) => d.status === 'open' || d.status === 'under_review' || d.status === 'awaiting_evidence'
  ).length;

  const pendingVerificationCount = verificationRequests.filter((v) => v.status === 'pending').length;

  const activeOrdersCount = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length;

  const navItems: { key: ModuleKey; label: string; icon: any; badge?: number; badgeColor?: string }[] = [
    { key: 'market', label: 'NEXORA MARKET', icon: ShoppingBag },
    { key: 'services', label: 'NEXORA SERVICES', icon: Wrench },
    { key: 'cargo', label: 'NEXORA CARGO', icon: Truck },
    { key: 'connect', label: 'NEXORA CONNECT', icon: MessageSquare },
    { key: 'community', label: 'NEXORA COMMUNITY', icon: Users },
    { key: 'search', label: 'NEXORA SEARCH', icon: Search },
    { key: 'ai', label: 'NEXORA AI', icon: Sparkles, badgeColor: 'bg-cyan-500 text-black font-extrabold' },
    {
      key: 'orders',
      label: 'NEXORA ORDERS',
      icon: ClipboardList,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    { key: 'core', label: 'NEXORA CORE', icon: User },
    {
      key: 'admin',
      label: 'NEXORA ADMIN',
      icon: ShieldAlert,
      badge: activeDisputesCount + pendingVerificationCount > 0 ? activeDisputesCount + pendingVerificationCount : undefined,
      badgeColor: 'bg-red-600 text-white font-extrabold',
    },
  ];

  const handleNavClick = (key: ModuleKey) => {
    onSelectModule(key);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-16 left-0 h-screen md:h-[calc(100vh-4rem)] w-64 bg-card border-r border-border flex flex-col justify-between p-4 z-50 md:z-10 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Module Navigation */}
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Slogan pill */}
          <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-cyan-600/10 border border-blue-500/20">
            <div className="text-[10px] uppercase font-black text-blue-600 dark:text-blue-400 tracking-wider">
              Xalqaro Platforma
            </div>
            <div className="text-[11px] font-semibold text-foreground leading-snug mt-0.5">
              One World. One Platform. Infinite Possibilities.
            </div>
          </div>

          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground px-3 mb-2">
              Platforma Modullari (10)
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                          item.badgeColor || (isActive ? 'bg-white text-blue-600' : 'bg-blue-500/10 text-blue-600')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Promos: Loyalty & Verification */}
        <div className="pt-3 border-t border-border space-y-2 shrink-0">
          <button
            onClick={() => {
              onOpenLoyaltyModal();
              onCloseMobile?.();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-700 dark:text-amber-300 transition-all text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>NEXORA REWARDS</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => {
              onOpenVerificationModal();
              onCloseMobile?.();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 text-blue-700 dark:text-blue-300 transition-all text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>KYC / KYB Tasdiqlash</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>
      </aside>
    </>
  );
}
