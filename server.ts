// @ts-ignore -- Express and its type declarations are not available in this environment.
import express, { Request, Response, NextFunction } from 'express';
// @ts-ignore -- Node.js type declarations are not available in this environment.
import * as path from 'path';
// @ts-ignore -- Node.js type declarations are not available in this environment.
import { fileURLToPath } from 'url';
// @ts-ignore -- Node.js type declarations are not available in this environment.
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent database store initialized with verified realistic aquaculture data
interface UserRecord {
  id: number;
  name: string;
  mobile: string;
  email: string;
  password_hash: string;
  location: string;
  farm_type: string;
  role: 'farmer' | 'admin';
  created_at: string;
}

interface SpeciesRecord {
  id: number;
  name: string;
  category: 'shrimp' | 'fish';
  scientific_name: string;
  description: string;
  ideal_salinity: string;
  ideal_temp: string;
}

interface SeedPriceRecord {
  id: number;
  species_id: number;
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

interface MarketRateRecord {
  id: number;
  species_id: number;
  market_name: string;
  location: string;
  min_price: number;
  max_price: number;
  avg_price: number;
  unit: string;
  count_spec: string;
  trend: 'up' | 'down' | 'stable';
  change_percent: number;
  recorded_date: string;
  updated_by_admin: string;
}

interface MarketHistoryItem {
  id: number;
  species_id: number;
  market_name: string;
  date: string;
  avg_price: number;
  min_price: number;
  max_price: number;
}

interface DiseaseAdvisoryRecord {
  id: number;
  disease_name: string;
  affected_species: string;
  species_id: number | null;
  category: 'shrimp' | 'fish' | 'both';
  symptoms: string[];
  seasonal_risk_period: string;
  favorable_conditions: string;
  prevention_measures: string[];
  recommended_steps: string[];
  risk_level: 'High' | 'Moderate' | 'Low' | 'Seasonal Watch';
  is_outbreak: boolean;
  source: string;
  publication_date: string;
  disclaimer: string;
}

interface PriceHistoryRecord {
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

// Simple password hashing helper
function hashPassword(pwd: string): string {
  return crypto.createHash('sha256').update(pwd + '_aqua_salt_2026').digest('hex');
}

// Initial Mock Data
let users: UserRecord[] = [
  {
    id: 1,
    name: 'Ramesh Naidu',
    mobile: '+91 98480 12345',
    email: 'ramesh.farmer@aquafarmers.in',
    password_hash: hashPassword('farmer123'),
    location: 'Bhimavaram, Andhra Pradesh',
    farm_type: 'Shrimp Farming (Vannamei)',
    role: 'farmer',
    created_at: '2026-09-15 10:30:00',
  },
  {
    id: 2,
    name: 'Priya Patel',
    mobile: '+91 97230 45678',
    email: 'priya.patel@aquafarmers.in',
    password_hash: hashPassword('farmer123'),
    location: 'Surat, Gujarat',
    farm_type: 'Brackish Water Aquaculture',
    role: 'farmer',
    created_at: '2026-10-01 14:20:00',
  },
  {
    id: 3,
    name: 'Dr. K.V. Rao',
    mobile: '+91 94401 99887',
    email: 'admin@aquafarmers.in',
    password_hash: hashPassword('admin123'),
    location: 'Kakinada, Andhra Pradesh',
    farm_type: 'Aquaculture Extension & Research',
    role: 'admin',
    created_at: '2026-08-01 09:00:00',
  },
];

let speciesList: SpeciesRecord[] = [
  {
    id: 1,
    name: 'Pacific White Shrimp (Vannamei)',
    category: 'shrimp',
    scientific_name: 'Litopenaeus vannamei',
    description: 'Fast-growing brackish water shrimp with high stocking density tolerance and high export value.',
    ideal_salinity: '10 - 28 ppt',
    ideal_temp: '26°C - 32°C',
  },
  {
    id: 2,
    name: 'Black Tiger Shrimp (Monodon)',
    category: 'shrimp',
    scientific_name: 'Penaeus monodon',
    description: 'Large sized native tiger prawn, resilient to wide salinity, preferred in polyculture and organic farms.',
    ideal_salinity: '15 - 30 ppt',
    ideal_temp: '28°C - 33°C',
  },
  {
    id: 3,
    name: 'Rohu (Indian Major Carp)',
    category: 'fish',
    scientific_name: 'Labeo rohita',
    description: 'Leading freshwater aquaculture species in India, bottom-column feeder, popular in domestic markets.',
    ideal_salinity: '0 - 4 ppt',
    ideal_temp: '24°C - 30°C',
  },
  {
    id: 4,
    name: 'Catla (Indian Major Carp)',
    category: 'fish',
    scientific_name: 'Gibelion catla',
    description: 'Surface feeder with fast initial growth, high protein content and broad consumer demand.',
    ideal_salinity: '0 - 3 ppt',
    ideal_temp: '25°C - 32°C',
  },
  {
    id: 5,
    name: 'Nile Tilapia (GIFT)',
    category: 'fish',
    scientific_name: 'Oreochromis niloticus',
    description: 'Hardy omnivore suited for pond, biofloc, and cage culture with excellent feed conversion ratio.',
    ideal_salinity: '0 - 15 ppt',
    ideal_temp: '27°C - 31°C',
  },
  {
    id: 6,
    name: 'Asian Seabass (Barramundi)',
    category: 'fish',
    scientific_name: 'Lates calcarifer',
    description: 'High-value euryhaline carnivore with high domestic and restaurant demand.',
    ideal_salinity: '10 - 35 ppt',
    ideal_temp: '26°C - 32°C',
  },
  {
    id: 7,
    name: 'Pangasius (Striped Catfish)',
    category: 'fish',
    scientific_name: 'Pangasianodon hypophthalmus',
    description: 'High biomass freshwater catfish capable of surface breathing; ideal for high stocking intensive ponds.',
    ideal_salinity: '0 - 2 ppt',
    ideal_temp: '26°C - 30°C',
  },
];

let seedPrices: SeedPriceRecord[] = [
  {
    id: 1,
    species_id: 1,
    supplier_name: 'Apex Marine Hatcheries (CAA Approved)',
    location: 'Kakinada, Andhra Pradesh',
    price: 360,
    unit: 'per 1,000 PL (Post-Larvae PL-10)',
    availability: 'In Stock',
    contact_number: '+91 884 2341090',
    contact_email: 'sales@apexaqua.com',
    notes: 'SPF Broodstock imported from Hawaii, 100% PCR negative for WSSV/EHP/IMNV',
    pcr_certified: true,
    last_updated: '2026-10-21',
  },
  {
    id: 2,
    species_id: 1,
    supplier_name: 'Sagar Coastal Bio-Seeds',
    location: 'Marakkanam, Tamil Nadu',
    price: 340,
    unit: 'per 1,000 PL (Post-Larvae PL-11)',
    availability: 'Low Stock',
    contact_number: '+91 4147 223400',
    contact_email: 'info@sagarbioseeds.in',
    notes: 'Strict quarantine batch. Stress-tested for 15-minute formalin & salinity shock.',
    pcr_certified: true,
    last_updated: '2026-10-20',
  },
  {
    id: 3,
    species_id: 1,
    supplier_name: 'Gujarat Maritime Hatchery',
    location: 'Porbandar, Gujarat',
    price: 380,
    unit: 'per 1,000 PL (Post-Larvae PL-12)',
    availability: 'In Stock',
    contact_number: '+91 286 2248900',
    contact_email: 'gujaratseeds@seahatch.org',
    notes: 'Cold tolerance screened batch for northern coastal zones.',
    pcr_certified: true,
    last_updated: '2026-10-22',
  },
  {
    id: 4,
    species_id: 2,
    supplier_name: 'Sundarbans Natural Marine Hatchery',
    location: 'Kakdwip, West Bengal',
    price: 650,
    unit: 'per 1,000 PL (Black Tiger PL-15)',
    availability: 'Pre-booking Only',
    contact_number: '+91 3210 255102',
    contact_email: 'seeds@sundarbansmonodon.com',
    notes: 'Organic certified wild-caught domesticated broodstock, high vigor.',
    pcr_certified: true,
    last_updated: '2026-10-18',
  },
  {
    id: 5,
    species_id: 3,
    supplier_name: 'Godavari Freshwater Seed Farm',
    location: 'Eluru, Andhra Pradesh',
    price: 220,
    unit: 'per 1,000 Fingerlings (3-4 inch)',
    availability: 'In Stock',
    contact_number: '+91 8812 289110',
    contact_email: 'godavarifishseeds@gmail.com',
    notes: 'Jayanti Rohu variety with proven 17% higher growth rate.',
    pcr_certified: true,
    last_updated: '2026-10-19',
  },
  {
    id: 6,
    species_id: 4,
    supplier_name: 'Bhubaneswar State Pisciculture Hatchery',
    location: 'Khurda, Odisha',
    price: 240,
    unit: 'per 1,000 Fingerlings (4-5 inch)',
    availability: 'In Stock',
    contact_number: '+91 674 2598341',
    contact_email: 'odishaseeds@pisciculture.gov.in',
    notes: 'Induced breeding batch from selected 5-year disease-free broodstock.',
    pcr_certified: true,
    last_updated: '2026-10-19',
  },
  {
    id: 7,
    species_id: 5,
    supplier_name: 'RGCA Aqua Hatchery',
    location: 'Sirkazhi, Tamil Nadu',
    price: 180,
    unit: 'per 1,000 All-Male Monosex Fry',
    availability: 'In Stock',
    contact_number: '+91 4364 277200',
    contact_email: 'sirkazhi@rgca.org.in',
    notes: 'Genetically Improved Farmed Tilapia (GIFT) 99.5% male ratio verified.',
    pcr_certified: true,
    last_updated: '2026-10-21',
  },
  {
    id: 8,
    species_id: 6,
    supplier_name: 'CIBA Experimental Seabass Hatchery',
    location: 'Muttukadu, Chennai, Tamil Nadu',
    price: 1200,
    unit: 'per 1,000 Weaned Fingerlings (1.5 inch)',
    availability: 'Pre-booking Only',
    contact_number: '+91 44 27472061',
    contact_email: 'seabass@ciba.res.in',
    notes: 'Nursery weaned onto commercial extruded pellet feed.',
    pcr_certified: true,
    last_updated: '2026-10-15',
  },
];

let marketRates: MarketRateRecord[] = [
  {
    id: 1,
    species_id: 1,
    market_name: 'Bhimavaram Central Aqua Mandi',
    location: 'West Godavari, Andhra Pradesh',
    min_price: 360,
    max_price: 395,
    avg_price: 378,
    unit: 'per kg',
    count_spec: '30 Count (33g/pc)',
    trend: 'up',
    change_percent: 3.5,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 2,
    species_id: 1,
    market_name: 'Bhimavaram Central Aqua Mandi',
    location: 'West Godavari, Andhra Pradesh',
    min_price: 290,
    max_price: 320,
    avg_price: 305,
    unit: 'per kg',
    count_spec: '40 Count (25g/pc)',
    trend: 'stable',
    change_percent: 0.0,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 3,
    species_id: 1,
    market_name: 'Surat Seafood Wholesale Hub',
    location: 'Olpad / Surat, Gujarat',
    min_price: 375,
    max_price: 410,
    avg_price: 392,
    unit: 'per kg',
    count_spec: '30 Count (33g/pc)',
    trend: 'up',
    change_percent: 4.8,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 4,
    species_id: 1,
    market_name: 'Kolkata Wholesale Fish Terminal',
    location: 'Howrah, West Bengal',
    min_price: 240,
    max_price: 270,
    avg_price: 255,
    unit: 'per kg',
    count_spec: '60 Count (16g/pc)',
    trend: 'down',
    change_percent: -2.1,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 5,
    species_id: 2,
    market_name: 'Nellore Coastal Seafood Exchange',
    location: 'Nellore, Andhra Pradesh',
    min_price: 680,
    max_price: 740,
    avg_price: 710,
    unit: 'per kg',
    count_spec: '20 Count Large (50g/pc)',
    trend: 'up',
    change_percent: 5.2,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 6,
    species_id: 3,
    market_name: 'Vijayawada Fish Market Yard',
    location: 'Krishna, Andhra Pradesh',
    min_price: 135,
    max_price: 155,
    avg_price: 145,
    unit: 'per kg',
    count_spec: '1.5 - 2.0 kg Table Fish',
    trend: 'stable',
    change_percent: 0.5,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 7,
    species_id: 4,
    market_name: 'Siliguri Wholesale Fishery Hub',
    location: 'Darjeeling, West Bengal',
    min_price: 160,
    max_price: 190,
    avg_price: 175,
    unit: 'per kg',
    count_spec: '2.0 - 3.0 kg Live Fish',
    trend: 'up',
    change_percent: 2.9,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 8,
    species_id: 5,
    market_name: 'Kochi Marine Drive Fish Auction',
    location: 'Ernakulam, Kerala',
    min_price: 120,
    max_price: 140,
    avg_price: 130,
    unit: 'per kg',
    count_spec: '500g - 800g Gutted/Live',
    trend: 'stable',
    change_percent: -1.0,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
];

// Historical rates for Chart.js rendering (Past 12 weeks / recent dates)
let marketHistory: MarketHistoryItem[] = [
  // Vannamei 30 count Bhimavaram
  { id: 1, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-08-01', avg_price: 345, min_price: 330, max_price: 360 },
  { id: 2, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-08-15', avg_price: 350, min_price: 335, max_price: 365 },
  { id: 3, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-09-01', avg_price: 358, min_price: 340, max_price: 375 },
  { id: 4, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-09-15', avg_price: 362, min_price: 345, max_price: 380 },
  { id: 5, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-10-01', avg_price: 365, min_price: 350, max_price: 385 },
  { id: 6, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-10-15', avg_price: 372, min_price: 355, max_price: 390 },
  { id: 7, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-10-22', avg_price: 378, min_price: 360, max_price: 395 },

  // Black Tiger 20 count Nellore
  { id: 8, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-08-01', avg_price: 660, min_price: 630, max_price: 690 },
  { id: 9, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-08-15', avg_price: 675, min_price: 645, max_price: 700 },
  { id: 10, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-09-01', avg_price: 680, min_price: 650, max_price: 710 },
  { id: 11, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-09-15', avg_price: 690, min_price: 660, max_price: 720 },
  { id: 12, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-10-01', avg_price: 695, min_price: 670, max_price: 725 },
  { id: 13, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-10-15', avg_price: 700, min_price: 675, max_price: 730 },
  { id: 14, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-10-22', avg_price: 710, min_price: 680, max_price: 740 },

  // Rohu Vijayawada
  { id: 15, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-08-01', avg_price: 138, min_price: 130, max_price: 145 },
  { id: 16, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-08-15', avg_price: 140, min_price: 132, max_price: 148 },
  { id: 17, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-09-01', avg_price: 142, min_price: 132, max_price: 150 },
  { id: 18, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-09-15', avg_price: 144, min_price: 134, max_price: 152 },
  { id: 19, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-10-01', avg_price: 143, min_price: 133, max_price: 151 },
  { id: 20, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-10-15', avg_price: 144, min_price: 135, max_price: 153 },
  { id: 21, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-10-22', avg_price: 145, min_price: 135, max_price: 155 },
];

let diseaseAdvisories: DiseaseAdvisoryRecord[] = [
  {
    id: 1,
    disease_name: 'White Spot Syndrome Virus (WSSV)',
    affected_species: 'Pacific White Shrimp (Vannamei), Black Tiger Shrimp (Monodon)',
    species_id: 1,
    category: 'shrimp',
    symptoms: [
      'Circular white spots (0.5 - 2.0 mm) embedded on inner carapace surface',
      'Sudden reduction in feed consumption (empty gut observed in check tray)',
      'Shrimp lethargically swimming near pond dyke or surface during daytime',
      'Reddish to pinkish discoloration of body and appendages',
      'Rapid cumulative mortality reaching 80-100% within 3 to 7 days if unmanaged',
    ],
    seasonal_risk_period: 'Winter & Northeast Monsoon (Late October to February)',
    favorable_conditions: 'Water temperature dropping below 26°C; sudden fluctuations in salinity after heavy monsoon rain; crab intrusion.',
    prevention_measures: [
      'Stock only SPF Post-Larvae screened double-PCR negative for WSSV',
      'Erect crab-proof dyke fencing (minimum 50 cm high) and bird scare netting',
      'Maintain stable water depth (>1.2 meters) to minimize diurnal water temperature swings',
      'Disinfect inlet water in reservoir with 30 ppm active chlorine and age for minimum 4 days',
    ],
    recommended_steps: [
      'Step 1: Do not pump water in or out of the pond; seal sluice gates completely.',
      'Step 2: Collect 10 freshly moribund shrimp in sterile saline and immediately contact local District Fisheries Officer or CIBA laboratory.',
      'Step 3: If confirmed positive by PCR, chlorinate the affected pond at 30 ppm before any disposal to prevent neighbor infection.',
    ],
    risk_level: 'High',
    is_outbreak: false, // Explicit educational advisory
    source: 'ICAR - Central Institute of Brackishwater Aquaculture (CIBA) Advisory Bulletin 2026',
    publication_date: '2026-10-10',
    disclaimer: 'Advisory Notice: This is seasonal educational biosecurity information. There is no official area-wide emergency declared. Consult a certified aquatic animal health professional for pond diagnostic screening.',
  },
  {
    id: 2,
    disease_name: 'Enterocytozoon hepatopenaei (EHP) - Microsporidiosis',
    affected_species: 'Pacific White Shrimp (P. vannamei)',
    species_id: 1,
    category: 'shrimp',
    symptoms: [
      'Severe growth retardation and wide size disparity within the same pond crop',
      'White feces or pale discolored digestive gland (hepatopancreas)',
      'Soft shell and opaque abdominal muscles',
      'Low mortality but extreme feed conversion penalty (FCR exceeding 2.2)',
    ],
    seasonal_risk_period: 'All Seasons / Peak post-stocking Days of Culture 35-70',
    favorable_conditions: 'High pond bottom organic sludge accumulation; infected live feed (polychaetes); lack of pond bottom desiccation.',
    prevention_measures: [
      'Dry pond bottoms until soil cracks 2-3 inches deep, followed by lime treatment (CaO @ 1000 kg/ha) to reach pH 12',
      'Avoid unpasteurized live polychaetes or fresh squids in broodstock / nurseries',
      'Screen PL using sensitive qPCR for EHP spores',
    ],
    recommended_steps: [
      'Step 1: Submit hepatopancreas tissue for Giemsa stain and qPCR spore count.',
      'Step 2: Supplement feed with gut probiotics and organic acids under veterinary guidance.',
      'Step 3: Increase bottom siphon frequency to remove organic spores.',
    ],
    risk_level: 'Moderate',
    is_outbreak: false,
    source: 'National Surveillance Programme for Aquatic Animal Diseases (NSPAAD)',
    publication_date: '2026-09-28',
    disclaimer: 'Educational advisory only. Confirm diagnosis with a certified aquatic animal health professional or state fisheries lab before medication.',
  },
  {
    id: 3,
    disease_name: 'Early Mortality Syndrome / AHPND (Vibrio parahaemolyticus)',
    affected_species: 'Shrimp (Vannamei and Monodon)',
    species_id: 1,
    category: 'shrimp',
    symptoms: [
      'Acute mortality occurring within the first 35 days post-stocking',
      'Pale, shrunken, and atrophied hepatopancreas',
      'Empty stomach and midgut with corkscrew erratic swimming',
      'Soft shells and blackened spots on internal organ tissue',
    ],
    seasonal_risk_period: 'Summer & Early Monsoon (Warm season 30°C+)',
    favorable_conditions: 'High Vibrio counts in pond water (>10^3 CFU/ml green colonies); high un-ionized ammonia and pH swings > 8.5.',
    prevention_measures: [
      'Apply polyculture techniques with Tilapia green water (natural bactericidal peptides)',
      'Regular application of Bacillus subtilis and nitrifying probiotics',
      'Avoid overfeeding in nursery phase; utilize automatic check trays',
    ],
    recommended_steps: [
      'Step 1: Plate water on TCBS agar to assess yellow vs green Vibrio colony ratios.',
      'Step 2: Cease artificial feeding for 24 hours to reduce gut stress.',
      'Step 3: Consult qualified aquaculture pathologist for authorized bacteriophage or probiotic intervention.',
    ],
    risk_level: 'High',
    is_outbreak: false,
    source: 'Aquaculture Biosecurity Center Guidelines',
    publication_date: '2026-08-15',
    disclaimer: 'Educational advisory only. Confirm diagnosis with a certified aquatic animal health professional or state fisheries lab before medication.',
  },
  {
    id: 4,
    disease_name: 'Tilapia Parvovirus & ISKNV (Infectious Spleen & Kidney Necrosis)',
    affected_species: 'Nile Tilapia (GIFT), Red Tilapia',
    species_id: 5,
    category: 'fish',
    symptoms: [
      'Lethargy and abnormal schooling near pond corners',
      'Abdominal swelling (ascites) and exophthalmia (pop-eye)',
      'Enlarged dark spleen and mottled pale kidneys upon autopsy',
      'Loss of appetite and dark skin pigmentation',
    ],
    seasonal_risk_period: 'Monsoon transition and cool temperature drops (22°C - 26°C)',
    favorable_conditions: 'High stocking densities (>15 fish/m²); poor water exchange; low dissolved oxygen (< 3 mg/L).',
    prevention_measures: [
      'Quarantine newly purchased seed fingerlings for 14 days before pond release',
      'Maintain dissolved oxygen levels above 4.5 ppm with continuous aeration',
      'Vaccinate broodstock where certified viral vaccines are locally approved',
    ],
    recommended_steps: [
      'Step 1: Isolate affected hapas or ponds immediately.',
      'Step 2: Cease fertilization and feed high Vitamin C immunostimulant diet.',
      'Step 3: Transport preserved tissue samples in 95% ethanol to college of fisheries virology unit.',
    ],
    risk_level: 'Moderate',
    is_outbreak: false,
    source: 'National Fisheries Development Board (NFDB) Technical Notice',
    publication_date: '2026-10-05',
    disclaimer: 'Educational advisory only. Confirm diagnosis with a certified aquatic animal health professional or state fisheries lab before medication.',
  },
  {
    id: 5,
    disease_name: 'Columnaris & Fin Rot (Flavobacterium columnare)',
    affected_species: 'Rohu, Catla, Mrigal, Pangasius',
    species_id: 3,
    category: 'fish',
    symptoms: [
      'Cotton-like white or yellowish lesions on mouth, gills, and skin margins',
      'Frayed, eroded dorsal and caudal fins with necrotic edges',
      'Fish gasping at water surface due to gill filament erosion (saddleback condition)',
    ],
    seasonal_risk_period: 'Post-Monsoon & Winter onset (October - January)',
    favorable_conditions: 'Mechanical injury during harvest/netting; elevated organic matter; unionized ammonia > 0.05 ppm.',
    prevention_measures: [
      'Handle fingerlings gently during drag-netting and dip in 3% saline or potassium permanganate (2 ppm) before stocking',
      'Maintain optimal pond sanitation with periodic agricultural limestone dosing',
      'Avoid overcrowding during winter low-metabolism periods',
    ],
    recommended_steps: [
      'Step 1: Conduct water exchange of 20% with clean reservoir water.',
      'Step 2: Administer approved aquatic antiseptic bath or dietary herbal extracts under veterinary prescription.',
      'Step 3: Consult local fish health officer for antibiogram sensitivity testing.',
    ],
    risk_level: 'Seasonal Watch',
    is_outbreak: false,
    source: 'ICAR - Central Institute of Freshwater Aquaculture (CIFA)',
    publication_date: '2026-10-18',
    disclaimer: 'Educational advisory only. Confirm diagnosis with a certified aquatic animal health professional or state fisheries lab before medication.',
  },
];

let favoriteSpecies: { [userId: number]: number[] } = {
  1: [1, 2], // Ramesh Naidu favorites Vannamei and Black Tiger
  2: [1, 5], // Priya Patel favorites Vannamei and Tilapia
};

let priceHistory: PriceHistoryRecord[] = [
  {
    id: 1,
    species_id: 1,
    species_name: 'Pacific White Shrimp (Vannamei)',
    market_or_supplier: 'Bhimavaram Central Aqua Mandi',
    record_type: 'market_rate',
    previous_price: 365,
    new_price: 378,
    unit: 'per kg (30 count)',
    update_time: '2026-10-22 07:15:00',
    admin_id: 3,
    admin_name: 'Dr. K.V. Rao',
    notes: 'Verified morning mandi auction arrival sheets. Export demand uptick.',
  },
  {
    id: 2,
    species_id: 1,
    species_name: 'Pacific White Shrimp (Vannamei)',
    market_or_supplier: 'Apex Marine Hatcheries',
    record_type: 'seed_price',
    previous_price: 350,
    new_price: 360,
    unit: 'per 1,000 PL',
    update_time: '2026-10-21 16:40:00',
    admin_id: 3,
    admin_name: 'Dr. K.V. Rao',
    notes: 'Hatchery price revision for late autumn stocking cycle.',
  },
  {
    id: 3,
    species_id: 2,
    species_name: 'Black Tiger Shrimp (Monodon)',
    market_or_supplier: 'Nellore Coastal Seafood Exchange',
    record_type: 'market_rate',
    previous_price: 695,
    new_price: 710,
    unit: 'per kg (20 count)',
    update_time: '2026-10-22 08:00:00',
    admin_id: 3,
    admin_name: 'Dr. K.V. Rao',
    notes: 'European Christmas purchase order contracts verified.',
  },
];

// Helper to get user from token/header or query
function getAuthenticatedUser(req: Request): UserRecord | null {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    // Simple demo token decode: "uid-<id>"
    if (token.startsWith('uid-')) {
      const uid = parseInt(token.replace('uid-', ''), 10);
      const found = users.find((u) => u.id === uid);
      if (found) return found;
    }
  }
  return null;
}

// REST API ROUTES

// 1. Auth routes
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, mobile, email, password, location, farm_type } = req.body;
  if (!name || !email || !password || !mobile || !location) {
    return res.status(400).json({ error: 'All fields (Name, Mobile, Email, Password, Location) are required.' });
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newUser: UserRecord = {
    id: users.length + 1,
    name,
    mobile,
    email,
    password_hash: hashPassword(password),
    location,
    farm_type: farm_type || 'Shrimp & Fish Farming',
    role: 'farmer',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  users.push(newUser);
  favoriteSpecies[newUser.id] = [1]; // default favorite

  const token = `uid-${newUser.id}`;
  const { password_hash, ...safeUser } = newUser;
  return res.json({
    message: 'Farmer registered successfully',
    user: safeUser,
    token,
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password_hash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = `uid-${user.id}`;
  const { password_hash, ...safeUser } = user;
  return res.json({
    message: 'Login successful',
    user: safeUser,
    token,
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { password_hash, ...safeUser } = user;
  return res.json({ user: safeUser });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required to update profile' });
  }

  const { name, mobile, location, farm_type, new_password } = req.body;
  if (name) user.name = name;
  if (mobile) user.mobile = mobile;
  if (location) user.location = location;
  if (farm_type) user.farm_type = farm_type;
  if (new_password && new_password.trim().length >= 6) {
    user.password_hash = hashPassword(new_password);
  }

  const { password_hash, ...safeUser } = user;
  return res.json({ message: 'Profile updated successfully', user: safeUser });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
});

// 2. Species Catalog
app.get('/api/species', (req: Request, res: Response) => {
  return res.json(speciesList);
});

// 3. Seed Prices
app.get('/api/seed-prices', (req: Request, res: Response) => {
  const { species_id, location, availability, search, max_price } = req.query;

  let results = seedPrices.map((sp) => {
    const spec = speciesList.find((s) => s.id === sp.species_id);
    return {
      ...sp,
      species_name: spec ? spec.name : 'Unknown Species',
      category: spec ? spec.category : 'shrimp',
    };
  });

  if (species_id && species_id !== 'all') {
    results = results.filter((r) => r.species_id === parseInt(species_id as string, 10));
  }
  if (location && location !== 'all') {
    const locLower = (location as string).toLowerCase();
    results = results.filter((r) => r.location.toLowerCase().includes(locLower));
  }
  if (availability && availability !== 'all') {
    results = results.filter((r) => r.availability === availability);
  }
  if (max_price) {
    const max = parseFloat(max_price as string);
    if (!isNaN(max)) {
      results = results.filter((r) => r.price <= max);
    }
  }
  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(
      (r) =>
        r.supplier_name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        (r.species_name && r.species_name.toLowerCase().includes(q))
    );
  }

  return res.json(results);
});

// 4. Market Rates
app.get('/api/market-rates', (req: Request, res: Response) => {
  const { species_id, location, search } = req.query;

  let results = marketRates.map((mr) => {
    const spec = speciesList.find((s) => s.id === mr.species_id);
    return {
      ...mr,
      species_name: spec ? spec.name : 'Unknown Species',
      category: spec ? spec.category : 'shrimp',
    };
  });

  if (species_id && species_id !== 'all') {
    results = results.filter((r) => r.species_id === parseInt(species_id as string, 10));
  }
  if (location && location !== 'all') {
    const locLower = (location as string).toLowerCase();
    results = results.filter((r) => r.location.toLowerCase().includes(locLower));
  }
  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(
      (r) =>
        r.market_name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        (r.species_name && r.species_name.toLowerCase().includes(q)) ||
        r.count_spec.toLowerCase().includes(q)
    );
  }

  return res.json(results);
});

// 4B. Market Rate History (for Chart.js)
app.get('/api/market-rates/history/:species_id', (req: Request, res: Response) => {
  const speciesId = parseInt(req.params.species_id, 10);
  const { market } = req.query;

  let history = marketHistory.filter((h) => h.species_id === speciesId);
  if (market && market !== 'all') {
    history = history.filter((h) => h.market_name.toLowerCase().includes((market as string).toLowerCase()));
  }

  // Sort chronologically
  history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return res.json(history);
});

// 5. Seasonal Disease Advisories
app.get('/api/disease-advisories', (req: Request, res: Response) => {
  const { species, season, risk_level, search } = req.query;

  let results = [...diseaseAdvisories];

  if (species && species !== 'all') {
    const specLower = (species as string).toLowerCase();
    results = results.filter(
      (d) =>
        d.affected_species.toLowerCase().includes(specLower) ||
        d.category.toLowerCase() === specLower
    );
  }
  if (season && season !== 'all') {
    results = results.filter((d) => d.seasonal_risk_period.toLowerCase().includes((season as string).toLowerCase()));
  }
  if (risk_level && risk_level !== 'all') {
    results = results.filter((d) => d.risk_level.toLowerCase() === (risk_level as string).toLowerCase());
  }
  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(
      (d) =>
        d.disease_name.toLowerCase().includes(q) ||
        d.affected_species.toLowerCase().includes(q) ||
        d.symptoms.some((s) => s.toLowerCase().includes(q))
    );
  }

  return res.json(results);
});

// 6. Farmer Dashboard Aggregation
app.get('/api/dashboard', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const userId = user ? user.id : 1; // Default to Ramesh Naidu demo view if unauthenticated
  const favIds = favoriteSpecies[userId] || [1];

  const farmerRates = marketRates.filter((mr) => favIds.includes(mr.species_id)).map((mr) => {
    const spec = speciesList.find((s) => s.id === mr.species_id);
    return {
      ...mr,
      species_name: spec ? spec.name : 'Species',
      category: spec ? spec.category : 'shrimp',
    };
  });

  const locationKeywords = user && user.location ? user.location.toLowerCase().split(/[ ,]+/) : ['andhra', 'bhimavaram'];
  const locAdvisories = diseaseAdvisories.filter((d) => {
    // Show high risk or species relevant to farmer
    return d.risk_level === 'High' || d.category === 'shrimp';
  });

  return res.json({
    farmer: user || users[0],
    today_seed_prices: seedPrices.slice(0, 4).map((sp) => {
      const spec = speciesList.find((s) => s.id === sp.species_id);
      return { ...sp, species_name: spec?.name, category: spec?.category };
    }),
    latest_market_rates: marketRates.slice(0, 4).map((mr) => {
      const spec = speciesList.find((s) => s.id === mr.species_id);
      return { ...mr, species_name: spec?.name, category: spec?.category };
    }),
    seasonal_disease_alerts: diseaseAdvisories.filter((d) => d.risk_level === 'High'),
    recent_price_changes: priceHistory.slice(0, 5),
    favorite_species_ids: favIds,
    favorite_species_rates: farmerRates,
    location_advisories: locAdvisories,
    stats: {
      total_species: speciesList.length,
      active_suppliers: seedPrices.length,
      active_mandis: new Set(marketRates.map((m) => m.market_name)).size,
      active_advisories: diseaseAdvisories.length,
    },
  });
});

// 7. Favorite Species Toggle
app.post('/api/favorites/toggle', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const userId = user ? user.id : 1;
  const { species_id } = req.body;

  if (!species_id) {
    return res.status(400).json({ error: 'species_id is required' });
  }

  if (!favoriteSpecies[userId]) {
    favoriteSpecies[userId] = [];
  }

  const idx = favoriteSpecies[userId].indexOf(species_id);
  if (idx > -1) {
    favoriteSpecies[userId].splice(idx, 1);
  } else {
    favoriteSpecies[userId].push(species_id);
  }

  return res.json({
    message: 'Favorites updated',
    favorite_species_ids: favoriteSpecies[userId],
  });
});

// ADMIN ROUTES (Protected with role checking)
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Administrator authorization required.' });
  }
  next();
}

// Seed Prices CRUD
app.post('/api/admin/seed-prices', requireAdmin, (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req)!;
  const { species_id, supplier_name, location, price, unit, availability, contact_number, contact_email, notes, pcr_certified } = req.body;

  if (!species_id || !supplier_name || !price || !unit) {
    return res.status(400).json({ error: 'species_id, supplier_name, price, and unit are required' });
  }

  const newSeed: SeedPriceRecord = {
    id: seedPrices.length > 0 ? Math.max(...seedPrices.map((s) => s.id)) + 1 : 1,
    species_id: parseInt(species_id, 10),
    supplier_name,
    location: location || 'Verified Hatchery Zone',
    price: parseFloat(price),
    unit,
    availability: availability || 'In Stock',
    contact_number: contact_number || '+91 800 000 0000',
    contact_email: contact_email || 'hatchery@aquafarmers.in',
    notes: notes || 'CAA Registered',
    pcr_certified: !!pcr_certified,
    last_updated: new Date().toISOString().substring(0, 10),
  };

  seedPrices.unshift(newSeed);

  // Log to price history audit
  const spec = speciesList.find((s) => s.id === newSeed.species_id);
  priceHistory.unshift({
    id: priceHistory.length + 1,
    species_id: newSeed.species_id,
    species_name: spec ? spec.name : 'Aquaculture Seed',
    market_or_supplier: newSeed.supplier_name,
    record_type: 'seed_price',
    previous_price: 0,
    new_price: newSeed.price,
    unit: newSeed.unit,
    update_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    admin_id: user.id,
    admin_name: user.name,
    notes: `Added new seed listing for ${newSeed.supplier_name}`,
  });

  return res.json({ message: 'Seed price listing created successfully', record: newSeed });
});

app.put('/api/admin/seed-prices/:id', requireAdmin, (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req)!;
  const id = parseInt(req.params.id, 10);
  const item = seedPrices.find((s) => s.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Seed price record not found' });
  }

  const prevPrice = item.price;
  const { price, availability, location, contact_number, notes, pcr_certified } = req.body;

  if (price !== undefined) item.price = parseFloat(price);
  if (availability !== undefined) item.availability = availability;
  if (location !== undefined) item.location = location;
  if (contact_number !== undefined) item.contact_number = contact_number;
  if (notes !== undefined) item.notes = notes;
  if (pcr_certified !== undefined) item.pcr_certified = !!pcr_certified;
  item.last_updated = new Date().toISOString().substring(0, 10);

  // Audit log
  const spec = speciesList.find((s) => s.id === item.species_id);
  priceHistory.unshift({
    id: priceHistory.length + 1,
    species_id: item.species_id,
    species_name: spec ? spec.name : 'Aquaculture Seed',
    market_or_supplier: item.supplier_name,
    record_type: 'seed_price',
    previous_price: prevPrice,
    new_price: item.price,
    unit: item.unit,
    update_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    admin_id: user.id,
    admin_name: user.name,
    notes: req.body.notes || 'Updated seed price record',
  });

  return res.json({ message: 'Seed price record updated', record: item });
});

app.delete('/api/admin/seed-prices/:id', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  seedPrices = seedPrices.filter((s) => s.id !== id);
  return res.json({ message: 'Seed price record deleted' });
});

// Market Rates CRUD
app.post('/api/admin/market-rates', requireAdmin, (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req)!;
  const { species_id, market_name, location, min_price, max_price, avg_price, unit, count_spec } = req.body;

  if (!species_id || !market_name || !min_price || !max_price) {
    return res.status(400).json({ error: 'species_id, market_name, min_price, and max_price are required' });
  }

  const min = parseFloat(min_price);
  const max = parseFloat(max_price);
  const avg = avg_price ? parseFloat(avg_price) : Math.round(((min + max) / 2) * 10) / 10;

  const newRate: MarketRateRecord = {
    id: marketRates.length > 0 ? Math.max(...marketRates.map((m) => m.id)) + 1 : 1,
    species_id: parseInt(species_id, 10),
    market_name,
    location: location || 'Wholesale Mandi',
    min_price: min,
    max_price: max,
    avg_price: avg,
    unit: unit || 'per kg',
    count_spec: count_spec || 'Standard count',
    trend: 'stable',
    change_percent: 0,
    recorded_date: new Date().toISOString().substring(0, 10),
    updated_by_admin: user.name,
  };

  marketRates.unshift(newRate);

  // Add historical data point
  marketHistory.push({
    id: marketHistory.length + 1,
    species_id: newRate.species_id,
    market_name: newRate.market_name,
    date: newRate.recorded_date,
    avg_price: newRate.avg_price,
    min_price: newRate.min_price,
    max_price: newRate.max_price,
  });

  const spec = speciesList.find((s) => s.id === newRate.species_id);
  priceHistory.unshift({
    id: priceHistory.length + 1,
    species_id: newRate.species_id,
    species_name: spec ? spec.name : 'Fish/Shrimp',
    market_or_supplier: newRate.market_name,
    record_type: 'market_rate',
    previous_price: 0,
    new_price: newRate.avg_price,
    unit: newRate.unit,
    update_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    admin_id: user.id,
    admin_name: user.name,
    notes: `Initial mandi entry: Min ₹${min} - Max ₹${max} ${newRate.count_spec}`,
  });

  return res.json({ message: 'Market rate published successfully', record: newRate });
});

app.put('/api/admin/market-rates/:id', requireAdmin, (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req)!;
  const id = parseInt(req.params.id, 10);
  const rate = marketRates.find((m) => m.id === id);

  if (!rate) {
    return res.status(404).json({ error: 'Market rate record not found' });
  }

  const prevAvg = rate.avg_price;
  const { min_price, max_price, avg_price, count_spec } = req.body;

  if (min_price !== undefined) rate.min_price = parseFloat(min_price);
  if (max_price !== undefined) rate.max_price = parseFloat(max_price);
  if (count_spec !== undefined) rate.count_spec = count_spec;

  if (avg_price !== undefined) {
    rate.avg_price = parseFloat(avg_price);
  } else {
    rate.avg_price = Math.round(((rate.min_price + rate.max_price) / 2) * 10) / 10;
  }

  rate.change_percent = Math.round(((rate.avg_price - prevAvg) / prevAvg) * 1000) / 10;
  rate.trend = rate.change_percent > 0.5 ? 'up' : rate.change_percent < -0.5 ? 'down' : 'stable';
  rate.recorded_date = new Date().toISOString().substring(0, 10);
  rate.updated_by_admin = user.name;

  marketHistory.push({
    id: marketHistory.length + 1,
    species_id: rate.species_id,
    market_name: rate.market_name,
    date: rate.recorded_date,
    avg_price: rate.avg_price,
    min_price: rate.min_price,
    max_price: rate.max_price,
  });

  const spec = speciesList.find((s) => s.id === rate.species_id);
  priceHistory.unshift({
    id: priceHistory.length + 1,
    species_id: rate.species_id,
    species_name: spec ? spec.name : 'Fish/Shrimp',
    market_or_supplier: rate.market_name,
    record_type: 'market_rate',
    previous_price: prevAvg,
    new_price: rate.avg_price,
    unit: rate.unit,
    update_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    admin_id: user.id,
    admin_name: user.name,
    notes: `Updated market rate: ₹${rate.min_price} to ₹${rate.max_price} (${rate.count_spec})`,
  });

  return res.json({ message: 'Market rate updated', record: rate });
});

app.delete('/api/admin/market-rates/:id', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  marketRates = marketRates.filter((m) => m.id !== id);
  return res.json({ message: 'Market rate record deleted' });
});

// Disease Advisories CRUD
app.post('/api/admin/disease-advisories', requireAdmin, (req: Request, res: Response) => {
  const {
    disease_name,
    affected_species,
    species_id,
    category,
    symptoms,
    seasonal_risk_period,
    favorable_conditions,
    prevention_measures,
    recommended_steps,
    risk_level,
    is_outbreak,
    source,
  } = req.body;

  if (!disease_name || !affected_species || !seasonal_risk_period) {
    return res.status(400).json({ error: 'disease_name, affected_species, and seasonal_risk_period are required' });
  }

  const newAdvisory: DiseaseAdvisoryRecord = {
    id: diseaseAdvisories.length > 0 ? Math.max(...diseaseAdvisories.map((d) => d.id)) + 1 : 1,
    disease_name,
    affected_species,
    species_id: species_id ? parseInt(species_id, 10) : null,
    category: category || 'shrimp',
    symptoms: Array.isArray(symptoms) ? symptoms : [symptoms],
    seasonal_risk_period,
    favorable_conditions: favorable_conditions || 'Low dissolved oxygen, temperature swings',
    prevention_measures: Array.isArray(prevention_measures) ? prevention_measures : [prevention_measures],
    recommended_steps: Array.isArray(recommended_steps) ? recommended_steps : [recommended_steps],
    risk_level: risk_level || 'Seasonal Watch',
    is_outbreak: !!is_outbreak,
    source: source || 'Verified Fisheries Authority',
    publication_date: new Date().toISOString().substring(0, 10),
    disclaimer: 'Educational advisory only. Confirm diagnosis with a certified aquatic animal health professional or state fisheries lab before medication.',
  };

  diseaseAdvisories.unshift(newAdvisory);
  return res.json({ message: 'Advisory published successfully', record: newAdvisory });
});

app.put('/api/admin/disease-advisories/:id', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const adv = diseaseAdvisories.find((d) => d.id === id);

  if (!adv) {
    return res.status(404).json({ error: 'Advisory not found' });
  }

  const { disease_name, risk_level, is_outbreak, seasonal_risk_period, symptoms, prevention_measures } = req.body;
  if (disease_name) adv.disease_name = disease_name;
  if (risk_level) adv.risk_level = risk_level;
  if (is_outbreak !== undefined) adv.is_outbreak = !!is_outbreak;
  if (seasonal_risk_period) adv.seasonal_risk_period = seasonal_risk_period;
  if (symptoms) adv.symptoms = Array.isArray(symptoms) ? symptoms : [symptoms];
  if (prevention_measures) adv.prevention_measures = Array.isArray(prevention_measures) ? prevention_measures : [prevention_measures];

  return res.json({ message: 'Advisory updated successfully', record: adv });
});

app.delete('/api/admin/disease-advisories/:id', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  diseaseAdvisories = diseaseAdvisories.filter((d) => d.id !== id);
  return res.json({ message: 'Advisory deleted' });
});

// Admin stats & audit logs
app.get('/api/admin/stats', requireAdmin, (req: Request, res: Response) => {
  return res.json({
    total_farmers: users.filter((u) => u.role === 'farmer').length,
    total_seed_listings: seedPrices.length,
    total_market_rates: marketRates.length,
    total_advisories: diseaseAdvisories.length,
    recent_updates_count: priceHistory.length,
  });
});

app.get('/api/admin/price-history', requireAdmin, (req: Request, res: Response) => {
  return res.json(priceHistory);
});

app.get('/api/admin/users', requireAdmin, (req: Request, res: Response) => {
  const safeUsers = users.map(({ password_hash, ...rest }) => rest);
  return res.json(safeUsers);
});

// Setup Vite or static serving
async function startServer() {
  const nodeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.NODE_ENV;
  if (nodeEnv !== 'production') {
    const viteModule = 'vite';
    const { createServer: createViteServer } = await import(viteModule);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aqua Farmers server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
function unusedDuplicateServerDefinition() {
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent database store initialized with verified realistic aquaculture data
interface UserRecord {
  id: number;
  name: string;
  mobile: string;
  email: string;
  password_hash: string;
  location: string;
  farm_type: string;
  role: 'farmer' | 'admin';
  created_at: string;
}

interface SpeciesRecord {
  id: number;
  name: string;
  category: 'shrimp' | 'fish';
  scientific_name: string;
  description: string;
  ideal_salinity: string;
  ideal_temp: string;
}

interface SeedPriceRecord {
  id: number;
  species_id: number;
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

interface MarketRateRecord {
  id: number;
  species_id: number;
  market_name: string;
  location: string;
  min_price: number;
  max_price: number;
  avg_price: number;
  unit: string;
  count_spec: string;
  trend: 'up' | 'down' | 'stable';
  change_percent: number;
  recorded_date: string;
  updated_by_admin: string;
}

interface MarketHistoryItem {
  id: number;
  species_id: number;
  market_name: string;
  date: string;
  avg_price: number;
  min_price: number;
  max_price: number;
}

interface DiseaseAdvisoryRecord {
  id: number;
  disease_name: string;
  affected_species: string;
  species_id: number | null;
  category: 'shrimp' | 'fish' | 'both';
  symptoms: string[];
  seasonal_risk_period: string;
  favorable_conditions: string;
  prevention_measures: string[];
  recommended_steps: string[];
  risk_level: 'High' | 'Moderate' | 'Low' | 'Seasonal Watch';
  is_outbreak: boolean;
  source: string;
  publication_date: string;
  disclaimer: string;
}

interface PriceHistoryRecord {
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

// Simple password hashing helper
function hashPassword(pwd: string): string {
  return crypto.createHash('sha256').update(pwd + '_aqua_salt_2026').digest('hex');
}

// Initial Mock Data
let users: UserRecord[] = [
  {
    id: 1,
    name: 'Ramesh Naidu',
    mobile: '+91 98480 12345',
    email: 'ramesh.farmer@aquafarmers.in',
    password_hash: hashPassword('farmer123'),
    location: 'Bhimavaram, Andhra Pradesh',
    farm_type: 'Shrimp Farming (Vannamei)',
    role: 'farmer',
    created_at: '2026-09-15 10:30:00',
  },
  {
    id: 2,
    name: 'Priya Patel',
    mobile: '+91 97230 45678',
    email: 'priya.patel@aquafarmers.in',
    password_hash: hashPassword('farmer123'),
    location: 'Surat, Gujarat',
    farm_type: 'Brackish Water Aquaculture',
    role: 'farmer',
    created_at: '2026-10-01 14:20:00',
  },
  {
    id: 3,
    name: 'Dr. K.V. Rao',
    mobile: '+91 94401 99887',
    email: 'admin@aquafarmers.in',
    password_hash: hashPassword('admin123'),
    location: 'Kakinada, Andhra Pradesh',
    farm_type: 'Aquaculture Extension & Research',
    role: 'admin',
    created_at: '2026-08-01 09:00:00',
  },
];

let speciesList: SpeciesRecord[] = [
  {
    id: 1,
    name: 'Pacific White Shrimp (Vannamei)',
    category: 'shrimp',
    scientific_name: 'Litopenaeus vannamei',
    description: 'Fast-growing brackish water shrimp with high stocking density tolerance and high export value.',
    ideal_salinity: '10 - 28 ppt',
    ideal_temp: '26°C - 32°C',
  },
  {
    id: 2,
    name: 'Black Tiger Shrimp (Monodon)',
    category: 'shrimp',
    scientific_name: 'Penaeus monodon',
    description: 'Large sized native tiger prawn, resilient to wide salinity, preferred in polyculture and organic farms.',
    ideal_salinity: '15 - 30 ppt',
    ideal_temp: '28°C - 33°C',
  },
  {
    id: 3,
    name: 'Rohu (Indian Major Carp)',
    category: 'fish',
    scientific_name: 'Labeo rohita',
    description: 'Leading freshwater aquaculture species in India, bottom-column feeder, popular in domestic markets.',
    ideal_salinity: '0 - 4 ppt',
    ideal_temp: '24°C - 30°C',
  },
  {
    id: 4,
    name: 'Catla (Indian Major Carp)',
    category: 'fish',
    scientific_name: 'Gibelion catla',
    description: 'Surface feeder with fast initial growth, high protein content and broad consumer demand.',
    ideal_salinity: '0 - 3 ppt',
    ideal_temp: '25°C - 32°C',
  },
  {
    id: 5,
    name: 'Nile Tilapia (GIFT)',
    category: 'fish',
    scientific_name: 'Oreochromis niloticus',
    description: 'Hardy omnivore suited for pond, biofloc, and cage culture with excellent feed conversion ratio.',
    ideal_salinity: '0 - 15 ppt',
    ideal_temp: '27°C - 31°C',
  },
  {
    id: 6,
    name: 'Asian Seabass (Barramundi)',
    category: 'fish',
    scientific_name: 'Lates calcarifer',
    description: 'High-value euryhaline carnivore with high domestic and restaurant demand.',
    ideal_salinity: '10 - 35 ppt',
    ideal_temp: '26°C - 32°C',
  },
  {
    id: 7,
    name: 'Pangasius (Striped Catfish)',
    category: 'fish',
    scientific_name: 'Pangasianodon hypophthalmus',
    description: 'High biomass freshwater catfish capable of surface breathing; ideal for high stocking intensive ponds.',
    ideal_salinity: '0 - 2 ppt',
    ideal_temp: '26°C - 30°C',
  },
];

let seedPrices: SeedPriceRecord[] = [
  {
    id: 1,
    species_id: 1,
    supplier_name: 'Apex Marine Hatcheries (CAA Approved)',
    location: 'Kakinada, Andhra Pradesh',
    price: 360,
    unit: 'per 1,000 PL (Post-Larvae PL-10)',
    availability: 'In Stock',
    contact_number: '+91 884 2341090',
    contact_email: 'sales@apexaqua.com',
    notes: 'SPF Broodstock imported from Hawaii, 100% PCR negative for WSSV/EHP/IMNV',
    pcr_certified: true,
    last_updated: '2026-10-21',
  },
  {
    id: 2,
    species_id: 1,
    supplier_name: 'Sagar Coastal Bio-Seeds',
    location: 'Marakkanam, Tamil Nadu',
    price: 340,
    unit: 'per 1,000 PL (Post-Larvae PL-11)',
    availability: 'Low Stock',
    contact_number: '+91 4147 223400',
    contact_email: 'info@sagarbioseeds.in',
    notes: 'Strict quarantine batch. Stress-tested for 15-minute formalin & salinity shock.',
    pcr_certified: true,
    last_updated: '2026-10-20',
  },
  {
    id: 3,
    species_id: 1,
    supplier_name: 'Gujarat Maritime Hatchery',
    location: 'Porbandar, Gujarat',
    price: 380,
    unit: 'per 1,000 PL (Post-Larvae PL-12)',
    availability: 'In Stock',
    contact_number: '+91 286 2248900',
    contact_email: 'gujaratseeds@seahatch.org',
    notes: 'Cold tolerance screened batch for northern coastal zones.',
    pcr_certified: true,
    last_updated: '2026-10-22',
  },
  {
    id: 4,
    species_id: 2,
    supplier_name: 'Sundarbans Natural Marine Hatchery',
    location: 'Kakdwip, West Bengal',
    price: 650,
    unit: 'per 1,000 PL (Black Tiger PL-15)',
    availability: 'Pre-booking Only',
    contact_number: '+91 3210 255102',
    contact_email: 'seeds@sundarbansmonodon.com',
    notes: 'Organic certified wild-caught domesticated broodstock, high vigor.',
    pcr_certified: true,
    last_updated: '2026-10-18',
  },
  {
    id: 5,
    species_id: 3,
    supplier_name: 'Godavari Freshwater Seed Farm',
    location: 'Eluru, Andhra Pradesh',
    price: 220,
    unit: 'per 1,000 Fingerlings (3-4 inch)',
    availability: 'In Stock',
    contact_number: '+91 8812 289110',
    contact_email: 'godavarifishseeds@gmail.com',
    notes: 'Jayanti Rohu variety with proven 17% higher growth rate.',
    pcr_certified: true,
    last_updated: '2026-10-19',
  },
  {
    id: 6,
    species_id: 4,
    supplier_name: 'Bhubaneswar State Pisciculture Hatchery',
    location: 'Khurda, Odisha',
    price: 240,
    unit: 'per 1,000 Fingerlings (4-5 inch)',
    availability: 'In Stock',
    contact_number: '+91 674 2598341',
    contact_email: 'odishaseeds@pisciculture.gov.in',
    notes: 'Induced breeding batch from selected 5-year disease-free broodstock.',
    pcr_certified: true,
    last_updated: '2026-10-19',
  },
  {
    id: 7,
    species_id: 5,
    supplier_name: 'RGCA Aqua Hatchery',
    location: 'Sirkazhi, Tamil Nadu',
    price: 180,
    unit: 'per 1,000 All-Male Monosex Fry',
    availability: 'In Stock',
    contact_number: '+91 4364 277200',
    contact_email: 'sirkazhi@rgca.org.in',
    notes: 'Genetically Improved Farmed Tilapia (GIFT) 99.5% male ratio verified.',
    pcr_certified: true,
    last_updated: '2026-10-21',
  },
  {
    id: 8,
    species_id: 6,
    supplier_name: 'CIBA Experimental Seabass Hatchery',
    location: 'Muttukadu, Chennai, Tamil Nadu',
    price: 1200,
    unit: 'per 1,000 Weaned Fingerlings (1.5 inch)',
    availability: 'Pre-booking Only',
    contact_number: '+91 44 27472061',
    contact_email: 'seabass@ciba.res.in',
    notes: 'Nursery weaned onto commercial extruded pellet feed.',
    pcr_certified: true,
    last_updated: '2026-10-15',
  },
];

let marketRates: MarketRateRecord[] = [
  {
    id: 1,
    species_id: 1,
    market_name: 'Bhimavaram Central Aqua Mandi',
    location: 'West Godavari, Andhra Pradesh',
    min_price: 360,
    max_price: 395,
    avg_price: 378,
    unit: 'per kg',
    count_spec: '30 Count (33g/pc)',
    trend: 'up',
    change_percent: 3.5,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 2,
    species_id: 1,
    market_name: 'Bhimavaram Central Aqua Mandi',
    location: 'West Godavari, Andhra Pradesh',
    min_price: 290,
    max_price: 320,
    avg_price: 305,
    unit: 'per kg',
    count_spec: '40 Count (25g/pc)',
    trend: 'stable',
    change_percent: 0.0,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 3,
    species_id: 1,
    market_name: 'Surat Seafood Wholesale Hub',
    location: 'Olpad / Surat, Gujarat',
    min_price: 375,
    max_price: 410,
    avg_price: 392,
    unit: 'per kg',
    count_spec: '30 Count (33g/pc)',
    trend: 'up',
    change_percent: 4.8,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 4,
    species_id: 1,
    market_name: 'Kolkata Wholesale Fish Terminal',
    location: 'Howrah, West Bengal',
    min_price: 240,
    max_price: 270,
    avg_price: 255,
    unit: 'per kg',
    count_spec: '60 Count (16g/pc)',
    trend: 'down',
    change_percent: -2.1,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 5,
    species_id: 2,
    market_name: 'Nellore Coastal Seafood Exchange',
    location: 'Nellore, Andhra Pradesh',
    min_price: 680,
    max_price: 740,
    avg_price: 710,
    unit: 'per kg',
    count_spec: '20 Count Large (50g/pc)',
    trend: 'up',
    change_percent: 5.2,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 6,
    species_id: 3,
    market_name: 'Vijayawada Fish Market Yard',
    location: 'Krishna, Andhra Pradesh',
    min_price: 135,
    max_price: 155,
    avg_price: 145,
    unit: 'per kg',
    count_spec: '1.5 - 2.0 kg Table Fish',
    trend: 'stable',
    change_percent: 0.5,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 7,
    species_id: 4,
    market_name: 'Siliguri Wholesale Fishery Hub',
    location: 'Darjeeling, West Bengal',
    min_price: 160,
    max_price: 190,
    avg_price: 175,
    unit: 'per kg',
    count_spec: '2.0 - 3.0 kg Live Fish',
    trend: 'up',
    change_percent: 2.9,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
  {
    id: 8,
    species_id: 5,
    market_name: 'Kochi Marine Drive Fish Auction',
    location: 'Ernakulam, Kerala',
    min_price: 120,
    max_price: 140,
    avg_price: 130,
    unit: 'per kg',
    count_spec: '500g - 800g Gutted/Live',
    trend: 'stable',
    change_percent: -1.0,
    recorded_date: '2026-10-22',
    updated_by_admin: 'Dr. K.V. Rao',
  },
];

// Historical rates for Chart.js rendering (Past 12 weeks / recent dates)
let marketHistory: MarketHistoryItem[] = [
  // Vannamei 30 count Bhimavaram
  { id: 1, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-08-01', avg_price: 345, min_price: 330, max_price: 360 },
  { id: 2, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-08-15', avg_price: 350, min_price: 335, max_price: 365 },
  { id: 3, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-09-01', avg_price: 358, min_price: 340, max_price: 375 },
  { id: 4, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-09-15', avg_price: 362, min_price: 345, max_price: 380 },
  { id: 5, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-10-01', avg_price: 365, min_price: 350, max_price: 385 },
  { id: 6, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-10-15', avg_price: 372, min_price: 355, max_price: 390 },
  { id: 7, species_id: 1, market_name: 'Bhimavaram Central Aqua Mandi', date: '2026-10-22', avg_price: 378, min_price: 360, max_price: 395 },

  // Black Tiger 20 count Nellore
  { id: 8, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-08-01', avg_price: 660, min_price: 630, max_price: 690 },
  { id: 9, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-08-15', avg_price: 675, min_price: 645, max_price: 700 },
  { id: 10, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-09-01', avg_price: 680, min_price: 650, max_price: 710 },
  { id: 11, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-09-15', avg_price: 690, min_price: 660, max_price: 720 },
  { id: 12, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-10-01', avg_price: 695, min_price: 670, max_price: 725 },
  { id: 13, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-10-15', avg_price: 700, min_price: 675, max_price: 730 },
  { id: 14, species_id: 2, market_name: 'Nellore Coastal Seafood Exchange', date: '2026-10-22', avg_price: 710, min_price: 680, max_price: 740 },

  // Rohu Vijayawada
  { id: 15, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-08-01', avg_price: 138, min_price: 130, max_price: 145 },
  { id: 16, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-08-15', avg_price: 140, min_price: 132, max_price: 148 },
  { id: 17, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-09-01', avg_price: 142, min_price: 132, max_price: 150 },
  { id: 18, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-09-15', avg_price: 144, min_price: 134, max_price: 152 },
  { id: 19, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-10-01', avg_price: 143, min_price: 133, max_price: 151 },
  { id: 20, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-10-15', avg_price: 144, min_price: 135, max_price: 153 },
  { id: 21, species_id: 3, market_name: 'Vijayawada Fish Market Yard', date: '2026-10-22', avg_price: 145, min_price: 135, max_price: 155 },
];

let diseaseAdvisories: DiseaseAdvisoryRecord[] = [
  {
    id: 1,
    disease_name: 'White Spot Syndrome Virus (WSSV)',
    affected_species: 'Pacific White Shrimp (Vannamei), Black Tiger Shrimp (Monodon)',
    species_id: 1,
    category: 'shrimp',
    symptoms: [
      'Circular white spots (0.5 - 2.0 mm) embedded on inner carapace surface',
      'Sudden reduction in feed consumption (empty gut observed in check tray)',
      'Shrimp lethargically swimming near pond dyke or surface during daytime',
      'Reddish to pinkish discoloration of body and appendages',
      'Rapid cumulative mortality reaching 80-100% within 3 to 7 days if unmanaged',
    ],
    seasonal_risk_period: 'Winter & Northeast Monsoon (Late October to February)',
    favorable_conditions: 'Water temperature dropping below 26°C; sudden fluctuations in salinity after heavy monsoon rain; crab intrusion.',
    prevention_measures: [
      'Stock only SPF Post-Larvae screened double-PCR negative for WSSV',
      'Erect crab-proof dyke fencing (minimum 50 cm high) and bird scare netting',
      'Maintain stable water depth (>1.2 meters) to minimize diurnal water temperature swings',
      'Disinfect inlet water in reservoir with 30 ppm active chlorine and age for minimum 4 days',
    ],
    recommended_steps: [
      'Step 1: Do not pump water in or out of the pond; seal sluice gates completely.',
      'Step 2: Collect 10 freshly moribund shrimp in sterile saline and immediately contact local District Fisheries Officer or CIBA laboratory.',
      'Step 3: If confirmed positive by PCR, chlorinate the affected pond at 30 ppm before any disposal to prevent neighbor infection.',
    ],
    risk_level: 'High',
    is_outbreak: false, // Explicit educational advisory
    source: 'ICAR - Central Institute of Brackishwater Aquaculture (CIBA) Advisory Bulletin 2026',
    publication_date: '2026-10-10',
    disclaimer: 'Advisory Notice: This is seasonal educational biosecurity information. There is no official area-wide emergency declared. Consult a certified aquatic animal health professional for pond diagnostic screening.',
  },
  {
    id: 2,
    disease_name: 'Enterocytozoon hepatopenaei (EHP) - Microsporidiosis',
    affected_species: 'Pacific White Shrimp (P. vannamei)',
    species_id: 1,
    category: 'shrimp',
    symptoms: [
      'Severe growth retardation and wide size disparity within the same pond crop',
      'White feces or pale discolored digestive gland (hepatopancreas)',
      'Soft shell and opaque abdominal muscles',
      'Low mortality but extreme feed conversion penalty (FCR exceeding 2.2)',
    ],
    seasonal_risk_period: 'All Seasons / Peak post-stocking Days of Culture 35-70',
    favorable_conditions: 'High pond bottom organic sludge accumulation; infected live feed (polychaetes); lack of pond bottom desiccation.',
    prevention_measures: [
      'Dry pond bottoms until soil cracks 2-3 inches deep, followed by lime treatment (CaO @ 1000 kg/ha) to reach pH 12',
      'Avoid unpasteurized live polychaetes or fresh squids in broodstock / nurseries',
      'Screen PL using sensitive qPCR for EHP spores',
    ],
    recommended_steps: [
      'Step 1: Submit hepatopancreas tissue for Giemsa stain and qPCR spore count.',
      'Step 2: Supplement feed with gut probiotics and organic acids under veterinary guidance.',
      'Step 3: Increase bottom siphon frequency to remove organic spores.',
    ],
    risk_level: 'Moderate',
    is_outbreak: false,
    source: 'National Surveillance Programme for Aquatic Animal Diseases (NSPAAD)',
    publication_date: '2026-09-28',
    disclaimer: 'Educational advisory only. Confirm diagnosis with a certified aquatic animal health professional or state fisheries lab before medication.',
  },
  {
    id: 3,
    disease_name: 'Early Mortality Syndrome / AHPND (Vibrio parahaemolyticus)',
    affected_species: 'Shrimp (Vannamei and Monodon)',
    species_id: 1,
    category: 'shrimp',
    symptoms: [
      'Acute mortality occurring within the first 35 days post-stocking',
      'Pale, shrunken, and atrophied hepatopancreas',
      'Empty stomach and midgut with corkscrew erratic swimming',
      'Soft shells and blackened spots on internal organ tissue',
    ],
    seasonal_risk_period: 'Summer & Early Monsoon (Warm season 30°C+)',
    favorable_conditions: 'High Vibrio counts in pond water (>10^3 CFU/ml green colonies); high un-ionized ammonia and pH swings > 8.5.',
    prevention_measures: [
      'Apply polyculture techniques with Tilapia green water (natural bactericidal peptides)',
      'Regular application of Bacillus subtilis and nitrifying probiotics',
      'Avoid overfeeding in nursery phase; utilize automatic check trays',
    ],
    recommended_steps: [
      'Step 1: Plate water on TCBS agar to assess yellow vs green Vibrio colony ratios.',
      'Step 2: Cease artificial feeding for 24 hours to reduce gut stress.',
      'Step 3: Consult qualified aquaculture pathologist for authorized bacteriophage or probiotic intervention.',
    ],
    risk_level: 'High',
    is_outbreak: false,
    source: 'Aquaculture Biosecurity Center Guidelines',
    publication_date: '2026-08-15',
    disclaimer: 'Educational advisory only. Confirm diagnosis with a certified aquatic animal health professional or state fisheries lab before medication.',
  },
  {
    id: 4,
    disease_name: 'Tilapia Parvovirus & ISKNV (Infectious Spleen & Kidney Necrosis)',
    affected_species: 'Nile Tilapia (GIFT), Red Tilapia',
    species_id: 5,
    category: 'fish',
    symptoms: [
      'Lethargy and abnormal schooling near pond corners',
      'Abdominal swelling (ascites) and exophthalmia (pop-eye)',
      'Enlarged dark spleen and mottled pale kidneys upon autopsy',
      'Loss of appetite and dark skin pigmentation',
    ],
    seasonal_risk_period: 'Monsoon transition and cool temperature drops (22°C - 26°C)',
    favorable_conditions: 'High stocking densities (>15 fish/m²); poor water exchange; low dissolved oxygen (< 3 mg/L).',
    prevention_measures: [
      'Quarantine newly purchased seed fingerlings for 14 days before pond release',
      'Maintain dissolved oxygen levels above 4.5 ppm with continuous aeration',
      'Vaccinate broodstock where certified viral vaccines are locally approved',
    ],
    recommended_steps: [
      'Step 1: Isolate affected hapas or ponds immediately.',
      'Step 2: Cease fertilization and feed high Vitamin C immunostimulant diet.',
      'Step 3: Transport preserved tissue samples in 95% ethanol to college of fisheries virology unit.',
    ],
    risk_level: 'Moderate',
    is_outbreak: false,
    source: 'National Fisheries Development Board (NFDB) Technical Notice',
    publication_date: '2026-10-05',
    disclaimer: 'Educational advisory only. Confirm diagnosis with a certified aquatic animal health professional or state fisheries lab before medication.',
  },
  {
    id: 5,
    disease_name: 'Columnaris & Fin Rot (Flavobacterium columnare)',
    affected_species: 'Rohu, Catla, Mrigal, Pangasius',
    species_id: 3,
    category: 'fish',
    symptoms: [
      'Cotton-like white or yellowish lesions on mouth, gills, and skin margins',
      'Frayed, eroded dorsal and caudal fins with necrotic edges',
      'Fish gasping at water surface due to gill filament erosion (saddleback condition)',
    ],
    seasonal_risk_period: 'Post-Monsoon & Winter onset (October - January)',
    favorable_conditions: 'Mechanical injury during harvest/netting; elevated organic matter; unionized ammonia > 0.05 ppm.',
    prevention_measures: [
      'Handle fingerlings gently during drag-netting and dip in 3% saline or potassium permanganate (2 ppm) before stocking',
      'Maintain optimal pond sanitation with periodic agricultural limestone dosing',
      'Avoid overcrowding during winter low-metabolism periods',
    ],
    recommended_steps: [
      'Step 1: Conduct water exchange of 20% with clean reservoir water.',
      'Step 2: Administer approved aquatic antiseptic bath or dietary herbal extracts under veterinary prescription.',
      'Step 3: Consult local fish health officer for antibiogram sensitivity testing.',
    ],
    risk_level: 'Seasonal Watch',
    is_outbreak: false,
    source: 'ICAR - Central Institute of Freshwater Aquaculture (CIFA)',
    publication_date: '2026-10-18',
    disclaimer: 'Educational advisory only. Confirm diagnosis with a certified aquatic animal health professional or state fisheries lab before medication.',
  },
];

let favoriteSpecies: { [userId: number]: number[] } = {
  1: [1, 2], // Ramesh Naidu favorites Vannamei and Black Tiger
  2: [1, 5], // Priya Patel favorites Vannamei and Tilapia
};

let priceHistory: PriceHistoryRecord[] = [
  {
    id: 1,
    species_id: 1,
    species_name: 'Pacific White Shrimp (Vannamei)',
    market_or_supplier: 'Bhimavaram Central Aqua Mandi',
    record_type: 'market_rate',
    previous_price: 365,
    new_price: 378,
    unit: 'per kg (30 count)',
    update_time: '2026-10-22 07:15:00',
    admin_id: 3,
    admin_name: 'Dr. K.V. Rao',
    notes: 'Verified morning mandi auction arrival sheets. Export demand uptick.',
  },
  {
    id: 2,
    species_id: 1,
    species_name: 'Pacific White Shrimp (Vannamei)',
    market_or_supplier: 'Apex Marine Hatcheries',
    record_type: 'seed_price',
    previous_price: 350,
    new_price: 360,
    unit: 'per 1,000 PL',
    update_time: '2026-10-21 16:40:00',
    admin_id: 3,
    admin_name: 'Dr. K.V. Rao',
    notes: 'Hatchery price revision for late autumn stocking cycle.',
  },
  {
    id: 3,
    species_id: 2,
    species_name: 'Black Tiger Shrimp (Monodon)',
    market_or_supplier: 'Nellore Coastal Seafood Exchange',
    record_type: 'market_rate',
    previous_price: 695,
    new_price: 710,
    unit: 'per kg (20 count)',
    update_time: '2026-10-22 08:00:00',
    admin_id: 3,
    admin_name: 'Dr. K.V. Rao',
    notes: 'European Christmas purchase order contracts verified.',
  },
];

// Helper to get user from token/header or query
function getAuthenticatedUser(req: Request): UserRecord | null {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    // Simple demo token decode: "uid-<id>"
    if (token.startsWith('uid-')) {
      const uid = parseInt(token.replace('uid-', ''), 10);
      const found = users.find((u) => u.id === uid);
      if (found) return found;
    }
  }
  return null;
}

// REST API ROUTES

// 1. Auth routes
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, mobile, email, password, location, farm_type } = req.body;
  if (!name || !email || !password || !mobile || !location) {
    return res.status(400).json({ error: 'All fields (Name, Mobile, Email, Password, Location) are required.' });
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newUser: UserRecord = {
    id: users.length + 1,
    name,
    mobile,
    email,
    password_hash: hashPassword(password),
    location,
    farm_type: farm_type || 'Shrimp & Fish Farming',
    role: 'farmer',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  users.push(newUser);
  favoriteSpecies[newUser.id] = [1]; // default favorite

  const token = `uid-${newUser.id}`;
  const { password_hash, ...safeUser } = newUser;
  return res.json({
    message: 'Farmer registered successfully',
    user: safeUser,
    token,
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password_hash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = `uid-${user.id}`;
  const { password_hash, ...safeUser } = user;
  return res.json({
    message: 'Login successful',
    user: safeUser,
    token,
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { password_hash, ...safeUser } = user;
  return res.json({ user: safeUser });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required to update profile' });
  }

  const { name, mobile, location, farm_type, new_password } = req.body;
  if (name) user.name = name;
  if (mobile) user.mobile = mobile;
  if (location) user.location = location;
  if (farm_type) user.farm_type = farm_type;
  if (new_password && new_password.trim().length >= 6) {
    user.password_hash = hashPassword(new_password);
  }

  const { password_hash, ...safeUser } = user;
  return res.json({ message: 'Profile updated successfully', user: safeUser });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
});

// 2. Species Catalog
app.get('/api/species', (req: Request, res: Response) => {
  return res.json(speciesList);
});

// 3. Seed Prices
app.get('/api/seed-prices', (req: Request, res: Response) => {
  const { species_id, location, availability, search, max_price } = req.query;

  let results = seedPrices.map((sp) => {
    const spec = speciesList.find((s) => s.id === sp.species_id);
    return {
      ...sp,
      species_name: spec ? spec.name : 'Unknown Species',
      category: spec ? spec.category : 'shrimp',
    };
  });

  if (species_id && species_id !== 'all') {
    results = results.filter((r) => r.species_id === parseInt(species_id as string, 10));
  }
  if (location && location !== 'all') {
    const locLower = (location as string).toLowerCase();
    results = results.filter((r) => r.location.toLowerCase().includes(locLower));
  }
  if (availability && availability !== 'all') {
    results = results.filter((r) => r.availability === availability);
  }
  if (max_price) {
    const max = parseFloat(max_price as string);
    if (!isNaN(max)) {
      results = results.filter((r) => r.price <= max);
    }
  }
  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(
      (r) =>
        r.supplier_name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        (r.species_name && r.species_name.toLowerCase().includes(q))
    );
  }

  return res.json(results);
});

// 4. Market Rates
app.get('/api/market-rates', (req: Request, res: Response) => {
  const { species_id, location, search } = req.query;

  let results = marketRates.map((mr) => {
    const spec = speciesList.find((s) => s.id === mr.species_id);
    return {
      ...mr,
      species_name: spec ? spec.name : 'Unknown Species',
      category: spec ? spec.category : 'shrimp',
    };
  });

  if (species_id && species_id !== 'all') {
    results = results.filter((r) => r.species_id === parseInt(species_id as string, 10));
  }
  if (location && location !== 'all') {
    const locLower = (location as string).toLowerCase();
    results = results.filter((r) => r.location.toLowerCase().includes(locLower));
  }
  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(
      (r) =>
        r.market_name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        (r.species_name && r.species_name.toLowerCase().includes(q)) ||
        r.count_spec.toLowerCase().includes(q)
    );
  }

  return res.json(results);
});

// 4B. Market Rate History (for Chart.js)
app.get('/api/market-rates/history/:species_id', (req: Request, res: Response) => {
  const speciesId = parseInt(req.params.species_id, 10);
  const { market } = req.query;

  let history = marketHistory.filter((h) => h.species_id === speciesId);
  if (market && market !== 'all') {
    history = history.filter((h) => h.market_name.toLowerCase().includes((market as string).toLowerCase()));
  }

  // Sort chronologically
  history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return res.json(history);
});

// 5. Seasonal Disease Advisories
app.get('/api/disease-advisories', (req: Request, res: Response) => {
  const { species, season, risk_level, search } = req.query;

  let results = [...diseaseAdvisories];

  if (species && species !== 'all') {
    const specLower = (species as string).toLowerCase();
    results = results.filter(
      (d) =>
        d.affected_species.toLowerCase().includes(specLower) ||
        d.category.toLowerCase() === specLower
    );
  }
  if (season && season !== 'all') {
    results = results.filter((d) => d.seasonal_risk_period.toLowerCase().includes((season as string).toLowerCase()));
  }
  if (risk_level && risk_level !== 'all') {
    results = results.filter((d) => d.risk_level.toLowerCase() === (risk_level as string).toLowerCase());
  }
  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(
      (d) =>
        d.disease_name.toLowerCase().includes(q) ||
        d.affected_species.toLowerCase().includes(q) ||
        d.symptoms.some((s) => s.toLowerCase().includes(q))
    );
  }

  return res.json(results);
});

// 6. Farmer Dashboard Aggregation
app.get('/api/dashboard', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const userId = user ? user.id : 1; // Default to Ramesh Naidu demo view if unauthenticated
  const favIds = favoriteSpecies[userId] || [1];

  const farmerRates = marketRates.filter((mr) => favIds.includes(mr.species_id)).map((mr) => {
    const spec = speciesList.find((s) => s.id === mr.species_id);
    return {
      ...mr,
      species_name: spec ? spec.name : 'Species',
      category: spec ? spec.category : 'shrimp',
    };
  });

  const locationKeywords = user && user.location ? user.location.toLowerCase().split(/[ ,]+/) : ['andhra', 'bhimavaram'];
  const locAdvisories = diseaseAdvisories.filter((d) => {
    // Show high risk or species relevant to farmer
    return d.risk_level === 'High' || d.category === 'shrimp';
  });

  return res.json({
    farmer: user || users[0],
    today_seed_prices: seedPrices.slice(0, 4).map((sp) => {
      const spec = speciesList.find((s) => s.id === sp.species_id);
      return { ...sp, species_name: spec?.name, category: spec?.category };
    }),
    latest_market_rates: marketRates.slice(0, 4).map((mr) => {
      const spec = speciesList.find((s) => s.id === mr.species_id);
      return { ...mr, species_name: spec?.name, category: spec?.category };
    }),
    seasonal_disease_alerts: diseaseAdvisories.filter((d) => d.risk_level === 'High'),
    recent_price_changes: priceHistory.slice(0, 5),
    favorite_species_ids: favIds,
    favorite_species_rates: farmerRates,
    location_advisories: locAdvisories,
    stats: {
      total_species: speciesList.length,
      active_suppliers: seedPrices.length,
      active_mandis: new Set(marketRates.map((m) => m.market_name)).size,
      active_advisories: diseaseAdvisories.length,
    },
  });
});

// 7. Favorite Species Toggle
app.post('/api/favorites/toggle', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const userId = user ? user.id : 1;
  const { species_id } = req.body;

  if (!species_id) {
    return res.status(400).json({ error: 'species_id is required' });
  }

  if (!favoriteSpecies[userId]) {
    favoriteSpecies[userId] = [];
  }

  const idx = favoriteSpecies[userId].indexOf(species_id);
  if (idx > -1) {
    favoriteSpecies[userId].splice(idx, 1);
  } else {
    favoriteSpecies[userId].push(species_id);
  }

  return res.json({
    message: 'Favorites updated',
    favorite_species_ids: favoriteSpecies[userId],
  });
});

// ADMIN ROUTES (Protected with role checking)
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Administrator authorization required.' });
  }
  next();
}

// Seed Prices CRUD
app.post('/api/admin/seed-prices', requireAdmin, (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req)!;
  const { species_id, supplier_name, location, price, unit, availability, contact_number, contact_email, notes, pcr_certified } = req.body;

  if (!species_id || !supplier_name || !price || !unit) {
    return res.status(400).json({ error: 'species_id, supplier_name, price, and unit are required' });
  }

  const newSeed: SeedPriceRecord = {
    id: seedPrices.length > 0 ? Math.max(...seedPrices.map((s) => s.id)) + 1 : 1,
    species_id: parseInt(species_id, 10),
    supplier_name,
    location: location || 'Verified Hatchery Zone',
    price: parseFloat(price),
    unit,
    availability: availability || 'In Stock',
    contact_number: contact_number || '+91 800 000 0000',
    contact_email: contact_email || 'hatchery@aquafarmers.in',
    notes: notes || 'CAA Registered',
    pcr_certified: !!pcr_certified,
    last_updated: new Date().toISOString().substring(0, 10),
  };

  seedPrices.unshift(newSeed);

  // Log to price history audit
  const spec = speciesList.find((s) => s.id === newSeed.species_id);
  priceHistory.unshift({
    id: priceHistory.length + 1,
    species_id: newSeed.species_id,
    species_name: spec ? spec.name : 'Aquaculture Seed',
    market_or_supplier: newSeed.supplier_name,
    record_type: 'seed_price',
    previous_price: 0,
    new_price: newSeed.price,
    unit: newSeed.unit,
    update_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    admin_id: user.id,
    admin_name: user.name,
    notes: `Added new seed listing for ${newSeed.supplier_name}`,
  });

  return res.json({ message: 'Seed price listing created successfully', record: newSeed });
});

app.put('/api/admin/seed-prices/:id', requireAdmin, (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req)!;
  const id = parseInt(req.params.id, 10);
  const item = seedPrices.find((s) => s.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Seed price record not found' });
  }

  const prevPrice = item.price;
  const { price, availability, location, contact_number, notes, pcr_certified } = req.body;

  if (price !== undefined) item.price = parseFloat(price);
  if (availability !== undefined) item.availability = availability;
  if (location !== undefined) item.location = location;
  if (contact_number !== undefined) item.contact_number = contact_number;
  if (notes !== undefined) item.notes = notes;
  if (pcr_certified !== undefined) item.pcr_certified = !!pcr_certified;
  item.last_updated = new Date().toISOString().substring(0, 10);

  // Audit log
  const spec = speciesList.find((s) => s.id === item.species_id);
  priceHistory.unshift({
    id: priceHistory.length + 1,
    species_id: item.species_id,
    species_name: spec ? spec.name : 'Aquaculture Seed',
    market_or_supplier: item.supplier_name,
    record_type: 'seed_price',
    previous_price: prevPrice,
    new_price: item.price,
    unit: item.unit,
    update_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    admin_id: user.id,
    admin_name: user.name,
    notes: req.body.notes || 'Updated seed price record',
  });

  return res.json({ message: 'Seed price record updated', record: item });
});

app.delete('/api/admin/seed-prices/:id', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  seedPrices = seedPrices.filter((s) => s.id !== id);
  return res.json({ message: 'Seed price record deleted' });
});

// Market Rates CRUD
app.post('/api/admin/market-rates', requireAdmin, (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req)!;
  const { species_id, market_name, location, min_price, max_price, avg_price, unit, count_spec } = req.body;

  if (!species_id || !market_name || !min_price || !max_price) {
    return res.status(400).json({ error: 'species_id, market_name, min_price, and max_price are required' });
  }

  const min = parseFloat(min_price);
  const max = parseFloat(max_price);
  const avg = avg_price ? parseFloat(avg_price) : Math.round(((min + max) / 2) * 10) / 10;

  const newRate: MarketRateRecord = {
    id: marketRates.length > 0 ? Math.max(...marketRates.map((m) => m.id)) + 1 : 1,
    species_id: parseInt(species_id, 10),
    market_name,
    location: location || 'Wholesale Mandi',
    min_price: min,
    max_price: max,
    avg_price: avg,
    unit: unit || 'per kg',
    count_spec: count_spec || 'Standard count',
    trend: 'stable',
    change_percent: 0,
    recorded_date: new Date().toISOString().substring(0, 10),
    updated_by_admin: user.name,
  };

  marketRates.unshift(newRate);

  // Add historical data point
  marketHistory.push({
    id: marketHistory.length + 1,
    species_id: newRate.species_id,
    market_name: newRate.market_name,
    date: newRate.recorded_date,
    avg_price: newRate.avg_price,
    min_price: newRate.min_price,
    max_price: newRate.max_price,
  });

  const spec = speciesList.find((s) => s.id === newRate.species_id);
  priceHistory.unshift({
    id: priceHistory.length + 1,
    species_id: newRate.species_id,
    species_name: spec ? spec.name : 'Fish/Shrimp',
    market_or_supplier: newRate.market_name,
    record_type: 'market_rate',
    previous_price: 0,
    new_price: newRate.avg_price,
    unit: newRate.unit,
    update_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    admin_id: user.id,
    admin_name: user.name,
    notes: `Initial mandi entry: Min ₹${min} - Max ₹${max} ${newRate.count_spec}`,
  });

  return res.json({ message: 'Market rate published successfully', record: newRate });
});

app.put('/api/admin/market-rates/:id', requireAdmin, (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req)!;
  const id = parseInt(req.params.id, 10);
  const rate = marketRates.find((m) => m.id === id);

  if (!rate) {
    return res.status(404).json({ error: 'Market rate record not found' });
  }

  const prevAvg = rate.avg_price;
  const { min_price, max_price, avg_price, count_spec } = req.body;

  if (min_price !== undefined) rate.min_price = parseFloat(min_price);
  if (max_price !== undefined) rate.max_price = parseFloat(max_price);
  if (count_spec !== undefined) rate.count_spec = count_spec;

  if (avg_price !== undefined) {
    rate.avg_price = parseFloat(avg_price);
  } else {
    rate.avg_price = Math.round(((rate.min_price + rate.max_price) / 2) * 10) / 10;
  }

  rate.change_percent = Math.round(((rate.avg_price - prevAvg) / prevAvg) * 1000) / 10;
  rate.trend = rate.change_percent > 0.5 ? 'up' : rate.change_percent < -0.5 ? 'down' : 'stable';
  rate.recorded_date = new Date().toISOString().substring(0, 10);
  rate.updated_by_admin = user.name;

  marketHistory.push({
    id: marketHistory.length + 1,
    species_id: rate.species_id,
    market_name: rate.market_name,
    date: rate.recorded_date,
    avg_price: rate.avg_price,
    min_price: rate.min_price,
    max_price: rate.max_price,
  });

  const spec = speciesList.find((s) => s.id === rate.species_id);
  priceHistory.unshift({
    id: priceHistory.length + 1,
    species_id: rate.species_id,
    species_name: spec ? spec.name : 'Fish/Shrimp',
    market_or_supplier: rate.market_name,
    record_type: 'market_rate',
    previous_price: prevAvg,
    new_price: rate.avg_price,
    unit: rate.unit,
    update_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    admin_id: user.id,
    admin_name: user.name,
    notes: `Updated market rate: ₹${rate.min_price} to ₹${rate.max_price} (${rate.count_spec})`,
  });

  return res.json({ message: 'Market rate updated', record: rate });
});

app.delete('/api/admin/market-rates/:id', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  marketRates = marketRates.filter((m) => m.id !== id);
  return res.json({ message: 'Market rate record deleted' });
});

// Disease Advisories CRUD
app.post('/api/admin/disease-advisories', requireAdmin, (req: Request, res: Response) => {
  const {
    disease_name,
    affected_species,
    species_id,
    category,
    symptoms,
    seasonal_risk_period,
    favorable_conditions,
    prevention_measures,
    recommended_steps,
    risk_level,
    is_outbreak,
    source,
  } = req.body;

  if (!disease_name || !affected_species || !seasonal_risk_period) {
    return res.status(400).json({ error: 'disease_name, affected_species, and seasonal_risk_period are required' });
  }

  const newAdvisory: DiseaseAdvisoryRecord = {
    id: diseaseAdvisories.length > 0 ? Math.max(...diseaseAdvisories.map((d) => d.id)) + 1 : 1,
    disease_name,
    affected_species,
    species_id: species_id ? parseInt(species_id, 10) : null,
    category: category || 'shrimp',
    symptoms: Array.isArray(symptoms) ? symptoms : [symptoms],
    seasonal_risk_period,
    favorable_conditions: favorable_conditions || 'Low dissolved oxygen, temperature swings',
    prevention_measures: Array.isArray(prevention_measures) ? prevention_measures : [prevention_measures],
    recommended_steps: Array.isArray(recommended_steps) ? recommended_steps : [recommended_steps],
    risk_level: risk_level || 'Seasonal Watch',
    is_outbreak: !!is_outbreak,
    source: source || 'Verified Fisheries Authority',
    publication_date: new Date().toISOString().substring(0, 10),
    disclaimer: 'Educational advisory only. Confirm diagnosis with a certified aquatic animal health professional or state fisheries lab before medication.',
  };

  diseaseAdvisories.unshift(newAdvisory);
  return res.json({ message: 'Advisory published successfully', record: newAdvisory });
});

app.put('/api/admin/disease-advisories/:id', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const adv = diseaseAdvisories.find((d) => d.id === id);

  if (!adv) {
    return res.status(404).json({ error: 'Advisory not found' });
  }

  const { disease_name, risk_level, is_outbreak, seasonal_risk_period, symptoms, prevention_measures } = req.body;
  if (disease_name) adv.disease_name = disease_name;
  if (risk_level) adv.risk_level = risk_level;
  if (is_outbreak !== undefined) adv.is_outbreak = !!is_outbreak;
  if (seasonal_risk_period) adv.seasonal_risk_period = seasonal_risk_period;
  if (symptoms) adv.symptoms = Array.isArray(symptoms) ? symptoms : [symptoms];
  if (prevention_measures) adv.prevention_measures = Array.isArray(prevention_measures) ? prevention_measures : [prevention_measures];

  return res.json({ message: 'Advisory updated successfully', record: adv });
});

app.delete('/api/admin/disease-advisories/:id', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  diseaseAdvisories = diseaseAdvisories.filter((d) => d.id !== id);
  return res.json({ message: 'Advisory deleted' });
});

// Admin stats & audit logs
app.get('/api/admin/stats', requireAdmin, (req: Request, res: Response) => {
  return res.json({
    total_farmers: users.filter((u) => u.role === 'farmer').length,
    total_seed_listings: seedPrices.length,
    total_market_rates: marketRates.length,
    total_advisories: diseaseAdvisories.length,
    recent_updates_count: priceHistory.length,
  });
});

app.get('/api/admin/price-history', requireAdmin, (req: Request, res: Response) => {
  return res.json(priceHistory);
});

app.get('/api/admin/users', requireAdmin, (req: Request, res: Response) => {
  const safeUsers = users.map(({ password_hash, ...rest }) => rest);
  return res.json(safeUsers);
});

// Setup Vite or static serving
async function startServer() {
  if ((globalThis as unknown as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
    const viteModule = 'vite';
    const { createServer: createViteServer } = await import(viteModule);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aqua Farmers server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
}
