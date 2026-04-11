import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Colors, Gradients } from '../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { getLoyaltyTierInfo } from '../utils/calculations';
import { useUserStore } from '../store/userStore';

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user, logout } = useUserStore();

  if (!user) return null;

  const tierInfo = getLoyaltyTierInfo(user.loyaltyAccount.tier);

  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل تريد الخروج من حسابك؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'خروج', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView>
        {/* Header */}
        <LinearGradient
          colors={Gradients.emeraldHeader}
          style={[styles.header, { paddingTop: insets.top + 8 }]}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.displayName.charAt(0)}
              </Text>
            </View>
            <Text style={styles.userName}>{user.displayName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>

            {/* Tier badge */}
            <View style={styles.tierBadge}>
              <Text style={styles.tierBadgeText}>
                {tierInfo.icon} {tierInfo.label}
              </Text>
            </View>
          </View>

          {/* Points summary */}
          <View style={styles.pointsRow}>
            <PointStat
              label="النقاط"
              value={String(user.loyaltyAccount.points)}
              icon="⭐"
            />
            <View style={styles.pointsDivider} />
            <PointStat
              label="الطلبات"
              value={String(user.loyaltyAccount.totalOrders)}
              icon="🛍️"
            />
            <View style={styles.pointsDivider} />
            <PointStat
              label="الإنفاق"
              value={`${user.loyaltyAccount.totalSpent} MAD`}
              icon="💰"
            />
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Loyalty section */}
          <MenuSection title="الولاء والمكافآت">
            <MenuItem
              icon="star"
              label="دائرة سينيا"
              subtitle="نقاطك ومستواك"
              onPress={() => navigation.navigate('Loyalty')}
            />
          </MenuSection>

          {/* Franchise section */}
          {user.role === 'franchisee' || user.role === 'admin' ? (
            <MenuSection title="إدارة الفرانشايز">
              <MenuItem
                icon="bar-chart-2"
                label="لوحة التحكم"
                subtitle="الطلبات والإحصائيات"
                onPress={() => navigation.navigate('FranchiseDashboard')}
              />
            </MenuSection>
          ) : null}

          {/* Account */}
          <MenuSection title="الحساب">
            <MenuItem icon="user" label="معلوماتي الشخصية" onPress={() => {}} />
            <MenuItem icon="map-pin" label="عناويني" onPress={() => {}} />
            <MenuItem icon="bell" label="الإشعارات" onPress={() => {}} />
          </MenuSection>

          {/* App info */}
          <MenuSection title="التطبيق">
            <MenuItem icon="info" label="عن سينيا بريستيج" onPress={() => {}} />
            <MenuItem icon="help-circle" label="الدعم والمساعدة" onPress={() => {}} />
            <MenuItem icon="shield" label="سياسة الخصوصية" onPress={() => {}} />
          </MenuSection>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Feather name="log-out" size={18} color="#EF4444" />
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
          </TouchableOpacity>

          <Text style={styles.version}>سينيا بريستيج v1.0.0</Text>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const PointStat: React.FC<{ label: string; value: string; icon: string }> = ({
  label,
  value,
  icon,
}) => (
  <View style={statStyles.container}>
    <Text style={statStyles.icon}>{icon}</Text>
    <Text style={statStyles.value}>{value}</Text>
    <Text style={statStyles.label}>{label}</Text>
  </View>
);

const MenuSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={sectionStyles.container}>
    <Text style={sectionStyles.title}>{title}</Text>
    <View style={sectionStyles.card}>{children}</View>
  </View>
);

const MenuItem: React.FC<{
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
}> = ({ icon, label, subtitle, onPress }) => (
  <TouchableOpacity style={itemStyles.row} onPress={onPress} activeOpacity={0.7}>
    <Feather name="chevron-left" size={18} color={Colors.textLight} />
    <View style={itemStyles.info}>
      <Text style={itemStyles.label}>{label}</Text>
      {subtitle && <Text style={itemStyles.subtitle}>{subtitle}</Text>}
    </View>
    <View style={itemStyles.iconContainer}>
      <Feather name={icon as any} size={18} color={Colors.emerald} />
    </View>
  </TouchableOpacity>
);

const statStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', gap: 2 },
  icon: { fontSize: 20 },
  value: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.sm,
    color: Colors.textOnDark,
  },
  label: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: 'rgba(253,250,246,0.6)',
  },
});

const sectionStyles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  title: {
    fontFamily: Fonts.montserratSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: Spacing.sm,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.card,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
});

const itemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1, alignItems: 'flex-end' },
  label: {
    fontFamily: Fonts.montserratMedium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.silk },
  header: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },
  avatarContainer: { alignItems: 'center', paddingVertical: Spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.goldShimmer,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    ...Shadows.gold,
  },
  avatarText: {
    fontFamily: Fonts.cinzelBold,
    fontSize: FontSizes['3xl'],
    color: Colors.emerald,
  },
  userName: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.xl,
    color: Colors.textOnDark,
    marginTop: Spacing.sm,
  },
  userEmail: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.sm,
    color: 'rgba(253,250,246,0.7)',
    marginTop: 2,
  },
  tierBadge: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tierBadgeText: {
    fontFamily: Fonts.montserratSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.white,
  },
  pointsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginTop: Spacing.md,
  },
  pointsDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: Spacing.sm,
  },
  content: {
    padding: Spacing.base,
    paddingTop: Spacing.lg,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.15)',
    marginBottom: Spacing.md,
  },
  logoutText: {
    fontFamily: Fonts.montserratSemiBold,
    fontSize: FontSizes.base,
    color: '#EF4444',
  },
  version: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
