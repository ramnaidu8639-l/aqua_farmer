import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Search,
  Filter,
  Thermometer,
  Stethoscope,
  Info,
  Calendar,
  BookOpen,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { DiseaseAdvisory } from '../types';
import { useAuth } from '../context/AuthContext';

interface DiseasesPageProps {
  advisories: DiseaseAdvisory[];
  onOpenAdvisory: (advisory: DiseaseAdvisory) => void;
  onOpenAdminModal?: (type: 'disease_advisory', item?: any) => void;
}

export const DiseasesPage: React.FC<DiseasesPageProps> = ({
  advisories,
  onOpenAdvisory,
  onOpenAdminModal,
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'shrimp' | 'fish'>('all');
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredAdvisories = advisories.filter((ad) => {
    const matchesCategory =
      categoryFilter === 'all' ||
      ad.category === categoryFilter ||
      ad.category === 'both';

    const matchesSeason =
      seasonFilter === 'all' ||
      ad.seasonal_risk_period.toLowerCase().includes(seasonFilter.toLowerCase());

    const matchesRisk =
      riskFilter === 'all' || ad.risk_level.toLowerCase() === riskFilter.toLowerCase();

    const matchesSearch =
      searchTerm === '' ||
      ad.disease_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.affected_species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.symptoms.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSeason && matchesRisk && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-950 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-rose-300 font-bold text-xs uppercase tracking-wider bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Biosecurity &amp; Pathology Advisory
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Seasonal Diseases &amp; Virus Directory</h2>
          <p className="text-xs sm:text-sm text-sky-200 mt-1 max-w-2xl">
            Scientific advisory bulletins compiled from national aquaculture research institutions to guide preventative bio-management and early symptom identification.
          </p>
        </div>

        {user?.role === 'admin' && onOpenAdminModal && (
          <button
            onClick={() => onOpenAdminModal('disease_advisory')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Publish Advisory
          </button>
        )}
      </div>

      {/* Prominent Educational vs Outbreak Disclaimer (Prompt Requirement) */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-950 flex flex-col sm:flex-row items-start gap-4">
        <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-sm">
          <Stethoscope className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-sm text-amber-900 uppercase tracking-wide">
              Official Diagnostic Notice &amp; Consultation Policy
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              Verified Educational Standard
            </span>
          </div>
          <p className="leading-relaxed text-amber-900/90">
            <strong>Clear Distinction:</strong> The advisories published here represent <em>general seasonal educational guidelines</em> based on historical meteorological and biological patterns. Aqua Farmers <strong>does not declare localized disease outbreaks</strong> without verified PCR laboratory confirmation issued by certified government fisheries laboratories.
          </p>
          <p className="font-semibold text-amber-950">
            Farmers observing acute mortalities or unusual physical signs must consult a licensed aquatic animal health professional or contact their local district fisheries diagnostic center before administering any chemical compounds or emergency draining.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search virus, symptom, species..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
            />
          </div>

          {/* Category Tabs */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium text-slate-700"
            >
              <option value="all">All Species (Shrimp &amp; Fish)</option>
              <option value="shrimp">Shrimp Diseases Only</option>
              <option value="fish">Farmed Fish Diseases Only</option>
            </select>
          </div>

          {/* Season Filter */}
          <div>
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium text-slate-700"
            >
              <option value="all">All Seasons</option>
              <option value="Winter">Winter (Temperature Drop)</option>
              <option value="Monsoon">Monsoon (Salinity Fluctuation)</option>
              <option value="Summer">Summer (High Heat &amp; Vibrio)</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium text-slate-700"
            >
              <option value="all">All Risk Levels</option>
              <option value="High">High Risk Level</option>
              <option value="Moderate">Moderate Risk Level</option>
              <option value="Seasonal Watch">Seasonal Watch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advisory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAdvisories.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
            <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800">No disease advisories match your filters</h4>
            <p className="text-xs text-slate-400 mt-1">Try resetting the species or season selection.</p>
          </div>
        ) : (
          filteredAdvisories.map((ad) => (
            <div
              key={ad.id}
              className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header Badge Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        ad.risk_level === 'High'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : ad.risk_level === 'Moderate'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {ad.risk_level} Risk
                    </span>

                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                      {ad.category}
                    </span>
                  </div>

                  {ad.is_outbreak ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                      Confirmed Outbreak
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      Educational Advisory
                    </span>
                  )}
                </div>

                {/* Disease Name & Host */}
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{ad.disease_name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Target Hosts: <span className="font-medium text-slate-700">{ad.affected_species}</span>
                </p>

                {/* Seasonal Trigger */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs">
                  <Thermometer className="w-4 h-4 text-sky-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">Peak Risk: </span>
                    <span className="text-slate-600">{ad.seasonal_risk_period}</span>
                  </div>
                </div>

                {/* Primary Visible Symptoms */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Key Clinical Signs:
                  </h4>
                  <ul className="space-y-1.5">
                    {ad.symptoms.slice(0, 3).map((symptom, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                  {ad.symptoms.length > 3 && (
                    <span className="text-[11px] text-sky-700 font-semibold mt-1 block">
                      +{ad.symptoms.length - 3} more symptoms in detailed advisory
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Published: {ad.publication_date}
                </div>

                <button
                  onClick={() => onOpenAdvisory(ad)}
                  className="px-4 py-2 rounded-xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                >
                  <span>Full Advisory</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
