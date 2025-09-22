import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../lib/theme';
import { useSessionStore } from '../../state/useSessionStore';
import { LargeButton } from '../../components/LargeButton';
import { Header } from '../../components/Header';
import { POPULAR_SITUATIONS } from '../../lib/constants';

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { 
    sessions, 
    loadSessions, 
    startCoachingSession,
    isPro 
  } = useSessionStore();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleStartCoaching = async () => {
    try {
      const session = await startCoachingSession();
      if (session) {
        router.push('/(tabs)/ask');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to start coaching session. Please try again.');
    }
  };

  const handlePopularSituation = async (situationId: string) => {
    try {
      const session = await startCoachingSession({
        situationType: situationId,
      });
      if (session) {
        router.push('/(tabs)/ask');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to start coaching session. Please try again.');
    }
  };

  const handleResumeSession = (sessionId: string) => {
    router.push('/(tabs)/ask');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Grandparent Coach" 
        subtitle="Your gentle parenting guide"
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={[styles.welcomeSection, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.welcomeTitle, {
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.xxl,
          }]}>
            Hi! I'm your grandparent coach.
          </Text>
          <Text style={[styles.welcomeText, {
            color: theme.colors.textSecondary,
            fontSize: theme.fonts.sizes.lg,
          }]}>
            Before you watch the grandkids—or after a tricky moment—ask me anything. 
            I'll ask a few quick questions so my suggestions fit your situation.
          </Text>
        </View>

        {/* Start Coaching Button */}
        <View style={styles.buttonSection}>
          <LargeButton
            title="Start a Coaching Session"
            onPress={handleStartCoaching}
            icon="chatbubble-ellipses"
            size="large"
            fullWidth
            accessibilityLabel="Start a new coaching session"
            accessibilityHint="Tap to begin a new conversation with your grandparent coach"
          />
        </View>

        {/* Popular Situations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.xl,
          }]}>
            Popular Situations
          </Text>
          
          <View style={styles.situationGrid}>
            {POPULAR_SITUATIONS.map((situation) => (
              <TouchableOpacity
                key={situation.id}
                style={[styles.situationCard, {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }]}
                onPress={() => handlePopularSituation(situation.id)}
                accessibilityLabel={`Get help with ${situation.title}`}
                accessibilityHint={`Tap to get coaching advice for ${situation.description}`}
              >
                <Text style={[styles.situationIcon, { fontSize: 32 }]}>
                  {situation.icon}
                </Text>
                <Text style={[styles.situationTitle, {
                  color: theme.colors.text,
                  fontSize: theme.fonts.sizes.base,
                }]}>
                  {situation.title}
                </Text>
                <Text style={[styles.situationDescription, {
                  color: theme.colors.textSecondary,
                  fontSize: theme.fonts.sizes.sm,
                }]}>
                  {situation.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {
              color: theme.colors.text,
              fontSize: theme.fonts.sizes.xl,
            }]}>
              Recent Conversations
            </Text>
            
            {sessions.slice(0, 3).map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[styles.sessionCard, {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }]}
                onPress={() => handleResumeSession(session.id)}
                accessibilityLabel={`Resume conversation: ${session.title || 'Untitled'}`}
                accessibilityHint="Tap to continue this conversation"
              >
                <View style={styles.sessionContent}>
                  <Text style={[styles.sessionTitle, {
                    color: theme.colors.text,
                    fontSize: theme.fonts.sizes.base,
                  }]}>
                    {session.title || 'Untitled Conversation'}
                  </Text>
                  <Text style={[styles.sessionDate, {
                    color: theme.colors.textSecondary,
                    fontSize: theme.fonts.sizes.sm,
                  }]}>
                    {new Date(session.updated_at).toLocaleDateString()}
                  </Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={theme.colors.textSecondary} 
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Pro Status */}
        {!isPro && (
          <View style={[styles.proBanner, { backgroundColor: theme.colors.accent }]}>
            <Ionicons name="star" size={24} color={theme.colors.background} />
            <Text style={[styles.proText, {
              color: theme.colors.background,
              fontSize: theme.fonts.sizes.base,
            }]}>
              Upgrade to Pro for unlimited sessions, voice input, and more features
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeSection: {
    padding: 24,
    borderRadius: 12,
    marginVertical: 16,
  },
  welcomeTitle: {
    fontFamily: 'System',
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 32,
  },
  welcomeText: {
    fontFamily: 'System',
    lineHeight: 24,
  },
  buttonSection: {
    marginVertical: 24,
  },
  section: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontFamily: 'System',
    fontWeight: '600',
    marginBottom: 16,
  },
  situationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  situationCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  situationIcon: {
    marginBottom: 8,
  },
  situationTitle: {
    fontFamily: 'System',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  situationDescription: {
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: 18,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  sessionContent: {
    flex: 1,
  },
  sessionTitle: {
    fontFamily: 'System',
    fontWeight: '500',
    marginBottom: 4,
  },
  sessionDate: {
    fontFamily: 'System',
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 24,
    gap: 8,
  },
  proText: {
    fontFamily: 'System',
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
});
