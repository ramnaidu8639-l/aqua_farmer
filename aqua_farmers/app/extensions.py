from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()
cors = CORS()

# Setup login configuration
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Please log in to access your farmer dashboard.'
login_manager.login_message_category = 'warning'
