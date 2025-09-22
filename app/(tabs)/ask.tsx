import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../lib/theme';
import { useSessionStore } from '../../state/useSessionStore';
import { Header } from '../../components/Header';
import { CoachMessage } from '../../components/CoachMessage';
import { UserMessage } from '../../components/UserMessage';
import { InputBar } from '../../components/InputBar';

export default function AskScreen() {
  const { theme } = useTheme();
  const {
    currentSession,
    messages,
    sendMessage,
    addToFavorites,
    generateSummary,
    isPro,
    isLoading,
  } = useSessionStore();

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentSession && messages.length === 0) {
      // Send initial greeting
      const greeting = "Hi! I'm here to help you with your grandparenting questions. What's going on with your grandchild today?";
      sendMessage(greeting);
    }
  }, [currentSession, messages.length, sendMessage]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    setIsTyping(true);
    try {
      await sendMessage(content);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveToFavorites = async () => {
    if (!currentSession) return;

    try {
      const title = `Advice from ${new Date().toLocaleDateString()}`;
      await addToFavorites(title);
      Alert.alert('Saved!', 'This advice has been saved to your favorites.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save to favorites. Please try again.');
    }
  };

  const handleGenerateSummary = async () => {
    if (!currentSession) return;

    try {
      const summary = await generateSummary(currentSession.id);
      if (summary) {
        Alert.alert('Summary Generated', summary);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate summary. Please try again.');
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    if (item.role === 'user') {
      return (
        <UserMessage
          content={item.content}
          timestamp={new Date(item.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        />
      );
    } else if (item.role === 'assistant') {
      return (
        <CoachMessage
          content={item.content}
          timestamp={new Date(item.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          onSaveToFavorites={handleSaveToFavorites}
          onGenerateSummary={handleGenerateSummary}
          isPro={isPro}
        />
      );
    }
    return null;
  };

  if (!currentSession) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Ask Your Coach" />
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, {
            color: theme.colors.textSecondary,
            fontSize: theme.fonts.sizes.lg,
          }]}>
            No active session. Start a new conversation from the Home tab.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Ask Your Coach" />
      
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, {
              color: theme.colors.textSecondary,
              fontSize: theme.fonts.sizes.lg,
            }]}>
              Start a conversation with your grandparent coach...
            </Text>
          </View>
        }
      />

      {isTyping && (
        <View style={[styles.typingIndicator, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.typingText, {
            color: theme.colors.textSecondary,
            fontSize: theme.fonts.sizes.sm,
          }]}>
            Coach is typing...
          </Text>
        </View>
      )}

      <InputBar
        onSendMessage={handleSendMessage}
        disabled={isLoading || isTyping}
        isPro={isPro}
        placeholder="Ask about tantrums, bedtime, sharing, or any parenting challenge..."
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: 24,
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  typingText: {
    fontFamily: 'System',
    fontStyle: 'italic',
  },
});
