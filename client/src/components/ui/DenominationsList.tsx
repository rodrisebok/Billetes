import React from 'react';
import { Denomination } from '../../types/cashFlow';
import { formatCurrency } from '../../utils/currency';

interface DenominationsListProps {
  denominations: Denomination[];
  visible: boolean;
}

const DenominationsList: React.FC<DenominationsListProps> = ({ 
  denominations, 
  visible 
}) => {
  if (!visible || denominations.length === 0) return null;

  const totalBills = denominations.reduce((sum, denom) => sum + denom.quantity, 0);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-xl mb-6 animate-in slide-in-from-top duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Billetes en Caja</h3>
        <span className="text-emerald-400 text-sm font-semibold">
          Total: {totalBills} billetes
        </span>
      </div>
      
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {denominations
          .sort((a, b) => b.value - a.value) // Ordenar por valor descendente
          .map((denom) => (
          <div 
            key={denom.id} 
            className="flex justify-between items-center bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-6 bg-gradient-to-r from-green-400 to-emerald-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">${denom.value}</span>
              </div>
              <span className="text-white font-medium">
                {formatCurrency(denom.value)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">×</span>
              <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold min-w-[2rem] text-center">
                {denom.quantity}
              </span>
              <span className="text-emerald-400 text-sm font-medium">
                = {formatCurrency(denom.value * denom.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DenominationsList;