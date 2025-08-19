import type { FC, ReactNode } from 'react';

interface CornerButtonProps {
  position: string; // ahora acepta clases tailwind directas
  icon: ReactNode;
  text: string;
  onClick: () => void;
  primary?: boolean;
}

const CornerButton: FC<CornerButtonProps> = ({ position, icon, text, onClick, primary = false }) => {
  const baseClasses =
    'w-32 h-32 flex flex-col items-center justify-center rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 group';

  const themeClasses = primary
    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 hover:scale-110'
    : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-xl focus:ring-blue-200 hover:scale-110';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${themeClasses} ${position}`}
    >
      <div className="transform transition-transform duration-300 group-hover:scale-125 text-3xl">
        {icon}
      </div>
      <span className="mt-2 font-semibold text-base tracking-wide">{text}</span>
    </button>
  );
};

export default CornerButton;
