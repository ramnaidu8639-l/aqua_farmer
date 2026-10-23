from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db, login_manager

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), nullable=False, index=True)
    mobile = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(150), nullable=False, index=True)
    farm_type = db.Column(db.String(100), nullable=False) # e.g. Shrimp Farming, Freshwater Fish, Brackish Water
    role = db.Column(db.String(20), nullable=False, default='farmer') # 'farmer' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    favorites = db.relationship('FavoriteSpecies', backref='user', cascade='all, delete-orphan', lazy=True)
    audit_logs = db.relationship('PriceHistory', backref='admin_user', foreign_keys='PriceHistory.admin_id', lazy=True)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    @property
    def is_admin(self) -> bool:
        return self.role == 'admin'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'mobile': self.mobile,
            'email': self.email,
            'location': self.location,
            'farm_type': self.farm_type,
            'role': self.role,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
        }

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class Species(db.Model):
    __tablename__ = 'species'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, index=True) # e.g. Pacific White Shrimp (Vannamei)
    category = db.Column(db.String(30), nullable=False, index=True) # 'shrimp' or 'fish'
    scientific_name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    ideal_salinity = db.Column(db.String(50), nullable=True)
    ideal_temp = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    seed_prices = db.relationship('SeedPrice', backref='species', cascade='all, delete-orphan', lazy=True)
    market_rates = db.relationship('MarketRate', backref='species', cascade='all, delete-orphan', lazy=True)
    advisories = db.relationship('DiseaseAdvisory', backref='species', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'scientific_name': self.scientific_name,
            'description': self.description,
            'ideal_salinity': self.ideal_salinity,
            'ideal_temp': self.ideal_temp,
        }

class SeedPrice(db.Model):
    __tablename__ = 'seed_prices'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    species_id = db.Column(db.Integer, db.ForeignKey('species.id'), nullable=False, index=True)
    supplier_name = db.Column(db.String(150), nullable=False, index=True)
    location = db.Column(db.String(150), nullable=False, index=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    unit = db.Column(db.String(50), nullable=False, default='per 1,000 seeds')
    availability = db.Column(db.String(50), nullable=False, default='In Stock') # 'In Stock', 'Low Stock', 'Pre-booking Only', 'Sold Out'
    contact_number = db.Column(db.String(30), nullable=False)
    contact_email = db.Column(db.String(120), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    pcr_certified = db.Column(db.Boolean, default=True)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'species_id': self.species_id,
            'species_name': self.species.name if self.species else None,
            'category': self.species.category if self.species else None,
            'supplier_name': self.supplier_name,
            'location': self.location,
            'price': float(self.price),
            'unit': self.unit,
            'availability': self.availability,
            'contact_number': self.contact_number,
            'contact_email': self.contact_email,
            'notes': self.notes,
            'pcr_certified': self.pcr_certified,
            'last_updated': self.last_updated.strftime('%Y-%m-%d') if self.last_updated else None,
        }

class MarketRate(db.Model):
    __tablename__ = 'market_rates'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    species_id = db.Column(db.Integer, db.ForeignKey('species.id'), nullable=False, index=True)
    market_name = db.Column(db.String(150), nullable=False, index=True)
    location = db.Column(db.String(150), nullable=False, index=True)
    min_price = db.Column(db.Numeric(10, 2), nullable=False)
    max_price = db.Column(db.Numeric(10, 2), nullable=False)
    avg_price = db.Column(db.Numeric(10, 2), nullable=False)
    unit = db.Column(db.String(50), nullable=False, default='per kg')
    count_spec = db.Column(db.String(80), nullable=False) # e.g., '30 Count', '40 Count', '1.5-2.0 kg'
    trend = db.Column(db.String(20), default='stable') # 'up', 'down', 'stable'
    change_percent = db.Column(db.Float, default=0.0)
    recorded_date = db.Column(db.Date, nullable=False, index=True, default=datetime.utcnow().date)
    updated_by_admin = db.Column(db.String(100), default='Fisheries Admin')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'species_id': self.species_id,
            'species_name': self.species.name if self.species else None,
            'category': self.species.category if self.species else None,
            'market_name': self.market_name,
            'location': self.location,
            'min_price': float(self.min_price),
            'max_price': float(self.max_price),
            'avg_price': float(self.avg_price),
            'unit': self.unit,
            'count_spec': self.count_spec,
            'trend': self.trend,
            'change_percent': self.change_percent,
            'recorded_date': self.recorded_date.strftime('%Y-%m-%d') if self.recorded_date else None,
            'updated_by_admin': self.updated_by_admin,
        }

