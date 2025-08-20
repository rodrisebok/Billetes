import tensorflow as tf
from tensorflow import keras # Usar keras desde tensorflow es una buena práctica
from tensorflow.keras import layers, models, Input # ¡Importante añadir Input!
from tensorflow.keras.models import Sequential
from tensorflow.keras.applications import MobileNetV2
import pathlib
import os

# --- PARÁMETROS DE CONFIGURACIÓN ---
# Puedes ajustar estos valores para experimentar

# 1. Ruta al conjunto de datos
# El script espera que tus imágenes estén en 'ml-training/dataset/'
dataset_dir = pathlib.Path('dataset')

# 2. Parámetros del modelo
BATCH_SIZE = 32
IMG_HEIGHT = 224
IMG_WIDTH = 224
EPOCHS = 15 # Puedes aumentar este número si tienes muchos datos (ej. 20-25)

# --- CARGA Y PREPARACIÓN DE DATOS ---

print("--- Cargando datasets ---")

# Carga el set de entrenamiento (80% de los datos)
train_dataset = tf.keras.utils.image_dataset_from_directory(
  dataset_dir,
  validation_split=0.2,
  subset="training",
  seed=123,
  image_size=(IMG_HEIGHT, IMG_WIDTH),
  batch_size=BATCH_SIZE)

# Carga el set de validación (20% de los datos)
validation_dataset = tf.keras.utils.image_dataset_from_directory(
  dataset_dir,
  validation_split=0.2,
  subset="validation",
  seed=123,
  image_size=(IMG_HEIGHT, IMG_WIDTH),
  batch_size=BATCH_SIZE)

# Obtiene los nombres de las clases (ej: ['1000_pesos', '500_pesos', ...])
class_names = train_dataset.class_names
num_classes = len(class_names)
print(f"Clases encontradas: {class_names}")

# Guardar los nombres de las clases en un archivo de texto
print("--- Guardando nombres de las clases en class_names.txt ---")
with open('class_names.txt', 'w') as f:
    for class_name in class_names:
        f.write(f"{class_name}\n")

# Optimización del rendimiento del dataset
AUTOTUNE = tf.data.AUTOTUNE
train_dataset = train_dataset.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
validation_dataset = validation_dataset.cache().prefetch(buffer_size=AUTOTUNE)

# --- DEFINICIÓN DEL MODELO ---

# --- CORRECCIÓN CLAVE ---
# 1. Capa de Aumentación de Datos (Data Augmentation)
#    Se añade una capa keras.Input() al inicio para definir explícitamente
#    la forma de entrada, solucionando el error del "ciclo".
data_augmentation = Sequential(
  [
    Input(shape=(IMG_HEIGHT, IMG_WIDTH, 3)), # <--- AQUÍ ESTÁ LA LÍNEA AÑADIDA
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
    # ¡Tu capa! Convierte aleatoriamente el 20% de las imágenes a escala de grises.
    layers.RandomGrayscale(0.2),
  ]
)

# 2. Modelo Base (Transfer Learning)
#    Usamos MobileNetV2, un modelo potente y ligero, pre-entrenado con millones de imágenes.
base_model = MobileNetV2(input_shape=(IMG_HEIGHT, IMG_WIDTH, 3),
                         include_top=False,  # No incluimos la última capa de clasificación
                         weights='imagenet')

# Congelamos el modelo base para no re-entrenar lo que ya sabe.
base_model.trainable = False

# 3. Construcción del Modelo Final
model = Sequential([
  data_augmentation,
  layers.Rescaling(1./127.5, offset=-1), # Normaliza los pixeles de [0, 255] a [-1, 1]
  base_model,
  layers.GlobalAveragePooling2D(),
  layers.Dropout(0.2), # Ayuda a prevenir el sobreajuste (overfitting)
  layers.Dense(num_classes, activation='softmax') # Capa de salida con una neurona por cada clase
])


# --- COMPILACIÓN Y ENTRENAMIENTO ---

# 1. Compilación
#    Configuramos el optimizador, la función de pérdida y las métricas.
model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(),
              metrics=['accuracy'])

print("\n--- Resumen del Modelo ---")
model.summary()

print("\n--- Iniciando Entrenamiento ---")
# 2. Entrenamiento
history = model.fit(
  train_dataset,
  validation_data=validation_dataset,
  epochs=EPOCHS
)

# --- GUARDADO DEL MODELO FINAL ---

# Guardamos el modelo entrenado en el formato recomendado .keras
model_filename = 'billetes_model_classifier.keras'
model.save(model_filename)
print(f"\n--- ¡Entrenamiento completado! ---")
print(f"Modelo guardado como '{model_filename}'")
print(f"Nombres de las clases guardados en 'class_names.txt'")
print("Recuerda copiar ambos archivos a la carpeta 'server/app/static/' para actualizar tu aplicación.")