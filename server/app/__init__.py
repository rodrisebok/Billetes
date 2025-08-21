# server/app/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app)  # Habilitar CORS para toda la aplicación

    # --- Configuración de la Base de Datos ---
    # Usar una ruta absoluta para la base de datos
    base_dir = os.path.abspath(os.path.dirname(__file__))
    database_path = os.path.join(base_dir, '..', '..', 'database.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + database_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # --- Inicialización de Extensiones ---
    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        # --- Importación de Modelos ---
        # Asegúrate de importar los modelos aquí para que Alembic los detecte
        from .models import cash_box, denomination, movement

        # --- Registro de Blueprints (Rutas) ---
        from .api.prediction_routes import prediction_bp
        app.register_blueprint(prediction_bp, url_prefix='/api')

        # --- NUEVA LÍNEA: REGISTRAR EL BLUEPRINT DE FLUJO DE CAJA ---
        from .api.cash_flow_routes import cash_flow_bp
        app.register_blueprint(cash_flow_bp, url_prefix='/api/cashflow')

        # --- Creación de la Base de Datos (si no existe) ---
        # db.create_all() # Descomentar si necesitas crear las tablas manualmente

        return app