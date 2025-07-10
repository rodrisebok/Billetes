import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

// --- INTERFACES PARA TIPADO ---
// Definimos cómo se verá la respuesta de nuestra API para mayor seguridad de tipos.
interface PredictionResponse {
  denominacion: string;
  confianza: number;
}

const App: React.FC = () => {
  // --- ESTADOS ---
  // Referencia al componente de la webcam para poder tomar capturas.
  const webcamRef = useRef<Webcam>(null);
  // Almacena el resultado de la última predicción válida.
  const [prediction, setPrediction] = useState<string>('Apunte a un billete...');
  // Estado para saber si la cámara está lista y cargada.
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  // Estado para evitar enviar múltiples imágenes al mismo tiempo.
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // --- LÓGICA DE CAPTURA Y PREDICCIÓN ---
  const captureAndPredict = async () => {
    // Si ya estamos procesando una imagen, no hacemos nada.
    if (isProcessing) {
      return;
    }

    // Verificamos que la referencia a la webcam exista.
    if (webcamRef.current) {
      // Tomamos la captura en formato base64.
      const imageSrc = webcamRef.current.getScreenshot();

      // Si la captura falla, salimos.
      if (!imageSrc) {
        setPrediction('Error al capturar imagen');
        return;
      }

      try {
        // Marcamos que estamos procesando.
        setIsProcessing(true);
        setPrediction('Analizando...');

        // Convertimos la imagen base64 a un archivo (Blob) para enviarla.
        const blob = await fetch(imageSrc).then(res => res.blob());
        const imageFile = new File([blob], "capture.jpg", { type: "image/jpeg" });

        // Creamos un FormData para enviar el archivo en la petición POST.
        const formData = new FormData();
        formData.append('file', imageFile);

        // Hacemos la llamada a nuestro backend.
        const response = await fetch('http://127.0.0.1:8000/predict/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }

        const data: PredictionResponse = await response.json();

        // Mostramos la predicción solo si la confianza es alta (ej: > 85%).
        if (data.confianza > 0.85) {
          // Formateamos el texto para que se vea mejor (ej: "500 Pesos").
          const formattedDenomination = data.denominacion.replace('_', ' ');
          setPrediction(formattedDenomination);
        } else {
          // Si la confianza es baja, pedimos al usuario que intente de nuevo.
          setPrediction('No se pudo identificar. Intente de nuevo.');
        }

      } catch (error: unknown) { // Añadimos el tipo 'unknown' para un manejo de errores más seguro.
        console.error("Error en la predicción:", error);
        setPrediction('Error de conexión con el servidor');
      } finally {
        // Marcamos que hemos terminado de procesar.
        setIsProcessing(false);
      }
    }
  };

  // --- EFECTO PARA EL BUCLE DE ANÁLISIS ---
  useEffect(() => {
    // Si la cámara no está lista, no iniciamos el bucle.
    if (!isCameraReady) return;

    // Creamos un intervalo que ejecutará la función de captura cada 1.5 segundos.
    const interval = setInterval(() => {
      captureAndPredict();
    }, 1500);

    // Limpiamos el intervalo cuando el componente se desmonte para evitar fugas de memoria.
    return () => clearInterval(interval);
  }, [isCameraReady, isProcessing]); // El efecto se re-ejecuta si la cámara o el estado de procesamiento cambian.


  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center font-sans text-white p-4">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Cabecera */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-center text-cyan-400">Detector de Billetes IA</h1>
          <p className="text-center text-gray-400 mt-1">Enfoque un billete con la cámara</p>
        </div>

        {/* Contenedor de la Cámara */}
        <div className="relative w-full aspect-video bg-gray-900">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{ facingMode: "environment" }} // Prioriza la cámara trasera
            onUserMedia={() => setIsCameraReady(true)} // Se activa cuando la cámara está lista
            onUserMediaError={() => { // ¡CORREGIDO! Simplificamos el handler para evitar conflictos de tipos.
              console.error("Error de cámara: No se pudo acceder al dispositivo.");
              setPrediction("No se pudo acceder a la cámara.");
            }}
          />
          {!isCameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <p>Cargando cámara...</p>
            </div>
          )}
        </div>

        {/* Contenedor del Resultado */}
        <div className="p-8 bg-gray-800">
          <p className="text-lg text-gray-400 text-center mb-2">Resultado de la Detección:</p>
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <p className="text-5xl font-mono font-extrabold text-white tracking-widest">
              {prediction}
            </p>
          </div>
        </div>

      </div>
       <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>Desarrollado con IA</p>
      </footer>
    </div>
  );
};

export default App;
