import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Database, FileCode, FolderGit2, BookOpen, Layers } from 'lucide-react';

interface PythonProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonProjectModal: React.FC<PythonProjectModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'schema' | 'models' | 'auth' | 'seed_prices' | 'market_rates' | 'advisories' | 'admin' | 'tests' | 'config'
  >('overview');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets: Record<string, { title: string; filename: string; code: string; desc: string }> = {
    overview: {
      title: 'Project Tree & Architecture',
      filename: 'aqua_farmers/ (Directory Structure)',
      desc: 'Complete modular Python 3.10+ & Flask backend with MySQL and SQLAlchemy ORM.',
      code: `aqua_farmers/
├── app/
│   ├── __init__.py           # Flask app factory, extension init & CLI commands
│   ├── models.py             # SQLAlchemy models for Users, Species, SeedPrices, MarketRates, Advisories
│   ├── extensions.py         # db = SQLAlchemy(), login_manager, migrate, cors
│   └── routes/
│       ├── __init__.py
│       ├── auth.py           # Registration, login, profile, password hashing
│       ├── seed_prices.py    # Seed price listings, species catalog & filters
│       ├── market_rates.py   # Mandi rates & Chart.js history endpoints
│       ├── advisories.py     # Seasonal virus advisories & educational flags
│       ├── admin.py          # Role-protected CRUD & audit logging
│       └── dashboard.py      # Farmer customized dashboard aggregator
├── tests/
│   ├── __init__.py
│   └── test_auth.py          # Pytest suite for auth, permissions & prices
├── config.py                 # Multi-environment config (MySQL / SQLite fallback)
├── run.py                    # Application launch entry point
├── requirements.txt          # Python dependencies
├── schema.sql                # Complete MySQL DDL tables & indexes
├── .env.example              # Environment variable template
└── README.md                 # Setup guide for Windows & Linux`,
    },
    schema: {
      title: 'MySQL Relational Schema (DDL)',
      filename: 'aqua_farmers/schema.sql',
      desc: 'Normalized relational tables with foreign keys, constraints, and query indexes.',
      code: `-- Aqua Farmers MySQL Schema
CREATE DATABASE IF NOT EXISTS aqua_farmers_db CHARACTER SET utf8mb4;
USE aqua_farmers_db;

-- 1. Users Table (Farmers & Admins)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    location VARCHAR(150) NOT NULL,
    farm_type VARCHAR(100) NOT NULL,
    role ENUM('farmer', 'admin') NOT NULL DEFAULT 'farmer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
);

-- 2. Species Table
CREATE TABLE species (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('shrimp', 'fish') NOT NULL,
    scientific_name VARCHAR(120) NOT NULL,
    description TEXT,
    ideal_salinity VARCHAR(50),
    ideal_temp VARCHAR(50)
);

-- 3. Seed Prices Table
CREATE TABLE seed_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    species_id INT NOT NULL,
    supplier_name VARCHAR(150) NOT NULL,
    location VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'per 1,000 seeds',
    availability ENUM('In Stock', 'Low Stock', 'Pre-booking Only', 'Sold Out'),
    contact_number VARCHAR(30) NOT NULL,
    pcr_certified BOOLEAN DEFAULT TRUE,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_seed_species FOREIGN KEY (species_id) REFERENCES species(id) ON DELETE CASCADE
);

-- 4. Market Rates Table
CREATE TABLE market_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    species_id INT NOT NULL,
    market_name VARCHAR(150) NOT NULL,
    location VARCHAR(150) NOT NULL,
    min_price DECIMAL(10,2) NOT NULL,
    max_price DECIMAL(10,2) NOT NULL,
    avg_price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'per kg',
    count_spec VARCHAR(80) NOT NULL,
    trend ENUM('up', 'down', 'stable') DEFAULT 'stable',
    change_percent FLOAT DEFAULT 0.0,
    recorded_date DATE NOT NULL,
    updated_by_admin VARCHAR(100),
    CONSTRAINT fk_market_species FOREIGN KEY (species_id) REFERENCES species(id) ON DELETE CASCADE
);

-- 5. Disease Advisories Table
CREATE TABLE disease_advisories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    disease_name VARCHAR(150) NOT NULL,
    affected_species VARCHAR(200) NOT NULL,
    species_id INT NULL,
    category ENUM('shrimp', 'fish', 'both') DEFAULT 'shrimp',
    symptoms TEXT NOT NULL,
    seasonal_risk_period VARCHAR(100) NOT NULL,
    favorable_conditions TEXT NOT NULL,
    prevention_measures TEXT NOT NULL,
    recommended_steps TEXT NOT NULL,
    risk_level ENUM('High', 'Moderate', 'Low', 'Seasonal Watch') DEFAULT 'Moderate',
    is_outbreak BOOLEAN DEFAULT FALSE,
    source VARCHAR(200) NOT NULL,
    publication_date DATE NOT NULL,
    disclaimer TEXT NOT NULL
);

-- 6. Price History Audit Log
CREATE TABLE price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    species_id INT NOT NULL,
    species_name VARCHAR(100) NOT NULL,
    market_or_supplier VARCHAR(150) NOT NULL,
    record_type ENUM('market_rate', 'seed_price') NOT NULL,
    previous_price DECIMAL(10,2) DEFAULT 0.0,
    new_price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    admin_id INT NULL,
    admin_name VARCHAR(100) NOT NULL,
    notes TEXT,
    CONSTRAINT fk_history_user FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);`,
    },
    models: {
      title: 'SQLAlchemy Models',
      filename: 'aqua_farmers/app/models.py',
      desc: 'UserMixin authentication, relationships, password hashing, and dictionary serializers.',
      code: `from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db, login_manager

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    mobile = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    farm_type = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='farmer')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @property
    def is_admin(self):
        return self.role == 'admin'

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'mobile': self.mobile,
            'email': self.email, 'location': self.location,
            'farm_type': self.farm_type, 'role': self.role
        }`,
    },
    auth: {
      title: 'Authentication & Session Routes',
      filename: 'aqua_farmers/app/routes/auth.py',
      desc: 'Farmer registration, secure password hashing, Flask-Login authentication.',
      code: `from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from app.extensions import db
from app.models import User, FavoriteSpecies

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered.'}), 400

    user = User(
        name=data.get('name'),
        mobile=data.get('mobile'),
        email=email,
        location=data.get('location'),
        farm_type=data.get('farm_type'),
        role='farmer'
    )
    user.set_password(data.get('password'))
    db.session.add(user)
    db.session.commit()

    login_user(user)
    return jsonify({'message': 'Farmer registered successfully', 'user': user.to_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    user = User.query.filter_by(email=data.get('email', '').lower()).first()

    if not user or not user.check_password(data.get('password', '')):
        return jsonify({'error': 'Invalid credentials'}), 401

    login_user(user, remember=True)
    return jsonify({'message': 'Login successful', 'user': user.to_dict()}), 200`,
    },
    admin: {
      title: 'Administrator Routes & Audit Logs',
      filename: 'aqua_farmers/app/routes/admin.py',
      desc: 'Role-based access control (@admin_required) and price history change tracking.',
      code: `from functools import wraps
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.extensions import db
from app.models import SeedPrice, MarketRate, DiseaseAdvisory, PriceHistory, Species

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def admin_required(f):
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        if not current_user.is_admin:
            return jsonify({'error': 'Administrator authorization required.'}), 403
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/market-rates', methods=['POST'])
@admin_required
def create_market_rate():
    data = request.get_json() or {}
    rate = MarketRate(
        species_id=int(data['species_id']),
        market_name=data['market_name'],
        location=data['location'],
        min_price=float(data['min_price']),
        max_price=float(data['max_price']),
        avg_price=float(data.get('avg_price', (float(data['min_price']) + float(data['max_price'])) / 2)),
        count_spec=data['count_spec'],
        recorded_date=datetime.utcnow().date(),
        updated_by_admin=current_user.name
    )
    db.session.add(rate)

    # Price History Audit
    audit = PriceHistory(
        species_id=rate.species_id,
        species_name=Species.query.get(rate.species_id).name,
        market_or_supplier=rate.market_name,
        record_type='market_rate',
        previous_price=0.0,
        new_price=rate.avg_price,
        unit=rate.unit,
        admin_id=current_user.id,
        admin_name=current_user.name,
        notes=f"Added rate for {rate.count_spec}"
    )
    db.session.add(audit)
    db.session.commit()
    return jsonify({'message': 'Market rate published', 'record': rate.to_dict()}), 201`,
    },
    tests: {
      title: 'Pytest Automated Tests',
      filename: 'aqua_farmers/tests/test_auth.py',
      desc: 'Automated test suite verifying farmer registration, login, role permissions, and price updates.',
      code: `import pytest
from app import create_app, db
from app.models import User, SeedPrice, Species

@pytest.fixture
def client():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        admin = User(name='Admin Rao', mobile='9999999999', email='admin@test.com', location='AP', farm_type='Hatchery', role='admin')
        admin.set_password('Admin@123')
        db.session.add(admin)
        db.session.commit()
        yield app.test_client()
        db.drop_all()

def test_admin_permission_denied_for_unauthenticated(client):
    res = client.post('/api/admin/seed-prices', json={'price': 400})
    assert res.status_code in [302, 401, 403]`,
    },
    config: {
      title: 'Environment & Database Config',
      filename: 'aqua_farmers/config.py',
      desc: 'Environment variables for MySQL connection pooling and PyMySQL driver configuration.',
      code: `import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'aqua-farmers-secret-2026')
    MYSQL_USER = os.getenv('MYSQL_USER', 'aqua_user')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'aqua_password')
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_PORT = os.getenv('MYSQL_PORT', '3306')
    MYSQL_DATABASE = os.getenv('MYSQL_DATABASE', 'aqua_farmers_db')

    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}?charset=utf8mb4"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False`,
    },
  };

  const activeSnippet = codeSnippets[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-sky-800/40">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">Aqua Farmers Python &amp; MySQL Backend</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Flask 3.0 + MySQL 8.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore the complete production codebase, database DDL, routes, and pytest suite.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/60 overflow-x-auto flex gap-1.5 scrollbar-thin">
          {[
            { id: 'overview', label: 'Project Tree', icon: Layers },
            { id: 'schema', label: 'schema.sql', icon: Database },
            { id: 'models', label: 'models.py', icon: FileCode },
            { id: 'auth', label: 'routes/auth.py', icon: FileCode },
            { id: 'admin', label: 'routes/admin.py', icon: FileCode },
            { id: 'tests', label: 'test_auth.py', icon: Terminal },
            { id: 'config', label: 'config.py', icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content & Code Area */}
        <div className="flex-1 overflow-hidden flex flex-col p-4 sm:p-6 bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono text-sky-400">{activeSnippet.filename}</div>
              <p className="text-xs text-slate-400 mt-0.5">{activeSnippet.desc}</p>
            </div>

            <button
              onClick={() => handleCopy(activeSnippet.code)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition self-start sm:self-auto"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard' : 'Copy Code'}
            </button>
          </div>

          <div className="flex-1 overflow-auto rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
            <pre className="whitespace-pre">{activeSnippet.code}</pre>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 rounded-b-2xl flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>To run locally: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300">cd aqua_farmers && pip install -r requirements.txt && python run.py</code></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition"
          >
            Back to Interactive App
          </button>
        </div>
      </div>
    </div>
  );
};
