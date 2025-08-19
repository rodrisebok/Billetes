import { useState } from 'react';
import type { FC } from 'react';
import type { View } from '../types';
import { CameraIcon, CajaIcon, TransactionIcon, HelpIcon, LogoIcon } from '../assets/icons';
import CornerButton from '../components/CornerButton';
import Notification from '../components/Notification';

interface MainScreenProps {
  onNavigate: (view: View) => void;
}

const MainScreen: FC<MainScreenProps> = ({ onNavigate }) => {
  const [notification, setNotification] = useState({
    message: '',
    isVisible: false,
    type: 'info' as 'info' | 'error',
  });

  const showNotification = (message: string) => {
    setNotification({ message, isVisible: true, type: 'info' });
    setTimeout(() => setNotification({ message: '', isVisible: false, type: 'info' }), 3000);
  };

  const handleComingSoonClick = () => showNotification('Función disponible próximamente');

  return (
    <div className="w-full h-full relative overflow-hidden rounded-3xl flex flex-col bg-gradient-to-br from-white to-blue-50">
      {/* Logo central */}
      <div className="flex-grow flex items-center justify-center relative">
        <div className="text-center">
          <LogoIcon />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-800">BilletesIA</h1>
          <p className="text-gray-500">Tu asistente de reconocimiento</p>
        </div>

        {/* Botones en los extremos */}
        <CornerButton
          position="absolute top-6 left-1/2 -translate-x-1/2"
          icon={<CameraIcon />}
          text="Cámara"
          onClick={() => onNavigate('camera')}
          primary
        />

        <CornerButton
          position="absolute bottom-6 left-1/2 -translate-x-1/2"
          icon={<HelpIcon />}
          text="Ayuda"
          onClick={handleComingSoonClick}
        />

        <CornerButton
          position="absolute left-6 top-1/2 -translate-y-1/2"
          icon={<CajaIcon />}
          text="Caja"
          onClick={handleComingSoonClick}
        />

        <CornerButton
          position="absolute right-6 top-1/2 -translate-y-1/2"
          icon={<TransactionIcon />}
          text="Transacción"
          onClick={handleComingSoonClick}
        />
      </div>

      {/* Notificación */}
      <Notification
        message={notification.message}
        type={notification.type === 'error' ? 'error' : 'success'}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </div>
  );
};

export default MainScreen;
