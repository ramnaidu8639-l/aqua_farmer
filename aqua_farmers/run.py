import os
from app import create_app, db

app = create_app(os.getenv('FLASK_ENV', 'development'))

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    # In development mode, auto create tables if they do not exist
    with app.app_context():
        db.create_all()
    print(f"Aqua Farmers Flask Backend starting on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
