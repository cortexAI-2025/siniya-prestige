import { Platform } from 'react-native';

export const Fonts = {
  cinzel: 'Cinzel-Regular',
  cinzelBold: 'Cinzel-Bold',
  cinzelSemiBold: 'Cinzel-SemiBold',
  montserrat: 'Montserrat-Regular',
  montserratBold: 'Montserrat-Bold',
  montserratSemiBold: 'Montserrat-SemiBold',
  montserratMedium: 'Montserrat-Medium',
  montserratLight: 'Montserrat-Light',
};

export const FontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
  '5xl': 40,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 999,
};

export const Shadows = {
  card: {
    shadowColor: '#022C22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  cardHover: {
    shadowColor: '#022C22',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
  gold: {
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  button: {
    shadowColor: '#022C22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const Layout = {
  screenPaddingH: 16,
  cardBorderRadius: 16,
  headerHeight: Platform.OS === 'ios' ? 200 : 180,
};
