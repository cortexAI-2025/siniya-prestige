import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients } from '../../constants/colors';
import { Fonts, FontSizes, Spacing } from '../../constants/theme';
import { NumericBadge } from '../ui/Badge';
import { useCartStore } from '../../store/cartStore';
import { useNavigation } from '@react-navigation/native';
import { useLang } from '../../hooks/useLang';

interface HeaderProps {
  showCart?: boolean;
  showBack?: boolean;
  title?: string;
  subtitle?: string;
  transparent?: boolean;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  showCart = true,
  showBack = false,
  title,
  subtitle,
  transparent = false,
  rightElement,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const { lang, toggle } = useLang();

  const paddingTop = insets.top + (Platform.OS === 'android' ? 8 : 0);

  const content = (
    <View style={[styles.container, { paddingTop }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.row}>
        {/* Left action */}
        {showBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={22} color={Colors.textOnDark} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Profile')}>
            <Feather name="user" size={22} color={Colors.textOnDark} />
          </TouchableOpacity>
        )}

        {/* Center — Logo or Title */}
        {title ? (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        ) : (
          <TouchableOpacity style={styles.logoContainer} onPress={toggle} activeOpacity={0.8}>
            <Text style={styles.logoText}>SINIYA</Text>
            <Text style={styles.logoSub}>PRESTIGE</Text>
            <View style={styles.langPill}>
              <Text style={styles.langPillText}>{lang === 'ar' ? 'FR' : 'ع'}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Right action */}
        {rightElement ? (
          rightElement
        ) : showCart ? (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Cart')}
          >
            <Feather name="shopping-bag" size={22} color={Colors.textOnDark} />
            <NumericBadge count={totalItems} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );

  if (transparent) {
    return <View style={styles.transparentBg}>{content}</View>;
  }

  return (
    <LinearGradient
      colors={Gradients.emeraldHeader}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {content}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  transparentBg: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  logoContainer: {
    alignItems: 'center',
  },
  langPill: {
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  langPillText: {
    fontFamily: Fonts.montserratBold,
    fontSize: 9,
    color: Colors.goldShimmer,
    letterSpacing: 1,
  },
  logoText: {
    fontFamily: Fonts.cinzelBold,
    fontSize: FontSizes['2xl'],
    color: Colors.goldShimmer,
    letterSpacing: 2,
  },
  logoSub: {
    fontFamily: Fonts.montserrat,
    fontSize: 9,
    color: Colors.gold,
    letterSpacing: 4,
    marginTop: -2,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  title: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.lg,
    color: Colors.textOnDark,
  },
  subtitle: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: 'rgba(253, 250, 246, 0.7)',
    marginTop: 2,
  },
});
