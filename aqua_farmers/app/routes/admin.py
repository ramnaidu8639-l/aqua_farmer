from functools import wraps
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.extensions import db
from app.models import User, SeedPrice, MarketRate, DiseaseAdvisory, PriceHistory, Species

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def admin_required(f):
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        if not current_user.is_admin:
            return jsonify({'error': 'Administrator authorization required.'}), 403
        return f(*args, **kwargs)
    return decorated_function

# --- Seed Prices Management ---
@admin_bp.route('/seed-prices', methods=['POST'])
@admin_required
def create_seed_price():
    data = request.get_json() or {}
    species_id = data.get('species_id')
    supplier_name = data.get('supplier_name', '').strip()
    price = data.get('price')
    unit = data.get('unit', 'per 1,000 seeds').strip()

    if not species_id or not supplier_name or price is None:
        return jsonify({'error': 'species_id, supplier_name, and price are required'}), 400

    seed = SeedPrice(
        species_id=int(species_id),
        supplier_name=supplier_name,
        location=data.get('location', 'Registered Hatchery Zone').strip(),
        price=float(price),
        unit=unit,
        availability=data.get('availability', 'In Stock'),
        contact_number=data.get('contact_number', ''),
        contact_email=data.get('contact_email', ''),
        notes=data.get('notes', ''),
        pcr_certified=data.get('pcr_certified', True),
        last_updated=datetime.utcnow()
    )
    db.session.add(seed)

    # Log to PriceHistory audit table
    species = Species.query.get(int(species_id))
    history = PriceHistory(
        species_id=int(species_id),
        species_name=species.name if species else 'Seed Record',
        market_or_supplier=supplier_name,
        record_type='seed_price',
        previous_price=0.0,
        new_price=float(price),
        unit=unit,
        admin_id=current_user.id,
        admin_name=current_user.name,
        notes=f"Created new seed listing: {supplier_name}"
    )
    db.session.add(history)
    db.session.commit()

    return jsonify({'message': 'Seed price created successfully', 'record': seed.to_dict()}), 201

@admin_bp.route('/seed-prices/<int:seed_id>', methods=['PUT'])
@admin_required
def update_seed_price(seed_id):
    seed = SeedPrice.query.get_or_404(seed_id)
    data = request.get_json() or {}

    previous_price = float(seed.price)

    if 'price' in data:
        seed.price = float(data['price'])
    if 'availability' in data:
        seed.availability = data['availability']
    if 'location' in data:
        seed.location = data['location']
    if 'contact_number' in data:
        seed.contact_number = data['contact_number']
    if 'notes' in data:
        seed.notes = data['notes']
    if 'pcr_certified' in data:
        seed.pcr_certified = bool(data['pcr_certified'])
    seed.last_updated = datetime.utcnow()

    # Log to audit history
    if 'price' in data and float(data['price']) != previous_price:
        history = PriceHistory(
            species_id=seed.species_id,
            species_name=seed.species.name if seed.species else 'Seed Record',
            market_or_supplier=seed.supplier_name,
            record_type='seed_price',
            previous_price=previous_price,
            new_price=float(seed.price),
            unit=seed.unit,
            admin_id=current_user.id,
            admin_name=current_user.name,
            notes=data.get('notes', 'Price adjustment by administrator')
        )
        db.session.add(history)

    db.session.commit()
    return jsonify({'message': 'Seed price record updated', 'record': seed.to_dict()}), 200

@admin_bp.route('/seed-prices/<int:seed_id>', methods=['DELETE'])
@admin_required
def delete_seed_price(seed_id):
    seed = SeedPrice.query.get_or_404(seed_id)
    db.session.delete(seed)
    db.session.commit()
    return jsonify({'message': 'Seed price deleted successfully'}), 200

# --- Market Rates Management ---
@admin_bp.route('/market-rates', methods=['POST'])
@admin_required
def create_market_rate():
    data = request.get_json() or {}
    species_id = data.get('species_id')
    market_name = data.get('market_name', '').strip()
    min_p = float(data.get('min_price', 0))
    max_p = float(data.get('max_price', 0))
    avg_p = float(data.get('avg_price', round((min_p + max_p) / 2, 2)))
    count_spec = data.get('count_spec', 'Standard Count').strip()

    if not species_id or not market_name or not min_p or not max_p:
        return jsonify({'error': 'species_id, market_name, min_price, and max_price are required'}), 400

    rate = MarketRate(
        species_id=int(species_id),
        market_name=market_name,
        location=data.get('location', 'Wholesale Mandi').strip(),
        min_price=min_p,
        max_price=max_p,
        avg_price=avg_p,
        unit=data.get('unit', 'per kg').strip(),
        count_spec=count_spec,
        trend='stable',
        change_percent=0.0,
        recorded_date=datetime.utcnow().date(),
        updated_by_admin=current_user.name
    )
    db.session.add(rate)

    species = Species.query.get(int(species_id))
    history = PriceHistory(
        species_id=int(species_id),
        species_name=species.name if species else 'Market Record',
        market_or_supplier=market_name,
        record_type='market_rate',
        previous_price=0.0,
        new_price=avg_p,
        unit=rate.unit,
        admin_id=current_user.id,
        admin_name=current_user.name,
        notes=f"New mandi entry: Min ₹{min_p} - Max ₹{max_p} ({count_spec})"
    )
    db.session.add(history)
    db.session.commit()

    return jsonify({'message': 'Market rate created successfully', 'record': rate.to_dict()}), 201

