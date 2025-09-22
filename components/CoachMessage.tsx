import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/theme';
import { speak } from '../lib/tts';

interface CoachMessageProps {
  content: string;
  timestamp?: string;
  onSaveToFavorites?: () => void;
  onGenerateSummary?: () => void;
  isPro?: boolean;
}

export const CoachMessage: React.FC<CoachMessageProps> = ({
  content,
  timestamp,
  onSaveToFavorites,
  onGenerateSummary,
  isPro = false,
}) => {
  const { theme } = useTheme();

  const handlePlayAudio = () => {
    speak(content, {
      rate: 0.9, // Slightly slower for better comprehension
      pitch: 1.0,
      onError: (error) => {
        Alert.alert('Audio Error', 'Unable to play audio. Please try again.');
        console.error('TTS Error:', error);
      },
    });
  };

  const handleSaveToFavorites = () => {
    if (!isPro) {
      Alert.alert(
        'Premium Feature',
        'Saving to favorites requires a premium subscription. Upgrade to access this feature.',
        [{ text: 'OK' }]
      );
      return;
    }
    onSaveToFavorites?.();
  };

  const handleGenerateSummary = () => {
    if (!isPro) {
      Alert.alert(
        'Premium Feature',
        'Generating summaries requires a premium subscription. Upgrade to access this feature.',
        [{ text: 'OK' }]
      );
      return;
    }
    onGenerateSummary?.();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.messageBubble, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.messageText, { 
          color: theme.colors.background,
          fontSize: theme.fonts.sizes.lg,
        }]}>
          {content}
        </Text>
        
        {timestamp && (
          <Text style={[styles.timestamp, { 
            color: theme.colors.background,
            fontSize: theme.fonts.sizes.sm,
          }]}>
            {timestamp}
          </Text>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          }]}
          onPress={handlePlayAudio}
          accessibilityLabel="Play audio"
          accessibilityHint="Tap to hear this message read aloud"
        >
          <Ionicons 
            name="volume-high" 
            size={20} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          }]}
          onPress={handleSaveToFavorites}
          accessibilityLabel="Save to favorites"
          accessibilityHint="Tap to save this advice to your favorites"
        >
          <Ionicons 
            name="heart-outline" 
            size={20} 
            color={isPro ? theme.colors.primary : theme.colors.textSecondary} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          }]}
          onPress={handleGenerateSummary}
          accessibilityLabel="Generate summary"
          accessibilityHint="Tap to create a one-page summary of this advice"
        >
          <Ionicons 
            name="document-text-outline" 
            size={20} 
            color={isPro ? theme.colors.primary : theme.colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  messageBubble: {
    padding: 16,
    borderRadius: 12,
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  messageText: {
    lineHeight: 24,
    fontFamily: 'System',
  },
  timestamp: {
    marginTop: 4,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
