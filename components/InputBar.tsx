import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/theme';
import { useVoiceRecognition } from '../lib/speech';

interface InputBarProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isPro?: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({
  onSendMessage,
  placeholder = "Ask your grandparent coach...",
  disabled = false,
  isPro = false,
}) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const inputRef = useRef<TextInput>(null);
  
  const {
    isListening,
    isAvailable,
    results,
    error: voiceError,
    startListening,
    stopListening,
    cancelListening,
  } = useVoiceRecognition();

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      Keyboard.dismiss();
    }
  };

  const handleVoiceInput = () => {
    if (!isPro) {
      Alert.alert(
        'Premium Feature',
        'Voice input requires a premium subscription. Upgrade to access this feature.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!isAvailable) {
      Alert.alert(
        'Voice Input Unavailable',
        'Voice recognition is not available on this device.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Handle voice recognition results
  React.useEffect(() => {
    if (results.length > 0) {
      const recognizedText = results[0];
      setMessage(recognizedText);
      stopListening();
    }
  }, [results, stopListening]);

  // Handle voice recognition errors
  React.useEffect(() => {
    if (voiceError) {
      Alert.alert(
        'Voice Input Error',
        voiceError,
        [{ text: 'OK' }]
      );
    }
  }, [voiceError]);

  return (
    <View style={[styles.container, { 
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
    }]}>
      <View style={[styles.inputContainer, { 
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border,
      }]}>
        <TextInput
          ref={inputRef}
          style={[styles.textInput, {
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.lg,
          }]}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          maxLength={4000}
          editable={!disabled}
          accessibilityLabel="Message input"
          accessibilityHint="Type your question or concern here"
        />
        
        <View style={styles.buttonContainer}>
          {isAvailable && (
            <TouchableOpacity
              style={[styles.voiceButton, {
                backgroundColor: isListening 
                  ? theme.colors.error 
                  : isPro 
                    ? theme.colors.primary 
                    : theme.colors.textSecondary,
              }]}
              onPress={handleVoiceInput}
              disabled={disabled}
              accessibilityLabel={isListening ? "Stop voice input" : "Start voice input"}
              accessibilityHint={isListening 
                ? "Tap to stop voice recording" 
                : "Tap to start voice recording"
              }
            >
              <Ionicons 
                name={isListening ? "stop" : "mic"} 
                size={20} 
                color={theme.colors.background} 
              />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.sendButton, {
              backgroundColor: message.trim() && !disabled 
                ? theme.colors.primary 
                : theme.colors.textSecondary,
            }]}
            onPress={handleSend}
            disabled={!message.trim() || disabled}
            accessibilityLabel="Send message"
            accessibilityHint="Tap to send your message"
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={theme.colors.background} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {isListening && (
        <View style={[styles.listeningIndicator, { backgroundColor: theme.colors.error }]}>
          <Text style={[styles.listeningText, { 
            color: theme.colors.background,
            fontSize: theme.fonts.sizes.sm,
          }]}>
            Listening... Tap to stop
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    maxHeight: 120,
    paddingVertical: 8,
    fontFamily: 'System',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listeningIndicator: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  listeningText: {
    fontFamily: 'System',
    fontWeight: '600',
  },
});
