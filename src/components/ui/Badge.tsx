import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts, FontSizes } from '../../constants/theme';

type BadgeVariant = 'emerald' | 'gold' | 'success' | 'error' | 'warning' | 'info' | 'custom';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const variantConfig: Record<BadgeVariant, { color: string; bg: string }> = {
  emerald: { color: Colors.white, bg: Colors.emerald },
  gold: { color: Colors.white, bg: Colors.gold },
  success: { color: Colors.white, bg: '#10B981' },
  error: { color: Colors.white, bg: '#EF4444' },
  warning: { color: Colors.white, bg: '#F59E0B' },
  info: { color: Colors.white, bg: '#3B82F6' },
  custom: { color: Colors.white, bg: Colors.emerald },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'emerald',
  color,
  bgColor,
  size = 'sm',
  style,
}) => {
  const config = variantConfig[variant];
  const textColor = color || config.color;
  const backgroundColor = bgColor || config.bg;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        size === 'md' && styles.sizeMd,
        style,
      ]}
    >
      <Text style={[styles.text, { color: textColor }, size === 'md' && styles.textMd]}>
        {label}
      </Text>
    </View>
  );
};

// Numeric badge (for cart count, etc.)
interface NumericBadgeProps {
  count: number;
  style?: ViewStyle;
}

export const NumericBadge: React.FC<NumericBadgeProps> = ({ count, style }) => {
  if (count <= 0) return null;
  return (
    <View style={[styles.numericBadge, style]}>
      <Text style={styles.numericText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  sizeMd: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.montserratSemiBold,
    letterSpacing: 0.2,
  },
  textMd: {
    fontSize: FontSizes.sm,
  },
  numericBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.gold,
    borderRadius: 999,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
    paddingHorizontal: 3,
  },
  numericText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: Fonts.montserratBold,
    lineHeight: 14,
  },
});