class DiseaseAdvisory(db.Model):
    __tablename__ = 'disease_advisories'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    disease_name = db.Column(db.String(150), nullable=False, index=True)
    affected_species = db.Column(db.String(200), nullable=False)
    species_id = db.Column(db.Integer, db.ForeignKey('species.id'), nullable=True)
    category = db.Column(db.String(30), nullable=False, default='shrimp') # 'shrimp', 'fish', 'both'
    symptoms = db.Column(db.Text, nullable=False) # stored as formatted or JSON
    seasonal_risk_period = db.Column(db.String(100), nullable=False, index=True)
    favorable_conditions = db.Column(db.Text, nullable=False)
    prevention_measures = db.Column(db.Text, nullable=False)
    recommended_steps = db.Column(db.Text, nullable=False)
    risk_level = db.Column(db.String(30), nullable=False, default='Moderate') # 'High', 'Moderate', 'Low', 'Seasonal Watch'
    is_outbreak = db.Column(db.Boolean, default=False, nullable=False) # Clearly distinguished educational vs verified local outbreak
    source = db.Column(db.String(200), nullable=False, default='National Fisheries Health Advisory')
    publication_date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date)
    disclaimer = db.Column(
        db.Text,
        nullable=False,
        default='Educational advisory only. Confirm diagnosis with a certified aquatic animal health professional or state fisheries lab before medication.'
    )

    def to_dict(self):
        # Format symptoms and measures as lists if separated by newlines
        symptom_list = [s.strip() for s in self.symptoms.split('\n') if s.strip()]
        prevention_list = [p.strip() for p in self.prevention_measures.split('\n') if p.strip()]
        steps_list = [st.strip() for st in self.recommended_steps.split('\n') if st.strip()]

        return {
            'id': self.id,
            'disease_name': self.disease_name,
            'affected_species': self.affected_species,
            'species_id': self.species_id,
            'category': self.category,
            'symptoms': symptom_list if symptom_list else [self.symptoms],
            'seasonal_risk_period': self.seasonal_risk_period,
            'favorable_conditions': self.favorable_conditions,
            'prevention_measures': prevention_list if prevention_list else [self.prevention_measures],
            'recommended_steps': steps_list if steps_list else [self.recommended_steps],
            'risk_level': self.risk_level,
            'is_outbreak': self.is_outbreak,
            'source': self.source,
            'publication_date': self.publication_date.strftime('%Y-%m-%d') if self.publication_date else None,
            'disclaimer': self.disclaimer,
        }

class FavoriteSpecies(db.Model):
    __tablename__ = 'favorite_species'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    species_id = db.Column(db.Integer, db.ForeignKey('species.id'), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'species_id', name='uq_user_species_favorite'),
    )

class PriceHistory(db.Model):
    __tablename__ = 'price_history'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    species_id = db.Column(db.Integer, db.ForeignKey('species.id'), nullable=False, index=True)
    species_name = db.Column(db.String(100), nullable=False)
    market_or_supplier = db.Column(db.String(150), nullable=False)
    record_type = db.Column(db.String(30), nullable=False) # 'market_rate' or 'seed_price'
    previous_price = db.Column(db.Numeric(10, 2), nullable=False, default=0.0)
    new_price = db.Column(db.Numeric(10, 2), nullable=False)
    unit = db.Column(db.String(50), nullable=False)
    update_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    admin_name = db.Column(db.String(100), nullable=False, default='Admin')
    notes = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'species_id': self.species_id,
            'species_name': self.species_name,
            'market_or_supplier': self.market_or_supplier,
            'record_type': self.record_type,
            'previous_price': float(self.previous_price),
            'new_price': float(self.new_price),
            'unit': self.unit,
            'update_time': self.update_time.strftime('%Y-%m-%d %H:%M:%S') if self.update_time else None,
            'admin_id': self.admin_id,
            'admin_name': self.admin_name,
            'notes': self.notes,
        }
