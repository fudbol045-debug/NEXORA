import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlatformProvider } from './context/PlatformContext';

import Header from './components/navigation/Header';
import Sidebar, { ModuleKey } from './components/navigation/Sidebar';

import { MarketModule } from './components/modules/MarketModule';
import { ServicesModule } from './components/modules/ServicesModule';
import { CargoModule } from './components/modules/CargoModule';
import { ConnectModule } from './components/modules/ConnectModule';
import { CommunityModule } from './components/modules/CommunityModule';
import SearchModule from './components/modules/SearchModule';
import AIModule from './components/modules/AIModule';
import { OrdersModule } from './components/modules/OrdersModule';
import { CoreProfileModule } from './components/modules/CoreProfileModule';
import { AdminModule } from './components/modules/AdminModule';

import { LoyaltyRewardsModal } from './components/modals/LoyaltyRewardsModal';
import { VerificationModal } from './components/modals/VerificationModal';

function AppContent() {
  const { currentLanguage, isRtl } = useLanguage();
  const { currentUser } = useAuth();

  const [activeModule, setActiveModule] = useState<ModuleKey>('market');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [chatTargetUserId, setChatTargetUserId] = useState<string | undefined>(undefined);

  const handleNavigateToModule = (module: string) => {
    if (
      [
        'core',
        'market',
        'services',
        'cargo',
        'connect',
        'community',
        'search',
        'ai',
        'orders',
        'admin',
      ].includes(module)
    ) {
      setActiveModule(module as ModuleKey);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenChatWith = (userId: string) => {
    setChatTargetUserId(userId);
    setActiveModule('connect');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200"
    >
      {/* Top Header */}
      <Header
        onOpenLoyaltyModal={() => setIsLoyaltyModalOpen(true)}
        onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
        onNavigateToModule={handleNavigateToModule}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          onOpenLoyaltyModal={() => setIsLoyaltyModalOpen(true)}
          onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Module Canvas */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {activeModule === 'market' && (
            <MarketModule
              onOpenConnect={(sellerId) => handleOpenChatWith(sellerId)}
              onOrderCreated={() => setActiveModule('orders')}
            />
          )}

          {activeModule === 'services' && (
            <ServicesModule
              onOpenConnect={(providerId) => handleOpenChatWith(providerId)}
              onOrderCreated={() => setActiveModule('orders')}
            />
          )}

          {activeModule === 'cargo' && (
            <CargoModule
              onOpenConnect={(carrierId) => handleOpenChatWith(carrierId)}
              onOrderCreated={() => setActiveModule('orders')}
            />
          )}

          {activeModule === 'connect' && (
            <ConnectModule initialChatUserId={chatTargetUserId} />
          )}

          {activeModule === 'community' && <CommunityModule />}

          {activeModule === 'search' && (
            <SearchModule
              onNavigateToModule={handleNavigateToModule}
              onOpenChatWith={handleOpenChatWith}
            />
          )}

          {activeModule === 'ai' && <AIModule />}

          {activeModule === 'orders' && <OrdersModule />}

          {activeModule === 'core' && <CoreProfileModule />}

          {activeModule === 'admin' && <AdminModule />}
        </main>
      </div>

      {/* Global Modals */}
      <LoyaltyRewardsModal
        isOpen={isLoyaltyModalOpen}
        onClose={() => setIsLoyaltyModalOpen(false)}
        onNavigateToShop={() => {
          setIsLoyaltyModalOpen(false);
          setActiveModule('market');
        }}
      />

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <PlatformProvider>
            <AppContent />
          </PlatformProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
