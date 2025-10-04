import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { loadSessions } from '../../lib/localSessions';

export default function HomeScreen() {
  const router = useRouter();
  const [recent, setRecent] = React.useState<{id:string; title:string; updatedAt:string;}[]>([]);

  React.useEffect(() => {
    const sub = router; // noop to keep dependency minimal
    (async () => {
      const sessions = await loadSessions();
      setRecent(sessions.slice(0,5));
    })();
  }, [router]);

  const handleStartCoaching = () => {
    router.push('/(tabs)/ask');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.emoji}>👵</Text>
          <Text style={styles.title}>Grandparent Coach</Text>
        </View>
        <Text style={styles.subtitle}>Your gentle parenting guide</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Hi! I'm your grandparent coach.
          </Text>
          <Text style={styles.welcomeText}>
            Before you watch the grandkids—or after a tricky moment—ask me anything. 
            I'll ask a few quick questions so my suggestions fit your situation.
          </Text>
        </View>

        {/* Start Coaching Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartCoaching}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color="#ffffff" />
            <Text style={styles.startButtonText}>Start a Coaching Session</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Situations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Popular Situations
          </Text>
          
          <View style={styles.situationGrid}>
            <TouchableOpacity style={styles.situationCard} onPress={() => router.push('/(tabs)/ask?topic=tantrums')}>
              <Text style={styles.situationIcon}>👶</Text>
              <Text style={styles.situationTitle}>Tantrums</Text>
              <Text style={styles.situationDescription}>
                Help with meltdowns and emotional outbursts
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.situationCard} onPress={() => router.push('/(tabs)/ask?topic=mealtime')}>
              <Text style={styles.situationIcon}>🍽️</Text>
              <Text style={styles.situationTitle}>Mealtime</Text>
              <Text style={styles.situationDescription}>
                Picky eating and dinner battles
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.situationCard} onPress={() => router.push('/(tabs)/ask?topic=bedtime')}>
              <Text style={styles.situationIcon}>😴</Text>
              <Text style={styles.situationTitle}>Bedtime</Text>
              <Text style={styles.situationDescription}>
                Sleep routines and bedtime resistance
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.situationCard} onPress={() => router.push('/(tabs)/ask?topic=screen_time')}>
              <Text style={styles.situationIcon}>📱</Text>
              <Text style={styles.situationTitle}>Screen Time</Text>
              <Text style={styles.situationDescription}>
                Managing technology and digital boundaries
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Conversations */}
        {recent.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Conversations</Text>
            {recent.map(s => (
              <TouchableOpacity key={s.id} style={{ paddingVertical:12, borderBottomColor:'#e9ecef', borderBottomWidth:1 }} onPress={() => router.push('/(tabs)/ask')}>
                <Text style={{ fontSize:16, color:'#333' }}>{s.title || 'Conversation'}</Text>
                <Text style={{ fontSize:12, color:'#999' }}>{new Date(s.updatedAt).toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
    marginBottom: 4,
  },
  emoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeSection: {
    padding: 24,
    borderRadius: 12,
    marginVertical: 16,
    backgroundColor: '#f8f9fa',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 32,
    color: '#333333',
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
  },
  buttonSection: {
    marginVertical: 24,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333333',
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
    borderColor: '#e9ecef',
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  situationIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  situationTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    color: '#333333',
  },
  situationDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
    color: '#666666',
  },
});
