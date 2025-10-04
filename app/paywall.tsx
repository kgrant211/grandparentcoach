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
      <Text style={styles.subtitle}>Get unlimited access to your parenting coach</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>$9.99</Text>
        <Text style={styles.priceLabel}>per month</Text>
      </View>
      <View style={styles.list}>
        <Text style={styles.item}>✓ Unlimited coaching conversations</Text>
        <Text style={styles.item}>✓ Access all your conversation history</Text>
        <Text style={styles.item}>✓ Get personalized advice anytime</Text>
      </View>
      <TouchableOpacity onPress={handleUpgrade} style={styles.primary}>
        <Text style={styles.primaryText}>Subscribe for $9.99/month</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRestore} style={styles.secondary}>
        <Text style={styles.secondaryText}>Restore Purchases</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Cancel anytime in {Platform.OS === 'ios' ? 'App Store Settings' : 'Google Play'}.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 16 },
  priceContainer: { alignItems: 'center', marginVertical: 20 },
  price: { fontSize: 48, fontWeight: '800', color: '#007AFF' },
  priceLabel: { fontSize: 16, color: '#666', marginTop: 4 },
  list: { marginVertical: 24, gap: 12 },
  item: { fontSize: 17, color: '#333', fontWeight: '500' },
  primary: { backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  primaryText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  secondary: { paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' },
  secondaryText: { color: '#111', fontSize: 16, fontWeight: '600' },
  note: { marginTop: 16, fontSize: 12, color: '#666', textAlign: 'center' }
});


