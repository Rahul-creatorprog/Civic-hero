import React, { createContext, useContext, useState, useEffect } from 'react';
import { speakText, stopSpeaking, isSpeechSynthesisSupported } from '../utils/speech';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('civic_high_contrast') === 'true';
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('civic_font_size') || 'normal'; // 'normal' | 'large' | 'xlarge'
  });

  const [kidMode, setKidMode] = useState(() => {
    return localStorage.getItem('civic_kid_mode') === 'true';
  });

  const [elderMode, setElderMode] = useState(() => {
    return localStorage.getItem('civic_elder_mode') === 'true';
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sync high contrast with DOM
  useEffect(() => {
    localStorage.setItem('civic_high_contrast', highContrast);
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Sync font size with DOM
  useEffect(() => {
    localStorage.setItem('civic_font_size', fontSize);
    document.documentElement.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-xlarge');
    document.documentElement.classList.add(`text-scale-${fontSize}`);
  }, [fontSize]);

  // Sync Kid mode
  useEffect(() => {
    localStorage.setItem('civic_kid_mode', kidMode);
    if (kidMode) {
      document.documentElement.classList.add('kid-mode');
    } else {
      document.documentElement.classList.remove('kid-mode');
    }
  }, [kidMode]);

  // Sync Elder mode
  useEffect(() => {
    localStorage.setItem('civic_elder_mode', elderMode);
    if (elderMode) {
      // In elder mode, automatically set font size to at least large
      setFontSize(prev => (prev === 'normal' ? 'large' : prev));
    }
  }, [elderMode]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);

  const cycleFontSize = () => {
    setFontSize(prev => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xlarge';
      return 'normal';
    });
  };

  const toggleKidMode = () => {
    setKidMode(prev => {
      const next = !prev;
      if (next) setElderMode(false); // mutually exclusive primary experience
      return next;
    });
  };

  const toggleElderMode = () => {
    setElderMode(prev => {
      const next = !prev;
      if (next) {
        setKidMode(false);
        setFontSize('large');
      }
      return next;
    });
  };

  const readAloud = (text) => {
    if (!text) return;
    setIsSpeaking(true);
    speakText(text, () => setIsSpeaking(false));
  };

  const stopAudio = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        fontSize,
        setFontSize,
        cycleFontSize,
        kidMode,
        toggleKidMode,
        elderMode,
        toggleElderMode,
        isSpeaking,
        readAloud,
        stopAudio,
        speechSupported: isSpeechSynthesisSupported()
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
