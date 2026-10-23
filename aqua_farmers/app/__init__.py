import os
from flask import Flask, jsonify, render_template, send_from_directory
from app.extensions import db, login_manager, migrate, cors
from config import config_by_name

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__, template_folder='templates', static_folder='static')
    app.config.from_object(config_by_name[config_name])

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Register API blueprints
    from app.routes.auth import auth_bp
    from app.routes.seed_prices import seed_prices_bp
    from app.routes.market_rates import market_rates_bp
    from app.routes.advisories import advisories_bp
    from app.routes.admin import admin_bp
    from app.routes.dashboard import dashboard_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(seed_prices_bp)
    app.register_blueprint(market_rates_bp)
    app.register_blueprint(advisories_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(dashboard_bp)

    # Health check & root route
    @app.route('/')
    def index():
        return jsonify({
            'app': 'Aqua Farmers - Aquaculture Management API',
            'version': '1.0.0',
            'status': 'online',
            'endpoints': [
                '/api/auth/login',
                '/api/auth/register',
                '/api/seed-prices',
                '/api/market-rates',
                '/api/market-rates/history/<species_id>',
                '/api/disease-advisories',
                '/api/dashboard',
                '/api/admin/seed-prices',
                '/api/admin/market-rates',
                '/api/admin/disease-advisories'
            ]
        })

    # Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'Internal server error'}), 500

    # Custom CLI Commands for easy setup
    @app.cli.command('init-db')
    def init_db():
        """Initialize and create all database tables."""
        db.create_all()
        print('Database tables created successfully!')

    @app.cli.command('seed-data')
    def seed_data():
        """Seed verified demonstration data for species, seed prices, and disease advisories."""
        from app.models import Species, SeedPrice, MarketRate, DiseaseAdvisory, User
        from datetime import datetime, date

        if Species.query.count() == 0:
            sp1 = Species(name='Pacific White Shrimp (Vannamei)', category='shrimp', scientific_name='Litopenaeus vannamei', description='High-yield brackish water shrimp.', ideal_salinity='10-28 ppt', ideal_temp='28-32°C')
            sp2 = Species(name='Black Tiger Shrimp (Monodon)', category='shrimp', scientific_name='Penaeus monodon', description='Large sized native shrimp.', ideal_salinity='15-30 ppt', ideal_temp='28-33°C')
            sp3 = Species(name='Rohu', category='fish', scientific_name='Labeo rohita', description='Freshwater major carp.', ideal_salinity='0-4 ppt', ideal_temp='24-30°C')
            db.session.add_all([sp1, sp2, sp3])
            db.session.commit()
            print('Species seeded.')

        if User.query.filter_by(role='admin').count() == 0:
            admin = User(name='Dr. K.V. Rao', mobile='+91 94401 99887', email='admin@aquafarmers.in', location='Kakinada, AP', farm_type='Research & Extension', role='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print('Admin user created (admin@aquafarmers.in / admin123).')

        print('Data seeding complete.')

    return app
