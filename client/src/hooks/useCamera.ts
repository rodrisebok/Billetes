// src/hooks/useCamera.ts - VERSIÓN CORREGIDA
import { useState, useRef, useCallback } from 'react';
import { CameraPermission } from '../types/camera';

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const requestCameraAccess = async (): Promise<CameraPermission> => {
    try {
      // Primero detener cualquier stream existente
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Esperar a que el video esté listo
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play();
              resolve();
            };
          }
        });
      }
      
      setHasPermission(true);
      setIsActive(true);
      setError('');
      
      return { granted: true };
    } catch (err) {
      console.error('Camera error:', err);
      const errorMessage = 'No se pudo acceder a la cámara. Verifica los permisos.';
      setError(errorMessage);
      setHasPermission(false);
      setIsActive(false);
      
      return { granted: false, error: errorMessage };
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const capturePhoto = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current || !isActive) {
        console.error('Video not ready or camera not active');
        resolve(null);
        return;
      }

      const video = videoRef.current;
      
      // Verificar que el video está reproduciendo
      if (video.readyState !== 4) {
        console.error('Video not ready');
        resolve(null);
        return;
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        resolve(null);
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.8);
    });
  }, [isActive]);

  return {
    hasPermission,
    error,
    isActive,
    videoRef,
    streamRef,
    requestCameraAccess,
    stopCamera,
    capturePhoto
  };
};