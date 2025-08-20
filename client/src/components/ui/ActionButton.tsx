import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  ariaLabel: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  title,
  subtitle,
  onClick,
  disabled = false,
  active = false,
  ariaLabel
}) => {
  const baseClasses = "w-full p-6 rounded-3xl shadow-xl flex items-center justify-between transition-all duration-200";
  const activeClasses = "bg-gradient-to-r from-emerald-500 to-teal-600 text-white transform hover:scale-105 hover:shadow-3xl active:scale-95 group";
  const disabledClasses = "bg-white/10 backdrop-blur-sm text-white opacity-60 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${active ? activeClasses : disabledClasses}`}
      aria-label={ariaLabel}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          active ? 'bg-white/20' : 'bg-white/10'
        }`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="text-left">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className={`text-sm ${active ? 'text-emerald-100' : 'text-gray-300'}`}>
            {subtitle}
          </p>
        </div>
      </div>
      {active && (
        <div className="transform group-hover:translate-x-1 transition-transform">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      )}
    </button>
  );
};

export default ActionButton;