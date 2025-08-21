import React, { useState, useEffect } from 'react';
import { ViewType } from './types/camera';
import { useCamera } from './hooks/useCamera';
import MainScreen from './components/screens/MainScreen';
import CameraScreen from './components/screens/CameraScreen';
import CashFlowScreen from './components/screens/CashFlowScreen';

// Extendemos el tipo de vista para incluir cashflow
type ExtendedViewType = ViewType | 'cashflow';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ExtendedViewType>('main');
  const { requestCameraAccess, stopCamera } = useCamera();

  const handleCameraOpen = async () => {
    const permission = await requestCameraAccess();
    if (permission.granted) {
      setCurrentView('camera');
    }
  };

  const handleCameraClose = () => {
    stopCamera();
    setCurrentView('main');
  };

  const handleCashFlowOpen = () => {
    setCurrentView('cashflow');
  };

  const handleCashFlowClose = () => {
    setCurrentView('main');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <>
      {currentView === 'main' && (
        <MainScreen 
          onCameraClick={handleCameraOpen}
          onCashFlowClick={handleCashFlowOpen}
        />
      )}
      {currentView === 'camera' && (
        <CameraScreen onClose={handleCameraClose} />
      )}
      {currentView === 'cashflow' && (
        <CashFlowScreen onBack={handleCashFlowClose} />
      )}
    </>
  );
};

export default App;