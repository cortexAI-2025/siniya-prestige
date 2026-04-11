import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const sizeConfig: Record<ButtonSize, { height: number; fontSize: number; paddingH: number }> = {
  sm: { height: 36, fontSize: FontSizes.sm, paddingH: Spacing.md },
  md: { height: 48, fontSize: FontSizes.base, paddingH: Spacing.lg },
  lg: { height: 56, fontSize: FontSizes.md, paddingH: Spacing.xl },
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const sizeStyle = sizeConfig[size];
  const isDisabled = disabled || isLoading;

  const renderContent = () => (
    <View style={styles.content}>
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.emerald : Colors.white}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { fontSize: sizeStyle.fontSize },
              variant === 'outline' && styles.textOutline,
              variant === 'ghost' && styles.textGhost,
              variant === 'gold' && styles.textWhite,
              variant === 'secondary' && styles.textSecondary,
              variant === 'danger' && styles.textWhite,
              isDisabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </>
      )}
    </View>
  );

  if (variant === 'primary' || variant === 'gold') {
    const gradientColors =
      variant === 'gold'
        ? ([Colors.goldDark, Colors.gold, Colors.goldLight] as [string, string, string])
        : ([Colors.emeraldDark, Colors.emerald, Colors.emeraldLight] as [string, string, string]);

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[
          fullWidth && styles.fullWidth,
          isDisabled && styles.containerDisabled,
          style,
        ]}
      >
        <LinearGradient
          colors={isDisabled ? ['#9CA3AF', '#9CA3AF'] : gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradientBtn,
            { height: sizeStyle.height, paddingHorizontal: sizeStyle.paddingH },
            variant === 'gold' && Shadows.gold,
            variant === 'primary' && Shadows.button,
          ]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        { height: sizeStyle.height, paddingHorizontal: sizeStyle.paddingH },
        variant === 'outline' && styles.outline,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        fullWidth && styles.fullWidth,
        isDisabled && styles.containerDisabled,
        style,
      ]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradientBtn: {
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.emerald,
    borderRadius: BorderRadius.lg,
  },
  secondary: {
    backgroundColor: Colors.overlayLight,
    borderRadius: BorderRadius.lg,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.lg,
  },
  danger: {
    backgroundColor: '#EF4444',
    borderRadius: BorderRadius.lg,
  },
  fullWidth: {
    width: '100%',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.white,
    fontFamily: Fonts.montserratSemiBold,
    letterSpacing: 0.3,
  },
  textOutline: {
    color: Colors.emerald,
  },
  textGhost: {
    color: Colors.emerald,
  },
  textSecondary: {
    color: Colors.emerald,
  },
  textWhite: {
    color: Colors.white,
  },
  textDisabled: {
    color: Colors.white,
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
});
