import { useCallback } from 'react';

export const useVoiceAnnouncement = () => {
  const announce = useCallback((text: string, lang: string = 'es-AR') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const announceResult = useCallback((value: number, confidence: number) => {
    const announcement = `Billete detectado: ${value} pesos argentinos con ${Math.round(confidence * 100)}% de confianza`;
    announce(announcement);
  }, [announce]);

  const announceError = useCallback((errorMessage: string) => {
    announce(`Error: ${errorMessage}`);
  }, [announce]);

  return {
    announce,
    announceResult,
    announceError
  };
};