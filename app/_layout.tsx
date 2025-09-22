import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../lib/theme';
import { AuthProvider } from '../state/useAuth';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modals" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