@admin_bp.route('/market-rates/<int:rate_id>', methods=['PUT'])
@admin_required
def update_market_rate(rate_id):
    rate = MarketRate.query.get_or_404(rate_id)
    data = request.get_json() or {}

    previous_avg = float(rate.avg_price)

    if 'min_price' in data:
        rate.min_price = float(data['min_price'])
    if 'max_price' in data:
        rate.max_price = float(data['max_price'])
    if 'count_spec' in data:
        rate.count_spec = data['count_spec']
    if 'avg_price' in data:
        rate.avg_price = float(data['avg_price'])
    else:
        rate.avg_price = round((float(rate.min_price) + float(rate.max_price)) / 2, 2)

    # Calculate trend and change
    if previous_avg > 0:
        rate.change_percent = round(((float(rate.avg_price) - previous_avg) / previous_avg) * 100, 1)
        rate.trend = 'up' if rate.change_percent > 0.5 else ('down' if rate.change_percent < -0.5 else 'stable')

    rate.recorded_date = datetime.utcnow().date()
    rate.updated_by_admin = current_user.name

    # Audit log
    history = PriceHistory(
        species_id=rate.species_id,
        species_name=rate.species.name if rate.species else 'Market Record',
        market_or_supplier=rate.market_name,
        record_type='market_rate',
        previous_price=previous_avg,
        new_price=float(rate.avg_price),
        unit=rate.unit,
        admin_id=current_user.id,
        admin_name=current_user.name,
        notes=f"Updated market price: Min ₹{rate.min_price} Max ₹{rate.max_price} ({rate.count_spec})"
    )
    db.session.add(history)
    db.session.commit()

    return jsonify({'message': 'Market rate updated', 'record': rate.to_dict()}), 200

@admin_bp.route('/market-rates/<int:rate_id>', methods=['DELETE'])
@admin_required
def delete_market_rate(rate_id):
    rate = MarketRate.query.get_or_404(rate_id)
    db.session.delete(rate)
    db.session.commit()
    return jsonify({'message': 'Market rate deleted'}), 200

# --- Disease Advisories Management ---
@admin_bp.route('/disease-advisories', methods=['POST'])
@admin_required
def create_advisory():
    data = request.get_json() or {}
    disease_name = data.get('disease_name', '').strip()
    affected_species = data.get('affected_species', '').strip()
    seasonal_risk_period = data.get('seasonal_risk_period', '').strip()

    if not disease_name or not affected_species or not seasonal_risk_period:
        return jsonify({'error': 'disease_name, affected_species, and seasonal_risk_period are required'}), 400

    symptoms = data.get('symptoms', '')
    if isinstance(symptoms, list):
        symptoms = '\n'.join(symptoms)

    prevention = data.get('prevention_measures', '')
    if isinstance(prevention, list):
        prevention = '\n'.join(prevention)

    steps = data.get('recommended_steps', '')
    if isinstance(steps, list):
        steps = '\n'.join(steps)

    advisory = DiseaseAdvisory(
        disease_name=disease_name,
        affected_species=affected_species,
        species_id=data.get('species_id'),
        category=data.get('category', 'shrimp'),
        symptoms=symptoms,
        seasonal_risk_period=seasonal_risk_period,
        favorable_conditions=data.get('favorable_conditions', 'High stocking density, temperature swings'),
        prevention_measures=prevention,
        recommended_steps=steps,
        risk_level=data.get('risk_level', 'Moderate'),
        is_outbreak=bool(data.get('is_outbreak', False)),
        source=data.get('source', 'Department of Fisheries Advisory Board'),
        publication_date=datetime.utcnow().date()
    )
    db.session.add(advisory)
    db.session.commit()

    return jsonify({'message': 'Advisory published successfully', 'record': advisory.to_dict()}), 201

# --- Admin Statistics & Audit History ---
@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    total_farmers = User.query.filter_by(role='farmer').count()
    total_seeds = SeedPrice.query.count()
    total_rates = MarketRate.query.count()
    total_advisories = DiseaseAdvisory.query.count()
    total_history = PriceHistory.query.count()

    return jsonify({
        'total_farmers': total_farmers,
        'total_seed_listings': total_seeds,
        'total_market_rates': total_rates,
        'total_advisories': total_advisories,
        'recent_updates_count': total_history
    }), 200

@admin_bp.route('/price-history', methods=['GET'])
@admin_required
def get_price_history():
    history = PriceHistory.query.order_by(PriceHistory.update_time.desc()).limit(50).all()
    return jsonify([h.to_dict() for h in history]), 200

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([u.to_dict() for u in users]), 200
