import React, { useState } from 'react';
import { ArrowLeft, DollarSign, Scan } from 'lucide-react';
import { useCashFlow } from '../../hooks/useCashFlow';
import BalanceCard from '../ui/BalanceCard';
import ActionGrid from '../ui/ActionGrid';
import DenominationsList from '../ui/DenominationsList';
import MovementsList from '../ui/MovementsList';
import AddMovementModal from '../ui/AddMovementModal';

interface CashFlowScreenProps {
  onBack: () => void;
}

const CashFlowScreen: React.FC<CashFlowScreenProps> = ({ onBack }) => {
  const {
    balance,
    denominations,
    movements,
    loading,
    error,
    addMovement,
    refresh
  } = useCashFlow();

  const [showAddMovement, setShowAddMovement] = useState(false);
  const [showDenominations, setShowDenominations] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const handleAddMovement = async (movementData: { amount: number; type: 'ingreso' | 'gasto' }) => {
    await addMovement(movementData);
  };

  const handleRefresh = async () => {
    await refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mx-auto flex items-center justify-center shadow-2xl mb-4">
            <DollarSign className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Cargando datos...</p>
          <p className="text-blue-200 text-sm mt-1">Conectando con la caja</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6 flex items-center justify-center">
        <div className="text-white text-center max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center shadow-2xl mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Error de conexión</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleRefresh}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Reintentar
            </button>
            <button
              onClick={onBack}
              className="w-full bg-white/10 backdrop-blur-sm text-white py-3 rounded-2xl font-semibold hover:bg-white/20 transition-colors duration-200"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-md mx-auto">
        {/* Header con Logo */}
        <div className="text-center mb-8 pt-4">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={onBack}
              className="absolute left-6 top-8 text-white hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-white/10"
              aria-label="Volver al inicio"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Scan className="w-5 h-5 text-gray-900" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Flujo de Caja
          </h1>
          <p className="text-blue-200 text-sm">
            Gestión de efectivo
          </p>
        </div>

        {/* Saldo Total */}
        <BalanceCard
          balance={balance}
          visible={balanceVisible}
          onToggleVisibility={() => setBalanceVisible(!balanceVisible)}
        />

        {/* Botones de Acción */}
        <ActionGrid
          onAddMovement={() => setShowAddMovement(true)}
          onToggleDenominations={() => setShowDenominations(!showDenominations)}
          onRefresh={handleRefresh}
          showDenominations={showDenominations}
        />

        {/* Desglose de Billetes */}
        <DenominationsList
          denominations={denominations}
          visible={showDenominations}
        />

        {/* Historial de Movimientos */}
        <MovementsList movements={movements} />

        {/* Modal para Agregar Movimiento */}
        <AddMovementModal
          visible={showAddMovement}
          onClose={() => setShowAddMovement(false)}
          onSubmit={handleAddMovement}
        />
      </div>
    </div>
  );
};

export default CashFlowScreen;