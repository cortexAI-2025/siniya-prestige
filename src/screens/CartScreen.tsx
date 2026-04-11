import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Colors, Gradients } from '../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { formatPrice } from '../utils/formatters';
import { calculateLoyaltyPoints } from '../utils/calculations';
import { CartItemCard } from '../components/cart/CartItem';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';

export const CartScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { items, getSubtotal, clearCart } = useCartStore();
  const user = useUserStore((s) => s.user);

  const subtotal = getSubtotal();
  const pointsToEarn = calculateLoyaltyPoints(subtotal);
  const isEmpty = items.length === 0;

  return (
    <View style={styles.screen}>
      {/* Header */}
      <LinearGradient colors={Gradients.emeraldHeader} style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.textOnDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الحقيبة</Text>
        {!isEmpty && (
          <TouchableOpacity onPress={clearCart} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.clearText}>إفراغ</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {isEmpty ? (
        /* Empty state */
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛍️</Text>
          <Text style={styles.emptyTitle}>الحقيبة فارغة</Text>
          <Text style={styles.emptySubtitle}>أضف أطباقاً من القائمة</Text>
          <Button
            title="استعرض القائمة"
            onPress={() => navigation.navigate('Menu')}
            style={{ marginTop: Spacing.xl, minWidth: 200 }}
          />
        </View>
      ) : (
        <>
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {/* Items */}
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}

            {/* Loyalty points preview */}
            <View style={styles.loyaltyBanner}>
              <Text style={styles.loyaltyText}>
                🌟 ستكسب <Text style={styles.loyaltyPoints}>{pointsToEarn} نقطة</Text> من هذا الطلب
              </Text>
            </View>

            {/* Summary */}
            <View style={styles.summary}>
              <SummaryRow label="المجموع الفرعي" value={formatPrice(subtotal)} />
              <View style={styles.separator} />
              <SummaryRow
                label="الإجمالي"
                value={formatPrice(subtotal)}
                isBold
                isGold
              />
            </View>

            <View style={{ height: 16 }} />
          </ScrollView>

          {/* Checkout CTA */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <Button
              title={`إتمام الطلب  •  ${formatPrice(subtotal)}`}
              onPress={() => navigation.navigate('Checkout')}
              variant="gold"
              size="lg"
              fullWidth
            />
          </View>
        </>
      )}
    </View>
  );
};

const SummaryRow: React.FC<{
  label: string;
  value: string;
  isBold?: boolean;
  isGold?: boolean;
}> = ({ label, value, isBold, isGold }) => (
  <View style={summaryStyles.row}>
    <Text style={[summaryStyles.value, isBold && summaryStyles.bold, isGold && summaryStyles.gold]}>
      {value}
    </Text>
    <Text style={[summaryStyles.label, isBold && summaryStyles.bold]}>
      {label}
    </Text>
  </View>
);

const summaryStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  value: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  bold: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.lg,
    color: Colors.emerald,
  },
  gold: {
    color: Colors.gold,
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.silk,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.xl,
    color: Colors.textOnDark,
  },
  clearText: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.sm,
    color: Colors.goldLight,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.base,
    paddingTop: Spacing.md,
  },
  loyaltyBanner: {
    backgroundColor: 'rgba(180,83,9,0.08)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(180,83,9,0.15)',
    alignItems: 'center',
  },
  loyaltyText: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.sm,
    color: Colors.emerald,
    textAlign: 'center',
  },
  loyaltyPoints: {
    fontFamily: Fonts.montserratBold,
    color: Colors.gold,
  },
  summary: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    ...Shadows.card,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.separator,
    marginVertical: 6,
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.separator,
    ...Shadows.card,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes['2xl'],
    color: Colors.emerald,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
