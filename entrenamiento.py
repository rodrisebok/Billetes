import os
# --- ¡CORRECCIÓN AÑADIDA! ---
# Esta línea deshabilita la GPU y fuerza a TensorFlow a usar la CPU.
# Colócala ANTES de importar TensorFlow.
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

import tensorflow as tf
from tensorflow.keras.preprocessing import image_dataset_from_directory
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import matplotlib.pyplot as plt

# --- CONFIGURACIÓN DEL ENTRENAMIENTO ---

# 1. Parámetros del Modelo
IMG_SIZE = (224, 224) # Tamaño al que se redimensionarán todas las imágenes. MobileNetV2 usa este tamaño.
BATCH_SIZE = 32      # Número de imágenes a procesar en cada paso.
EPOCHS = 10          # Número de veces que el modelo verá el dataset completo. 10 es un buen punto de partida.

# 2. Ruta a tu dataset
# Asegúrate de que esta carpeta contenga las subcarpetas: 500_pesos, 1000_pesos, 2000_pesos
DATASET_DIR = 'dataset'

# --- PASO 1: CARGAR Y PREPARAR LOS DATOS ---

print("--- Cargando y preparando el dataset ---")

# Cargamos el dataset desde el directorio, dividiéndolo en entrenamiento (80%) y validación (20%).
# La validación nos ayuda a saber si el modelo está aprendiendo bien o solo memorizando.
train_dataset = image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="training",
    seed=123, # Semilla para que la división sea siempre la misma.
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='int' # Las etiquetas serán números enteros (0, 1, 2...).
)

validation_dataset = image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='int'
)

# Guardamos los nombres de las clases (ej: ['1000_pesos', '2000_pesos', '500_pesos'])
# El orden lo define TensorFlow alfabéticamente.
class_names = train_dataset.class_names
num_classes = len(class_names)
print(f"Clases encontradas: {class_names}")
print(f"Número de clases: {num_classes}")

# Optimizamos la carga de datos para un mejor rendimiento
AUTOTUNE = tf.data.AUTOTUNE
train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
validation_dataset = validation_dataset.prefetch(buffer_size=AUTOTUNE)

# --- PASO 2: CONSTRUIR EL MODELO (TRANSFER LEARNING) ---

print("\n--- Construyendo el modelo con Transfer Learning ---")

# Creamos una capa de pre-procesamiento que se ajusta a lo que MobileNetV2 espera.
preprocess_layer = tf.keras.Sequential([
    tf.keras.layers.Lambda(lambda x: preprocess_input(x))
])

# Cargamos el modelo base MobileNetV2, pre-entrenado con millones de imágenes de ImageNet.
# No incluimos la capa de clasificación final (include_top=False).
base_model = MobileNetV2(input_shape=(224, 224, 3),
                         include_top=False,
                         weights='imagenet')

# Congelamos el modelo base. No queremos re-entrenar sus pesos, solo usar el conocimiento que ya tiene.
base_model.trainable = False

# Construimos nuestro nuevo modelo encima del modelo base.
inputs = tf.keras.Input(shape=(224, 224, 3))
x = preprocess_layer(inputs) # Aplicamos el pre-procesamiento
x = base_model(x, training=False) # Pasamos los datos por el modelo base en modo inferencia.
x = GlobalAveragePooling2D()(x) # Reducimos la dimensionalidad de los features.
x = Dropout(0.2)(x) # Añadimos un Dropout para prevenir sobreajuste (overfitting).
# La capa final tiene tantas neuronas como clases tengamos, con activación 'softmax' para clasificación.
outputs = Dense(num_classes, activation='softmax')(x)

model = Model(inputs, outputs)

# Compilamos el modelo, definiendo el optimizador, la función de pérdida y las métricas.
model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(),
              metrics=['accuracy'])

# Mostramos un resumen de la arquitectura del modelo.
model.summary()


# --- PASO 3: ENTRENAR EL MODELO ---

print("\n--- ¡Iniciando el entrenamiento! ---")
# Este paso puede tardar varios minutos. Si usas GPU en Colab, será mucho más rápido.
history = model.fit(train_dataset,
                    epochs=EPOCHS,
                    validation_data=validation_dataset)


# --- PASO 4: EVALUAR Y GUARDAR EL MODELO ---

print("\n--- Entrenamiento finalizado. Guardando el modelo... ---")

# Guardamos el modelo entrenado en un único archivo.
# ¡Este archivo es el "cerebro" que usaremos en nuestra aplicación!
model.save('modelo_billetes.h5')
print("Modelo guardado exitosamente como 'modelo_billetes.h5'")

# Opcional: Visualizar la precisión y pérdida durante el entrenamiento
acc = history.history['accuracy']
val_acc = history.history['val_accuracy']
loss = history.history['loss']
val_loss = history.history['val_loss']

plt.figure(figsize=(8, 8))
plt.subplot(2, 1, 1)
plt.plot(acc, label='Precisión de Entrenamiento')
plt.plot(val_acc, label='Precisión de Validación')
plt.legend(loc='lower right')
plt.ylabel('Precisión')
plt.ylim([min(plt.ylim()),1])
plt.title('Precisión de Entrenamiento y Validación')

plt.subplot(2, 1, 2)
plt.plot(loss, label='Pérdida de Entrenamiento')
plt.plot(val_loss, label='Pérdida de Validación')
plt.legend(loc='upper right')
plt.ylabel('Pérdida (Cross Entropy)')
plt.ylim([0,1.0])
plt.title('Pérdida de Entrenamiento y Validación')
plt.xlabel('epoch')
plt.show()
