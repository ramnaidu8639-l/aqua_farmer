import pytest
from app import create_app, db
from app.models import User, Species, SeedPrice, MarketRate, DiseaseAdvisory

@pytest.fixture
def client():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        # Seed test admin & farmer
        admin = User(name='Test Admin', mobile='9999999999', email='admin@test.com', location='AP', farm_type='Hatchery', role='admin')
        admin.set_password('Admin@123')
        
        farmer = User(name='Test Farmer', mobile='8888888888', email='farmer@test.com', location='AP', farm_type='Shrimp', role='farmer')
        farmer.set_password('Farmer@123')

        sp = Species(name='Vannamei Shrimp', category='shrimp', scientific_name='L. vannamei')
        db.session.add_all([admin, farmer, sp])
        db.session.commit()

        yield app.test_client()
        db.session.remove()
        db.drop_all()

def test_register_farmer(client):
    res = client.post('/api/auth/register', json={
        'name': 'Ganesh',
        'mobile': '9876543210',
        'email': 'ganesh@farm.in',
        'password': 'password123',
        'location': 'Nellore, AP',
        'farm_type': 'Shrimp Farming'
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data['user']['name'] == 'Ganesh'
    assert data['user']['role'] == 'farmer'

def test_login_success(client):
    res = client.post('/api/auth/login', json={
        'email': 'farmer@test.com',
        'password': 'Farmer@123'
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data['user']['email'] == 'farmer@test.com'

def test_login_invalid_password(client):
    res = client.post('/api/auth/login', json={
        'email': 'farmer@test.com',
        'password': 'wrongpassword'
    })
    assert res.status_code == 401

def test_admin_permission_denied_for_farmer(client):
    # Log in as normal farmer
    client.post('/api/auth/login', json={'email': 'farmer@test.com', 'password': 'Farmer@123'})
    res = client.post('/api/admin/seed-prices', json={
        'species_id': 1,
        'supplier_name': 'Unauthorized Hatchery',
        'price': 400
    })
    assert res.status_code == 403

def test_admin_seed_price_creation(client):
    # Log in as admin
    client.post('/api/auth/login', json={'email': 'admin@test.com', 'password': 'Admin@123'})
    res = client.post('/api/admin/seed-prices', json={
        'species_id': 1,
        'supplier_name': 'Krishna Aqua Seeds',
        'location': 'Vijayawada, AP',
        'price': 350.0,
        'unit': 'per 1,000 PL',
        'availability': 'In Stock'
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data['record']['supplier_name'] == 'Krishna Aqua Seeds'

def test_disease_advisory_verified_outbreak_flag(client):
    # Log in as admin
    client.post('/api/auth/login', json={'email': 'admin@test.com', 'password': 'Admin@123'})
    res = client.post('/api/admin/disease-advisories', json={
        'disease_name': 'WSSV Winter Watch',
        'affected_species': 'Vannamei',
        'seasonal_risk_period': 'Winter',
        'is_outbreak': False, # Clearly marked as educational
        'risk_level': 'High',
        'symptoms': ['White spots on carapace', 'Lethargic behavior'],
        'prevention_measures': ['PCR screening', 'Maintain 28°C+ water depth']
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data['record']['is_outbreak'] is False
