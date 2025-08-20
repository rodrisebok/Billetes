from flask import Flask
from flask_cors import CORS
from app.api.prediction_routes import prediction_bp
#from config import Config

def create_app():
    app = Flask(__name__)
    #app.config.from_object(Config)

    # Habilitar CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}}) # Más seguro en producción

    # Registrar blueprints (rutas)
    app.register_blueprint(prediction_bp, url_prefix='/api')

    return app