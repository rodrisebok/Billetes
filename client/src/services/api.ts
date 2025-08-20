// src/services/api.ts - VERSIÓN CORREGIDA
import { PredictionResult } from '../types/api';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const analyzeCurrencyImage = async (imageBlob: Blob): Promise<PredictionResult> => {
  try {
    console.log('Enviando imagen al backend...', imageBlob.size, 'bytes');
    
    const formData = new FormData();
    formData.append('file', imageBlob, 'image_bytes');

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
      // No agregar Content-Type header, dejamos que el navegador lo maneje
    });

    console.log('Respuesta del backend:', response.status, response.statusText);

    if (!response.ok) {
      // Intentar obtener el mensaje de error del backend
      const errorText = await response.text();
      console.error('Error del backend:', errorText);
      throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
    }

    const result = await response.json();
    console.log('Resultado del análisis:', result);
    return result;
  } catch (error) {
    console.error('Error analyzing currency:', error);
    throw error;
  }
};

// Función para probar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};