import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Category } from '../../types';
import { Colors, Gradients } from '../../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import { useLang } from '../../hooks/useLang';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const { name } = useLang();

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {categories.map((cat, index) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => {
              onSelectCategory(cat.id);
              scrollRef.current?.scrollTo({
                x: index * 100,
                animated: true,
              });
            }}
            style={styles.tabWrapper}
            activeOpacity={0.75}
          >
            {isSelected ? (
              <LinearGradient
                colors={Gradients.goldAccent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tab}
              >
                <Text style={styles.icon}>{cat.icon}</Text>
                <Text style={[styles.label, styles.labelSelected]}>{name(cat)}</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.tab, styles.tabInactive]}>
                <Text style={styles.icon}>{cat.icon}</Text>
                <Text style={styles.label}>{name(cat)}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  tabWrapper: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    gap: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tabInactive: {
    backgroundColor: Colors.overlayLight,
    borderWidth: 1,
    borderColor: 'rgba(2, 44, 34, 0.1)',
  },
  icon: {
    fontSize: 14,
  },
  label: {
    fontFamily: Fonts.montserratMedium,
    fontSize: FontSizes.sm,
    color: Colors.emerald,
  },
  labelSelected: {
    color: Colors.white,
    fontFamily: Fonts.montserratSemiBold,
  },
});
