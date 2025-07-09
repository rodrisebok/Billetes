import os
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
from PIL import Image
import io
# --- CAMBIO IMPORTANTE: AÑADIR ESTE IMPORT ---
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# --- 1. INICIALIZACIÓN DE LA APLICACIÓN FASTAPI ---
app = FastAPI(title="API de Detección de Billetes",
              description="Una API que utiliza un modelo de Deep Learning para identificar billetes argentinos.")

# --- 2. CONFIGURACIÓN DE CORS ---
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. CARGA DEL MODELO DE IA ---
try:
    model = tf.keras.models.load_model('modelo_billetes.h5')
    print("Modelo cargado exitosamente.")
except Exception as e:
    print(f"Error cargando el modelo: {e}")
    model = None

# --- 4. PREPARACIÓN DE LAS CLASES ---
CLASS_NAMES = ['1000_pesos', '2000_pesos', '500_pesos']
print(f"Clases configuradas: {CLASS_NAMES}")


# --- 5. FUNCIÓN DE PROCESAMIENTO DE IMAGEN ---
def process_image(image_bytes):
    """
    Toma los bytes de una imagen, la redimensiona y la prepara
    para que el modelo pueda procesarla.
    """
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    
    # --- CAMBIO IMPORTANTE: APLICAR PREPROCESAMIENTO AQUÍ ---
    # Aplicamos la misma función que en el entrenamiento.
    processed_image = preprocess_input(img_array)
    
    return processed_image


# --- 6. DEFINICIÓN DEL ENDPOINT DE LA API ---
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    if not model:
        return {"error": "El modelo no está disponible o no se pudo cargar."}

    image_bytes = await file.read()
    processed_image = process_image(image_bytes)
    prediction = model.predict(processed_image)
    predicted_class_index = np.argmax(prediction)
    predicted_class_name = CLASS_NAMES[predicted_class_index]
    confidence = float(prediction[0][predicted_class_index])

    return {
        "denominacion": predicted_class_name,
        "confianza": confidence
    }

# --- 7. PUNTO DE ENTRADA PARA EJECUTAR EL SERVIDOR ---
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
