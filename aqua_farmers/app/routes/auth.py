from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
from app.extensions import db
from app.models import User, FavoriteSpecies

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    mobile = data.get('mobile', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    location = data.get('location', '').strip()
    farm_type = data.get('farm_type', 'Shrimp Farming').strip()

    # Validation
    if not name or not email or not password or not mobile or not location:
        return jsonify({'error': 'Name, mobile, email, password, and location are required.'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'An account with this email address already exists.'}), 400

    user = User(
        name=name,
        mobile=mobile,
        email=email,
        location=location,
        farm_type=farm_type,
        role='farmer'
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    # Add default favorite species (e.g. Vannamei)
    fav = FavoriteSpecies(user_id=user.id, species_id=1)
    db.session.add(fav)
    db.session.commit()

    login_user(user)

    return jsonify({
        'message': 'Farmer registered successfully',
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password.'}), 401

    login_user(user, remember=True)
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict()
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({'user': current_user.to_dict()}), 200
    return jsonify({'user': None}), 200

@auth_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    data = request.get_json() or {}
    
    if 'name' in data and data['name'].strip():
        current_user.name = data['name'].strip()
    if 'mobile' in data and data['mobile'].strip():
        current_user.mobile = data['mobile'].strip()
    if 'location' in data and data['location'].strip():
        current_user.location = data['location'].strip()
    if 'farm_type' in data and data['farm_type'].strip():
        current_user.farm_type = data['farm_type'].strip()
    if 'new_password' in data and len(data['new_password']) >= 6:
        current_user.set_password(data['new_password'])

    db.session.commit()
    return jsonify({
        'message': 'Profile updated successfully',
        'user': current_user.to_dict()
    }), 200
