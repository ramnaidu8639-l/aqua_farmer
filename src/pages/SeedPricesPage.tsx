import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Coins,
  ChevronDown,
  RefreshCw,
  PlusCircle,
  Tag,
} from 'lucide-react';
import { SeedPrice, Species } from '../types';
import { useAuth } from '../context/AuthContext';

interface SeedPricesPageProps {
  seedPrices: SeedPrice[];
  speciesList: Species[];
  loading: boolean;
  onRefresh: () => void;
  onOpenAdminModal?: (type: 'seed_price', item?: any) => void;
}

export const SeedPricesPage: React.FC<SeedPricesPageProps> = ({
  seedPrices,
  speciesList,
  loading,
  onRefresh,
  onOpenAdminModal,
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  // Extract unique locations from seed prices
  const uniqueLocations = Array.from(
    new Set(seedPrices.map((sp) => sp.location.split(',')[1]?.trim() || sp.location))
  ).filter(Boolean);

  // Filter logic
  const filteredSeeds = seedPrices.filter((sp) => {
    const matchesSearch =
      searchTerm === '' ||
      sp.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sp.species_name && sp.species_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecies =
      selectedSpeciesId === 'all' || sp.species_id === parseInt(selectedSpeciesId, 10);

    const matchesLocation =
      selectedLocation === 'all' ||
      sp.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesAvailability =
      selectedAvailability === 'all' || sp.availability === selectedAvailability;

    const matchesPrice = sp.price <= maxPrice;

    return (
      matchesSearch &&
      matchesSpecies &&
      matchesLocation &&
      matchesAvailability &&
      matchesPrice
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-teal-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-cyan-300 font-bold text-xs uppercase tracking-wider bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 mb-2">
            <Coins className="w-3.5 h-3.5" /> Hatchery Directory &amp; Price Verification
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Hatchery Seed Prices</h2>
          <p className="text-xs sm:text-sm text-sky-200 mt-1 max-w-2xl">
            Verified post-larvae (PL) and fingerling pricing from CAA-approved marine hatcheries and state seed multiplication farms.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {user?.role === 'admin' && onOpenAdminModal && (
            <button
              onClick={() => onOpenAdminModal('seed_price')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              Add Seed Listing
            </button>
          )}

          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition shrink-0"
            title="Refresh prices"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search supplier, species, city..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
            />
          </div>

          {/* Species Filter */}
          <div>
            <select
              value={selectedSpeciesId}
              onChange={(e) => setSelectedSpeciesId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium text-slate-700"
            >
              <option value="all">All Species (Shrimp &amp; Fish)</option>
              {speciesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium text-slate-700"
            >
              <option value="all">All Hatchery Regions</option>
              {uniqueLocations.map((loc, i) => (
                <option key={i} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium text-slate-700"
            >
              <option value="all">Any Availability</option>
              <option value="In Stock">In Stock Only</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Pre-booking Only">Pre-booking Only</option>
            </select>
          </div>
        </div>

        {/* Max Price Slider & Quick Tags */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Max Price: ₹{maxPrice}</span>
            <input
              type="range"
              min="150"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-32 accent-sky-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Quick Filters:</span>
            <button
              onClick={() => {
                setSelectedSpeciesId('1');
                setSelectedAvailability('all');
              }}
              className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 font-medium transition"
            >
              Vannamei PL
            </button>
            <button
              onClick={() => {
                setSelectedSpeciesId('3');
                setSelectedAvailability('all');
              }}
              className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 font-medium transition"
            >
              Rohu Seeds
            </button>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpeciesId('all');
                setSelectedLocation('all');
                setSelectedAvailability('all');
                setMaxPrice(2000);
              }}
              className="text-slate-400 hover:text-slate-700 underline"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Seed Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSeeds.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
            <Coins className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800">No seed listings match your filters</h4>
            <p className="text-xs text-slate-400 mt-1">Try resetting your filters or widening your price limit.</p>
          </div>
        ) : (
          filteredSeeds.map((sp) => (
            <div
              key={sp.id}
              className="bg-white rounded-2xl border border-sky-100 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                    {sp.species_name || 'Shrimp PL'}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sp.availability === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : sp.availability === 'Low Stock'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {sp.availability}
                  </span>
                </div>

                {/* Supplier Name */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">{sp.supplier_name}</h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>{sp.location}</span>
                </div>

                {/* Price Display */}
                <div className="mt-4 p-3 bg-gradient-to-r from-sky-50 to-teal-50/50 rounded-xl border border-sky-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-sky-950">₹{sp.price}</span>
                    <span className="text-xs text-slate-500 ml-1 font-medium">{sp.unit}</span>
                  </div>
                  {sp.pcr_certified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> PCR SPF
                    </span>
                  )}
                </div>

                {/* Notes */}
                {sp.notes && (
                  <p className="text-[11px] text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                    {sp.notes}
                  </p>
                )}
              </div>

              {/* Contact Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <a
                    href={`tel:${sp.contact_number}`}
                    className="inline-flex items-center gap-1.5 text-sky-800 hover:text-sky-900 font-bold"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>{sp.contact_number}</span>
                  </a>

                  {sp.contact_email && (
                    <a
                      href={`mailto:${sp.contact_email}`}
                      className="text-slate-400 hover:text-slate-700"
                      title={sp.contact_email}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Updated: {sp.last_updated}
                  </span>
                  {user?.role === 'admin' && onOpenAdminModal && (
                    <button
                      onClick={() => onOpenAdminModal('seed_price', sp)}
                      className="text-sky-700 hover:underline font-semibold"
                    >
                      Edit Listing
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
