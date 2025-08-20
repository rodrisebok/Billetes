from flask import Blueprint, request, jsonify
from app.core.classifier import classifier

prediction_bp = Blueprint('prediction_bp', __name__)

@prediction_bp.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No se encontró ningún archivo"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "Ningún archivo seleccionado"}), 400

    try:
        image_bytes = file.read()
        predicted_class, confidence = classifier.predict(image_bytes)
        return jsonify({
            "predicted_class": predicted_class,
            "confidence": confidence
        })
    except Exception as e:
        return jsonify({"error": f"Error al procesar la imagen: {str(e)}"}), 500