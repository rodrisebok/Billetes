// --- Archivo: frontend/src/components/CornerButton.tsx ---
// Este es el componente reutilizable para los botones de las esquinas.

import React from 'react';
import type { FC } from 'react';
import type { CornerButtonProps } from '../types';

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
            className={`
                ${positionClasses[position]} 
                ${bgColor} 
                ${textColor} 
                ${hoverColor} 
                rounded-2xl w-32 h-32 md:w-36 md:h-36 
                flex flex-col items-center justify-center 
                shadow-lg transition-all duration-200 ease-in-out 
                hover:scale-105 hover:shadow-xl
            `}
        >
            {icon}
            <span className="mt-2 font-semibold text-sm">{text}</span>
        </button>
    );
};

export default CornerButton;
