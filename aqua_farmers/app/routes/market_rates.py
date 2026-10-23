from flask import Blueprint, request, jsonify
from app.models import MarketRate, Species

market_rates_bp = Blueprint('market_rates', __name__, url_prefix='/api')

@market_rates_bp.route('/market-rates', methods=['GET'])
def get_market_rates():
    species_id = request.args.get('species_id')
    location = request.args.get('location')
    date = request.args.get('date')
    search = request.args.get('search')

    query = MarketRate.query.join(Species)

    if species_id and species_id != 'all':
        query = query.filter(MarketRate.species_id == int(species_id))

    if location and location != 'all':
        query = query.filter(MarketRate.location.ilike(f'%{location}%'))

    if date:
        query = query.filter(MarketRate.recorded_date == date)

    if search:
        search_term = f'%{search}%'
        query = query.filter(
            (MarketRate.market_name.ilike(search_term)) |
            (MarketRate.location.ilike(search_term)) |
            (Species.name.ilike(search_term)) |
            (MarketRate.count_spec.ilike(search_term))
        )

    rates = query.order_by(MarketRate.recorded_date.desc(), MarketRate.id.desc()).all()
    return jsonify([r.to_dict() for r in rates]), 200

@market_rates_bp.route('/market-rates/history/<int:species_id>', methods=['GET'])
def get_market_rate_history(species_id):
    market_name = request.args.get('market_name')

    query = MarketRate.query.filter_by(species_id=species_id)
    if market_name and market_name != 'all':
        query = query.filter(MarketRate.market_name.ilike(f'%{market_name}%'))

    rates = query.order_by(MarketRate.recorded_date.asc()).all()
    
    history_data = [
        {
            'date': r.recorded_date.strftime('%Y-%m-%d') if r.recorded_date else '',
            'avg_price': float(r.avg_price),
            'min_price': float(r.min_price),
            'max_price': float(r.max_price),
            'market_name': r.market_name,
            'count_spec': r.count_spec
        }
        for r in rates
    ]
    return jsonify(history_data), 200
