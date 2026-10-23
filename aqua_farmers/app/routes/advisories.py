from flask import Blueprint, request, jsonify
from app.models import DiseaseAdvisory

advisories_bp = Blueprint('advisories', __name__, url_prefix='/api')

@advisories_bp.route('/disease-advisories', methods=['GET'])
def get_advisories():
    species = request.args.get('species')
    season = request.args.get('season')
    risk_level = request.args.get('risk_level')
    search = request.args.get('search')
    outbreak_only = request.args.get('outbreak_only')

    query = DiseaseAdvisory.query

    if species and species != 'all':
        query = query.filter(DiseaseAdvisory.affected_species.ilike(f'%{species}%'))

    if season and season != 'all':
        query = query.filter(DiseaseAdvisory.seasonal_risk_period.ilike(f'%{season}%'))

    if risk_level and risk_level != 'all':
        query = query.filter(DiseaseAdvisory.risk_level.ilike(risk_level))

    if outbreak_only == 'true':
        query = query.filter(DiseaseAdvisory.is_outbreak == True)

    if search:
        search_term = f'%{search}%'
        query = query.filter(
            (DiseaseAdvisory.disease_name.ilike(search_term)) |
            (DiseaseAdvisory.affected_species.ilike(search_term)) |
            (DiseaseAdvisory.symptoms.ilike(search_term))
        )

    advisories = query.order_by(DiseaseAdvisory.publication_date.desc()).all()
    return jsonify([a.to_dict() for a in advisories]), 200
