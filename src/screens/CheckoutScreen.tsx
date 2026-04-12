import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Colors, Gradients } from '../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { formatPrice } from '../utils/formatters';
import {
  calculateTip,
  calculateLoyaltyPoints,
} from '../utils/calculations';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { useRestaurantStore } from '../store/restaurantStore';
import { orderService } from '../services/orderService';
import type { PaymentMethod } from '../types';

const TIP_OPTIONS = [
  { id: 't0', label: 'بدون', percentage: 0 },
  { id: 't5', label: '5%', percentage: 5 },
  { id: 't10', label: '10%', percentage: 10 },
  { id: 't15', label: '15%', percentage: 15 },
  { id: 'custom', label: 'مخصص', percentage: -1 },
];

const PAYMENT_METHODS: { id: PaymentMethod; labelAr: string; icon: string }[] = [
  { id: 'cash', labelAr: 'نقدًا', icon: '💵' },
  { id: 'card', labelAr: 'بطاقة بنكية', icon: '💳' },
  { id: 'wallet', labelAr: 'محفظة رقمية', icon: '📱' },
];

export const CheckoutScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { items, getSubtotal, orderType, setOrderType, tableId, setTableId, clearCart } =
    useCartStore();
  const { user, addLoyaltyPoints } = useUserStore();
  const { selectedRestaurant } = useRestaurantStore();

  const [selectedTip, setSelectedTip] = useState('t0');
  const [customTip, setCustomTip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [tableInput, setTableInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const tipPercent =
    selectedTip === 'custom'
      ? parseFloat(customTip) || 0
      : TIP_OPTIONS.find((t) => t.id === selectedTip)?.percentage ?? 0;
  const tipAmount = calculateTip(subtotal, tipPercent);
  const total = subtotal + tipAmount;
  const pointsToEarn = calculateLoyaltyPoints(total);

  const handlePlaceOrder = async () => {
    if (!orderType) {
      Alert.alert('خطأ', 'يرجى اختيار نوع الطلب (على الطاولة أو للمنزل)');
      return;
    }
    if (orderType === 'dine_in' && !tableInput) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الطاولة');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment
      await orderService.simulatePayment(total, paymentMethod);

      // Create order
      const order = await orderService.createOrder({
        userId: user?.uid ?? 'guest',
        restaurantId: selectedRestaurant?.id ?? 'rest1',
        items,
        orderType,
        tableId: orderType === 'dine_in' ? tableInput : undefined,
        tip: tipAmount,
        paymentMethod,
      });

      // Add loyalty points
      addLoyaltyPoints(total);
      clearCart();

      navigation.replace('OrderConfirmation', { orderId: order.id });
    } catch (error) {
      Alert.alert('خطأ في الدفع', 'حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <LinearGradient
        colors={Gradients.emeraldHeader}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.textOnDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>إتمام الطلب</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Order Type */}
        <SectionCard title="نوع الطلب">
          <View style={styles.optionRow}>
            <OrderTypeBtn
              label="على الطاولة"
              icon="🍽️"
              isSelected={orderType === 'dine_in'}
              onPress={() => setOrderType('dine_in')}
            />
            <OrderTypeBtn
              label="للمنزل / للخارج"
              icon="🥡"
              isSelected={orderType === 'takeaway'}
              onPress={() => setOrderType('takeaway')}
            />
          </View>

          {orderType === 'dine_in' && (
            <View style={styles.tableInput}>
              <Text style={styles.inputLabel}>رقم الطاولة</Text>
              <TextInput
                value={tableInput}
                onChangeText={setTableInput}
                placeholder="مثال: T-04"
                placeholderTextColor={Colors.textLight}
                style={styles.textInput}
                keyboardType="default"
                textAlign="right"
              />
            </View>
          )}
        </SectionCard>

        {/* Tip */}
        <SectionCard title="إكرامية للطاقم">
          <View style={styles.tipRow}>
            {TIP_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.tipBtn, selectedTip === opt.id && styles.tipBtnSelected]}
                onPress={() => setSelectedTip(opt.id)}
              >
                <Text
                  style={[styles.tipLabel, selectedTip === opt.id && styles.tipLabelSelected]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedTip === 'custom' && (
            <TextInput
              value={customTip}
              onChangeText={setCustomTip}
              placeholder="أدخل نسبة الإكرامية %"
              placeholderTextColor={Colors.textLight}
              keyboardType="numeric"
              style={[styles.textInput, { marginTop: Spacing.sm }]}
              textAlign="right"
            />
          )}
          {tipAmount > 0 && (
            <Text style={styles.tipAmount}>
              مبلغ الإكرامية: <Text style={{ color: Colors.gold }}>{formatPrice(tipAmount)}</Text>
            </Text>
          )}
        </SectionCard>

        {/* Payment Method */}
        <SectionCard title="طريقة الدفع (Stripe)">
          {PAYMENT_METHODS.map((pm) => (
            <TouchableOpacity
              key={pm.id}
              style={[styles.paymentRow, paymentMethod === pm.id && styles.paymentRowSelected]}
              onPress={() => setPaymentMethod(pm.id)}
            >
              <Text style={styles.paymentIcon}>{pm.icon}</Text>
              <Text style={[styles.paymentLabel, paymentMethod === pm.id && styles.paymentLabelSelected]}>
                {pm.labelAr}
              </Text>
              {paymentMethod === pm.id && (
                <Feather name="check-circle" size={18} color={Colors.emerald} style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
          ))}
        </SectionCard>

        {/* Order Summary */}
        <SectionCard title="ملخص الطلب">
          <SummaryLine label="المجموع الفرعي" value={formatPrice(subtotal)} />
          {tipAmount > 0 && <SummaryLine label="الإكرامية" value={formatPrice(tipAmount)} />}
          <View style={styles.separator} />
          <SummaryLine label="الإجمالي" value={formatPrice(total)} isBold />

          {/* Loyalty preview */}
          <View style={styles.loyaltyPreview}>
            <Text style={styles.loyaltyText}>
              🌟 ستكسب <Text style={{ color: Colors.gold, fontFamily: Fonts.montserratBold }}>{pointsToEarn} نقطة</Text> من هذا الطلب
            </Text>
          </View>
        </SectionCard>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          title={isProcessing ? 'جاري المعالجة...' : `تأكيد الطلب  •  ${formatPrice(total)}`}
          onPress={handlePlaceOrder}
          variant="gold"
          size="lg"
          fullWidth
          isLoading={isProcessing}
        />
      </View>
    </View>
  );
};

// Sub-components
const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={sectionStyles.card}>
    <Text style={sectionStyles.title}>{title}</Text>
    {children}
  </View>
);

const OrderTypeBtn: React.FC<{
  label: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ label, icon, isSelected, onPress }) => (
  <TouchableOpacity
    style={[sectionStyles.orderBtn, isSelected && sectionStyles.orderBtnSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    {isSelected ? (
      <LinearGradient
        colors={Gradients.emeraldHeader}
        style={sectionStyles.orderBtnGradient}
      >
        <Text style={sectionStyles.orderIcon}>{icon}</Text>
        <Text style={[sectionStyles.orderLabel, { color: Colors.white }]}>{label}</Text>
      </LinearGradient>
    ) : (
      <View style={sectionStyles.orderBtnInner}>
        <Text style={sectionStyles.orderIcon}>{icon}</Text>
        <Text style={sectionStyles.orderLabel}>{label}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const SummaryLine: React.FC<{ label: string; value: string; isBold?: boolean }> = ({
  label,
  value,
  isBold,
}) => (
  <View style={summaryStyles.row}>
    <Text style={[summaryStyles.value, isBold && summaryStyles.bold]}>{value}</Text>
    <Text style={[summaryStyles.label, isBold && summaryStyles.bold]}>{label}</Text>
  </View>
);

const sectionStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  title: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.base,
    color: Colors.emerald,
    textAlign: 'right',
    marginBottom: Spacing.md,
  },
  orderBtn: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.separator,
  },
  orderBtnSelected: {
    borderColor: Colors.emerald,
  },
  orderBtnGradient: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  orderBtnInner: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  orderIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  orderLabel: {
    fontFamily: Fonts.montserratSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.emerald,
    textAlign: 'center',
  },
});

const summaryStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
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
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.silk },
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
  content: {
    padding: Spacing.base,
    paddingTop: Spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tableInput: {
    marginTop: Spacing.md,
  },
  inputLabel: {
    fontFamily: Fonts.montserratMedium,
    fontSize: FontSizes.sm,
    color: Colors.emerald,
    textAlign: 'right',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: Colors.silk,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.separator,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  tipRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  tipBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.overlayLight,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  tipBtnSelected: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  tipLabel: {
    fontFamily: Fonts.montserratSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.emerald,
  },
  tipLabelSelected: {
    color: Colors.white,
  },
  tipAmount: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: Spacing.sm,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.separator,
    marginBottom: Spacing.sm,
  },
  paymentRowSelected: {
    borderColor: Colors.emerald,
    backgroundColor: Colors.overlayLight,
  },
  paymentIcon: { fontSize: 20 },
  paymentLabel: {
    fontFamily: Fonts.montserratMedium,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  paymentLabelSelected: {
    color: Colors.emerald,
    fontFamily: Fonts.montserratSemiBold,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.separator,
    marginVertical: Spacing.sm,
  },
  loyaltyPreview: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  loyaltyText: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.separator,
  },
});
