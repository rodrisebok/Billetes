// Obtenemos la URL de la API desde las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface PredictionResponse {
  predicted_class: string;
  confidence: number;
}

/**
 * Envía una imagen al backend para su clasificación.
 * @param imageBlob El blob de la imagen capturada.
 * @returns Una promesa con la predicción del servidor.
 */
export const classifyImage = async (imageBlob: Blob): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append('file', imageBlob, 'capture.jpeg');

  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error en el servidor');
  }

  return response.json();
};