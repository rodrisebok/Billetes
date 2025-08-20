import React from 'react';
import { Camera, Wallet, Clock, HelpCircle } from 'lucide-react';
import Logo from '../ui/Logo';
import ActionButton from '../ui/ActionButton';

interface MainScreenProps {
  onCameraClick: () => void;
}

const MainScreen: React.FC<MainScreenProps> = ({ onCameraClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-md mx-auto">
        <Logo />

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <ActionButton
            icon={Camera}
            title="Escanear Billete"
            subtitle="Usa la cámara"
            onClick={onCameraClick}
            active={true}
            ariaLabel="Abrir cámara para escanear billetes"
          />

          <ActionButton
            icon={Wallet}
            title="Flujo de Caja"
            subtitle="Próximamente"
            disabled={true}
            ariaLabel="Flujo de caja - Próximamente disponible"
          />

          <ActionButton
            icon={Clock}
            title="Transacciones"
            subtitle="Próximamente"
            disabled={true}
            ariaLabel="Historial de transacciones - Próximamente disponible"
          />

          <ActionButton
            icon={HelpCircle}
            title="Ayuda"
            subtitle="Próximamente"
            disabled={true}
            ariaLabel="Centro de ayuda - Próximamente disponible"
          />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-blue-300 text-sm">
            Diseñado para la independencia financiera
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;