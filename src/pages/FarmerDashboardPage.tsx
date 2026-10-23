import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Anchor,
  Phone,
  Mail,
  Heart,
  TrendingUp,
  Coins,
  AlertTriangle,
  History,
  Edit3,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DashboardData, Species } from '../types';

interface FarmerDashboardPageProps {
  onSelectTab: (tab: string) => void;
  onOpenAdvisory: (advisory: any) => void;
  speciesList: Species[];
}

export const FarmerDashboardPage: React.FC<FarmerDashboardPageProps> = ({
  onSelectTab,
  onOpenAdvisory,
  speciesList,
}) => {
  const { user, token, favoriteSpeciesIds, toggleFavorite, updateProfile } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);

  // Edit profile form state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileMobile, setProfileMobile] = useState(user?.mobile || '');
  const [profileLocation, setProfileLocation] = useState(user?.location || '');
  const [profileFarmType, setProfileFarmType] = useState(user?.farm_type || '');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/dashboard', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data: DashboardData) => {
        setDashboardData(data);
      })
      .catch((err) => console.error('Dashboard load failed', err))
      .finally(() => setLoading(false));
  }, [token, favoriteSpeciesIds]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileMobile(user.mobile);
      setProfileLocation(user.location);
      setProfileFarmType(user.farm_type);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateProfile({
      name: profileName,
      mobile: profileMobile,
      location: profileLocation,
      farm_type: profileFarmType,
    });
    if (ok) {
      setSaveSuccess(true);
      setEditingProfile(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-cyan-300 font-bold text-xs uppercase tracking-wider bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800">
              <Sparkles className="w-3.5 h-3.5" /> Farmer Command Dashboard
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Welcome Back, {user ? user.name : 'Farmer Partner'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-sky-200">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {user ? user.location : 'Andhra Pradesh Coastal Aqua Belt'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Anchor className="w-3.5 h-3.5 text-teal-400" />
                {user ? user.farm_type : 'Shrimp Farming (Vannamei)'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Phone className="w-3.5 h-3.5" />
                {user?.mobile}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition border border-white/10"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {editingProfile ? 'Close Editor' : 'Edit Farm Profile'}
            </button>

            <button
              onClick={() => onSelectTab('seed-prices')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md"
            >
              <Coins className="w-3.5 h-3.5" />
              Order Seeds
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Farm profile details updated successfully!</span>
          </div>
        )}
      </div>

      {/* Profile Editor Modal / Drawer */}
      {editingProfile && (
        <form
          onSubmit={handleUpdateProfile}
          className="bg-white p-6 rounded-3xl border border-sky-100 shadow-md space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-600" />
              Update Farmer Profile Information
            </h3>
            <span className="text-xs text-slate-400">Settings save directly to backend</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Farmer Full Name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Contact</label>
              <input
                type="tel"
                required
                value={profileMobile}
                onChange={(e) => setProfileMobile(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Farm Location / Region</label>
              <input
                type="text"
                required
                value={profileLocation}
                onChange={(e) => setProfileLocation(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Farm Type</label>
              <select
                value={profileFarmType}
                onChange={(e) => setProfileFarmType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="Shrimp Farming (Vannamei)">Shrimp Farming (Vannamei)</option>
                <option value="Shrimp Farming (Monodon)">Shrimp Farming (Monodon)</option>
                <option value="Freshwater Major Carp (Rohu/Catla)">Freshwater Fish</option>
                <option value="Tilapia / Biofloc Intensive">Tilapia / Biofloc</option>
                <option value="Coastal Polyculture">Coastal Polyculture</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingProfile(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Saved Favorite Species Strip */}
      <section className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              Favorite Farmed Species
            </h3>
            <p className="text-xs text-slate-500">Toggle favorites to customize your market alert feeds</p>
          </div>
          <span className="text-[11px] text-slate-400">Click to pin / unpin</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {speciesList.map((spec) => {
            const isFav = favoriteSpeciesIds.includes(spec.id);
            return (
              <button
                key={spec.id}
                onClick={() => toggleFavorite(spec.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  isFav
                    ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                <span>{spec.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid: Latest Market Rates for Favorites & Today's Seed Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Rates for Farmer's Species */}
        <section className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">Rates for Your Saved Species</h3>
              </div>
              <button
                onClick={() => onSelectTab('market-rates')}
                className="text-xs text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1"
              >
                <span>Full Mandi View</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {dashboardData?.favorite_species_rates?.slice(0, 4).map((rate) => (
                <div key={rate.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">{rate.species_name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-500" />
                      {rate.market_name} • {rate.count_spec}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">₹{rate.avg_price} <span className="text-[10px] text-slate-400 font-normal">/kg</span></div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{rate.trend === 'up' ? '▲ High Demand' : '● Stable'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-100 text-[11px] text-teal-900">
            Wholesale mandis update morning auction figures by 08:30 AM daily.
          </div>
        </section>

        {/* Today's Seed Prices */}
        <section className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">Verified Hatchery Seed Arrivals</h3>
              </div>
              <button
                onClick={() => onSelectTab('seed-prices')}
                className="text-xs text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1"
              >
                <span>All Hatcheries</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {dashboardData?.today_seed_prices?.slice(0, 4).map((seed) => (
                <div key={seed.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">{seed.supplier_name}</div>
                    <div className="text-[11px] text-slate-500">{seed.species_name} • {seed.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-sky-900">₹{seed.price}</div>
                    <div className="text-[10px] text-slate-400">{seed.unit.split(' ')[0]} {seed.unit.split(' ')[1]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 text-[11px] text-sky-900 flex items-center justify-between">
            <span>All listed hatcheries are CAA registered &amp; PCR screened.</span>
            <span className="font-bold text-sky-700">100% SPF certified</span>
          </div>
        </section>
      </div>

      {/* Regional Disease Alerts & Recent Price History Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Tailored Disease Advisories */}
        <section className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Regional Disease &amp; Virus Alerts</h3>
            </div>
            <button
              onClick={() => onSelectTab('diseases')}
              className="text-xs text-rose-700 hover:text-rose-900 font-bold"
            >
              All Advisories
            </button>
          </div>

          <div className="space-y-3">
            {dashboardData?.seasonal_disease_alerts?.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onOpenAdvisory(alert)}
                className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 hover:bg-rose-50 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      {alert.risk_level} Risk Season
                    </span>
                    <span className="text-[10px] text-slate-400">Target: {alert.category}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mt-2">{alert.disease_name}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {alert.symptoms[0]}
                  </p>
                </div>
                <div className="mt-3 text-right">
                  <span className="text-xs font-bold text-rose-700 hover:underline">
                    View Biosecurity Protocol &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Price Changes Audit Log */}
        <section className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sky-800">
              <History className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Recent Price Audit Updates</h3>
            </div>
            <span className="text-xs text-slate-400">Verified by Fisheries Officers</span>
          </div>

          <div className="space-y-2.5">
            {dashboardData?.recent_price_changes?.map((hist) => (
              <div
                key={hist.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-800">{hist.species_name}</div>
                  <div className="text-[10px] text-slate-500">
                    {hist.market_or_supplier} • Updated by {hist.admin_name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sky-950">
                    ₹{hist.previous_price} &rarr; <span className="text-emerald-600">₹{hist.new_price}</span>
                  </div>
                  <div className="text-[9px] text-slate-400">{hist.update_time}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
