from flask import Blueprint, request, jsonify
from app.models import SeedPrice, Species

seed_prices_bp = Blueprint('seed_prices', __name__, url_prefix='/api')

@seed_prices_bp.route('/species', methods=['GET'])
def list_species():
    species = Species.query.order_by(Species.name).all()
    return jsonify([s.to_dict() for s in species]), 200

@seed_prices_bp.route('/seed-prices', methods=['GET'])
def get_seed_prices():
    species_id = request.args.get('species_id')
    location = request.args.get('location')
    availability = request.args.get('availability')
    max_price = request.args.get('max_price', type=float)
    search = request.args.get('search')
    sort_by = request.args.get('sort_by', 'last_updated') # 'price_asc', 'price_desc', 'last_updated'

    query = SeedPrice.query.join(Species)

    if species_id and species_id != 'all':
        query = query.filter(SeedPrice.species_id == int(species_id))

    if location and location != 'all':
        query = query.filter(SeedPrice.location.ilike(f'%{location}%'))

    if availability and availability != 'all':
        query = query.filter(SeedPrice.availability == availability)

    if max_price:
        query = query.filter(SeedPrice.price <= max_price)

    if search:
        search_term = f'%{search}%'
        query = query.filter(
            (SeedPrice.supplier_name.ilike(search_term)) |
            (SeedPrice.location.ilike(search_term)) |
            (Species.name.ilike(search_term))
        )

    # Sorting
    if sort_by == 'price_asc':
        query = query.order_by(SeedPrice.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(SeedPrice.price.desc())
    else:
        query = query.order_by(SeedPrice.last_updated.desc())

    seeds = query.all()
    return jsonify([s.to_dict() for s in seeds]), 200
