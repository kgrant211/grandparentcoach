import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../state/useAuth';

export default function EmailConfirmationBanner() {
  const { isEmailConfirmed, needsEmailConfirmation, resendConfirmationEmail, user } = useAuth();

  const handleResend = async () => {
    const result = await resendConfirmationEmail();
    if (result.success) {
      Alert.alert('Email Sent!', 'Check your inbox for the confirmation link.');
    } else {
      Alert.alert('Error', result.error || 'Failed to send email. Please try again.');
    }
  };

  // Don't show if email is confirmed or if confirmation isn't required yet
  if (isEmailConfirmed || !user) {
    return null;
  }

  const message = needsEmailConfirmation
    ? 'Your account requires email confirmation. Please verify your email soon to continue using the app.'
    : 'Please confirm your email address to keep your account active.';

  const bgColor = needsEmailConfirmation ? '#FEE2E2' : '#FEF3C7';
  const textColor = needsEmailConfirmation ? '#991B1B' : '#92400E';
  const iconColor = needsEmailConfirmation ? '#DC2626' : '#D97706';

  return (
    <View style={[styles.banner, { backgroundColor: bgColor }]}>
      <View style={styles.content}>
        <Ionicons name="mail-outline" size={20} color={iconColor} style={styles.icon} />
        <Text style={[styles.text, { color: textColor }]}>{message}</Text>
      </View>
      <TouchableOpacity onPress={handleResend} style={styles.button}>
        <Text style={[styles.buttonText, { color: textColor }]}>Resend Email</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    marginTop: 2,
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  button: {
    alignSelf: 'flex-start',
    marginLeft: 28,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

