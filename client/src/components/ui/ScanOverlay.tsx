import React from 'react';

interface ScanOverlayProps {
  isScanning: boolean;
}

const ScanOverlay: React.FC<ScanOverlayProps> = ({ isScanning }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative">
        <div className="w-80 h-48 border-4 border-emerald-400 rounded-3xl relative">
          {/* Corner indicators */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
          <div className="absolute -top-2 -right-2 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-lg"></div>
          
          {/* Scanning line animation */}
          {isScanning && (
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="w-full h-1 bg-emerald-400 animate-pulse absolute top-1/2 transform -translate-y-1/2"></div>
            </div>
          )}
        </div>
        <p className="text-white text-center mt-4 text-lg">
          {isScanning ? 'Analizando...' : 'Alinea el billete dentro del marco'}
        </p>
      </div>
    </div>
  );
};

export default ScanOverlay;