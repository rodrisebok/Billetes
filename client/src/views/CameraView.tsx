import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { classifyImage } from '../api/predictionService';
import type { PredictionResponse } from '../api/predictionService';
import type { View } from '../types';
import { CameraIcon, BackIcon, LoadingIcon } from '../assets/icons';
import Notification from '../components/Notification';

const CameraView: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // --- NUEVO ESTADO PARA EL MENSAJE EN PANTALLA ---
  // Este estado controlará el texto que se muestra permanentemente en la cámara.
  const [infoText, setInfoText] = useState('Apunte a un billete...');
  
  // Umbral de confianza (80%)
  const CONFIDENCE_THRESHOLD = 0.8;

  const handleTakePhoto = async () => {
    if (webcamRef.current && !isLoading) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setIsLoading(true);
        setError(null);
        try {
          const blob = await (await fetch(imageSrc)).blob();
          const result = await classifyImage(blob);

          // --- LÓGICA MEJORADA ---
          // Comprueba si es 'fondo' o si la confianza es menor al 80%
          if (result.predicted_class.toLowerCase() === 'fondo' || result.confidence < CONFIDENCE_THRESHOLD) {
            // Si no es un billete claro, muestra la instrucción.
            setInfoText('Apunte a un billete...');
          } else {
            // Si es un billete claro, muestra el resultado.
            const confidenceText = `(${(result.confidence * 100).toFixed(0)}%)`;
            const classText = result.predicted_class.replace('_', ' ');
            setInfoText(`${classText} ${confidenceText}`);
          }
          // --------------------------

        } catch (err: any) {
          setError(err.message || "No se pudo conectar con el servidor.");
          setInfoText(''); // Oculta el texto de info si hay un error para no solaparse
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'environment', aspectRatio: 9 / 16 }}
        className="object-cover w-full h-full"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

      <button 
        onClick={() => onNavigate('main')} 
        className="absolute top-5 left-5 text-white bg-black/30 rounded-full p-2 backdrop-blur-sm transition-colors hover:bg-black/50"
      >
        <BackIcon />
      </button>

      {/* --- NUEVO ELEMENTO: TEXTO DE ESTADO PERMANENTE --- */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-11/12 max-w-sm">
        <div className="bg-black/50 text-white text-center rounded-xl p-3 backdrop-blur-md">
          <p className="text-xl font-semibold tracking-wide">{infoText}</p>
        </div>
      </div>
      {/* --------------------------------------------------- */}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={handleTakePhoto}
          disabled={isLoading}
          className="w-20 h-20 bg-white rounded-full border-4 border-gray-400 flex items-center justify-center transition-transform duration-200 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Tomar foto"
        >
          {isLoading ? <LoadingIcon /> : <CameraIcon />}
        </button>
      </div>

      {/* La notificación ahora se usará solo para errores */}
      <Notification
        message={error ? `Error: ${error}` : ''}
        type={'error'}
        isVisible={!!error}
        onClose={() => {
          setError(null);
          setInfoText('Apunte a un billete...'); // Restaura el texto al cerrar el error
        }}
      />
    </div>
  );
};

export default CameraView;