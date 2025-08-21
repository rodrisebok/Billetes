import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

# Inicialización de extensiones
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app)  # Habilitar CORS para toda la aplicación

    # Configuración de la base de datos
    base_dir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(base_dir, '..', 'database.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Vincular extensiones con la app
    db.init_app(app)
    migrate.init_app(app, db)

    # Importar y registrar Blueprints (rutas)
    from .api.prediction_routes import prediction_bp
    app.register_blueprint(prediction_bp, url_prefix='/api')

    # Importar modelos para que Migrate los reconozca
    from . import models

    return app