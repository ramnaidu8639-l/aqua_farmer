import React, { useState } from 'react';
import {
  Waves,
  Coins,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  Calculator,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { SeedPrice, MarketRate, DiseaseAdvisory } from '../types';

interface HomePageProps {
  onSelectTab: (tab: string) => void;
  onOpenAdvisory: (advisory: DiseaseAdvisory) => void;
  onOpenPythonDocs: () => void;
  seedPrices: SeedPrice[];
  marketRates: MarketRate[];
  advisories: DiseaseAdvisory[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTab,
  onOpenAdvisory,
  onOpenPythonDocs,
  seedPrices,
  marketRates,
  advisories,
}) => {
  // Mini pond stocking calculator state
  const [pondAcres, setPondAcres] = useState<number>(2.5);
  const [stockingDensity, setStockingDensity] = useState<number>(40); // 40 PL/m2
  const [selectedSeedRate, setSelectedSeedRate] = useState<number>(360); // ₹360 per 1000 PL

  // 1 acre = ~4046.86 m2
  const totalM2 = pondAcres * 4046.86;
  const totalSeedsNeeded = Math.round(totalM2 * stockingDensity);
  const estimatedSeedCost = Math.round((totalSeedsNeeded / 1000) * selectedSeedRate);

  const topAdvisory = advisories.find((a) => a.risk_level === 'High') || advisories[0];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-sky-950 to-teal-950 text-white shadow-2xl border border-sky-900/50 p-6 sm:p-12">
        {/* Subtle background ripples */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Verified Aquaculture Intelligence • Harvest Season 2026
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Transparent Market Rates &amp; <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-200 bg-clip-text text-transparent">
              Verified Hatchery Seed Prices
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Aqua Farmers connects coastal and inland farmers to verified daily mandi auction arrivals, CAA-certified hatchery post-larvae rates, and seasonal scientific disease advisories.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab('market-rates')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-400/25"
            >
              <TrendingUp className="w-4 h-4" />
              Check Today's Mandi Rates
            </button>

            <button
              onClick={() => onSelectTab('seed-prices')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition"
            >
              <Coins className="w-4 h-4 text-cyan-400" />
              Browse Hatcheries &amp; Seeds
            </button>

            <button
              onClick={onOpenPythonDocs}
              className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 font-bold text-xs border border-cyan-800/40 transition"
            >
              <ExternalLink className="w-4 h-4" />
              Python &amp; MySQL Code
            </button>
          </div>
        </div>

        {/* Live Ticker Bar */}
        <div className="relative z-10 mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-[11px] text-slate-400">Vannamei (30 Count)</div>
            <div className="text-xl sm:text-2xl font-black text-cyan-300">₹378 <span className="text-xs font-normal text-slate-400">/kg</span></div>
            <div className="text-[10px] text-emerald-400 font-semibold">▲ +3.5% Bhimavaram</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Black Tiger (20 Count)</div>
            <div className="text-xl sm:text-2xl font-black text-teal-300">₹710 <span className="text-xs font-normal text-slate-400">/kg</span></div>
            <div className="text-[10px] text-emerald-400 font-semibold">▲ +5.2% Nellore</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Rohu Table Fish</div>
            <div className="text-xl sm:text-2xl font-black text-sky-200">₹145 <span className="text-xs font-normal text-slate-400">/kg</span></div>
            <div className="text-[10px] text-slate-300 font-semibold">● Stable Vijayawada</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">SPF Vannamei PL-10</div>
            <div className="text-xl sm:text-2xl font-black text-amber-300">₹360 <span className="text-xs font-normal text-slate-400">/1k PL</span></div>
            <div className="text-[10px] text-cyan-400 font-semibold">Verified CAA Hatcheries</div>
          </div>
        </div>
      </section>

      {/* High-Risk Seasonal Disease Alert Banner */}
      {topAdvisory && (
        <section className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-rose-200 rounded-3xl p-6 sm:p-7 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-rose-500 text-white shrink-0 shadow-md shadow-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-600 text-white">
                    Seasonal Alert: {topAdvisory.seasonal_risk_period}
                  </span>
                  <span className="text-[11px] font-medium text-slate-600">
                    Educational Biosecurity Advisory
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{topAdvisory.disease_name}</h3>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Sudden temperature drops increase mortality vulnerability in {topAdvisory.affected_species}. Ensure dissolved oxygen &gt; 4.5 ppm and check check-trays before feed application.
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenAdvisory(topAdvisory)}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>View Biosecurity Protocol</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </section>
      )}

      {/* Main Feature Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Seed Prices */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Verified Hatchery Seed Prices</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Explore certified SPF vannamei, monodon tiger, and major carp seed rates across Andhra, Tamil Nadu, Gujarat, and Odisha.
            </p>
            <div className="mt-4 space-y-2">
              {seedPrices.slice(0, 2).map((sp) => (
                <div key={sp.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-800">{sp.supplier_name}</div>
                    <div className="text-[10px] text-slate-400">{sp.location}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sky-800">₹{sp.price}</span>
                    <div className="text-[9px] text-slate-400">{sp.unit.split(' ')[0]} {sp.unit.split(' ')[1]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => onSelectTab('seed-prices')}
            className="mt-6 w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>Search All Seed Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Market Rates & Charts */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Mandi Rate Intelligence</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Wholesale farmgate auction quotes updated daily with minimum, maximum, and average rates and Chart.js historical curves.
            </p>
            <div className="mt-4 space-y-2">
              {marketRates.slice(0, 2).map((mr) => (
                <div key={mr.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-800">{mr.market_name}</div>
                    <div className="text-[10px] text-slate-400">{mr.count_spec}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-teal-800">₹{mr.avg_price} /kg</span>
                    <div className="text-[9px] text-emerald-600 font-semibold">{mr.trend === 'up' ? '▲ Rising' : '● Stable'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => onSelectTab('market-rates')}
            className="mt-6 w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>Open Interactive Rate Chart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Seasonal Disease Advisories */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Seasonal Biosecurity &amp; Viruses</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Curated biological advisories for WSSV, EHP, EMS, and Columnaris with verified prevention steps and accredited lab guidance.
            </p>
            <div className="mt-4 space-y-2">
              {advisories.slice(0, 2).map((ad) => (
                <div key={ad.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-800">{ad.disease_name}</div>
                    <div className="text-[10px] text-slate-400">{ad.seasonal_risk_period}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ad.risk_level === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                    {ad.risk_level}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => onSelectTab('diseases')}
            className="mt-6 w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>View All Disease Advisories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Farmer Tool: Pond Seed & Stocking Calculator */}
      <section className="bg-gradient-to-br from-sky-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-cyan-300 font-bold text-xs uppercase tracking-wider bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800">
              <Calculator className="w-3.5 h-3.5" /> Farmer Calculation Tool
            </div>
            <h3 className="text-2xl font-bold">Pond Seed Requirement &amp; Budget Estimator</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculate the exact post-larvae (PL) count and estimated hatchery seed expenditure for your farm acreage based on targeted stocking densities.
            </p>
          </div>

          {/* Calculator Inputs & Result */}
          <div className="w-full lg:w-auto bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
            <div className="grid grid-cols-3 gap-4 w-full sm:w-auto">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Water Area</label>
                <div className="flex items-center gap-1 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
                  <input
                    type="number"
                    step="0.5"
                    value={pondAcres}
                    onChange={(e) => setPondAcres(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    className="w-16 bg-transparent text-sm font-bold text-cyan-300 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Acres</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Density</label>
                <div className="flex items-center gap-1 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
                  <input
                    type="number"
                    value={stockingDensity}
                    onChange={(e) => setStockingDensity(Math.max(5, parseInt(e.target.value, 10) || 0))}
                    className="w-14 bg-transparent text-sm font-bold text-teal-300 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">PL/m²</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Hatchery Rate</label>
                <div className="flex items-center gap-1 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400">₹</span>
                  <input
                    type="number"
                    value={selectedSeedRate}
                    onChange={(e) => setSelectedSeedRate(Math.max(50, parseInt(e.target.value, 10) || 0))}
                    className="w-14 bg-transparent text-sm font-bold text-amber-300 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">/1k</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto pl-0 sm:pl-6 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-800 text-center sm:text-left">
              <div className="text-[11px] text-slate-400">Total Seed Count</div>
              <div className="text-xl font-black text-cyan-300">{totalSeedsNeeded.toLocaleString()} PL</div>
              <div className="text-[11px] text-slate-400 mt-1">Est. Seed Budget</div>
              <div className="text-lg font-bold text-emerald-400">₹{estimatedSeedCost.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Biosecurity Golden Rules Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Aquaculture Biosecurity Standards</h3>
            <p className="text-xs text-slate-500">Official protocol recommendations for disease prevention</p>
          </div>
          <button
            onClick={() => onSelectTab('diseases')}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
          >
            <span>All Advisories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900">PCR Screening Before Stocking</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Always test post-larvae samples for WSSV, EHP, and IMNV at authorized CAA diagnostic labs prior to packing.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900">Reservoir Water Aging &amp; Chlorination</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Disinfect intake tidal water with 30 ppm active chlorine and age for 4 days before pumping into culture ponds.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900">Winter Aeration &amp; Feed Discipline</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maintain minimum 1.2m water column to avoid diurnal temperature swings. Cut feed rations when temperature falls below 26°C.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
