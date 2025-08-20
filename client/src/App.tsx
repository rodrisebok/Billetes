import React, { useState, useEffect } from 'react';
import { ViewType } from './types/camera';
import { useCamera } from './hooks/useCamera';
import MainScreen from './components/screens/MainScreen';
import CameraScreen from './components/screens/CameraScreen';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('main');
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <>
      {currentView === 'main' && (
        <MainScreen onCameraClick={handleCameraOpen} />
      )}
      {currentView === 'camera' && (
        <CameraScreen onClose={handleCameraClose} />
      )}
    </>
  );
};

export default App;