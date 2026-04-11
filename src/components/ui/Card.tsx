import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadows } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  noPadding?: boolean;
  variant?: 'default' | 'emerald' | 'gold' | 'transparent';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevated = false,
  noPadding = false,
  variant = 'default',
}) => {
  return (
    <View
      style={[
        styles.card,
        !noPadding && styles.padding,
        elevated && Shadows.cardHover,
        !elevated && Shadows.card,
        variant === 'emerald' && styles.emeraldCard,
        variant === 'gold' && styles.goldCard,
        variant === 'transparent' && styles.transparentCard,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  padding: {
    padding: 16,
  },
  emeraldCard: {
    backgroundColor: Colors.emerald,
  },
  goldCard: {
    backgroundColor: Colors.gold,
  },
  transparentCard: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
});
