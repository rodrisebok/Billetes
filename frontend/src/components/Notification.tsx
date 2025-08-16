// --- Archivo: frontend/src/components/Notification.tsx ---
// Este componente muestra un mensaje temporal en la pantalla.

import React from 'react';
import type { FC } from 'react';
import type { NotificationProps } from '../types';

const Notification: FC<NotificationProps> = ({ message, isVisible }) => (
    <div className={`absolute bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded-full transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {message}
    </div>
);

export default Notification;
