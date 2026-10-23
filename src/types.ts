export interface User {
  id: number;
  name: string;
  mobile: string;
  email: string;
  location: string;
  farm_type: string;
  role: 'farmer' | 'admin';
  created_at: string;
}

export interface Species {
  id: number;
  name: string;
  category: 'shrimp' | 'fish';
  scientific_name: string;
  description: string;
  ideal_salinity: string;
  ideal_temp: string;
}

export interface SeedPrice {
  id: number;
  species_id: number;
  species_name?: string;
  category?: 'shrimp' | 'fish';
  supplier_name: string;
  location: string;
  price: number;
  unit: string;
  availability: 'In Stock' | 'Low Stock' | 'Pre-booking Only' | 'Sold Out';
  contact_number: string;
  contact_email: string;
  notes?: string;
  pcr_certified: boolean;
  last_updated: string;
}

export interface MarketRate {
  id: number;
  species_id: number;
  species_name?: string;
  category?: 'shrimp' | 'fish';
  market_name: string;
  location: string;
  min_price: number;
  max_price: number;
  avg_price: number;
  unit: string;
  count_spec: string; // e.g. "30 count", "40 count", "1.5-2.0 kg"
  trend: 'up' | 'down' | 'stable';
  change_percent: number;
  recorded_date: string;
  updated_by_admin: string;
}

export interface MarketRateHistoryPoint {
  date: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  market_name: string;
}

export interface DiseaseAdvisory {
  id: number;
  disease_name: string;
  affected_species: string;
  species_id?: number | null;
  category: 'shrimp' | 'fish' | 'both';
  symptoms: string[];
  seasonal_risk_period: string; // e.g. "Winter (Nov - Feb)"
  favorable_conditions: string;
  prevention_measures: string[];
  recommended_steps: string[];
  risk_level: 'High' | 'Moderate' | 'Low' | 'Seasonal Watch';
  is_outbreak: boolean; // clearly distinguished general advisory vs confirmed outbreak
  source: string;
  publication_date: string;
  disclaimer: string;
}

export interface PriceHistoryRecord {
  id: number;
  species_id: number;
  species_name: string;
  market_or_supplier: string;
  record_type: 'market_rate' | 'seed_price';
  previous_price: number;
  new_price: number;
  unit: string;
  update_time: string;
  admin_id: number;
  admin_name: string;
  notes: string;
}

export interface DashboardData {
  farmer: User | null;
  today_seed_prices: SeedPrice[];
  latest_market_rates: MarketRate[];
  seasonal_disease_alerts: DiseaseAdvisory[];
  recent_price_changes: PriceHistoryRecord[];
  favorite_species_ids: number[];
  favorite_species_rates: MarketRate[];
  location_advisories: DiseaseAdvisory[];
  stats: {
    total_species: number;
    active_suppliers: number;
    active_mandis: number;
    active_advisories: number;
  };
}

export interface AdminStats {
  total_farmers: number;
  total_seed_listings: number;
  total_market_rates: number;
  total_advisories: number;
  recent_updates_count: number;
}
