import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { SeedPricesPage } from './pages/SeedPricesPage';
import { MarketRatesPage } from './pages/MarketRatesPage';
import { DiseasesPage } from './pages/DiseasesPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DiseaseAdvisoryModal } from './components/DiseaseAdvisoryModal';
import { PythonProjectModal } from './components/PythonProjectModal';
import { AuthModal } from './components/AuthModal';
import { AdminModal } from './components/AdminModal';
import { Species, SeedPrice, MarketRate, DiseaseAdvisory } from './types';

function MainApp() {
  const { user, token } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [seedPrices, setSeedPrices] = useState<SeedPrice[]>([]);
  const [marketRates, setMarketRates] = useState<MarketRate[]>([]);
  const [advisories, setAdvisories] = useState<DiseaseAdvisory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [selectedAdvisory, setSelectedAdvisory] = useState<DiseaseAdvisory | null>(null);
  const [pythonModalOpen, setPythonModalOpen] = useState<boolean>(false);
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });
  const [adminModalState, setAdminModalState] = useState<{
    isOpen: boolean;
    type: 'seed_price' | 'market_rate' | 'disease_advisory';
    item?: any;
  }>({
    isOpen: false,
    type: 'seed_price',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [specRes, seedsRes, ratesRes, advRes] = await Promise.all([
        fetch('/api/species'),
        fetch('/api/seed-prices'),
        fetch('/api/market-rates'),
        fetch('/api/disease-advisories'),
      ]);

      if (specRes.ok) setSpeciesList(await specRes.json());
      if (seedsRes.ok) setSeedPrices(await seedsRes.json());
      if (ratesRes.ok) setMarketRates(await ratesRes.json());
      if (advRes.ok) setAdvisories(await advRes.json());
    } catch (err) {
      console.error('Failed to load application data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdminModal = (
    type: 'seed_price' | 'market_rate' | 'disease_advisory',
    item?: any
  ) => {
    setAdminModalState({ isOpen: true, type, item });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenPythonDocs={() => setPythonModalOpen(true)}
        onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode })}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {currentTab === 'home' && (
          <HomePage
            onSelectTab={setCurrentTab}
            onOpenAdvisory={setSelectedAdvisory}
            onOpenPythonDocs={() => setPythonModalOpen(true)}
            seedPrices={seedPrices}
            marketRates={marketRates}
            advisories={advisories}
          />
        )}

        {currentTab === 'seed-prices' && (
          <SeedPricesPage
            seedPrices={seedPrices}
            speciesList={speciesList}
            loading={loading}
            onRefresh={loadData}
            onOpenAdminModal={handleOpenAdminModal}
          />
        )}

        {currentTab === 'market-rates' && (
          <MarketRatesPage
            marketRates={marketRates}
            speciesList={speciesList}
            loading={loading}
            onRefresh={loadData}
            onOpenAdminModal={handleOpenAdminModal}
          />
        )}

        {currentTab === 'diseases' && (
          <DiseasesPage
            advisories={advisories}
            onOpenAdvisory={setSelectedAdvisory}
            onOpenAdminModal={handleOpenAdminModal}
          />
        )}

        {currentTab === 'dashboard' && (
          <FarmerDashboardPage
            onSelectTab={setCurrentTab}
            onOpenAdvisory={setSelectedAdvisory}
            speciesList={speciesList}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardPage
            seedPrices={seedPrices}
            marketRates={marketRates}
            advisories={advisories}
            speciesList={speciesList}
            onRefresh={loadData}
            onOpenAdminModal={handleOpenAdminModal}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={setCurrentTab}
        onOpenPythonDocs={() => setPythonModalOpen(true)}
      />

      {/* Modals */}
      <DiseaseAdvisoryModal
        advisory={selectedAdvisory}
        onClose={() => setSelectedAdvisory(null)}
      />

      <PythonProjectModal
        isOpen={pythonModalOpen}
        onClose={() => setPythonModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
      />

      <AdminModal
        isOpen={adminModalState.isOpen}
        type={adminModalState.type}
        item={adminModalState.item}
        speciesList={speciesList}
        token={token}
        onClose={() => setAdminModalState({ ...adminModalState, isOpen: false })}
        onSuccess={loadData}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
