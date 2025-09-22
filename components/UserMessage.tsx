import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../lib/theme';

interface UserMessageProps {
  content: string;
  timestamp?: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({
  content,
  timestamp,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.messageBubble, { 
        backgroundColor: theme.colors.secondary,
        alignSelf: 'flex-end',
      }]}>
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
  },
  messageText: {
    lineHeight: 24,
    fontFamily: 'System',
  },
  timestamp: {
    marginTop: 4,
    opacity: 0.8,
  },
});
