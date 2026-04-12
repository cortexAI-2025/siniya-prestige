import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Colors, Gradients } from '../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { formatPrice, formatOrderNumber } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { useUserStore } from '../store/userStore';

type RouteParams = { orderId: string };

export const OrderConfirmationScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ OrderConfirmation: RouteParams }, 'OrderConfirmation'>>();
  const { orderId } = route.params;

  const user = useUserStore((s) => s.user);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={Gradients.emeraldHeader}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Animated checkmark */}
        <Animated.View style={[styles.checkContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.checkCircle}>
            <Feather name="check" size={48} color={Colors.emerald} strokeWidth={3} />
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.successTitle}>تم تأكيد طلبك!</Text>
          <Text style={styles.orderNumber}>{formatOrderNumber(orderId)}</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status steps */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>حالة الطلب</Text>
            <StatusStep icon="check-circle" label="تم استلام الطلب" done />
            <StatusStep icon="clock" label="قيد التحضير" pending />
            <StatusStep icon="package" label="جاهز للاستلام" pending />
          </View>

          {/* Loyalty earned */}
          {user && (
            <View style={styles.loyaltyCard}>
              <Text style={styles.loyaltyTitle}>🌟 نقاط الولاء</Text>
              <Text style={styles.loyaltyBalance}>
                رصيدك الحالي:{' '}
                <Text style={{ color: Colors.gold, fontFamily: Fonts.montserratBold }}>
                  {user.loyaltyAccount.points} نقطة
                </Text>
              </Text>
              <Text style={styles.loyaltyTier}>
                مستواك: {user.loyaltyAccount.tier === 'silver' ? 'فضي 🥈' :
                         user.loyaltyAccount.tier === 'gold' ? 'ذهبي 🥇' :
                         user.loyaltyAccount.tier === 'platinum' ? 'بلاتيني 💎' : 'برونزي 🥉'}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="تتبع طلبي"
              onPress={() => {}}
              variant="primary"
              fullWidth
              style={{ marginBottom: Spacing.sm }}
            />
            <Button
              title="العودة للقائمة"
              onPress={() => navigation.navigate('Main')}
              variant="outline"
              fullWidth
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const StatusStep: React.FC<{ icon: string; label: string; done?: boolean; pending?: boolean }> = ({
  icon,
  label,
  done,
  pending,
}) => (
  <View style={stepStyles.row}>
    <View style={[stepStyles.dot, done && stepStyles.dotDone, pending && stepStyles.dotPending]}>
      {done && <Feather name={icon as any} size={14} color={Colors.white} />}
    </View>
    <Text style={[stepStyles.label, done && stepStyles.labelDone]}>{label}</Text>
    <View style={stepStyles.spacer} />
  </View>
);

const stepStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.separator,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.separator,
  },
  dotDone: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  dotPending: {
    backgroundColor: 'transparent',
    borderColor: Colors.textLight,
  },
  label: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  labelDone: {
    fontFamily: Fonts.montserratSemiBold,
    color: Colors.emerald,
  },
  spacer: { flex: 0 },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.silk },
  gradient: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkContainer: {
    marginBottom: Spacing.sm,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.goldShimmer,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.gold,
  },
  successTitle: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes['2xl'],
    color: Colors.textOnDark,
  },
  orderNumber: {
    fontFamily: Fonts.cinzel,
    fontSize: FontSizes.xl,
    color: Colors.goldShimmer,
    letterSpacing: 2,
  },
  content: {
    padding: Spacing.base,
    paddingTop: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  cardTitle: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.base,
    color: Colors.emerald,
    textAlign: 'right',
    marginBottom: Spacing.md,
  },
  loyaltyCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.card,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(180,83,9,0.15)',
  },
  loyaltyTitle: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.base,
    color: Colors.emerald,
    marginBottom: 4,
  },
  loyaltyBalance: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  loyaltyTier: {
    fontFamily: Fonts.montserratMedium,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    marginTop: Spacing.sm,
  },
});
