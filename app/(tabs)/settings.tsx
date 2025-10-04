import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { purchaseMonthly, restore, isPro } from '../../lib/revenuecat';
import { useAuth } from '../../state/useAuth';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, profile, isPro: isProStatus, signOut: handleSignOut } = useAuth();
  const [proStatus, setProStatus] = useState(false);

  useEffect(() => {
    checkProStatus();
  }, [isProStatus]);

  const checkProStatus = async () => {
    const status = await isPro();
    setProStatus(status);
  };

  const handleUpgrade = async () => {
    try {
      const result = await purchaseMonthly();
      const pro = await isPro();
      if (pro) {
        setProStatus(true);
        Alert.alert('Success', 'You now have Pro!');
      } else {
        Alert.alert('Purchase', 'Purchase completed. Entitlement pending.');
      }
    } catch (e: any) {
      Alert.alert('Purchase failed', e?.message || 'Please try again later.');
    }
  };

  const handleRestorePurchases = async () => {
    try {
      await restore();
      const pro = await isPro();
      if (pro) Alert.alert('Restored', 'Your Pro access has been restored.');
      else Alert.alert('Restore', 'No active purchases found.');
    } catch (e: any) {
      Alert.alert('Restore failed', e?.message || 'Please try again later.');
    }
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This will create a file with your conversation history and saved favorites.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          Alert.alert('Export', 'Data export will be available soon!');
        }},
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your conversations, favorites, and account data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert('Delete', 'Data deletion will be available soon!');
        }},
      ]
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightComponent,
    showArrow = true
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#ffffff" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>

      <View style={styles.settingRight}>
        {rightComponent || (showArrow && onPress && (
          <Ionicons name="chevron-forward" size={20} color="#666666" />
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          {user ? (
            <>
              <SettingItem
                icon="person"
                title={profile?.email || user.email || 'Signed In'}
                subtitle={proStatus ? 'Pro Member' : 'Free Account'}
                onPress={() => {}}
                showArrow={false}
              />
              
              <SettingItem
                icon="log-out"
                title="Sign Out"
                subtitle="Sign out of your account"
                onPress={() => {
                  Alert.alert(
                    'Sign Out',
                    'Are you sure you want to sign out?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Sign Out', style: 'destructive', onPress: handleSignOut }
                    ]
                  );
                }}
              />
            </>
          ) : (
            <SettingItem
              icon="person-add"
              title="Sign In"
              subtitle="Save your progress and access Pro features"
              onPress={() => router.push('/login')}
            />
          )}

          {!proStatus && (
            <SettingItem
              icon="star-outline"
              title="Upgrade to Pro"
              subtitle="Unlock unlimited sessions and premium features"
              onPress={handleUpgrade}
            />
          )}

          <SettingItem
            icon="refresh"
            title="Restore Purchases"
            subtitle="Restore previous purchases"
            onPress={handleRestorePurchases}
          />
        </View>

        {/* Data & Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>

          <SettingItem
            icon="download"
            title="Export My Data"
            subtitle="Download your conversations and favorites"
            onPress={handleExportData}
          />

          <SettingItem
            icon="trash"
            title="Delete All Data"
            subtitle="Permanently delete all your data"
            onPress={handleDeleteData}
          />
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>

          <SettingItem
            icon="document-text"
            title="Privacy Policy"
            subtitle="How we protect your data"
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy will be available soon!')}
          />

          <SettingItem
            icon="shield-checkmark"
            title="Terms of Service"
            subtitle="App usage terms and conditions"
            onPress={() => Alert.alert('Terms of Service', 'Terms of service will be available soon!')}
          />

          <SettingItem
            icon="medical"
            title="Safety & Medical Disclaimer"
            subtitle="Important safety information"
            onPress={() => Alert.alert(
              'Safety & Medical Disclaimer',
              'This app provides educational support only and is not medical or legal advice. For medical concerns or emergencies, contact a licensed professional or local emergency services immediately. Do not include identifying information about minors.'
            )}
          />
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 8,
    color: '#333333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#007AFF',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
    color: '#333333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  settingRight: {
    marginLeft: 8,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#999999',
  },
});
