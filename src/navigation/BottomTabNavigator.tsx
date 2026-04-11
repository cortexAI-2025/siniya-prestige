import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MenuScreen } from '../screens/MenuScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { Colors } from '../constants/colors';
import { Fonts, FontSizes, Shadows } from '../constants/theme';
import type { BottomTabParamList } from '../types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Custom tab bar
function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'Menu', labelAr: 'البوتيك', icon: 'home' },
    { name: 'Search', labelAr: 'البحث', icon: 'search' },
    { name: 'Favorites', labelAr: 'المفضلة', icon: 'heart' },
    { name: 'Profile', labelAr: 'حسابي', icon: 'user' },
  ];

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom || 12 }]}>
      {state.routes.map((route: any, index: number) => {
        const tab = tabs[index];
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => {
              if (!isFocused) {
                navigation.navigate(route.name);
              }
            }}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            {isFocused && <View style={styles.activeIndicator} />}
            <Feather
              name={tab.icon as any}
              size={22}
              color={isFocused ? Colors.emerald : Colors.textLight}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {tab.labelAr}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.separator,
    ...Shadows.card,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
    paddingTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: -10,
    width: 32,
    height: 3,
    backgroundColor: Colors.emerald,
    borderRadius: 2,
  },
  tabLabel: {
    fontFamily: Fonts.montserrat,
    fontSize: 10,
    color: Colors.textLight,
  },
  tabLabelActive: {
    fontFamily: Fonts.montserratSemiBold,
    color: Colors.emerald,
  },
});
