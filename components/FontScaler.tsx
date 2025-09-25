import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../lib/theme';

interface FontScalerProps {
  onFontSizeChange: (scale: number) => void;
  currentScale: number;
}

export const FontScaler: React.FC<FontScalerProps> = ({
  onFontSizeChange,
  currentScale,
}) => {
  const { theme } = useTheme();

  const minScale = 0.8;
  const maxScale = 1.5;

  const getScaleLabel = (scale: number): string => {
    if (scale < 0.9) return 'Small';
    if (scale < 1.1) return 'Medium';
    if (scale < 1.3) return 'Large';
    return 'Extra Large';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, {
          color: theme.colors.text,
          fontSize: theme.fonts.sizes.lg,
        }]}>
          Text Size
        </Text>
        <Text style={[styles.currentSize, {
          color: theme.colors.textSecondary,
          fontSize: theme.fonts.sizes.base,
        }]}>
          {getScaleLabel(currentScale)}
        </Text>
      </View>

      <View style={styles.sliderContainer}>
        <Text style={[styles.label, {
          color: theme.colors.textSecondary,
          fontSize: theme.fonts.sizes.sm,
        }]}>
          A
        </Text>
        
        <View style={styles.sliderPlaceholder}>
          <Text style={[styles.sliderText, { color: theme.colors.text }]}>
            Font scale: {currentScale.toFixed(1)}x
          </Text>
        </View>
        
        <Text style={[styles.label, {
          color: theme.colors.textSecondary,
          fontSize: theme.fonts.sizes.xxl,
        }]}>
          A
        </Text>
      </View>

      <View style={styles.previewContainer}>
        <Text style={[styles.previewText, {
          color: theme.colors.text,
          fontSize: theme.fonts.sizes.lg * currentScale,
        }]}>
          This is how your text will look
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 12,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'System',
    fontWeight: '600',
  },
  currentSize: {
    fontFamily: 'System',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontFamily: 'System',
    fontWeight: '600',
    marginHorizontal: 8,
  },
  sliderPlaceholder: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  sliderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  previewContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
  },
  previewText: {
    fontFamily: 'System',
    textAlign: 'center',
  },
});
