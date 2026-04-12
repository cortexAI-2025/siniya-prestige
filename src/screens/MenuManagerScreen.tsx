import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Image, Switch, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Colors, Gradients } from '../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { formatPrice } from '../utils/formatters';
import { MENU_ITEMS, CATEGORIES } from '../constants/mockData';
import { MenuItem } from '../types';

type LocalItem = MenuItem & { _localAvailable: boolean };

export const MenuManagerScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<LocalItem[]>(
    MENU_ITEMS.map((item) => ({ ...item, _localAvailable: item.isAvailable }))
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<LocalItem | null>(null);

  const filtered = items.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch = item.nameAr.includes(search) || item.nameEn.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, _localAvailable: !item._localAvailable } : item)
    );
  };

  const updatePrice = (id: string, price: number) => {
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, price } : item)
    );
  };

  const availableCount = items.filter((i) => i._localAvailable).length;

  return (
    <View style={styles.screen}>
      {/* Header */}
      <LinearGradient colors={Gradients.emeraldHeader} style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.textOnDark} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>إدارة القائمة</Text>
          <Text style={styles.headerSub}>{availableCount}/{items.length} طبق متاح</Text>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={16} color={Colors.textLight} style={styles.searchIcon} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="ابحث عن طبق..."
          placeholderTextColor={Colors.textLight}
          style={styles.searchInput}
          textAlign="right"
        />
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContent}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={styles.catIcon}>{cat.icon}</Text>
            <Text style={[styles.catLabel, selectedCategory === cat.id && styles.catLabelActive]}>
              {cat.nameAr}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Item list */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map((item) => (
          <View key={item.id} style={[styles.itemCard, !item._localAvailable && styles.itemCardDisabled]}>
            {/* Image */}
            <Image source={{ uri: item.image }} style={styles.itemImage} />

            {/* Info */}
            <View style={styles.itemInfo}>
              <View style={styles.itemTop}>
                <Switch
                  value={item._localAvailable}
                  onValueChange={() => toggleAvailability(item.id)}
                  trackColor={{ false: Colors.separator, true: Colors.emerald }}
                  thumbColor={Colors.white}
                  style={styles.switch}
                />
                <Text style={[styles.itemName, !item._localAvailable && styles.itemNameDisabled]} numberOfLines={1}>
                  {item.nameAr}
                </Text>
              </View>
              <Text style={styles.itemEn} numberOfLines={1}>{item.nameEn}</Text>

              <View style={styles.itemBottom}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => setEditingItem(item)}
                >
                  <Feather name="edit-2" size={13} color={Colors.emerald} />
                  <Text style={styles.editBtnText}>تعديل</Text>
                </TouchableOpacity>
                <View style={styles.priceContainer}>
                  {item.isFeatured && <Text style={styles.starBadge}>⭐</Text>}
                  <Text style={[styles.price, !item._localAvailable && styles.priceDisabled]}>
                    {formatPrice(item.price)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyText}>لا توجد أطباق مطابقة</Text>
          </View>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Edit Price Modal */}
      {editingItem && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>تعديل السعر</Text>
            <Text style={styles.modalItemName}>{editingItem.nameAr}</Text>

            <TextInput
              defaultValue={String(editingItem.price)}
              onChangeText={(v) => {
                const price = parseFloat(v);
                if (!isNaN(price)) updatePrice(editingItem.id, price);
              }}
              keyboardType="numeric"
              style={styles.priceInput}
              textAlign="right"
              autoFocus
            />
            <Text style={styles.modalCurrency}>درهم</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setEditingItem(null)}
              >
                <Text style={styles.modalCancelText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={() => {
                  Alert.alert('✅', 'تم تحديث السعر بنجاح');
                  setEditingItem(null);
                }}
              >
                <Text style={styles.modalConfirmText}>حفظ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.silk },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.base,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontFamily: Fonts.montserratBold, fontSize: FontSizes.lg, color: Colors.textOnDark },
  headerSub: { fontFamily: Fonts.montserrat, fontSize: FontSizes.xs, color: 'rgba(253,250,246,0.7)' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.cardBg, margin: Spacing.base, marginBottom: Spacing.sm,
    borderRadius: BorderRadius.xl, paddingHorizontal: Spacing.md,
    borderWidth: 1, borderColor: Colors.separator, ...Shadows.card,
  },
  searchIcon: { marginLeft: Spacing.sm },
  searchInput: {
    flex: 1, paddingVertical: Spacing.md,
    fontFamily: Fonts.montserrat, fontSize: FontSizes.base, color: Colors.textPrimary,
  },
  categoryScroll: { maxHeight: 48 },
  categoryContent: { paddingHorizontal: Spacing.base, paddingBottom: 4, gap: Spacing.sm, flexDirection: 'row' },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: 6,
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.separator,
  },
  catChipActive: { backgroundColor: Colors.emerald, borderColor: Colors.emerald },
  catIcon: { fontSize: 14 },
  catLabel: { fontFamily: Fonts.montserratMedium, fontSize: FontSizes.xs, color: Colors.emerald },
  catLabelActive: { color: Colors.white },
  list: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md, gap: Spacing.sm },
  itemCard: {
    flexDirection: 'row', backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl, overflow: 'hidden',
    ...Shadows.card, borderWidth: 1, borderColor: Colors.separator,
  },
  itemCardDisabled: { opacity: 0.6 },
  itemImage: { width: 90, height: 90 },
  itemInfo: { flex: 1, padding: Spacing.md },
  itemTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  itemName: { flex: 1, fontFamily: Fonts.montserratSemiBold, fontSize: FontSizes.sm, color: Colors.emerald, textAlign: 'right' },
  itemNameDisabled: { color: Colors.textLight },
  itemEn: { fontFamily: Fonts.montserrat, fontSize: FontSizes.xs, color: Colors.textLight, textAlign: 'right', marginBottom: Spacing.sm },
  itemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  starBadge: { fontSize: 11 },
  price: { fontFamily: Fonts.montserratBold, fontSize: FontSizes.sm, color: Colors.gold },
  priceDisabled: { color: Colors.textLight },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: Colors.overlayLight, borderRadius: BorderRadius.sm,
    borderWidth: 1, borderColor: Colors.separator,
  },
  editBtnText: { fontFamily: Fonts.montserratMedium, fontSize: 11, color: Colors.emerald },
  switch: { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { fontSize: 40, marginBottom: Spacing.md },
  emptyText: { fontFamily: Fonts.montserrat, fontSize: FontSizes.base, color: Colors.textLight },
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.cardBg, borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl, width: '80%', alignItems: 'center',
  },
  modalTitle: { fontFamily: Fonts.montserratBold, fontSize: FontSizes.lg, color: Colors.emerald, marginBottom: Spacing.sm },
  modalItemName: { fontFamily: Fonts.montserrat, fontSize: FontSizes.sm, color: Colors.textSecondary, marginBottom: Spacing.lg, textAlign: 'center' },
  priceInput: {
    width: '60%', borderBottomWidth: 2, borderBottomColor: Colors.emerald,
    fontFamily: Fonts.montserratBold, fontSize: FontSizes['2xl'], color: Colors.emerald,
    paddingBottom: 4, textAlign: 'center',
  },
  modalCurrency: { fontFamily: Fonts.montserrat, fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 4, marginBottom: Spacing.xl },
  modalActions: { flexDirection: 'row', gap: Spacing.md, width: '100%' },
  modalCancel: {
    flex: 1, padding: Spacing.md, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.separator, alignItems: 'center',
  },
  modalCancelText: { fontFamily: Fonts.montserratSemiBold, fontSize: FontSizes.sm, color: Colors.textSecondary },
  modalConfirm: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.lg, backgroundColor: Colors.emerald, alignItems: 'center' },
  modalConfirmText: { fontFamily: Fonts.montserratBold, fontSize: FontSizes.sm, color: Colors.white },
});
