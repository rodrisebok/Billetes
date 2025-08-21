import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Check } from 'lucide-react';
import { AddMovementRequest } from '../../types/cashFlow';
import { isValidAmount, parseAmount } from '../../utils/currency';

interface AddMovementModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (movement: AddMovementRequest) => Promise<void>;
}

const AddMovementModal: React.FC<AddMovementModalProps> = ({
  visible,
  onClose,
  onSubmit
}) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'ingreso' | 'gasto'>('ingreso');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidAmount(amount)) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        amount: parseAmount(amount),
        type
      });
      setAmount('');
      setType('ingreso');
      onClose();
    } catch (error) {
      console.error('Error adding movement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setType('ingreso');
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Nuevo Movimiento</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/10"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de movimiento */}
          <div>
            <label className="block text-white text-sm font-semibold mb-3">
              Tipo de movimiento
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('ingreso')}
                className={`p-4 rounded-2xl flex flex-col items-center transition-all duration-200 ${
                  type === 'ingreso'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <TrendingUp className="w-6 h-6 mb-2" />
                <span className="font-semibold">Ingreso</span>
              </button>
              
              <button
                type="button"
                onClick={() => setType('gasto')}
                className={`p-4 rounded-2xl flex flex-col items-center transition-all duration-200 ${
                  type === 'gasto'
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <TrendingDown className="w-6 h-6 mb-2" />
                <span className="font-semibold">Gasto</span>
              </button>
            </div>
          </div>

          {/* Monto */}
          <div>
            <label htmlFor="amount" className="block text-white text-sm font-semibold mb-2">
              Monto
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-lg">
                $
              </span>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                step="0.01"
                min="0.01"
                className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/50 rounded-2xl px-12 py-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-white/20"
                required
              />
            </div>
            {amount && !isValidAmount(amount) && (
              <p className="text-red-400 text-sm mt-2">
                Ingresa un monto válido mayor a 0
              </p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-white/10 backdrop-blur-sm text-white py-4 rounded-2xl font-semibold hover:bg-white/20 transition-colors duration-200"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={!isValidAmount(amount) || loading}
              className={`flex-1 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                !isValidAmount(amount) || loading
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : type === 'ingreso'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg'
                    : 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              <span>{loading ? 'Guardando...' : 'Confirmar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovementModal;