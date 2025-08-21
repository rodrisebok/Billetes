import React, { useState, useEffect } from 'react';
import { X, Edit3, DollarSign } from 'lucide-react';
import { Movement } from '../../types/cashFlow';
import { formatCurrency } from '../../utils/currency';

interface EditMovementModalProps {
  movement: Movement | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (movementId: number, newAmount: number) => Promise<void>;
}

const EditMovementModal: React.FC<EditMovementModalProps> = ({
  movement,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (movement && isOpen) {
      setAmount(movement.amount.toString());
      setError(null);
    }
  }, [movement, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movement) return;

    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Por favor ingresa un monto válido');
      return;
    }

    if (numericAmount === movement.amount) {
      setError('El nuevo monto debe ser diferente al actual');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onUpdate(movement.id, numericAmount);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar movimiento');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAmount('');
      setError(null);
      onClose();
    }
  };

  if (!isOpen || !movement) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Editar Movimiento</h3>
              <p className="text-gray-400 text-sm">
                Modificar {movement.type} • {movement.origin}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Información actual */}
        <div className="bg-white/5 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Monto actual:</span>
            <span className={`font-bold text-lg ${
              movement.type === 'ingreso' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {movement.type === 'ingreso' ? '+' : '-'}{formatCurrency(movement.amount)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
              Nuevo Monto
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                step="0.01"
                min="0.01"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !amount}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovementModal;