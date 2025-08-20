import React, { useRef, useEffect, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { useCurrencyAnalysis } from '../../hooks/useCurrencyAnalysis';
import ScanOverlay from '../ui/ScanOverlay';
import ResultModal from '../ui/ResultModal';

interface CameraScreenProps {
  onClose: () => void;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  
  const { isAnalyzing, result, error, analyzeImage, clearResult } = useCurrencyAnalysis();

  // Inicializar cámara cuando el componente se monta
  useEffect(() => {
    startCamera();
    
    // Cleanup al desmontar
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      console.log('Iniciando cámara...');
      
      // Detener cualquier stream existente
      stopCamera();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      console.log('Stream obtenido:', stream);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Configurar eventos del video
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata cargada');
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log('Video playing');
                setCameraReady(true);
                setCameraError('');
              })
              .catch(err => {
                console.error('Error playing video:', err);
                setCameraError('Error al iniciar la reproducción del video');
              });
          }
        };

        videoRef.current.onerror = (e) => {
          console.error('Video error:', e);
          setCameraError('Error en el stream de video');
        };
      }
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError(`Error al acceder a la cámara: ${err}`);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track);
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  };

  const handleCapture = async () => {
    console.log('Attempting capture, camera ready:', cameraReady);
    
    if (!videoRef.current || !cameraReady) {
      console.error('Video not ready or camera not active');
      setCameraError('Cámara no está lista');
      return;
    }

    const video = videoRef.current;
    console.log('Video state:', {
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight
    });

    if (video.readyState !== 4) {
      console.error('Video not fully loaded');
      setCameraError('El video no está completamente cargado');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        console.error('Cannot get canvas context');
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          console.log('Photo captured, size:', blob.size);
          await analyzeImage(blob);
        } else {
          console.error('Failed to create blob');
        }
      }, 'image/jpeg', 0.8);
      
    } catch (err) {
      console.error('Error capturing photo:', err);
      setCameraError(`Error al capturar foto: ${err}`);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size);
      await analyzeImage(file);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleClose}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            aria-label="Cerrar cámara"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white text-xl font-bold">Escanear Billete</h2>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            aria-label="Seleccionar imagen desde galería"
          >
            <Upload className="w-6 h-6 text-white" />
          </button>
        </div>
        
        {/* Status indicator */}
        <div className="text-center mt-2">
          <p className="text-white text-sm">
            {cameraError ? `❌ ${cameraError}` : 
             cameraReady ? '✅ Cámara lista' : 
             '🔄 Iniciando cámara...'}
          </p>
        </div>
      </div>

      {/* Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        aria-label="Vista de la cámara para escanear billetes"
        style={{ backgroundColor: '#000' }}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Scanning Overlay */}
      <ScanOverlay isScanning={isAnalyzing} />

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
        <div className="flex items-center justify-center space-x-8">
          <button
            onClick={handleCapture}
            disabled={isAnalyzing || !cameraReady}
            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Capturar foto del billete"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              {isAnalyzing ? (
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Camera className="w-8 h-8 text-emerald-500" />
              )}
            </div>
          </button>
        </div>
        
        {/* Debug info */}
        <div className="text-center mt-4">
          <p className="text-white text-xs opacity-70">
            Cámara: {cameraReady ? 'Activa' : 'Inactiva'} | 
            Análisis: {isAnalyzing ? 'Procesando' : 'Listo'}
          </p>
        </div>
      </div>

      {/* Result Modal */}
      <ResultModal
        result={result}
        error={error}
        onContinue={clearResult}
        onRetry={clearResult}
      />
    </div>
  );
};

export default CameraScreen;