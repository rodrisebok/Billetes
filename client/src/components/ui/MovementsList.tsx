import React from 'react';
import { History, TrendingUp, TrendingDown, Scan, Edit3, Settings } from 'lucide-react';
import { Movement } from '../../types/cashFlow';
import { formatCurrency, formatDate } from '../../utils/currency';

interface MovementsListProps {
  movements: Movement[];
  onEditMovement: (movement: Movement) => void;
}

const MovementsList: React.FC<MovementsListProps> = ({ movements, onEditMovement }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
      <div className="flex items-center space-x-2 mb-4">
        <History className="w-5 h-5 text-white" />
        <h3 className="text-lg font-bold text-white">Movimientos Recientes</h3>
        {movements.length > 0 && (
          <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
            {movements.length}
          </span>
        )}
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {movements.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <History className="w-8 h-8 text-white/50" />
            </div>
            <p className="text-gray-300">No hay movimientos registrados</p>
            <p className="text-gray-400 text-sm mt-1">Los nuevos movimientos aparecerán aquí</p>
          </div>
        ) : (
          movements.map((movement) => (
            <div 
              key={movement.id} 
              className="flex items-center justify-between bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors duration-200 group"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  movement.type === 'ingreso' 
                    ? 'bg-emerald-500' 
                    : 'bg-red-500'
                }`}>
                  {movement.type === 'ingreso' ? 
                    <TrendingUp className="w-5 h-5 text-white" /> : 
                    <TrendingDown className="w-5 h-5 text-white" />
                  }
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className={`font-semibold ${
                      movement.type === 'ingreso' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {movement.type === 'ingreso' ? '+' : '-'}{formatCurrency(movement.amount)}
                    </p>
                    <div className="flex items-center space-x-1">
                      {movement.origin === 'escaneo' ? (
                        <Scan className="w-3 h-3 text-blue-400" />
                      ) : (
                        <Edit3 className="w-3 h-3 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-400 capitalize">
                        {movement.origin}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300">
                    {formatDate(movement.date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    movement.type === 'ingreso' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {movement.type === 'ingreso' ? 'Ingreso' : 'Gasto'}
                  </span>
                </div>
                
                {/* ✅ BOTÓN DE EDITAR */}
                <button
                  onClick={() => onEditMovement(movement)}
                  className="w-8 h-8 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  title="Editar movimiento"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MovementsList;