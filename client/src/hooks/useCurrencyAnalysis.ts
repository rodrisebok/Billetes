import { useState } from 'react';
import { PredictionResult } from '../types/api';
import { analyzeCurrencyImage } from '../services/api';
import { useVoiceAnnouncement } from './useVoiceAnnouncement';

export const useCurrencyAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string>('');
  const { announceResult, announceError } = useVoiceAnnouncement();

  const analyzeImage = async (imageBlob: Blob) => {
    setIsAnalyzing(true);
    setResult(null);
    setError('');

    try {
      const analysisResult = await analyzeCurrencyImage(imageBlob);
      setResult(analysisResult);
      announceResult(analysisResult.value, analysisResult.confidence);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al analizar la imagen';
      setError(errorMessage);
      announceError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError('');
  };

  return {
    isAnalyzing,
    result,
    error,
    analyzeImage,
    clearResult
  };
};