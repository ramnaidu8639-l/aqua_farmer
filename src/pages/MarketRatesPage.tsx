import React, { useState } from 'react';
import {
  TrendingUp,
  MapPin,
  Calendar,
  Search,
  Filter,
  PlusCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { MarketRate, Species } from '../types';
import { PriceChart } from '../components/PriceChart';
import { useAuth } from '../context/AuthContext';

interface MarketRatesPageProps {
  marketRates: MarketRate[];
  speciesList: Species[];
  loading: boolean;
  onRefresh: () => void;
  onOpenAdminModal?: (type: 'market_rate', item?: any) => void;
}

export const MarketRatesPage: React.FC<MarketRatesPageProps> = ({
  marketRates,
  speciesList,
  loading,
  onRefresh,
  onOpenAdminModal,
}) => {
  const { user } = useAuth();
  const [selectedChartSpeciesId, setSelectedChartSpeciesId] = useState<number>(1);
  const [filterSpecies, setFilterSpecies] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const selectedSpeciesObj =
    speciesList.find((s) => s.id === selectedChartSpeciesId) || speciesList[0];

  const uniqueLocations = Array.from(new Set(marketRates.map((mr) => mr.location)));

  const filteredRates = marketRates.filter((mr) => {
    const matchesSpecies =
      filterSpecies === 'all' || mr.species_id === parseInt(filterSpecies, 10);
    const matchesLocation =
      filterLocation === 'all' || mr.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesSearch =
      searchTerm === '' ||
      mr.market_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mr.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mr.species_name && mr.species_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mr.count_spec.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSpecies && matchesLocation && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-sky-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-teal-300 font-bold text-xs uppercase tracking-wider bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800 mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Official Wholesale Mandi Benchmarks
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Daily Aquaculture Market Rates</h2>
          <p className="text-xs sm:text-sm text-sky-200 mt-1 max-w-2xl">
            Farmgate auction quotes recorded across coastal mandis with minimum, maximum, and average rates per kilogram.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {user?.role === 'admin' && onOpenAdminModal && (
            <button
              onClick={() => onOpenAdminModal('market_rate')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              Add Mandi Quote
            </button>
          )}

          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition shrink-0"
            title="Refresh market rates"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Verified Price Origin Advisory Callout */}
      <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-3 text-sky-900 text-xs">
        <ShieldAlert className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Verified Price Transparency:</strong> Mandi prices displayed below are compiled directly from physical auction arrival slips entered by designated Regional Aquaculture Extension Administrators. In accordance with platform standards, simulated live pricing is prohibited.
        </div>
      </div>

      {/* Interactive Chart.js Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Historical Price Trend Analysis</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Select Commodity:</span>
            <select
              value={selectedChartSpeciesId}
              onChange={(e) => setSelectedChartSpeciesId(parseInt(e.target.value, 10))}
              className="text-xs p-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {speciesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <PriceChart
          speciesId={selectedChartSpeciesId}
          speciesName={selectedSpeciesObj?.name || 'Vannamei'}
        />
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search mandi, location, or count..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
            />
          </div>

          <div>
            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 font-medium text-slate-700"
            >
              <option value="all">All Species</option>
              {speciesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 font-medium text-slate-700"
            >
              <option value="all">All Mandi Locations</option>
              {uniqueLocations.map((loc, i) => (
                <option key={i} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Responsive Market Rate Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Commodity / Species</th>
                <th className="py-3.5 px-4">Mandi &amp; Location</th>
                <th className="py-3.5 px-4">Count / Size</th>
                <th className="py-3.5 px-4 text-right">Min Price</th>
                <th className="py-3.5 px-4 text-right">Max Price</th>
                <th className="py-3.5 px-4 text-right">Avg Rate (₹/kg)</th>
                <th className="py-3.5 px-4 text-center">Trend</th>
                <th className="py-3.5 px-4">Recorded</th>
                {user?.role === 'admin' && <th className="py-3.5 px-4 text-right">Admin Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRates.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 9 : 8} className="py-8 text-center text-slate-400">
                    No market quotes match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredRates.map((mr) => (
                  <tr key={mr.id} className="hover:bg-sky-50/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{mr.species_name}</div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {mr.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{mr.market_name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-sky-500" />
                        {mr.location}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
                        {mr.count_spec}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-medium text-slate-600">
                      ₹{mr.min_price}
                    </td>

                    <td className="py-3 px-4 text-right font-medium text-slate-600">
                      ₹{mr.max_price}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-black text-sky-950">₹{mr.avg_price}</span>
                      <span className="text-[10px] text-slate-400 block font-normal">/{mr.unit}</span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {mr.trend === 'up' ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ArrowUpRight className="w-3 h-3" /> +{mr.change_percent}%
                        </span>
                      ) : mr.trend === 'down' ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <ArrowDownRight className="w-3 h-3" /> {mr.change_percent}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          <Minus className="w-3 h-3" /> Stable
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-[11px] font-medium text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {mr.recorded_date}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <UserCheck className="w-2.5 h-2.5 text-teal-600" />
                        {mr.updated_by_admin}
                      </div>
                    </td>

                    {user?.role === 'admin' && onOpenAdminModal && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onOpenAdminModal('market_rate', mr)}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 hover:bg-sky-100 font-semibold text-[11px] transition"
                        >
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
