import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/theme';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
  subtitle,
}) => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar 
        barStyle={theme.accessibility.highContrast ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />
      <View style={[styles.container, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border,
      }]}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            {showBackButton && (
              <TouchableOpacity
                style={[styles.backButton, {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                }]}
                onPress={onBackPress}
                accessibilityLabel="Go back"
                accessibilityHint="Tap to go back to the previous screen"
              >
                <Ionicons 
                  name="arrow-back" 
                  size={24} 
                  color={theme.colors.text} 
                />
              </TouchableOpacity>
            )}
            
            <View style={styles.titleContainer}>
              <Text style={[styles.title, {
                color: theme.colors.text,
                fontSize: theme.fonts.sizes.xl,
              }]}>
                {title}
              </Text>
              {subtitle && (
                <Text style={[styles.subtitle, {
                  color: theme.colors.textSecondary,
                  fontSize: theme.fonts.sizes.sm,
                }]}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
          
          {rightComponent && (
            <View style={styles.rightSection}>
              {rightComponent}
            </View>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50, // Account for status bar
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'System',
    fontWeight: '600',
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: 'System',
    marginTop: 2,
    lineHeight: 18,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
