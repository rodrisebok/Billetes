import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

interface BalanceCardProps {
  balance: number;
  visible: boolean;
  onToggleVisibility: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ 
  balance, 
  visible, 
  onToggleVisibility 
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-xl mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white">Saldo Total</h2>
        <button
          onClick={onToggleVisibility}
          className="text-white hover:text-emerald-400 transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
          aria-label={visible ? 'Ocultar saldo' : 'Mostrar saldo'}
        >
          {visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>
      <p className="text-3xl font-bold text-emerald-400">
        {visible ? formatCurrency(balance) : '••••••'}
      </p>
    </div>
  );
};

export default BalanceCard;