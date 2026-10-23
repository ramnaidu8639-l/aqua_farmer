import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Species } from '../types';

interface AdminModalProps {
  type: 'seed_price' | 'market_rate' | 'disease_advisory';
  item?: any;
  speciesList: Species[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string | null;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  type,
  item,
  speciesList,
  isOpen,
  onClose,
  onSuccess,
  token,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    } else {
      // Default initial states
      if (type === 'seed_price') {
        setFormData({
          species_id: speciesList[0]?.id || 1,
          supplier_name: '',
          location: 'Andhra Pradesh',
          price: 350,
          unit: 'per 1,000 PL (Post-Larvae)',
          availability: 'In Stock',
          contact_number: '+91 ',
          contact_email: '',
          notes: 'SPF Certified broodstock',
          pcr_certified: true,
        });
      } else if (type === 'market_rate') {
        setFormData({
          species_id: speciesList[0]?.id || 1,
          market_name: 'Bhimavaram Central Aqua Mandi',
          location: 'Andhra Pradesh',
          min_price: 340,
          max_price: 380,
          avg_price: 360,
          unit: 'per kg',
          count_spec: '30 Count (33g/pc)',
        });
      } else if (type === 'disease_advisory') {
        setFormData({
          disease_name: '',
          affected_species: 'Pacific White Shrimp (Vannamei)',
          species_id: speciesList[0]?.id || 1,
          category: 'shrimp',
          symptoms: 'White spots on carapace\nDrop in feed consumption\nErratic surface swimming',
          seasonal_risk_period: 'Winter (Nov - Feb)',
          favorable_conditions: 'Water temperature drops below 26°C and high unionized ammonia',
          prevention_measures: 'SPF screened post-larvae\nBird scaring nets\nContinuous bottom aeration',
          recommended_steps: 'Immediately seal pond sluice gate\nSubmit live moribund samples to certified lab',
          risk_level: 'High',
          is_outbreak: false,
          source: 'State Fisheries Department / CIBA Advisory 2026',
        });
      }
    }
  }, [type, item, speciesList, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      let url = '';
      let method = 'POST';

      if (type === 'seed_price') {
        url = item ? `/api/admin/seed-prices/${item.id}` : '/api/admin/seed-prices';
        method = item ? 'PUT' : 'POST';
      } else if (type === 'market_rate') {
        url = item ? `/api/admin/market-rates/${item.id}` : '/api/admin/market-rates';
        method = item ? 'PUT' : 'POST';
      } else if (type === 'disease_advisory') {
        url = item ? `/api/admin/disease-advisories/${item.id}` : '/api/admin/disease-advisories';
        method = item ? 'PUT' : 'POST';
      }

      // Convert formatted text to arrays if needed for advisory
      const payload = { ...formData };
      if (type === 'disease_advisory') {
        if (typeof payload.symptoms === 'string') {
          payload.symptoms = payload.symptoms.split('\n').filter((s: string) => s.trim().length > 0);
        }
        if (typeof payload.prevention_measures === 'string') {
          payload.prevention_measures = payload.prevention_measures.split('\n').filter((s: string) => s.trim().length > 0);
        }
        if (typeof payload.recommended_steps === 'string') {
          payload.recommended_steps = payload.recommended_steps.split('\n').filter((s: string) => s.trim().length > 0);
        }
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save record');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sky-100 flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-sky-950 text-white rounded-t-2xl">
          <div>
            <h3 className="text-base font-bold">
              {item ? 'Edit' : 'Add New'}{' '}
              {type === 'seed_price'
                ? 'Seed Price Listing'
                : type === 'market_rate'
                ? 'Market Rate Record'
                : 'Seasonal Disease Advisory'}
            </h3>
            <p className="text-xs text-sky-200">
              Administrative action will be tracked in price audit history
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="m-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* SEED PRICE FORM */}
          {type === 'seed_price' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Species</label>
                <select
                  value={formData.species_id || ''}
                  onChange={(e) => setFormData({ ...formData, species_id: parseInt(e.target.value, 10) })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  required
                >
                  {speciesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hatchery / Supplier Name</label>
                <input
                  type="text"
                  value={formData.supplier_name || ''}
                  onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                  placeholder="e.g. Apex Marine Hatcheries"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pricing Unit</label>
                  <input
                    type="text"
                    value={formData.unit || ''}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="per 1,000 seeds"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Availability</label>
                  <select
                    value={formData.availability || 'In Stock'}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Pre-booking Only">Pre-booking Only</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Kakinada, Andhra Pradesh"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.contact_number || ''}
                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contact_email || ''}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Broodstock &amp; Testing Notes</label>
                <input
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. SPF Certified, PCR negative for WSSV/EHP"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pcr_certified"
                  checked={!!formData.pcr_certified}
                  onChange={(e) => setFormData({ ...formData, pcr_certified: e.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <label htmlFor="pcr_certified" className="text-xs text-slate-700 font-medium">
                  Verified CAA / PCR Disease Screened Batch
                </label>
              </div>
            </>
          )}

          {/* MARKET RATE FORM */}
          {type === 'market_rate' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Species</label>
                <select
                  value={formData.species_id || ''}
                  onChange={(e) => setFormData({ ...formData, species_id: parseInt(e.target.value, 10) })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  required
                >
                  {speciesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Wholesale Market / Mandi Name</label>
                <input
                  type="text"
                  value={formData.market_name || ''}
                  onChange={(e) => setFormData({ ...formData, market_name: e.target.value })}
                  placeholder="e.g. Bhimavaram Central Aqua Mandi"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State / Region</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Andhra Pradesh"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Size / Count Specification</label>
                  <input
                    type="text"
                    value={formData.count_spec || ''}
                    onChange={(e) => setFormData({ ...formData, count_spec: e.target.value })}
                    placeholder="e.g. 30 Count (33g/pc)"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Price (₹)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.min_price || ''}
                    onChange={(e) => setFormData({ ...formData, min_price: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Price (₹)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.max_price || ''}
                    onChange={(e) => setFormData({ ...formData, max_price: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Avg Price (₹)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.avg_price || ''}
                    onChange={(e) => setFormData({ ...formData, avg_price: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* DISEASE ADVISORY FORM */}
          {type === 'disease_advisory' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Disease / Virus Name</label>
                <input
                  type="text"
                  value={formData.disease_name || ''}
                  onChange={(e) => setFormData({ ...formData, disease_name: e.target.value })}
                  placeholder="e.g. White Spot Syndrome Virus (WSSV)"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Affected Species</label>
                  <input
                    type="text"
                    value={formData.affected_species || ''}
                    onChange={(e) => setFormData({ ...formData, affected_species: e.target.value })}
                    placeholder="e.g. Vannamei and Monodon"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seasonal Peak Period</label>
                  <input
                    type="text"
                    value={formData.seasonal_risk_period || ''}
                    onChange={(e) => setFormData({ ...formData, seasonal_risk_period: e.target.value })}
                    placeholder="e.g. Winter (Nov - Feb)"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Risk Level</label>
                  <select
                    value={formData.risk_level || 'Moderate'}
                    onChange={(e) => setFormData({ ...formData, risk_level: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="High">High Risk</option>
                    <option value="Moderate">Moderate Risk</option>
                    <option value="Low">Low Risk</option>
                    <option value="Seasonal Watch">Seasonal Watch</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_outbreak"
                    checked={!!formData.is_outbreak}
                    onChange={(e) => setFormData({ ...formData, is_outbreak: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <label htmlFor="is_outbreak" className="text-xs text-rose-800 font-bold">
                    Confirmed Local Outbreak Alert (Verified Only)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Common Symptoms (one per line)
                </label>
                <textarea
                  rows={3}
                  value={
                    Array.isArray(formData.symptoms)
                      ? formData.symptoms.join('\n')
                      : formData.symptoms || ''
                  }
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="Enter visible pond symptoms, one per line"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Biosecurity &amp; Prevention Measures (one per line)
                </label>
                <textarea
                  rows={3}
                  value={
                    Array.isArray(formData.prevention_measures)
                      ? formData.prevention_measures.join('\n')
                      : formData.prevention_measures || ''
                  }
                  onChange={(e) => setFormData({ ...formData, prevention_measures: e.target.value })}
                  placeholder="Enter preventive actions, one per line"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Advisory Source</label>
                <input
                  type="text"
                  value={formData.source || ''}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g. CIBA / National Aquatic Animal Disease Surveillance"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition shadow-sm disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
