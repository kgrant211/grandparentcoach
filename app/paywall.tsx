import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { purchaseMonthly, restore, isPro } from '../lib/revenuecat';
import { useRouter } from 'expo-router';

export default function PaywallScreen() {
  const router = useRouter();

  const handleUpgrade = async () => {
    try {
      await purchaseMonthly();
      const pro = await isPro();
      if (pro) {
        Alert.alert('Thank you!', 'Pro unlocked.');
        router.back();
      } else {
        Alert.alert('Processing', 'Purchase completed. Entitlement may take a moment.');
      }
    } catch (e: any) {
      Alert.alert('Purchase failed', e?.message || 'Please try again later.');
    }
  };

  const handleRestore = async () => {
    try {
      await restore();
      const pro = await isPro();
      if (pro) {
        Alert.alert('Restored', 'Your Pro access has been restored.');
        router.back();
      } else {
        Alert.alert('Restore', 'No active purchases found.');
      }
    } catch (e: any) {
      Alert.alert('Restore failed', e?.message || 'Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Go Pro</Text>
      <Text style={styles.subtitle}>Unlock everything:</Text>
      <View style={styles.list}>
        <Text style={styles.item}>• Unlimited coaching sessions</Text>
        <Text style={styles.item}>• Save favorites and summaries</Text>
        <Text style={styles.item}>• Audio playback</Text>
        <Text style={styles.item}>• Priority improvements</Text>
      </View>
      <TouchableOpacity onPress={handleUpgrade} style={styles.primary}>
        <Text style={styles.primaryText}>Upgrade to Pro</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRestore} style={styles.secondary}>
        <Text style={styles.secondaryText}>Restore Purchases</Text>
      </TouchableOpacity>
      <Text style={styles.note}>7‑day free trial, then monthly. Cancel anytime in {Platform.OS === 'ios' ? 'Settings' : 'Google Play'}.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#444', textAlign: 'center' },
  list: { marginVertical: 24, gap: 8 },
  item: { fontSize: 16, color: '#333' },
  primary: { backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  primaryText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  secondary: { paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' },
  secondaryText: { color: '#111', fontSize: 16, fontWeight: '600' },
  note: { marginTop: 16, fontSize: 12, color: '#666', textAlign: 'center' }
});


