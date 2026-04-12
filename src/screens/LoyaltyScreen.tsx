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
import { getLoyaltyTierInfo } from '../utils/calculations';
import { useUserStore } from '../store/userStore';

const TIER_ORDER = ['bronze', 'silver', 'gold', 'platinum'];

export const LoyaltyScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const user = useUserStore((s) => s.user);

  if (!user) return null;

  const { loyaltyAccount } = user;
  const tierInfo = getLoyaltyTierInfo(loyaltyAccount.tier);
  const currentTierIndex = TIER_ORDER.indexOf(loyaltyAccount.tier);
  const nextTier = TIER_ORDER[currentTierIndex + 1];
  const nextTierInfo = nextTier ? getLoyaltyTierInfo(nextTier) : null;
  const progressToNext = nextTierInfo
    ? Math.min((loyaltyAccount.totalSpent - tierInfo.minSpent) /
        (nextTierInfo.minSpent - tierInfo.minSpent), 1)
    : 1;

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
        <Text style={styles.headerTitle}>دائرة سينيا</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tier card */}
        <LinearGradient
          colors={Gradients.emeraldHeader}
          style={styles.tierCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.tierIcon}>{tierInfo.icon}</Text>
          <Text style={styles.tierLabel}>{tierInfo.label}</Text>
          <Text style={styles.pointsCount}>{loyaltyAccount.points}</Text>
          <Text style={styles.pointsLabel}>نقطة في رصيدك</Text>

          {/* Progress to next tier */}
          {nextTierInfo && (
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressToNext * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {nextTierInfo.minSpent - loyaltyAccount.totalSpent} درهم للوصول إلى {nextTierInfo.label} {nextTierInfo.icon}
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard label="إجمالي الإنفاق" value={`${loyaltyAccount.totalSpent} MAD`} icon="📊" />
          <StatCard label="عدد الطلبات" value={String(loyaltyAccount.totalOrders)} icon="🛍️" />
        </View>

        {/* How it works */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>كيف تعمل نقاط سينيا؟</Text>

          <RuleRow icon="💰" text="كل 10 درهم = نقطة واحدة" />
          <RuleRow icon="🎁" text="1 نقطة = 1 درهم خصم" />
          <RuleRow icon="🥈" text="500 درهم: مستوى فضي" />
          <RuleRow icon="🥇" text="2000 درهم: مستوى ذهبي" />
          <RuleRow icon="💎" text="5000 درهم: مستوى بلاتيني" />
        </View>

        {/* Tiers */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>مستويات الولاء</Text>
          {TIER_ORDER.map((tier) => {
            const info = getLoyaltyTierInfo(tier);
            const isActive = tier === loyaltyAccount.tier;
            return (
              <View
                key={tier}
                style={[styles.tierRow, isActive && styles.tierRowActive]}
              >
                <Text style={styles.tierRowIcon}>{info.icon}</Text>
                <View style={styles.tierRowInfo}>
                  <Text style={[styles.tierRowLabel, isActive && styles.tierRowLabelActive]}>
                    {info.label}
                  </Text>
                  <Text style={styles.tierRowRange}>
                    {info.maxSpent === Infinity
                      ? `${info.minSpent}+ درهم`
                      : `${info.minSpent} - ${info.maxSpent} درهم`}
                  </Text>
                </View>
                {isActive && (
                  <View style={styles.activeChip}>
                    <Text style={styles.activeChipText}>مستواك الحالي</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: string }> = ({
  label,
  value,
  icon,
}) => (
  <View style={statStyles.card}>
    <Text style={statStyles.icon}>{icon}</Text>
    <Text style={statStyles.value}>{value}</Text>
    <Text style={statStyles.label}>{label}</Text>
  </View>
);

const RuleRow: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View style={ruleStyles.row}>
    <Text style={ruleStyles.icon}>{icon}</Text>
    <Text style={ruleStyles.text}>{text}</Text>
  </View>
);

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    alignItems: 'center',
    ...Shadows.card,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  icon: { fontSize: 28, marginBottom: Spacing.xs },
  value: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.lg,
    color: Colors.emerald,
  },
  label: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});

const ruleStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  icon: { fontSize: 18 },
  text: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'right',
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
  content: { padding: Spacing.base, gap: Spacing.md },
  tierCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.card,
  },
  tierIcon: { fontSize: 56, marginBottom: Spacing.sm },
  tierLabel: {
    fontFamily: Fonts.cinzelBold,
    fontSize: FontSizes.xl,
    color: Colors.goldShimmer,
    letterSpacing: 2,
  },
  pointsCount: {
    fontFamily: Fonts.montserratBold,
    fontSize: 52,
    color: Colors.white,
    marginTop: Spacing.sm,
    lineHeight: 60,
  },
  pointsLabel: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.base,
    color: 'rgba(253,250,246,0.7)',
  },
  progressContainer: {
    width: '100%',
    marginTop: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.goldShimmer,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: 'rgba(253,250,246,0.8)',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: Colors.separator,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.base,
    color: Colors.emerald,
    textAlign: 'right',
    marginBottom: Spacing.xs,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  tierRowActive: {
    backgroundColor: Colors.overlayLight,
    borderWidth: 1,
    borderColor: Colors.emerald,
  },
  tierRowIcon: { fontSize: 24 },
  tierRowInfo: { flex: 1, alignItems: 'flex-end' },
  tierRowLabel: {
    fontFamily: Fonts.montserratSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  tierRowLabelActive: { color: Colors.emerald },
  tierRowRange: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: Colors.textLight,
  },
  activeChip: {
    backgroundColor: Colors.emerald,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  activeChipText: {
    fontFamily: Fonts.montserratSemiBold,
    fontSize: 10,
    color: Colors.white,
  },
});
