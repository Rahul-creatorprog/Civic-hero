// Web Speech API helper for Accessibility (Elderly, Kids, and Visually Impaired)

let currentUtterance = null;

export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
};

export const speakText = (text, onEnd = null) => {
  if (!isSpeechSynthesisSupported()) {
    console.warn('Speech synthesis not supported in this browser.');
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text) return false;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // slightly slower for better elder/kid clarity
  utterance.pitch = 1.05;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

// Create a Speech Recognition instance for voice dictation
export const createSpeechRecognizer = (onResult, onError, onEnd) => {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (onResult) onResult(transcript);
  };

  recognition.onerror = (err) => {
    console.warn('Speech recognition error:', err);
    if (onError) onError(err);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  return recognition;
};
