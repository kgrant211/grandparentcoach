import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.updated}>Last Updated: October 4, 2025</Text>

        <Text style={styles.section}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing and using Grandparent Coach, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our service.
        </Text>

        <Text style={styles.section}>2. Description of Service</Text>
        <Text style={styles.paragraph}>
          Grandparent Coach provides AI-powered parenting coaching advice for grandparents and caregivers. Our service offers guidance on child-rearing situations using modern, connection-focused parenting approaches.
        </Text>

        <Text style={styles.section}>3. Not Professional Advice</Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: '700' }}>IMPORTANT: </Text>
          Grandparent Coach does not provide medical, legal, or professional advice. The information provided is for educational and informational purposes only. Always consult qualified professionals for medical, legal, or crisis situations.
        </Text>

        <Text style={styles.section}>4. Subscription Terms</Text>
        <Text style={styles.paragraph}>
          • Subscription cost: $9.99 per month
        </Text>
        <Text style={styles.paragraph}>
          • Provides unlimited coaching conversations
        </Text>
        <Text style={styles.paragraph}>
          • Automatically renews monthly unless canceled
        </Text>
        <Text style={styles.paragraph}>
          • Cancel anytime through your App Store or Google Play account settings
        </Text>
        <Text style={styles.paragraph}>
          • No refunds for partial months
        </Text>

        <Text style={styles.section}>5. User Responsibilities</Text>
        <Text style={styles.paragraph}>
          You agree to:
        </Text>
        <Text style={styles.bullet}>• Use the service for lawful purposes only</Text>
        <Text style={styles.bullet}>• Not share inappropriate or harmful content</Text>
        <Text style={styles.bullet}>• Maintain the security of your account</Text>
        <Text style={styles.bullet}>• Contact emergency services for crisis situations</Text>
        <Text style={styles.bullet}>• Consult healthcare professionals for medical concerns</Text>

        <Text style={styles.section}>6. Emergency Situations</Text>
        <Text style={styles.paragraph}>
          If you or a child is in immediate danger, call emergency services (911 in the US) or contact local emergency services immediately. Do not rely on this app for emergency situations.
        </Text>

        <Text style={styles.section}>7. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          All content, features, and functionality of Grandparent Coach are owned by us and are protected by copyright, trademark, and other intellectual property laws.
        </Text>

        <Text style={styles.section}>8. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          To the fullest extent permitted by law, Grandparent Coach shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
        </Text>

        <Text style={styles.section}>9. Modifications to Service</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify, suspend, or discontinue any part of the service at any time with or without notice.
        </Text>

        <Text style={styles.section}>10. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.
        </Text>

        <Text style={styles.section}>11. Governing Law</Text>
        <Text style={styles.paragraph}>
          These terms are governed by the laws of the United States, without regard to conflict of law provisions.
        </Text>

        <Text style={styles.section}>12. Contact Information</Text>
        <Text style={styles.paragraph}>
          For questions about these terms, contact us at:
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
