import os
# Esta línea deshabilita la GPU y fuerza a TensorFlow a usar la CPU.
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

import tensorflow as tf
from tensorflow.keras.preprocessing import image_dataset_from_directory
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import matplotlib.pyplot as plt

# --- CONFIGURACIÓN DEL ENTRENAMIENTO ---
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
DATASET_DIR = 'dataset'

# --- PASO 1: CARGAR Y PREPARAR LOS DATOS ---
print("--- Cargando y preparando el dataset ---")

train_dataset = image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='int'
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

class_names = train_dataset.class_names
num_classes = len(class_names)
print(f"Clases encontradas: {class_names}")
print(f"Número de clases: {num_classes}")

# --- CAMBIO IMPORTANTE: APLICAR PREPROCESAMIENTO AL DATASET ---
AUTOTUNE = tf.data.AUTOTUNE

# Esta función aplica el preprocesamiento que MobileNetV2 necesita.
def preprocess_dataset_fn(image, label):
    return preprocess_input(image), label

# Usamos .map() para aplicar la función a cada imagen en nuestros datasets.
train_dataset = train_dataset.map(preprocess_dataset_fn, num_parallel_calls=AUTOTUNE).prefetch(buffer_size=AUTOTUNE)
validation_dataset = validation_dataset.map(preprocess_dataset_fn, num_parallel_calls=AUTOTUNE).prefetch(buffer_size=AUTOTUNE)


# --- PASO 2: CONSTRUIR EL MODELO (TRANSFER LEARNING) ---
print("\n--- Construyendo el modelo con Transfer Learning ---")

# Cargamos el modelo base MobileNetV2.
base_model = MobileNetV2(input_shape=(224, 224, 3),
                         include_top=False,
                         weights='imagenet')
base_model.trainable = False

# Construimos nuestro nuevo modelo. ¡Ya no necesitamos la capa Lambda!
inputs = tf.keras.Input(shape=(224, 224, 3))
# Pasamos los datos directamente al modelo base, ya que el preprocesamiento se hizo antes.
x = base_model(inputs, training=False)
x = GlobalAveragePooling2D()(x)
x = Dropout(0.2)(x)
outputs = Dense(num_classes, activation='softmax')(x)

model = Model(inputs, outputs)

model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(),
              metrics=['accuracy'])

model.summary()

# --- PASO 3: ENTRENAR EL MODELO ---
print("\n--- ¡Iniciando el entrenamiento! ---")
history = model.fit(train_dataset,
                    epochs=EPOCHS,
                    validation_data=validation_dataset)

# --- PASO 4: EVALUAR Y GUARDAR EL MODELO ---
print("\n--- Entrenamiento finalizado. Guardando el modelo... ---")
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
