import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { PredictionResult } from '../../types/api';

interface ResultModalProps {
  result?: PredictionResult | null;
  error?: string;
  onContinue: () => void;
  onRetry: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ 
  result, 
  error, 
  onContinue, 
  onRetry 
}) => {
  if (!result && !error) return null;

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 z-30">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        {result ? (
          <>
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Billete Detectado!
            </h3>
            <div className="text-4xl font-bold text-emerald-600 mb-2">
              ${result.value}
            </div>
            <p className="text-gray-600 mb-6">
              Confianza: {Math.round(result.confidence * 100)}%
            </p>
            <button
              onClick={onContinue}
              className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold"
              aria-label="Continuar escaneando"
            >
              Escanear Otro
            </button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Error
            </h3>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={onRetry}
              className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold"
              aria-label="Intentar nuevamente"
            >
              Intentar Nuevamente
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultModal;