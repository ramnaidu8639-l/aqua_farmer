# Aqua Farmers – Aquaculture Management System

A production-grade full-stack aquaculture platform designed to empower fish and shrimp farmers with verified seed prices, wholesale mandi market rate tracking, and seasonal disease alerts.

---

## 1. System Architecture & Tech Stack

- **Backend**: Python 3.10+ with Flask (Application Factory & Blueprints)
- **Database**: MySQL 8.0+
- **ORM & Migrations**: SQLAlchemy & Flask-Migrate
- **Authentication**: Flask-Login with secure `werkzeug.security` password hashing
- **Charts**: Chart.js for time-series trend analysis
- **Frontend**: Responsive mobile-first interface (Bootstrap 5 / Modern React SPA)

---

## 2. Prerequisites

- Python 3.10 or higher
- MySQL Server 8.0 or higher
- Git & pip

---

## 3. Installation & Setup

### Step 1: Clone or Navigate to the Project Directory
```bash
cd aqua_farmers
```

### Step 2: Create and Activate Virtual Environment

**On Linux / macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows (Command Prompt or PowerShell):**
```cmd
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` to configure your MySQL database credentials:
```env
FLASK_ENV=development
SECRET_KEY=generate_a_random_32_byte_hex_string_here
MYSQL_USER=aqua_user
MYSQL_PASSWORD=your_secure_mysql_password
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=aqua_farmers_db

# Optional fallback to SQLite for immediate testing without running MySQL:
# USE_SQLITE=true
```

---

## 4. Database Setup & Initialization

### Option A: Create MySQL Database and Run SQL Schema Directly
Open MySQL CLI or Workbench:
```sql
CREATE DATABASE aqua_farmers_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'aqua_user'@'localhost' IDENTIFIED BY 'your_secure_mysql_password';
GRANT ALL PRIVILEGES ON aqua_farmers_db.* TO 'aqua_user'@'localhost';
FLUSH PRIVILEGES;
```

Run the schema script:
```bash
mysql -u aqua_user -p aqua_farmers_db < schema.sql
```

### Option B: Use Flask CLI Migration Tools
```bash
# Initialize DB tables via SQLAlchemy
flask init-db

# Populate verified demonstration data (Species, Hatcheries, Mandis, Advisories)
flask seed-data
```

---

## 5. Creating the First Administrator Securely

Aqua Farmers includes a CLI utility to provision administrator credentials securely:

```bash
flask seed-data
```
This provisions the initial extension administrator:
- **Email**: `admin@aquafarmers.in`
- **Password**: `admin123` *(Be sure to change upon initial production login via the profile settings)*

Alternatively, run an interactive Python shell:
```python
python
>>> from app import create_app, db
>>> from app.models import User
>>> app = create_app()
>>> with app.app_context():
...     admin = User(name='Dr. K.V. Rao', mobile='+91 94401 99887', email='admin@aquafarmers.in', location='Kakinada, AP', farm_type='Fisheries Extension', role='admin')
...     admin.set_password('YourStrongAdminPassword!')
...     db.session.add(admin)
...     db.session.commit()
...     print('Administrator created successfully!')
```

---

## 6. Running the Application

### Development Server:
```bash
python run.py
```
The server will start at: `http://127.0.0.1:5000`

### Production Deployment (using Gunicorn):
```bash
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

---

## 7. Running the Automated Test Suite

Run pytest to verify authentication, role-based permissions, seed pricing, and advisory integrity:
```bash
pytest tests/ -v
```

---

## 8. REST API Reference Summary

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Register a new farmer account |
| `/api/auth/login` | POST | Public | Log in with email and password |
| `/api/auth/logout` | POST | User | Log out user session |
| `/api/auth/profile` | PUT | User | Update farmer profile & location |
| `/api/species` | GET | Public | List commercial fish and shrimp species |
| `/api/seed-prices` | GET | Public | Search & filter hatchery seed prices |
| `/api/market-rates` | GET | Public | Filter wholesale mandi prices |
| `/api/market-rates/history/<id>`| GET | Public | Historical price series for Chart.js |
| `/api/disease-advisories` | GET | Public | Seasonal advisories with educational flags |
| `/api/dashboard` | GET | Public/User | Farmer dashboard feed & alerts |
| `/api/favorites/toggle` | POST | User | Save or unfavorite species |
| `/api/admin/seed-prices` | POST | Admin | Add verified hatchery seed listing |
| `/api/admin/seed-prices/<id>` | PUT/DELETE| Admin | Update or delete seed listing |
| `/api/admin/market-rates` | POST | Admin | Publish verified mandi prices |
| `/api/admin/market-rates/<id>`| PUT/DELETE| Admin | Update market rates & log audit |
| `/api/admin/disease-advisories`| POST | Admin | Publish seasonal advisory |
| `/api/admin/price-history` | GET | Admin | Audit trail of price changes |

---

## 9. Biosecurity & Data Disclaimer

*Aqua Farmers displays verified administrator-curated records and seasonal advisories. It clearly distinguishes educational biosecurity advisories from confirmed outbreak declarations. Farmers must always consult certified aquatic animal health specialists or state college laboratories before introducing chemical treatments.*
