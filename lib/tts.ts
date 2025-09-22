import * as Speech from 'expo-speech';

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  language?: string;
  onStart?: () => void;
  onDone?: () => void;
  onError?: (error: any) => void;
}

export const speak = (text: string, options: TTSOptions = {}) => {
  const {
    rate = 1.0,
    pitch = 1.0,
    language = 'en-US',
    onStart,
    onDone,
    onError,
  } = options;

  return Speech.speak(text, {
    rate,
    pitch,
    language,
    onStart,
    onDone,
    onError,
  });
};

export const stop = () => {
  Speech.stop();
};

export const isSpeaking = () => {
  return Speech.isSpeakingAsync();
};

export const pause = () => {
  Speech.pause();
};

export const resume = () => {
  Speech.resume();
};

export const getAvailableVoices = async () => {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices;
  } catch (error) {
    console.error('Error getting available voices:', error);
    return [];
  }
};
