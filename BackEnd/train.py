# --- Archivo: BackEnd/train.py ---
# Este script utiliza Transfer Learning (MobileNetV2) para entrenar un modelo que CLASIFICA billetes.

import tensorflow as tf
import os

# --- PARÁMETROS DE CONFIGURACIÓN ---
# Asegúrate de que esta ruta apunte a tu carpeta de imágenes.
DATASET_PATH = "dataset" 
# Tamaño al que se redimensionarán todas las imágenes. MobileNetV2 funciona bien con 224x224.
IMG_SIZE = 224
# Número de imágenes a procesar en cada paso del entrenamiento.
BATCH_SIZE = 32
# Número de veces que el modelo verá el dataset completo.
EPOCHS = 10 
# Nombre del archivo donde se guardará el modelo entrenado.
MODEL_FILENAME = "billetes_model_classifier.keras"

# --- 1. CARGA Y PREPARACIÓN DEL DATASET ---
print("Cargando y preparando el dataset...")

# Cargamos las imágenes desde las carpetas.
# Las etiquetas (los nombres de los billetes) se infieren automáticamente de los nombres de las carpetas.
train_dataset = tf.keras.utils.image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,  # Usamos el 20% de las imágenes para validación.
    subset="training",
    seed=123,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE
)

validation_dataset = tf.keras.utils.image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE
)

# Guardamos los nombres de las clases (ej: ['1000_pesos', '2000_pesos', 'fondo'])
class_names = train_dataset.class_names
num_classes = len(class_names)
print(f"Se encontraron {num_classes} clases: {class_names}")

# Optimizamos la carga de datos para un mejor rendimiento.
AUTOTUNE = tf.data.AUTOTUNE
train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
validation_dataset = validation_dataset.prefetch(buffer_size=AUTOTUNE)


# --- 2. CREACIÓN DEL MODELO CON TRANSFER LEARNING ---
print("Creando el modelo con Transfer Learning...")

# Capa para aplicar "data augmentation": giros, zooms, etc.
data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal_and_vertical"),
    tf.keras.layers.RandomRotation(0.2),
    tf.keras.layers.RandomZoom(0.2),
])

# Capa de pre-procesamiento específica de MobileNetV2.
preprocess_input = tf.keras.applications.mobilenet_v2.preprocess_input

# Cargamos el modelo base (MobileNetV2) pre-entrenado con ImageNet.
base_model = tf.keras.applications.MobileNetV2(input_shape=(IMG_SIZE, IMG_SIZE, 3),
                                               include_top=False,
                                               weights='imagenet')

# "Congelamos" el modelo base para no alterar su conocimiento previo.
base_model.trainable = False

# Construimos nuestro nuevo modelo sobre el modelo base.
inputs = tf.keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
x = data_augmentation(inputs)
x = preprocess_input(x)
x = base_model(x, training=False)
x = tf.keras.layers.GlobalAveragePooling2D()(x)
x = tf.keras.layers.Dropout(0.2)(x)
outputs = tf.keras.layers.Dense(num_classes, activation='softmax')(x)

model = tf.keras.Model(inputs, outputs)

# Compilamos el modelo.
model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(),
              metrics=['accuracy'])

model.summary()


# --- 3. ENTRENAMIENTO DEL MODELO ---
print("Iniciando el entrenamiento...")

history = model.fit(
    train_dataset,
    validation_data=validation_dataset,
    epochs=EPOCHS
)


# --- 4. GUARDADO DEL MODELO Y CLASES ---
print(f"Entrenamiento finalizado. Guardando el modelo en '{MODEL_FILENAME}'...")
model.save(MODEL_FILENAME)
print("¡Modelo guardado con éxito!")

with open("class_names.txt", "w") as f:
    f.write("\n".join(class_names))
print("Nombres de las clases guardados en 'class_names.txt'")
