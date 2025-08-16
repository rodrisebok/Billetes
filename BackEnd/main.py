# --- Archivo: BackEnd/main.py ---
# Este script carga el modelo de CLASIFICACIÓN y lo usa para las predicciones.

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# --- CONFIGURACIÓN ---
MODEL_FILENAME = "billetes_model_classifier.keras"
CLASS_NAMES_FILENAME = "class_names.txt"
IMG_SIZE = 224 # Debe ser el mismo tamaño que se usó en el entrenamiento.

app = FastAPI()

# --- Configuración de CORS ---
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Carga del modelo y las clases ---
try:
    print(f"Cargando modelo desde '{MODEL_FILENAME}'...")
    model = tf.keras.models.load_model(MODEL_FILENAME)
    print("¡Modelo cargado con éxito!")

    print(f"Cargando nombres de clases desde '{CLASS_NAMES_FILENAME}'...")
    with open(CLASS_NAMES_FILENAME, "r") as f:
        class_names = [line.strip() for line in f.readlines()]
    print(f"Clases cargadas: {class_names}")

except Exception as e:
    print(f"Error al cargar el modelo o las clases: {e}")
    model = None
    class_names = []

# --- Endpoint de Bienvenida ---
@app.get("/")
def read_root():
    return {"message": "Servidor de clasificación de billetes funcionando."}

# --- Endpoint de Predicción ---
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    if not model or not class_names:
        raise HTTPException(status_code=500, detail="Modelo no cargado. Revisa los logs del servidor.")

    # --- 1. Leer y pre-procesar la imagen ---
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        image = image.resize((IMG_SIZE, IMG_SIZE))
        image_array = np.array(image)
        image_array = np.expand_dims(image_array, axis=0) 
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al procesar la imagen: {e}")

    # --- 2. Realizar la predicción ---
    try:
        prediction = model.predict(image_array)
        
        predicted_class_index = np.argmax(prediction[0])
        predicted_class_name = class_names[predicted_class_index]
        confidence = float(np.max(prediction[0]))

        print(f"Predicción: {predicted_class_name}, Confianza: {confidence:.2f}")

        # Si el modelo predice la clase 'fondo', podemos devolver una respuesta especial
        # o simplemente una confianza baja para que el frontend lo ignore.
        if predicted_class_name == 'fondo':
             return {
                "denominacion": "fondo",
                "confianza": confidence
            }

        return {
            "denominacion": predicted_class_name,
            "confianza": confidence
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error durante la predicción: {e}")
