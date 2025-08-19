import type { FC } from 'react';

// 1. Actualizamos el "contrato" (la interface) para incluir 'type'
interface NotificationProps {
  message: string;
  // 'type' solo puede ser 'success' o 'error'
  type: 'success' | 'error'; 
  onClose: () => void;
  // isVisible puede ser opcional si se maneja desde fuera
  isVisible?: boolean; 
}

const Notification: FC<NotificationProps> = ({ message, type, isVisible, onClose }) => {
  // 2. Definimos los colores basados en la prop 'type'
  const baseClasses = "absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-sm px-4 py-2 rounded-full shadow-lg transition-all duration-500 cursor-pointer";
  const typeClasses = type === 'success' 
    ? 'bg-green-500' // Verde para éxito
    : 'bg-red-500';   // Rojo para error

  // Si isVisible es false, no renderizamos nada
  if (isVisible === false) {
    return null;
  }

  return (
    <div 
      className={`${baseClasses} ${typeClasses}`}
      onClick={onClose} // Permite cerrar la notificación al hacer clic en ella
    >
      {message}
    </div>
  );
};

export default Notification;