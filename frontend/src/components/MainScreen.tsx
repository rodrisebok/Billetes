// --- Archivo: frontend/src/components/MainScreen.tsx ---
// Se han incluido los componentes 'CornerButton', 'Notification' y los íconos
// directamente en este archivo para resolver los errores de importación.

import React, { useState } from 'react';
import type { FC, ReactNode } from 'react';

// --- Tipos (Normalmente en src/types/index.ts) ---
type View = 'main' | 'camera' | 'caja'; 

interface MainScreenProps {
    onNavigate: (view: View) => void;
}

interface CornerButtonProps {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    bgColor: string;
    textColor: string;
    hoverColor: string;
    icon: ReactNode;
    text: string;
    onClick: () => void;
}

interface NotificationProps {
    message: string;
    isVisible: boolean;
}

// --- Componentes de Íconos (Normalmente en src/assets/icons.tsx) ---
const CameraIcon: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
);
const CajaIcon: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);
const TransactionIcon: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3m7-7-7 7 7 7m7 7-7-7 7-7"></path></svg>
);
const HelpIcon: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);
const LogoIcon: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 md:h-40 md:w-40 mx-auto text-gray-700" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
);


// --- Componente Notification (Normalmente en src/components/Notification.tsx) ---
const Notification: FC<NotificationProps> = ({ message, isVisible }) => (
    <div className={`absolute bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded-full transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {message}
    </div>
);


// --- Componente CornerButton (Normalmente en src/components/CornerButton.tsx) ---
const CornerButton: FC<CornerButtonProps> = ({ position, bgColor, textColor, hoverColor, icon, text, onClick }) => {
    const positionClasses = {
        'top-left': 'justify-self-start self-start',
        'top-right': 'justify-self-end self-start',
        'bottom-left': 'justify-self-start self-end',
        'bottom-right': 'justify-self-end self-end'
    };
    return (
        <button 
            onClick={onClick}
            className={`corner-button ${positionClasses[position]} ${bgColor} ${textColor} ${hoverColor} rounded-2xl w-32 h-32 md:w-36 md:h-36 flex flex-col items-center justify-center shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl`}
        >
            {icon}
            <span className="mt-2 font-semibold text-sm">{text}</span>
        </button>
    );
};


// --- Componente Principal: MainScreen ---
const MainScreen: FC<MainScreenProps> = ({ onNavigate }) => {
    const [notification, setNotification] = useState({ message: '', isVisible: false });

    const showNotification = (message: string) => {
        setNotification({ message, isVisible: true });
        setTimeout(() => setNotification({ message: '', isVisible: false }), 3000);
    };

    const handleComingSoonClick = () => showNotification('¡Función disponible próximamente!');

    return (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 relative overflow-hidden rounded-3xl flex flex-col">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4 p-5 md:p-8">
                <CornerButton position="top-left" bgColor="bg-[#A2D2FF]" textColor="text-white" hoverColor="hover:bg-[#89CFF0]" icon={<CameraIcon />} text="Cámara" onClick={() => onNavigate('camera')} />
                <CornerButton position="top-right" bgColor="bg-white" textColor="text-gray-700" hoverColor="hover:border-2 hover:border-[#FFAB76]" icon={<CajaIcon />} text="Caja" onClick={handleComingSoonClick} />
                <CornerButton position="bottom-left" bgColor="bg-white" textColor="text-gray-700" hoverColor="hover:border-2 hover:border-[#FFAB76]" icon={<TransactionIcon />} text="Transacción" onClick={handleComingSoonClick} />
                <CornerButton position="bottom-right" bgColor="bg-white" textColor="text-gray-700" hoverColor="hover:border-2 hover:border-[#FFAB76]" icon={<HelpIcon />} text="Ayuda" onClick={handleComingSoonClick} />
            </div>
            
            <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <LogoIcon />
                </div>
            </div>
            
            <Notification message={notification.message} isVisible={notification.isVisible} />
        </div>
    );
};

export default MainScreen;
