import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.updated}>Last Updated: October 4, 2025</Text>

        <Text style={styles.section}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          Grandparent Coach collects minimal information to provide our parenting coaching service:
        </Text>
        <Text style={styles.bullet}>• Account information (email, if you create an account)</Text>
        <Text style={styles.bullet}>• Conversations with the AI coach (stored locally on your device)</Text>
        <Text style={styles.bullet}>• Subscription and payment information (processed by App Store/Google Play)</Text>

        <Text style={styles.section}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use your information to:
        </Text>
        <Text style={styles.bullet}>• Provide personalized coaching advice</Text>
        <Text style={styles.bullet}>• Improve our AI coaching service</Text>
        <Text style={styles.bullet}>• Process subscription payments</Text>
        <Text style={styles.bullet}>• Send important service updates</Text>

        <Text style={styles.section}>3. Data Storage</Text>
        <Text style={styles.paragraph}>
          Your conversations are stored locally on your device. We do not store conversation content on our servers except temporarily to generate responses. Conversation history is used to provide context-aware coaching but is not permanently retained by us.
        </Text>

        <Text style={styles.section}>4. Data Sharing</Text>
        <Text style={styles.paragraph}>
          We do not sell or share your personal information with third parties, except:
        </Text>
        <Text style={styles.bullet}>• With your consent</Text>
        <Text style={styles.bullet}>• To comply with legal obligations</Text>
        <Text style={styles.bullet}>• With service providers (like OpenAI for AI responses) under strict confidentiality agreements</Text>

        <Text style={styles.section}>5. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to:
        </Text>
        <Text style={styles.bullet}>• Access your personal data</Text>
        <Text style={styles.bullet}>• Delete your conversations (stored locally)</Text>
        <Text style={styles.bullet}>• Cancel your subscription at any time</Text>
        <Text style={styles.bullet}>• Request deletion of your account</Text>

        <Text style={styles.section}>6. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          Our service is intended for adults (grandparents and caregivers). We do not knowingly collect information from children under 13.
        </Text>

        <Text style={styles.section}>7. Security</Text>
        <Text style={styles.paragraph}>
          We use industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure.
        </Text>

        <Text style={styles.section}>8. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy in the app.
        </Text>

        <Text style={styles.section}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions about this privacy policy, please contact us at:
        </Text>
        <Text style={styles.paragraph}>
          support@grandparentcoach.app
        </Text>

        <View style={{ height: 40 }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  updated: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
});
