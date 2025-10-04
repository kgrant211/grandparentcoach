import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { askCoachAPI } from '../../server/api';
import {
  createSession as createLocalSession,
  loadSessions as loadLocalSessions,
  loadMessages as loadLocalMessages,
  saveMessages as saveLocalMessages,
  touchSession as touchLocal,
  type LocalSession,
  type LocalMessage,
  getFreeCount,
  incrementFreeCount,
} from '../../lib/localSessions';
import { MAX_FREE_SESSIONS } from '../../lib/constants';

export default function AskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const topic = typeof params.topic === 'string' ? params.topic : undefined;
  const sidParam = typeof params.sid === 'string' ? params.sid : undefined;

  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m here to help you with your grandparenting questions. What\'s going on with your grandchild today?',
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);

  const [draft, setDraft] = useState('');
  const [sessionList, setSessionList] = useState<LocalSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showSwitcher, setShowSwitcher] = useState(false);

  const ensureSession = async (): Promise<string> => {
    if (currentSessionId) return currentSessionId;
    const session = await createLocalSession('New conversation');
    setCurrentSessionId(session.id);
    setSessionList(prev => [session, ...prev]);
    return session.id;
  };

  const loadSessionData = async (sessionId: string) => {
    const msgs = await loadLocalMessages(sessionId);
    if (msgs.length) setMessages(msgs as any);
  };

  const refreshSessions = async () => {
    const list = await loadLocalSessions();
    setSessionList(list);
  };

  React.useEffect(() => {
    refreshSessions();
  }, []);

  // Handle deep-linking into a specific session id
  React.useEffect(() => {
    (async () => {
      if (sidParam) {
        setCurrentSessionId(sidParam);
        await loadSessionData(sidParam);
      }
    })();
  }, [sidParam]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const sessionId = await ensureSession();
    await touchLocal(sessionId);

    // Add user message
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Ensure we are appending to the currently selected session's messages from storage, to avoid stale state
    let base = await loadLocalMessages(sessionId);
    if (!Array.isArray(base)) base = [] as any;
    const nextLocal: LocalMessage[] = [...(base as any), newMessage];
    setMessages(nextLocal as any);
    await saveLocalMessages(sessionId, nextLocal);

    // Paywall check AFTER showing the user's message
    const count = await getFreeCount();
    if (count >= MAX_FREE_SESSIONS) {
      Alert.alert('Free limit reached', 'Upgrade to continue with unlimited sessions.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Upgrade', onPress: () => router.push('/paywall') }
      ]);
      return;
    }

    // Auto-name conversation from first user message
    if (nextLocal.length === 1) {
      try {
        const { generateTitleFromText, updateSessionTitle } = await import('../../lib/localSessions');
        const title = generateTitleFromText(newMessage.content, 'Conversation');
        await updateSessionTitle(sessionId, title);
        refreshSessions();
      } catch {}
    }

    try {
      // Gather context from all previous sessions for conversation continuity
      const allSessions = await loadLocalSessions();
      const conversationHistory: string[] = [];
      
      // Get summaries from the 5 most recent sessions (excluding current one)
      const recentSessions = allSessions.filter(s => s.id !== sessionId).slice(0, 5);
      for (const session of recentSessions) {
        const sessionMsgs = await loadLocalMessages(session.id);
        if (sessionMsgs.length > 0) {
          const summary = `Previous conversation "${session.title}": ${sessionMsgs.slice(0, 4).map(m => `${m.role}: ${m.content.slice(0, 100)}`).join(' | ')}`;
          conversationHistory.push(summary);
        }
      }

      const { content: coach } = await askCoachAPI({
        context: { 
          topic,
          conversationHistory: conversationHistory.length > 0 ? conversationHistory.join('\n---\n') : undefined 
        },
        messages: nextLocal.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      });
      const coachResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: coach || 'Thanks for sharing. Could you tell me a bit more about the situation?',
        timestamp: new Date().toLocaleTimeString(),
      };
      const updated = [...nextLocal, coachResponse] as any;
      setMessages(updated);
      await saveLocalMessages(sessionId, updated);
      await incrementFreeCount();
      await refreshSessions();
    } catch (e) {
      Alert.alert('Network error', 'Unable to reach the coach. Please try again.');
    }
  };

  // Seed tailored clarifying questions for popular topics - create new session when topic is provided
  React.useEffect(() => {
    if (!topic) return;
    
    // Create a new session for this topic
    (async () => {
      const newSession = await createLocalSession(`New ${topic} conversation`);
      setCurrentSessionId(newSession.id);
      setSessionList(prev => [newSession, ...prev]);
      
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
      const greeting = {
        id: 'greet-' + Date.now().toString(),
        role: 'assistant' as const,
        content: 'Hi! I\'m here to help you with your grandparenting questions. What\'s going on with your grandchild today?',
        timestamp: new Date().toLocaleTimeString(),
      };
      
      const messages = prompt ? [
        greeting,
        {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: prompt,
          timestamp: new Date().toLocaleTimeString(),
        }
      ] : [greeting];
      
      setMessages(messages as any);
      await saveLocalMessages(newSession.id, messages as any);
    })();
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')} style={styles.titleContainer} accessibilityLabel="Go to home">
          <Text style={styles.emoji}>👵</Text>
          <Text style={styles.title}>Grandparent Coach</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowSwitcher(s => !s)} accessibilityLabel="Switch conversation" style={{position:'absolute', right:16, top:60}}>
          <Ionicons name="swap-horizontal" size={22} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {showSwitcher && (
        <View style={{ paddingHorizontal:16, paddingVertical:8, borderBottomColor:'#e9ecef', borderBottomWidth:1 }}>
          <ScrollSessions
            sessions={sessionList}
            currentId={currentSessionId}
            onNew={async () => {
              const s = await createLocalSession('New conversation');
              setCurrentSessionId(s.id);
              const greeting = {
                id: 'greet-' + Date.now().toString(),
                role: 'assistant' as const,
                content: 'Hi! I\'m here to help you with your grandparenting questions. What\'s going on with your grandchild today?',
                timestamp: new Date().toLocaleTimeString(),
              } as any;
              setMessages([greeting] as any);
              await saveLocalMessages(s.id, [greeting] as any);
              setShowSwitcher(false);
              await refreshSessions();
            }}
            onSelect={async (id) => {
              setCurrentSessionId(id);
              const msgs = await loadLocalMessages(id);
              if (msgs && (msgs as any).length) {
                setMessages((msgs as any));
              } else {
                const greeting = {
                  id: 'greet-' + Date.now().toString(),
                  role: 'assistant' as const,
                  content: 'Hi! I\'m here to help you with your grandparenting questions. What\'s going on with your grandchild today?',
                  timestamp: new Date().toLocaleTimeString(),
                } as any;
                setMessages([greeting] as any);
                await saveLocalMessages(id, [greeting] as any);
              }
              setShowSwitcher(false);
            }}
          />
        </View>
      )}

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
    </KeyboardAvoidingView>
  );
}

function ScrollSessions({ sessions, currentId, onNew, onSelect }: { sessions: LocalSession[]; currentId: string | null; onNew: () => void; onSelect: (id: string) => void; }) {
  return (
    <View style={{ flexDirection:'row', gap:8, flexWrap:'wrap' }}>
      <TouchableOpacity onPress={onNew} style={{ paddingVertical:8, paddingHorizontal:12, borderRadius:12, borderWidth:1, borderColor:'#e9ecef' }}>
        <Text style={{ color:'#007AFF', fontWeight:'600' }}>+ New</Text>
      </TouchableOpacity>
      {sessions.map(s => (
        <TouchableOpacity key={s.id} onPress={() => onSelect(s.id)} style={{ paddingVertical:8, paddingHorizontal:12, borderRadius:12, borderWidth:1, borderColor: s.id===currentId?'#007AFF':'#e9ecef', backgroundColor: s.id===currentId?'#E8F0FE':'#fff' }}>
          <Text style={{ color:'#333' }}>{s.title || 'Conversation'}</Text>
        </TouchableOpacity>
      ))}
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 24,
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
