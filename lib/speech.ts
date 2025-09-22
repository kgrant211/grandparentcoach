import Voice from '@react-native-voice/voice';
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
    isAvailable: false,
    results: [],
    error: null,
  });

  useEffect(() => {
    // Initialize voice recognition
    const initVoice = async () => {
      try {
        const isAvailable = await Voice.isAvailable();
        setState(prev => ({ ...prev, isAvailable }));
      } catch (error) {
        console.error('Voice recognition not available:', error);
        setState(prev => ({ ...prev, isAvailable: false }));
      }
    };

    initVoice();

    // Set up event listeners
    Voice.onSpeechStart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null }));
    };

    Voice.onSpeechEnd = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    Voice.onSpeechResults = (e) => {
      setState(prev => ({ 
        ...prev, 
        results: e.value || [],
        isListening: false 
      }));
    };

    Voice.onSpeechError = (e) => {
      setState(prev => ({ 
        ...prev, 
        error: e.error?.message || 'Speech recognition error',
        isListening: false 
      }));
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setState(prev => ({ ...prev, error: null, results: [] }));
      await Voice.start('en-US');
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to start listening',
        isListening: false 
      }));
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const cancelListening = async () => {
    try {
      await Voice.cancel();
      setState(prev => ({ 
        ...prev, 
        isListening: false, 
        results: [],
        error: null 
      }));
    } catch (error) {
      console.error('Error canceling voice recognition:', error);
    }
  };

  return {
    ...state,
    startListening,
    stopListening,
    cancelListening,
  };
};
