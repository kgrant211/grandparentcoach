import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { useAuth } from '../../state/useAuth';
import { Header } from '../../components/Header';
import { LargeButton } from '../../components/LargeButton';
import { FontScaler } from '../../components/FontScaler';

export default function SettingsScreen() {
  const { theme, isHighContrast, fontSizeScale, toggleHighContrast, setFontSizeScale } = useTheme();
  const { user, profile, isPro, signOut } = useAuth();
  const [showFontScaler, setShowFontScaler] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Pro',
      'Pro features include:\n• Unlimited coaching sessions\n• Voice input\n• Save to favorites\n• Generate summaries\n• Priority support',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => {
          // TODO: Implement RevenueCat upgrade flow
          Alert.alert('Coming Soon', 'Upgrade functionality will be available soon!');
        }},
      ]
    );
  };

  const handleRestorePurchases = () => {
    Alert.alert(
      'Restore Purchases',
      'This will restore any previous purchases associated with your account.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore', onPress: () => {
          // TODO: Implement RevenueCat restore flow
          Alert.alert('Restore', 'Purchase restoration will be available soon!');
        }},
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This will create a file with your conversation history and saved favorites.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          // TODO: Implement data export
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
      style={[styles.settingItem, { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name={icon} size={20} color={theme.colors.background} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, {
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.lg,
          }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, {
              color: theme.colors.textSecondary,
              fontSize: theme.fonts.sizes.sm,
            }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {rightComponent || (showArrow && onPress && (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={theme.colors.textSecondary} 
          />
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Settings" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.lg,
          }]}>
            Account
          </Text>
          
          <SettingItem
            icon="person"
            title={profile?.display_name || 'Guest User'}
            subtitle={profile?.email || 'Not signed in'}
            onPress={() => {
              if (!user) {
                Alert.alert('Sign In', 'Please sign in to manage your account.');
              }
            }}
          />
          
          {isPro ? (
            <SettingItem
              icon="star"
              title="Pro Subscription"
              subtitle="Active"
              rightComponent={
                <View style={[styles.proBadge, { backgroundColor: theme.colors.accent }]}>
                  <Text style={[styles.proBadgeText, { color: theme.colors.background }]}>
                    PRO
                  </Text>
                </View>
              }
              showArrow={false}
            />
          ) : (
            <SettingItem
              icon="star-outline"
              title="Upgrade to Pro"
              subtitle="Unlock all features"
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

        {/* Accessibility Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.lg,
          }]}>
            Accessibility
          </Text>
          
          <SettingItem
            icon="text"
            title="Text Size"
            subtitle={`Current: ${fontSizeScale.toFixed(1)}x`}
            onPress={() => setShowFontScaler(!showFontScaler)}
          />
          
          {showFontScaler && (
            <FontScaler
              onFontSizeChange={setFontSizeScale}
              currentScale={fontSizeScale}
            />
          )}
          
          <SettingItem
            icon="contrast"
            title="High Contrast"
            subtitle={isHighContrast ? 'Enabled' : 'Disabled'}
            rightComponent={
              <Switch
                value={isHighContrast}
                onValueChange={toggleHighContrast}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.colors.background}
              />
            }
            showArrow={false}
          />
        </View>

        {/* Data & Privacy Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.lg,
          }]}>
            Data & Privacy
          </Text>
          
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
          <Text style={[styles.sectionTitle, {
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.lg,
          }]}>
            Legal
          </Text>
          
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

        {/* Sign Out */}
        {user && (
          <View style={styles.signOutSection}>
            <LargeButton
              title="Sign Out"
              onPress={handleSignOut}
              variant="outline"
              icon="log-out"
              fullWidth
            />
          </View>
        )}

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={[styles.versionText, {
            color: theme.colors.textSecondary,
            fontSize: theme.fonts.sizes.sm,
          }]}>
            Version 1.0.0
          </Text>
        </View>
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
  section: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontFamily: 'System',
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
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
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'System',
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: 'System',
  },
  settingRight: {
    marginLeft: 8,
  },
  proBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  proBadgeText: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 14,
  },
  signOutSection: {
    marginVertical: 32,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontFamily: 'System',
  },
});
