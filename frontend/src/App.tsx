// --- Archivo: frontend/src/App.tsx ---
// Versión consolidada y corregida para asegurar el funcionamiento y el diseño.

import React, { useState, useRef, useEffect } from 'react';
import type { FC, ReactNode } from 'react';
// Se elimina la dependencia de 'react-webcam' para usar la API nativa del navegador.

// --- Definiciones de Tipos ---

type View = 'main' | 'camera' | 'caja'; 

interface NotificationProps {
    message: string;
    isVisible: boolean;
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

interface MainScreenProps {
    onNavigate: (view: View) => void;
}

interface CameraViewProps {
    onNavigate: (view: View) => void;
}

// --- Componentes de Íconos ---

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

// --- Componente Notification ---
const Notification: FC<NotificationProps> = ({ message, isVisible }) => (
    <div className={`absolute bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded-full transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {message}
    </div>
);

// --- Componente CornerButton ---
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

// --- Componente MainScreen (con el diseño corregido) ---
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

// --- Componente CameraView (Corregido para usar la API nativa del navegador) ---
const CameraView: FC<CameraViewProps> = ({ onNavigate }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [prediction, setPrediction] = useState('Apunte a un billete...');
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Efecto para iniciar la cámara
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsCameraReady(true);
                }
            } catch (err) {
                console.error("Error al acceder a la cámara:", err);
                setPrediction("Error de cámara");
            }
        };
        startCamera();

        // Limpieza: detener la cámara cuando el componente se desmonte
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const captureAndPredict = async () => {
        if (isProcessing || !videoRef.current || !canvasRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageSrc = canvas.toDataURL('image/jpeg');

        try {
            setIsProcessing(true);
            const blob = await fetch(imageSrc).then(res => res.blob());
            const imageFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
            const formData = new FormData();
            formData.append('file', imageFile);
            // Se corrige la URL para usar localhost (127.0.0.1)
            const response = await fetch('http://127.0.0.1:8000/predict/', { 
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            const data = await response.json();
            if (data.denominacion === 'fondo' || data.confianza < 0.85) {
                setPrediction('Apunte a un billete...');
            } else {
                setPrediction(data.denominacion.replace('_', ' '));
            }
        } catch (error) {
            console.error("Error en la predicción:", error);
            setPrediction('Error de conexión');
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (!isCameraReady) return;
        const interval = setInterval(captureAndPredict, 1500);
        return () => clearInterval(interval);
    }, [isCameraReady, isProcessing]);

    return (
        <div className="w-full h-full bg-gray-900 text-white flex flex-col overflow-hidden rounded-3xl">
            <div className="p-4 flex items-center border-b border-gray-700">
                <button onClick={() => onNavigate('main')} className="text-cyan-400 hover:text-cyan-300 mr-4">&larr; Volver</button>
                <h1 className="text-xl font-bold text-cyan-400">Detector de Billetes</h1>
            </div>
            <div className="relative w-full flex-grow bg-gray-900 flex items-center justify-center">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden"></canvas>
                {!isCameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"><p>Iniciando cámara...</p></div>
                )}
            </div>
            <div className="p-6 bg-gray-800">
                <p className="text-lg text-gray-400 text-center mb-2">Resultado:</p>
                <div className="bg-gray-900 rounded-lg p-4 text-center">
                    <p className="text-4xl font-mono font-bold text-white tracking-widest">{prediction}</p>
                </div>
            </div>
        </div>
    );
};

// --- Componente Principal App ---
const App: FC = () => {
    const [currentView, setCurrentView] = useState<View>('main');

    const handleNavigation = (view: View) => {
        setCurrentView(view);
    };

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
        <div className="bg-gray-200 flex items-center justify-center w-screen h-screen p-4">
            <style>{`
                body { font-family: 'Inter', sans-serif; }
                .corner-button { transition: all 0.2s ease-in-out; }
            `}</style>
            <div className="w-full h-full max-w-[420px] max-h-[900px] shadow-2xl rounded-3xl">
                {renderCurrentView()}
            </div>
        </div>
    );
};

export default App;
