import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { askCoachAPI } from '../../server/api';

export default function AskScreen() {
  const params = useLocalSearchParams();
  const topic = typeof params.topic === 'string' ? params.topic : undefined;

  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m here to help you with your grandparenting questions. What\'s going on with your grandchild today?',
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);

  const [draft, setDraft] = useState('');

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      const { content: coach } = await askCoachAPI({
        context: { topic },
        messages: [...messages, newMessage].map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      });
      const coachResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: coach || 'Thanks for sharing. Could you tell me a bit more about the situation?',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, coachResponse]);
    } catch (e) {
      Alert.alert('Network error', 'Unable to reach the coach. Please try again.');
    }
  };

  // Seed tailored clarifying questions for popular topics on first render
  React.useEffect(() => {
    if (!topic) return;
    setMessages(prev => {
      if (prev.length > 1) return prev;
      const friendly = (t: string) => {
        switch (t) {
          case 'tantrums':
            return "Let\'s get the full picture about tantrums. How old is the child? When do the tantrums tend to happen? What do you usually try in the moment? Anything stressful going on today?";
          case 'mealtime':
            return "Quick mealtime check-in: How old is the child? What\'s hard about meals—refusal, leaving the table, specific foods? What\'s helped even a little? Any allergies or family rules I should follow?";
          case 'bedtime':
            return "Bedtime context helps: How old is the child? What\'s the routine now and where does it get tough? Do they nap, and how was today? What\'s worked before, even a little?";
          case 'screen_time':
            return "For screens, I\'d love context: How old is the child? What devices and when are they used? What limits are already in place? What sparks pushback?";
          default:
            return undefined;
        }
      };
      const prompt = friendly(topic);
      if (!prompt) return prev;
      const tailored = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: prompt,
        timestamp: new Date().toLocaleTimeString(),
      };
      return [...prev, tailored];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const renderMessage = ({ item }: { item: any }) => {
    if (item.role === 'user') {
      return (
        <View style={styles.userMessage}>
          <Text style={styles.userMessageText}>{item.content}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      );
    } else if (item.role === 'assistant') {
      return (
        <View style={styles.coachMessage}>
          <Text style={styles.coachMessageText}>{item.content}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      );
    }
    return null;
  };

  // Auto scroll to bottom
  const listRef = React.useRef<FlatList<any>>(null);
  React.useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages.length]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ask Your Coach</Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContent}
        renderItem={({ item }) => (
          <View style={styles.messageWrapper}>
            {item.role === 'user' ? (
              <View style={styles.userMessage}>
                <Text style={styles.userMessageText}>{item.content}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            ) : (
              <View style={styles.coachMessage}>
                <Text style={styles.coachMessageText}>{item.content}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            )}
          </View>
        )}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        style={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type your question..."
          placeholderTextColor="#999999"
          style={styles.input}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => { handleSendMessage(draft); setDraft(''); }}
        >
          <Ionicons name="send" size={20} color="#ffffff" />
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 18,
    marginLeft: 50,
    marginRight: 16,
    alignSelf: 'flex-end',
  },
  userMessageText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 20,
  },
  coachMessage: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 18,
    marginLeft: 16,
    marginRight: 50,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  coachMessageText: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 8,
  },
  input: {
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#f8f9fa',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
