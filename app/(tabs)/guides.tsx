import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { speak } from '../../lib/tts';

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
  },
  {
    id: 'repairing-after-conflict',
    title: 'Repairing After We Lose Our Cool',
    content: 'We all make mistakes as caregivers. The important thing is to repair the connection afterward. When you apologize and reconnect, you teach your grandchild that relationships can be mended and that everyone deserves forgiveness.',
    tryThis: [
      'Take time to calm down first',
      'Acknowledge what happened',
      'Apologize sincerely',
      'Ask how you can help them feel better'
    ],
    icon: '💝'
  },
  {
    id: 'screens-and-limits',
    title: 'Screens & Limits',
    content: 'Screen time can be a source of conflict, but it doesn\'t have to be. Set clear, consistent limits while being understanding about why screens are appealing. Focus on what your grandchild can do instead of just what they can\'t.',
    tryThis: [
      'Set a timer together',
      'Create a "screen-free" zone',
      'Plan fun alternatives',
      'Be consistent with the rules'
    ],
    icon: '📱'
  },
  {
    id: 'grandparent-parent-alignment',
    title: 'Grandparent–Parent Alignment',
    content: 'Staying aligned with the parents\' rules while maintaining your special grandparent relationship can be tricky. The key is open communication, respect for their parenting choices, and finding ways to support their goals while creating your own meaningful connections.',
    tryThis: [
      'Ask about their parenting approach',
      'Share your observations gently',
      'Support their rules consistently',
      'Focus on your unique grandparent role'
    ],
    icon: '👨‍👩‍👧‍👦'
  }
];

export default function GuidesScreen() {
  const { theme } = useTheme();

  const handlePlayAudio = (content: string) => {
    speak(content, {
      rate: 0.9,
      pitch: 1.0,
      onError: (error) => {
        Alert.alert('Audio Error', 'Unable to play audio. Please try again.');
        console.error('TTS Error:', error);
      },
    });
  };

  const renderGuide = (guide: Guide) => (
    <View key={guide.id} style={[styles.guideCard, { 
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    }]}>
      <View style={styles.guideHeader}>
        <Text style={styles.guideIcon}>{guide.icon}</Text>
        <Text style={[styles.guideTitle, {
          color: theme.colors.text,
          fontSize: theme.fonts.sizes.xl,
        }]}>
          {guide.title}
        </Text>
        <TouchableOpacity
          style={[styles.audioButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => handlePlayAudio(guide.content)}
          accessibilityLabel="Play audio"
          accessibilityHint="Tap to hear this guide read aloud"
        >
          <Ionicons name="volume-high" size={20} color={theme.colors.background} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.guideContent, {
        color: theme.colors.text,
        fontSize: theme.fonts.sizes.lg,
      }]}>
        {guide.content}
      </Text>

      <View style={[styles.tryThisSection, { 
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border,
      }]}>
        <Text style={[styles.tryThisTitle, {
          color: theme.colors.text,
          fontSize: theme.fonts.sizes.base,
        }]}>
          Try this today:
        </Text>
        {guide.tryThis.map((item, index) => (
          <View key={index} style={styles.tryThisItem}>
            <Text style={[styles.bullet, { color: theme.colors.primary }]}>•</Text>
            <Text style={[styles.tryThisText, {
              color: theme.colors.text,
              fontSize: theme.fonts.sizes.base,
            }]}>
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Parenting Guides" 
        subtitle="Quick tips for common situations"
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introSection}>
          <Text style={[styles.introTitle, {
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.xxl,
          }]}>
            Gentle Parenting for Grandparents
          </Text>
          <Text style={[styles.introText, {
            color: theme.colors.textSecondary,
            fontSize: theme.fonts.sizes.lg,
          }]}>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  introSection: {
    padding: 24,
    marginVertical: 16,
  },
  introTitle: {
    fontFamily: 'System',
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 32,
  },
  introText: {
    fontFamily: 'System',
    lineHeight: 24,
  },
  guideCard: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  guideIcon: {
    fontSize: 32,
    marginRight: 8,
  },
  guideTitle: {
    fontFamily: 'System',
    fontWeight: '600',
    flex: 1,
    lineHeight: 28,
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  guideContent: {
    fontFamily: 'System',
    lineHeight: 24,
    marginBottom: 24,
  },
  tryThisSection: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  tryThisTitle: {
    fontFamily: 'System',
    fontWeight: '600',
    marginBottom: 8,
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
  },
  tryThisText: {
    fontFamily: 'System',
    flex: 1,
    lineHeight: 20,
  },
});
