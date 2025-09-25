// Voice recognition temporarily disabled for build compatibility
// import Voice from '@react-native-voice/voice';
import { useEffect, useState } from 'react';

export interface SpeechRecognitionState {
  isListening: boolean;
  isAvailable: boolean;
  results: string[];
  error: string | null;
}

export const useVoiceRecognition = () => {
  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    isAvailable: false, // Temporarily disabled
    results: [],
    error: null,
  });

  useEffect(() => {
    // Voice recognition temporarily disabled for build compatibility
    console.log('Voice recognition temporarily disabled for build compatibility');
  }, []);

  const startListening = async () => {
    console.log('Voice recognition temporarily disabled');
    setState(prev => ({ 
      ...prev, 
      error: 'Voice recognition temporarily disabled',
      isListening: false 
    }));
  };

  const stopListening = async () => {
    console.log('Voice recognition temporarily disabled');
  };

  const cancelListening = async () => {
    setState(prev => ({ 
      ...prev, 
      isListening: false, 
      results: [],
      error: null 
    }));
  };

  return {
    ...state,
    startListening,
    stopListening,
    cancelListening,
  };
};
