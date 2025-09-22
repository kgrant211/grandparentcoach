import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Guide {
  id: string;
  title: string;
  content: string;
  tryThis: string[];
  icon: string;
}

const GUIDES: Guide[] = [
  {
    id: 'staying-calm',
    title: 'Staying Calm in the Moment',
    content: 'When your grandchild is having a tough time, your calm presence is the most powerful tool you have. Take a deep breath and remember that their behavior is communication, not a personal attack. Your steady, loving response helps them feel safe and teaches them how to handle big emotions.',
    tryThis: [
      'Take 3 deep breaths before responding',
      'Get down to their eye level',
      'Use a calm, gentle voice',
      'Acknowledge their feelings: "I can see you\'re upset"'
    ],
    icon: '🌊'
  },
  {
    id: 'setting-boundaries',
    title: 'Setting Boundaries with Warmth',
    content: 'Boundaries are acts of love, not punishment. When you set clear, consistent limits with warmth and understanding, you help your grandchild feel secure. They learn that rules exist to keep them safe and help them grow into responsible people.',
    tryThis: [
      'Be clear and specific about the rule',
      'Explain the "why" behind the boundary',
      'Stay firm but kind in your tone',
      'Offer choices when possible'
    ],
    icon: '🤗'
  },
  {
    id: 'when-kids-say-no',
    title: 'When Kids Say "No"',
    content: 'Saying "no" is actually a healthy part of development! It shows your grandchild is developing their own sense of self. Instead of seeing it as defiance, try to understand what they\'re really communicating and work together to find solutions.',
    tryThis: [
      'Validate their feelings first',
      'Ask "What would help you feel better?"',
      'Offer two acceptable choices',
      'Give them time to process'
    ],
    icon: '🚫'
  }
];

export default function GuidesScreen() {
  const renderGuide = (guide: Guide) => (
    <View key={guide.id} style={styles.guideCard}>
      <View style={styles.guideHeader}>
        <Text style={styles.guideIcon}>{guide.icon}</Text>
        <Text style={styles.guideTitle}>{guide.title}</Text>
      </View>

      <Text style={styles.guideContent}>{guide.content}</Text>

      <View style={styles.tryThisSection}>
        <Text style={styles.tryThisTitle}>Try this today:</Text>
        {guide.tryThis.map((item, index) => (
          <View key={index} style={styles.tryThisItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.tryThisText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parenting Guides</Text>
        <Text style={styles.subtitle}>Quick tips for common situations</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>
            Gentle Parenting for Grandparents
          </Text>
          <Text style={styles.introText}>
            These bite-sized guides help you understand modern parenting approaches
            and build stronger connections with your grandchildren.
          </Text>
        </View>

        {GUIDES.map(renderGuide)}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  introSection: {
    padding: 24,
    marginVertical: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 32,
    color: '#333333',
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
  },
  guideCard: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 24,
    backgroundColor: '#ffffff',
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  guideIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  guideTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    lineHeight: 28,
    color: '#333333',
  },
  guideContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 24,
  },
  tryThisSection: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  tryThisTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  tryThisItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 18,
    marginRight: 8,
    marginTop: 2,
    color: '#007AFF',
  },
  tryThisText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 20,
    color: '#333333',
  },
});
