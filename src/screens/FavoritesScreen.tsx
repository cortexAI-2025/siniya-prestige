import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { Fonts, FontSizes, Spacing } from '../constants/theme';
import { MENU_ITEMS } from '../constants/mockData';
import { MenuItemCard } from '../components/menu/MenuItemCard';
import { useUserStore } from '../store/userStore';

export const FavoritesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const user = useUserStore((s) => s.user);

  const favoriteItems = MENU_ITEMS.filter(
    (item) => user?.favoriteItems.includes(item.id)
  );

  const pairedItems: typeof MENU_ITEMS[] = [];
  for (let i = 0; i < favoriteItems.length; i += 2) {
    pairedItems.push([favoriteItems[i], favoriteItems[i + 1]]);
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + Spacing.md }]}>
      <Text style={styles.title}>المفضلة</Text>

      {favoriteItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyTitle}>لا توجد أطباق مفضلة</Text>
          <Text style={styles.emptyText}>
            اضغط على قلب ♥ بجانب أي طبق لإضافته للمفضلة
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {pairedItems.map((pair, i) => (
            <View key={i} style={styles.gridRow}>
              <MenuItemCard
                item={pair[0]}
                onPress={(item) => navigation.navigate('ProductDetail', { itemId: item.id })}
              />
              {pair[1] ? (
                <MenuItemCard
                  item={pair[1]}
                  onPress={(item) => navigation.navigate('ProductDetail', { itemId: item.id })}
                />
              ) : (
                <View style={{ flex: 1 }} />
              )}
            </View>
          ))}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.silk },
  title: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes['2xl'],
    color: Colors.emerald,
    textAlign: 'right',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  grid: {
    paddingHorizontal: Spacing.base,
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.lg },
  emptyTitle: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.xl,
    color: Colors.emerald,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
