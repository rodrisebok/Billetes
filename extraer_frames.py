import cv2
import os

def procesar_video(ruta_video, denominacion):
    """
    Función para extraer todos los frames de un video y guardarlos como imágenes JPG
    en una carpeta específica para su clase (denominación).
    """
    # Crea el directorio base 'dataset' si no existe.
    # Aquí es donde vivirá todo nuestro conjunto de datos de imágenes.
    carpeta_dataset = "dataset"
    if not os.path.exists(carpeta_dataset):
        os.makedirs(carpeta_dataset)
        print(f"Directorio base '{carpeta_dataset}' creado.")

    # Crea el directorio específico para esta denominación (ej: 'dataset/500_pesos').
    carpeta_clase = os.path.join(carpeta_dataset, denominacion)
    if not os.path.exists(carpeta_clase):
        os.makedirs(carpeta_clase)
        print(f"Directorio de clase '{carpeta_clase}' creado.")
    else:
        print(f"Directorio de clase '{carpeta_clase}' ya existe. Las nuevas imágenes se añadirán aquí.")

    # Intenta abrir el archivo de video.
    cap = cv2.VideoCapture(ruta_video)
    if not cap.isOpened():
        print(f"Error: No se pudo abrir el video en la ruta '{ruta_video}'")
        return

    # Leemos la cantidad total de frames para tener una idea del progreso.
    frame_count_total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"El video '{ruta_video}' tiene {frame_count_total} frames en total.")

    # Iteramos sobre cada frame del video.
    frame_actual = 0
    while True:
        # Leemos el siguiente frame. 'ret' será True si la lectura fue exitosa.
        ret, frame = cap.read()

        # Si 'ret' es False, significa que llegamos al final del video.
        if not ret:
            break

        # Construimos el nombre del archivo de salida para la imagen.
        # Usamos :05d para que los números tengan ceros a la izquierda (ej: frame_00001.jpg)
        # Esto mantiene los archivos ordenados.
        nombre_archivo = os.path.join(carpeta_clase, f"frame_{frame_actual:05d}.jpg")
        
        # Guardamos el frame actual como una imagen JPG.
        cv2.imwrite(nombre_archivo, frame)
        
        # Imprimimos un mensaje de progreso cada 100 frames para no saturar la consola.
        if (frame_actual % 100) == 0:
            print(f"Progreso: Guardado {nombre_archivo}")
        
        frame_actual += 1

    # Liberamos el objeto de captura de video para liberar memoria.
    cap.release()
    print(f"\n¡Proceso completado para '{ruta_video}'!")
    print(f"Se extrajeron y guardaron {frame_actual} imágenes en la carpeta '{carpeta_clase}'.")


# --- CONFIGURACIÓN PRINCIPAL ---
#
# 1. Guarda este script como "extraer_frames.py".
# 2. Crea una carpeta llamada "videos" en el mismo lugar que este script.
# 3. Pon tus videos dentro de la carpeta "videos".
# 4. Asegúrate de tener instalado OpenCV: pip install opencv-python
# 5. AJUSTA LOS NOMBRES de tus archivos de video y las denominaciones en el diccionario de abajo.
# 6. Ejecuta el script desde tu terminal: python extraer_frames.py
#
if __name__ == "__main__":
    # Diccionario para configurar qué videos procesar y en qué carpetas guardar las imágenes.
    # La "clave" es la ruta al video.
    # El "valor" es el nombre de la carpeta (la clase) que se creará dentro de 'dataset'.
    videos_a_procesar = {
        "videos/billete_500.mp4": "500_pesos",
        "videos/billete_1000.mp4": "1000_pesos",
        "videos/billete_2000.mp4": "2000_pesos"
        # Puedes añadir más videos aquí si consigues más billetes.
        # "videos/billete_100.mp4": "100_pesos",
    }

    print("--- Iniciando el proceso de extracción de frames ---")

    for ruta_video, denominacion in videos_a_procesar.items():
        print(f"\n>>> Procesando video para la clase: {denominacion.upper()} <<<")
        if os.path.exists(ruta_video):
            procesar_video(ruta_video, denominacion)
        else:
            # Advertencia si un video configurado no se encuentra en la carpeta.
            print(f"ADVERTENCIA: El archivo de video '{ruta_video}' no fue encontrado. Saltando este video.")
    
    print("\n--- ¡Todos los videos han sido procesados! ---")
    print("Revisa la nueva carpeta 'dataset' que se ha creado en tu proyecto.")

