import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/theme';

interface LargeButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const LargeButton: React.FC<LargeButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1,
    };

    // Size styles
    const sizeStyles = {
      small: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        minHeight: 44,
      },
      medium: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        minHeight: 48,
      },
      large: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
        minHeight: 56,
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        borderWidth: 0,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
      },
      success: {
        backgroundColor: theme.colors.success,
        borderWidth: 0,
      },
      warning: {
        backgroundColor: theme.colors.warning,
        borderWidth: 0,
      },
      error: {
        backgroundColor: theme.colors.error,
        borderWidth: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontFamily: 'System',
      fontWeight: '600',
      textAlign: 'center',
    };

    const sizeStyles = {
      small: {
        fontSize: theme.fonts.sizes.sm,
      },
      medium: {
        fontSize: theme.fonts.sizes.base,
      },
      large: {
        fontSize: theme.fonts.sizes.lg,
      },
    };

    const variantStyles = {
      primary: { color: theme.colors.background },
      secondary: { color: theme.colors.background },
      outline: { color: theme.colors.primary },
      success: { color: theme.colors.background },
      warning: { color: theme.colors.background },
      error: { color: theme.colors.background },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getIconColor = () => {
    const variantColors = {
      primary: theme.colors.background,
      secondary: theme.colors.background,
      outline: theme.colors.primary,
      success: theme.colors.background,
      warning: theme.colors.background,
      error: theme.colors.background,
    };
    return variantColors[variant];
  };

  const getIconSize = () => {
    const sizeMap = {
      small: 16,
      medium: 20,
      large: 24,
    };
    return sizeMap[size];
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
    >
      {icon && iconPosition === 'left' && (
        <Ionicons
          name={icon}
          size={getIconSize()}
          color={getIconColor()}
          style={styles.iconLeft}
        />
      )}
      
      <Text style={[getTextStyle(), textStyle]}>
        {title}
      </Text>
      
      {icon && iconPosition === 'right' && (
        <Ionicons
          name={icon}
          size={getIconSize()}
          color={getIconColor()}
          style={styles.iconRight}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
