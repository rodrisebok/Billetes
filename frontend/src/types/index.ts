// --- Archivo: frontend/src/types/index.ts ---
// Este archivo centraliza todas las definiciones de tipos de TypeScript.

import type { ReactNode } from 'react';

// Define los nombres de las vistas posibles en la aplicación.
export type View = 'main' | 'camera' | 'caja'; 

// Props para el componente de notificación.
export interface NotificationProps {
    message: string;
    isVisible: boolean;
}

// Props para los botones de las esquinas.
export interface CornerButtonProps {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    bgColor: string;
    textColor: string;
    hoverColor: string;
    icon: ReactNode;
    text: string;
    onClick: () => void;
}

// Props para la pantalla principal.
export interface MainScreenProps {
    onNavigate: (view: View) => void;
}

// Props para la vista de la cámara.
export interface CameraViewProps {
    onNavigate: (view: View) => void;
}
