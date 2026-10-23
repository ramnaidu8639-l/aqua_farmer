import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'aqua-farmers-super-secret-key-change-in-prod-2026')
    WTF_CSRF_ENABLED = True
    
    # MySQL Database configuration via environment variables
    MYSQL_USER = os.getenv('MYSQL_USER', 'aqua_user')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'aqua_password')
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_PORT = os.getenv('MYSQL_PORT', '3306')
    MYSQL_DATABASE = os.getenv('MYSQL_DATABASE', 'aqua_farmers_db')
    
    # SQLAlchemy URI with PyMySQL driver
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}?charset=utf8mb4"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 280,
        'pool_pre_ping': True,
        'pool_size': 10,
        'max_overflow': 20,
    }

class DevelopmentConfig(Config):
    DEBUG = True
    # Can fallback to SQLite for quick local trials if MySQL is not running
    if os.getenv('USE_SQLITE', 'false').lower() == 'true':
        SQLALCHEMY_DATABASE_URI = 'sqlite:///aqua_farmers_dev.db'

class TestingConfig(Config):
    TESTING = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False

config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
