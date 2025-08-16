// --- Archivo: frontend/src/components/CameraView.tsx ---
// Corregido para solucionar el error de importación.

import React, { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
// Se elimina la importación directa de 'react-webcam' que causaba el error.
// import Webcam from 'react-webcam'; 
import type { View } from '../types';

// Se define la interfaz de props localmente para incluir el componente de la cámara.
interface CameraViewProps {
    onNavigate: (view: View) => void;
    WebcamComponent: React.ComponentType<any>; // Prop para recibir el componente Webcam.
}

const CameraView: FC<CameraViewProps> = ({ onNavigate, WebcamComponent }) => {
    // La referencia ahora es de tipo 'any' ya que el tipo 'Webcam' no se importa directamente.
    const webcamRef = useRef<any>(null);
    const [prediction, setPrediction] = useState('Apunte a un billete...');
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const captureAndPredict = async () => {
        if (isProcessing || !webcamRef.current) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        try {
            setIsProcessing(true);

            const blob = await fetch(imageSrc).then(res => res.blob());
            const imageFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
            const formData = new FormData();
            formData.append('file', imageFile);

            // RECUERDA: Cambia '127.0.0.1' por tu IP local si pruebas desde el celular.
            const response = await fetch('http://127.0.0.1:8000/predict/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            
            const data = await response.json();

            if (data.denominacion === 'fondo' || data.confianza < 0.85) {
                setPrediction('Apunte a un billete...');
            } else {
                setPrediction(data.denominacion.replace('_', ' '));
            }

        } catch (error) {
            console.error("Error en la predicción:", error);
            setPrediction('Error de conexión');
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (!isCameraReady) return;
        const interval = setInterval(captureAndPredict, 1500);
        return () => clearInterval(interval);
    }, [isCameraReady, isProcessing]);

    return (
        <div className="w-full h-full bg-gray-900 text-white flex flex-col overflow-hidden rounded-3xl">
            <div className="p-4 flex items-center border-b border-gray-700">
                <button onClick={() => onNavigate('main')} className="text-cyan-400 hover:text-cyan-300 mr-4">
                    &larr; Volver
                </button>
                <h1 className="text-xl font-bold text-cyan-400">Detector de Billetes</h1>
            </div>
            <div className="relative w-full flex-grow bg-gray-900 flex items-center justify-center">
                {/* Se utiliza el WebcamComponent que se recibe por props */}
                <WebcamComponent
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={{ facingMode: "environment" }}
                    onUserMedia={() => setIsCameraReady(true)}
                    onUserMediaError={() => setPrediction("Error de cámara")}
                />
                {!isCameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <p>Cargando cámara...</p>
                    </div>
                )}
            </div>
            <div className="p-6 bg-gray-800">
                <p className="text-lg text-gray-400 text-center mb-2">Resultado:</p>
                <div className="bg-gray-900 rounded-lg p-4 text-center">
                    <p className="text-4xl font-mono font-bold text-white tracking-widest">
                        {prediction}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CameraView;
