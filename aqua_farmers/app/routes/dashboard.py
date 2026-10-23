from flask import Blueprint, jsonify, request
from flask_login import current_user
from app.extensions import db
from app.models import SeedPrice, MarketRate, DiseaseAdvisory, PriceHistory, Species, FavoriteSpecies

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api')

@dashboard_bp.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    user = current_user if current_user.is_authenticated else None
    user_id = user.id if user else None

    # Get user favorite species
    favorite_species_ids = []
    if user_id:
        favs = FavoriteSpecies.query.filter_by(user_id=user_id).all()
        favorite_species_ids = [f.species_id for f in favs]
    if not favorite_species_ids:
        favorite_species_ids = [1, 2] # Default to Vannamei & Tiger Shrimp

    # Today's seed prices
    latest_seeds = SeedPrice.query.order_by(SeedPrice.last_updated.desc()).limit(4).all()

    # Latest market rates
    latest_rates = MarketRate.query.order_by(MarketRate.recorded_date.desc()).limit(4).all()

    # Favorite species rates
    fav_rates = MarketRate.query.filter(MarketRate.species_id.in_(favorite_species_ids)).order_by(MarketRate.recorded_date.desc()).all()

    # High-risk seasonal disease alerts
    disease_alerts = DiseaseAdvisory.query.filter_by(risk_level='High').all()

    # Recent price changes from audit history
    recent_price_changes = PriceHistory.query.order_by(PriceHistory.update_time.desc()).limit(5).all()

    # Local advisories for farmer's region
    loc_advisories = DiseaseAdvisory.query.order_by(DiseaseAdvisory.publication_date.desc()).limit(3).all()

    stats = {
        'total_species': Species.query.count(),
        'active_suppliers': SeedPrice.query.count(),
        'active_mandis': db.session.query(MarketRate.market_name).distinct().count(),
        'active_advisories': DiseaseAdvisory.query.count(),
    }

    return jsonify({
        'farmer': user.to_dict() if user else None,
        'today_seed_prices': [s.to_dict() for s in latest_seeds],
        'latest_market_rates': [r.to_dict() for r in latest_rates],
        'seasonal_disease_alerts': [d.to_dict() for d in disease_alerts],
        'recent_price_changes': [p.to_dict() for p in recent_price_changes],
        'favorite_species_ids': favorite_species_ids,
        'favorite_species_rates': [r.to_dict() for r in fav_rates],
        'location_advisories': [d.to_dict() for d in loc_advisories],
        'stats': stats,
    }), 200

@dashboard_bp.route('/favorites/toggle', methods=['POST'])
def toggle_favorite():
    if not current_user.is_authenticated:
        return jsonify({'error': 'Authentication required to save favorites'}), 401

    data = request.get_json() or {}
    species_id = data.get('species_id')
    if not species_id:
        return jsonify({'error': 'species_id is required'}), 400

    fav = FavoriteSpecies.query.filter_by(user_id=current_user.id, species_id=int(species_id)).first()
    if fav:
        db.session.delete(fav)
        db.session.commit()
        is_favorited = False
    else:
        new_fav = FavoriteSpecies(user_id=current_user.id, species_id=int(species_id))
        db.session.add(new_fav)
        db.session.commit()
        is_favorited = True

    updated_favs = [f.species_id for f in FavoriteSpecies.query.filter_by(user_id=current_user.id).all()]
    return jsonify({
        'message': 'Favorites updated successfully',
        'is_favorited': is_favorited,
        'favorite_species_ids': updated_favs
    }), 200
