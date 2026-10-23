import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Coins,
  TrendingUp,
  AlertTriangle,
  Users,
  History,
  PlusCircle,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SeedPrice, MarketRate, DiseaseAdvisory, Species, PriceHistoryRecord, AdminStats } from '../types';

interface AdminDashboardPageProps {
  seedPrices: SeedPrice[];
  marketRates: MarketRate[];
  advisories: DiseaseAdvisory[];
  speciesList: Species[];
  onRefresh: () => void;
  onOpenAdminModal: (type: 'seed_price' | 'market_rate' | 'disease_advisory', item?: any) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  seedPrices,
  marketRates,
  advisories,
  speciesList,
  onRefresh,
  onOpenAdminModal,
}) => {
  const { user, token, switchDemoPersona } = useAuth();
  const [activeTab, setActiveTab] = useState<'seeds' | 'rates' | 'advisories' | 'audit' | 'farmers'>('seeds');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryRecord[]>([]);
  const [registeredFarmers, setRegisteredFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin && token) {
      loadAdminData();
    }
  }, [isAdmin, token]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, histRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/price-history', { headers }),
        fetch('/api/admin/users', { headers }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (histRes.ok) setPriceHistory(await histRes.json());
      if (usersRes.ok) setRegisteredFarmers(await usersRes.json());
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSeed = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this seed listing?')) return;
    try {
      const res = await fetch(`/api/admin/seed-prices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setStatusMsg('Seed listing deleted successfully');
        onRefresh();
        loadAdminData();
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch {
      alert('Delete failed');
    }
  };

  const handleDeleteRate = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this market rate?')) return;
    try {
      const res = await fetch(`/api/admin/market-rates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setStatusMsg('Market rate deleted successfully');
        onRefresh();
        loadAdminData();
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch {
      alert('Delete failed');
    }
  };

  const handleDeleteAdvisory = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this advisory?')) return;
    try {
      const res = await fetch(`/api/admin/disease-advisories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setStatusMsg('Advisory deleted successfully');
        onRefresh();
        loadAdminData();
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch {
      alert('Delete failed');
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-sm space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Administrator Authorization Required</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          The Aqua Farmers administrative portal is restricted to authorized Fisheries Extension officers.
          You can instantly switch to the Administrator evaluation persona below.
        </p>
        <button
          onClick={() => switchDemoPersona('admin_rao')}
          className="px-6 py-3 rounded-xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
        >
          Switch to Admin Persona (Dr. K.V. Rao)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wider bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800 mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Administrator Operations Center
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Aqua Farmers Admin Portal</h2>
          <p className="text-xs sm:text-sm text-sky-200 mt-1">
            Logged in as <strong>{user?.name}</strong> • Role-based authorization active
          </p>
        </div>

        <button
          onClick={() => {
            onRefresh();
            loadAdminData();
          }}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition self-end sm:self-auto"
          title="Refresh database records"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Website Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Farmers</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats?.total_farmers || 2}</div>
          <div className="text-[10px] text-teal-600 font-semibold mt-1">Active Accounts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hatchery Listings</div>
          <div className="text-2xl font-black text-sky-900 mt-1">{seedPrices.length}</div>
          <div className="text-[10px] text-sky-600 font-semibold mt-1">CAA Verified</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Market Mandi Quotes</div>
          <div className="text-2xl font-black text-teal-900 mt-1">{marketRates.length}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">Verified Farmgate</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Advisories</div>
          <div className="text-2xl font-black text-amber-900 mt-1">{advisories.length}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-1">Educational Bulletins</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('seeds')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'seeds' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          Manage Seed Prices ({seedPrices.length})
        </button>

        <button
          onClick={() => setActiveTab('rates')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'rates' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Manage Market Rates ({marketRates.length})
        </button>

        <button
          onClick={() => setActiveTab('advisories')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'advisories' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Publish Advisories ({advisories.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'audit' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Price Audit History ({priceHistory.length})
        </button>

        <button
          onClick={() => setActiveTab('farmers')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'farmers' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Registered Farmers ({registeredFarmers.length})
        </button>
      </div>

      {/* TAB 1: SEED PRICES MANAGEMENT */}
      {activeTab === 'seeds' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Hatchery Seed Inventory &amp; Pricing</h3>
            <button
              onClick={() => onOpenAdminModal('seed_price')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Hatchery Seed Record
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Supplier / Hatchery</th>
                  <th className="py-3 px-4">Species</th>
                  <th className="py-3 px-4">Price / Unit</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {seedPrices.map((sp) => (
                  <tr key={sp.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{sp.supplier_name}</td>
                    <td className="py-3 px-4">{sp.species_name}</td>
                    <td className="py-3 px-4 font-bold text-sky-900">
                      ₹{sp.price} <span className="text-[10px] text-slate-400 font-normal">({sp.unit})</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {sp.availability}
                      </span>
                    </td>
                    <td className="py-3 px-4">{sp.location}</td>
                    <td className="py-3 px-4 text-slate-400">{sp.last_updated}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => onOpenAdminModal('seed_price', sp)}
                        className="p-1 rounded text-sky-700 hover:bg-sky-50"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSeed(sp.id)}
                        className="p-1 rounded text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MARKET RATES MANAGEMENT */}
      {activeTab === 'rates' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Wholesale Mandi Auction Benchmarks</h3>
            <button
              onClick={() => onOpenAdminModal('market_rate')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Mandi Quote
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Commodity</th>
                  <th className="py-3 px-4">Mandi &amp; Location</th>
                  <th className="py-3 px-4">Count / Specification</th>
                  <th className="py-3 px-4">Min - Max Price</th>
                  <th className="py-3 px-4">Avg Price</th>
                  <th className="py-3 px-4">Updated By</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marketRates.map((mr) => (
                  <tr key={mr.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{mr.species_name}</td>
                    <td className="py-3 px-4">{mr.market_name} ({mr.location})</td>
                    <td className="py-3 px-4 font-medium">{mr.count_spec}</td>
                    <td className="py-3 px-4">₹{mr.min_price} - ₹{mr.max_price}</td>
                    <td className="py-3 px-4 font-black text-teal-900">₹{mr.avg_price} /kg</td>
                    <td className="py-3 px-4 text-slate-400">{mr.updated_by_admin}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => onOpenAdminModal('market_rate', mr)}
                        className="p-1 rounded text-sky-700 hover:bg-sky-50"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRate(mr.id)}
                        className="p-1 rounded text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DISEASE ADVISORIES */}
      {activeTab === 'advisories' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Seasonal Biosecurity &amp; Disease Advisories</h3>
            <button
              onClick={() => onOpenAdminModal('disease_advisory')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Publish New Advisory
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Disease / Virus Name</th>
                  <th className="py-3 px-4">Host Species</th>
                  <th className="py-3 px-4">Peak Risk Season</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Outbreak Status</th>
                  <th className="py-3 px-4">Published</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {advisories.map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{ad.disease_name}</td>
                    <td className="py-3 px-4">{ad.affected_species}</td>
                    <td className="py-3 px-4">{ad.seasonal_risk_period}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ad.risk_level === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {ad.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {ad.is_outbreak ? (
                        <span className="text-red-600 font-bold">Confirmed Alert</span>
                      ) : (
                        <span className="text-teal-700 font-medium">Educational Only</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{ad.publication_date}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteAdvisory(ad.id)}
                        className="p-1 rounded text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PRICE AUDIT HISTORY */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Price Audit Trail (Who updated what &amp; when)</h3>
              <p className="text-xs text-slate-500">Immutable log of price revisions for legal and auditing compliance</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Commodity / Item</th>
                  <th className="py-3 px-4">Market / Supplier</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Price Adjustment</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Verification Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {priceHistory.map((hist) => (
                  <tr key={hist.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{hist.update_time}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{hist.species_name}</td>
                    <td className="py-3 px-4">{hist.market_or_supplier}</td>
                    <td className="py-3 px-4">
                      <span className="uppercase text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {hist.record_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      ₹{hist.previous_price} &rarr; <span className="text-emerald-700 font-bold">₹{hist.new_price}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{hist.admin_name}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{hist.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: REGISTERED FARMERS DIRECTORY */}
      {activeTab === 'farmers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Registered Farmer Accounts</h3>
            <span className="text-xs text-slate-400">Total: {registeredFarmers.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Farmer Name</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Farm Location</th>
                  <th className="py-3 px-4">Farm Type</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registeredFarmers.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{f.name}</td>
                    <td className="py-3 px-4 text-slate-600">{f.mobile}</td>
                    <td className="py-3 px-4 text-slate-600">{f.email}</td>
                    <td className="py-3 px-4">{f.location}</td>
                    <td className="py-3 px-4 font-medium">{f.farm_type}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${f.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                        {f.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{f.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
