import cv2
import os

def procesar_video(ruta_video, denominacion):
    """
    Función para extraer todos los frames de un video y guardarlos como imágenes JPG
    en una carpeta específica para su clase (denominación), asegurando que los nombres
    de archivo sean únicos.
    """
    carpeta_dataset = "dataset"
    if not os.path.exists(carpeta_dataset):
        os.makedirs(carpeta_dataset)
        print(f"Directorio base '{carpeta_dataset}' creado.")

    carpeta_clase = os.path.join(carpeta_dataset, denominacion)
    if not os.path.exists(carpeta_clase):
        os.makedirs(carpeta_clase)
        print(f"Directorio de clase '{carpeta_clase}' creado.")
    else:
        print(f"Directorio de clase '{carpeta_clase}' ya existe. Las nuevas imágenes se añadirán aquí.")

    cap = cv2.VideoCapture(ruta_video)
    if not cap.isOpened():
        print(f"Error: No se pudo abrir el video en la ruta '{ruta_video}'")
        return

    frame_count_total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"El video '{ruta_video}' tiene {frame_count_total} frames en total.")

    # --- INICIO DE LA CORRECCIÓN ---
    # Obtenemos el nombre del archivo de video sin la extensión para usarlo en el nombre del frame.
    # Por ejemplo, de "videos/billete_500_1.mp4" obtenemos "billete_500_1"
    nombre_video_base = os.path.splitext(os.path.basename(ruta_video))[0]
    # --- FIN DE LA CORRECCIÓN ---

    frame_actual = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # --- CORRECCIÓN EN EL NOMBRE DEL ARCHIVO ---
        # Ahora el nombre incluye la base del nombre del video, haciéndolo único.
        # Ejemplo de salida: "billete_500_1_frame_00001.jpg"
        nombre_archivo = os.path.join(carpeta_clase, f"{nombre_video_base}_frame_{frame_actual:05d}.jpg")
        
        cv2.imwrite(nombre_archivo, frame)
        
        if (frame_actual % 100) == 0:
            print(f"Progreso: Guardado {nombre_archivo}")
        
        frame_actual += 1

    cap.release()
    print(f"\n¡Proceso completado para '{ruta_video}'!")
    print(f"Se extrajeron y guardaron {frame_actual} imágenes en la carpeta '{carpeta_clase}'.")


# --- CONFIGURACIÓN PRINCIPAL ---
if __name__ == "__main__":
    videos_a_procesar = {
        "videos/billete_10.mp4": "10_pesos",
        "videos/billete_10_1.mp4": "10_pesos",
        "videos/billete_20.mp4": "20_pesos",
        "videos/billete_20_1.mp4": "20_pesos",
        "videos/billete_20_2.mp4": "20_pesos",
        "videos/billete_50.mp4": "50_pesos",
        "videos/billete_50_1.mp4": "50_pesos",
        "videos/billete_50_2.mp4": "50_pesos",
        "videos/billete_100.mp4": "100_pesos",
        "videos/billete_100_1.mp4": "100_pesos",
        "videos/billete_100_2.mp4": "100_pesos",
        "videos/billete_100_3.mp4": "100_pesos",
        "videos/billete_200.mp4": "200_pesos",
        "videos/billete_200_1.mp4": "200_pesos",
        "videos/billete_200_2.mp4": "200_pesos",
        "videos/billete_500.mp4": "500_pesos",
        "videos/billete_500_1.mp4": "500_pesos",
        "videos/billete_1000.mp4": "1000_pesos",
        "videos/billete_1000_1.mp4": "1000_pesos",
        "videos/billete_1000_2.mp4": "1000_pesos",
        "videos/billete_2000.mp4": "2000_pesos",
        "videos/billete_2000_1.mp4": "2000_pesos",
        "videos/billete_10000.mp4": "10000_pesos",
        "videos/billete_10000_1.mp4": "10000_pesos",
        "videos/billete_20000.mp4": "20000_pesos",
        
    }

    print("--- Iniciando el proceso de extracción de frames ---")

    for ruta_video, denominacion in videos_a_procesar.items():
        print(f"\n>>> Procesando video para la clase: {denominacion.upper()} <<<")
        if os.path.exists(ruta_video):
            procesar_video(ruta_video, denominacion)
        else:
            print(f"ADVERTENCIA: El archivo de video '{ruta_video}' no fue encontrado. Saltando este video.")
    
    print("\n--- ¡Todos los videos han sido procesados! ---")
    print("Revisa la nueva carpeta 'dataset' que se ha creado en tu proyecto.")