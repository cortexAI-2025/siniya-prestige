import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { MenuItem, Category, ChefCollection } from '../types';
import { Colors, Gradients } from '../constants/colors';
import { Fonts, FontSizes, Spacing } from '../constants/theme';
import { CATEGORIES, CHEF_COLLECTIONS } from '../constants/mockData';
import { menuService } from '../services/menuService';
import { MenuItemCard } from '../components/menu/MenuItemCard';
import { CategoryFilter } from '../components/menu/CategoryFilter';
import { ChefCollectionsRow } from '../components/menu/ChefCollectionCard';
import { NumericBadge } from '../components/ui/Badge';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const MenuScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalItems = useCartStore((s) => s.getTotalItems());
  const user = useUserStore((s) => s.user);

  const fetchMenu = useCallback(async () => {
    try {
      const items = await menuService.getMenuByCategory(selectedCategory);
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setIsLoading(true);
    fetchMenu();
  }, [fetchMenu]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedCollection(null);
  };

  const handleCollectionSelect = (collection: ChefCollection) => {
    setSelectedCollection(
      selectedCollection === collection.id ? null : collection.id
    );
  };

  const handleItemPress = (item: MenuItem) => {
    navigation.navigate('ProductDetail', { itemId: item.id });
  };

  const renderHeader = () => (
    <LinearGradient
      colors={Gradients.emeraldHeader}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <Feather name="user" size={22} color={Colors.textOnDark} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoBlock}>
          {/* Decorative wreath placeholder */}
          <View style={styles.logoWreath}>
            <Text style={styles.logoText}>SINIYA</Text>
            <Text style={styles.logoSub}>PRESTIGE</Text>
          </View>
        </View>

        {/* Cart */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Cart')}
        >
          <Feather name="shopping-bag" size={22} color={Colors.textOnDark} />
          <NumericBadge count={totalItems} />
        </TouchableOpacity>
      </View>

      {/* Chef Collections */}
      <ChefCollectionsRow
        collections={CHEF_COLLECTIONS}
        selectedId={selectedCollection}
        onSelect={handleCollectionSelect}
        sectionLabel="مجموعات الشيف"
        subLabel="المصراف"
      />

      <View style={styles.headerBottomPad} />
    </LinearGradient>
  );

  const renderSectionHeader = () => (
    <View>
      {/* Category filter */}
      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Section title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>قطع البوتيك</Text>
      </View>
    </View>
  );

  const renderItem = ({ item, index }: { item: MenuItem; index: number }) => (
    <MenuItemCard item={item} onPress={handleItemPress} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🍽️</Text>
      <Text style={styles.emptyText}>لا توجد أطباق في هذه الفئة</Text>
    </View>
  );

  // Pair items for 2-column grid
  const pairedItems = [];
  for (let i = 0; i < menuItems.length; i += 2) {
    pairedItems.push([menuItems[i], menuItems[i + 1]]);
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true);
              fetchMenu();
            }}
            tintColor={Colors.gold}
          />
        }
        stickyHeaderIndices={[0]}
      >
        {/* Sticky header with gradient */}
        {renderHeader()}

        {/* Category filter (sticky) */}
        <View style={styles.categorySticky}>
          {renderSectionHeader()}
        </View>

        {/* Menu grid */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.emerald} />
          </View>
        ) : menuItems.length === 0 ? (
          renderEmpty()
        ) : (
          <View style={styles.gridContainer}>
            {pairedItems.map((pair, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                <MenuItemCard item={pair[0]} onPress={handleItemPress} />
                {pair[1] ? (
                  <MenuItemCard item={pair[1]} onPress={handleItemPress} />
                ) : (
                  <View style={styles.gridPlaceholder} />
                )}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: insets.bottom + 80 }} />
      </ScrollView>

      {/* Floating cart button */}
      {totalItems > 0 && (
        <TouchableOpacity
          style={[styles.floatingCart, { bottom: insets.bottom + 90 }]}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={Gradients.goldAccent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.floatingCartGradient}
          >
            <Feather name="shopping-bag" size={20} color={Colors.white} />
            <View style={styles.cartBadgeFloat}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
            <Text style={styles.floatingCartText}>حقيبة التسوق</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.silk,
  },

  // Header styles
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBlock: {
    alignItems: 'center',
  },
  logoWreath: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoText: {
    fontFamily: Fonts.cinzelBold,
    fontSize: 26,
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
  headerBottomPad: {
    height: Spacing.md,
  },

  // Category / Section
  categorySticky: {
    backgroundColor: Colors.silk,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.lg,
    color: Colors.emerald,
  },

  // Grid
  gridContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  gridPlaceholder: {
    flex: 1,
  },

  // Loading / Empty
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Floating cart
  floatingCart: {
    position: 'absolute',
    right: Spacing.base,
    borderRadius: 999,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  floatingCartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  cartBadgeFloat: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    fontFamily: Fonts.montserratBold,
    fontSize: 11,
    color: Colors.gold,
  },
  floatingCartText: {
    fontFamily: Fonts.montserratSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.white,
  },
});
