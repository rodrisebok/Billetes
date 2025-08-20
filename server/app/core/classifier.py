import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import io
import os

class BilletesClassifier:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(BilletesClassifier, cls).__new__(cls)
            # Cargar modelo y etiquetas una sola vez
            model_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'billetes_model_classifier.keras')
            labels_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'class_names.txt')

            cls._instance.model = load_model(model_path)
            with open(labels_path, 'r') as f:
                cls._instance.class_names = [line.strip() for line in f.readlines()]
            print("Modelo y etiquetas cargados.")
        return cls._instance

    def _preprocess_image(self, image_bytes):
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image = image.resize((224, 224))
        image_array = np.array(image)
        image_array = np.expand_dims(image_array, axis=0)
        return image_array

    def predict(self, image_bytes):
        processed_image = self._preprocess_image(image_bytes)
        prediction = self.model.predict(processed_image)
        predicted_class_index = np.argmax(prediction)
        predicted_class_name = self.class_names[predicted_class_index]
        confidence = float(np.max(prediction))
        return predicted_class_name, confidence

# Singleton instance
classifier = BilletesClassifier()