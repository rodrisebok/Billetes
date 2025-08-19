import { useState } from 'react';
import MainScreen from './views/MainScreen';
import CameraView from './views/CameraView';
import type { View } from './types';

function App() {
  const [currentView, setCurrentView] = useState<View>('main');

  // Esta función se pasa a los componentes hijos para que puedan cambiar la vista.
  const handleNavigation = (view: View) => {
    setCurrentView(view);
  };

  // Esta función decide qué componente renderizar basado en el estado actual.
  const renderCurrentView = () => {
    switch (currentView) {
      case 'camera':
        return <CameraView onNavigate={handleNavigation} />;
      case 'main':
      default:
        return <MainScreen onNavigate={handleNavigation} />;
    }
  };

  return (
    // Contenedor exterior que centra el marco de la aplicación en la pantalla.
    // El fondo gris claro ahora se aplica desde `src/index.css`.
    <div className="flex items-center justify-center w-screen h-screen p-4">
      {/* El marco principal de la aplicación con sombra y bordes redondeados. */}
      <div className="w-full h-full max-w-[420px] max-h-[900px] shadow-2xl rounded-3xl overflow-hidden bg-gray-100">
        {renderCurrentView()}
      </div>
    </div>
  );
}

export default App;