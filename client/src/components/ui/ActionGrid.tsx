import React from 'react';
import { Plus, Banknote, RotateCcw } from 'lucide-react';

interface ActionGridProps {
  onAddMovement: () => void;
  onToggleDenominations: () => void;
  onRefresh: () => void;
  showDenominations: boolean;
}

const ActionGrid: React.FC<ActionGridProps> = ({
  onAddMovement,
  onToggleDenominations,
  onRefresh,
  showDenominations
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <button
        onClick={onAddMovement}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-200 flex flex-col items-center active:scale-95"
        aria-label="Agregar movimiento"
      >
        <Plus className="w-6 h-6 mb-2" />
        <span className="font-semibold text-sm">Agregar</span>
      </button>
      
      <button
        onClick={onToggleDenominations}
        className={`p-4 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-200 flex flex-col items-center active:scale-95 ${
          showDenominations 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
            : 'bg-white/10 backdrop-blur-sm text-white'
        }`}
        aria-label={showDenominations ? 'Ocultar billetes' : 'Mostrar billetes'}
      >
        <Banknote className="w-6 h-6 mb-2" />
        <span className="font-semibold text-sm">Billetes</span>
      </button>

      <button
        onClick={onRefresh}
        className="bg-white/10 backdrop-blur-sm text-white p-4 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-200 flex flex-col items-center active:scale-95"
        aria-label="Actualizar datos"
      >
        <RotateCcw className="w-6 h-6 mb-2" />
        <span className="font-semibold text-sm">Actualizar</span>
      </button>
    </div>
  );
};

export default ActionGrid;