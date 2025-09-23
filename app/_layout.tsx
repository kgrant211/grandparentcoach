import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { initRevenueCat } from '../lib/revenuecat';

export default function RootLayout() {
  useEffect(() => {
    const key = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
    if (key && Platform.OS !== 'web') {
      initRevenueCat(key).catch(() => {
        // ignore init errors on unsupported/envs
      });
    }
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
