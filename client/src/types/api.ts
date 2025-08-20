export interface PredictionResult {
  value: number;
  confidence: number;
  currency?: string;
  denomination?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PredictionRequest {
  image: Blob;
}