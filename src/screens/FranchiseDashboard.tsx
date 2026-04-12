import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Colors, Gradients } from '../constants/colors';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { formatPrice, formatRelativeTime, translateOrderStatus, getStatusColor } from '../utils/formatters';
import { useRestaurantStore } from '../store/restaurantStore';

export const FranchiseDashboard: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const {
    selectedRestaurant,
    franchiseStats,
    liveOrders,
    isLoadingOrders,
    fetchFranchiseStats,
    fetchLiveOrders,
    updateOrderStatus,
  } = useRestaurantStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    if (!selectedRestaurant) return;
    await Promise.all([
      fetchFranchiseStats(selectedRestaurant.id),
      fetchLiveOrders(selectedRestaurant.id),
    ]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedRestaurant]);

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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>لوحة الفرانشايز</Text>
          <Text style={styles.headerSub}>
            {selectedRestaurant?.nameAr}
          </Text>
        </View>
        <View style={styles.statusDot}>
          <View style={styles.greenDot} />
          <Text style={styles.statusText}>مفتوح</Text>
        </View>
      </LinearGradient>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true);
              loadData();
            }}
            tintColor={Colors.gold}
          />
        }
        contentContainerStyle={styles.content}
      >
        {/* Revenue cards */}
        {franchiseStats ? (
          <>
            <View style={styles.statsGrid}>
              <RevenueCard
                label="رقم أعمال اليوم"
                value={formatPrice(franchiseStats.dailyRevenue)}
                icon="📈"
                gradient={Gradients.emeraldHeader}
              />
              <RevenueCard
                label="رقم الأعمال الشهري"
                value={formatPrice(franchiseStats.monthlyRevenue)}
                icon="💰"
                gradient={Gradients.goldAccent}
              />
            </View>

            <View style={styles.statsGrid}>
              <MetricCard
                label="إجمالي الطلبات"
                value={String(franchiseStats.totalOrders)}
                icon="🛍️"
              />
              <MetricCard
                label="طلبات معلقة"
                value={String(franchiseStats.pendingOrders)}
                icon="⏳"
                highlight
              />
            </View>

            {/* Franchise fee */}
            <View style={styles.feeCard}>
              <LinearGradient
                colors={[Colors.emeraldDark, Colors.emerald]}
                style={styles.feeGradient}
              >
                <View style={styles.feeRow}>
                  <View style={styles.feeInfo}>
                    <Text style={styles.feeTitle}>ريع الفرانشايز (5%)</Text>
                    <Text style={styles.feeAmount}>{formatPrice(franchiseStats.franchiseFeeOwed)}</Text>
                    <Text style={styles.feeSub}>مستحق نهاية الشهر</Text>
                  </View>
                  <View style={styles.feeRight}>
                    <Text style={styles.feeIcon}>🏛️</Text>
                  </View>
                </View>
                <View style={styles.feeNote}>
                  <Text style={styles.feeNoteText}>
                    💡 يتم احتساب ريع 5% من صافي الأرباح الشهرية وفق عقد الفرانشايز
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </>
        ) : (
          <ActivityIndicator color={Colors.emerald} size="large" style={{ marginVertical: 40 }} />
        )}

        {/* Live orders */}
        <View style={styles.ordersSection}>
          <Text style={styles.sectionTitle}>الطلبات الحية</Text>

          {isLoadingOrders ? (
            <ActivityIndicator color={Colors.emerald} />
          ) : liveOrders.length === 0 ? (
            <Text style={styles.emptyText}>لا توجد طلبات نشطة حالياً</Text>
          ) : (
            liveOrders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderTop}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(order.status)}20` },
                    ]}
                  >
                    <Text style={[styles.statusText2, { color: getStatusColor(order.status) }]}>
                      {translateOrderStatus(order.status)}
                    </Text>
                  </View>
                  <View style={styles.orderMeta}>
                    <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                    <Text style={styles.orderTime}>{formatRelativeTime(order.createdAt)}</Text>
                  </View>
                </View>

                <View style={styles.orderBottom}>
                  <View style={styles.orderTypeChip}>
                    <Text style={styles.orderTypeText}>
                      {order.orderType === 'dine_in'
                        ? `🍽️ طاولة ${order.tableId}`
                        : '🥡 للخارج'}
                    </Text>
                  </View>
                  <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
                </View>

                {/* Actions */}
                <View style={styles.orderActions}>
                  {order.status === 'pending' && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.confirmBtn]}
                      onPress={() => updateOrderStatus(order.id, 'confirmed')}
                    >
                      <Text style={styles.actionBtnText}>تأكيد</Text>
                    </TouchableOpacity>
                  )}
                  {order.status === 'confirmed' && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.prepareBtn]}
                      onPress={() => updateOrderStatus(order.id, 'preparing')}
                    >
                      <Text style={styles.actionBtnText}>بدء التحضير</Text>
                    </TouchableOpacity>
                  )}
                  {order.status === 'preparing' && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.readyBtn]}
                      onPress={() => updateOrderStatus(order.id, 'ready')}
                    >
                      <Text style={styles.actionBtnText}>جاهز ✓</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

const RevenueCard: React.FC<{
  label: string;
  value: string;
  icon: string;
  gradient: string[];
}> = ({ label, value, icon, gradient }) => (
  <LinearGradient
    colors={gradient as [string, string]}
    style={cardStyles.revenue}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={cardStyles.revIcon}>{icon}</Text>
    <Text style={cardStyles.revValue}>{value}</Text>
    <Text style={cardStyles.revLabel}>{label}</Text>
  </LinearGradient>
);

const MetricCard: React.FC<{
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}> = ({ label, value, icon, highlight }) => (
  <View style={[cardStyles.metric, highlight && cardStyles.metricHighlight]}>
    <Text style={cardStyles.metricIcon}>{icon}</Text>
    <Text style={[cardStyles.metricValue, highlight && cardStyles.metricValueHighlight]}>
      {value}
    </Text>
    <Text style={cardStyles.metricLabel}>{label}</Text>
  </View>
);

const cardStyles = StyleSheet.create({
  revenue: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    alignItems: 'center',
    ...Shadows.card,
  },
  revIcon: { fontSize: 28, marginBottom: 6 },
  revValue: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.lg,
    color: Colors.white,
  },
  revLabel: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: 'rgba(253,250,246,0.7)',
    textAlign: 'center',
    marginTop: 4,
  },
  metric: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    alignItems: 'center',
    ...Shadows.card,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  metricHighlight: {
    borderColor: Colors.gold,
    borderWidth: 1.5,
  },
  metricIcon: { fontSize: 24, marginBottom: 4 },
  metricValue: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes['2xl'],
    color: Colors.emerald,
  },
  metricValueHighlight: { color: Colors.gold },
  metricLabel: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
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
    gap: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.lg,
    color: Colors.textOnDark,
  },
  headerSub: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: 'rgba(253,250,246,0.7)',
    textAlign: 'center',
  },
  statusDot: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  statusText: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: 'rgba(253,250,246,0.8)',
  },
  content: { padding: Spacing.base, gap: Spacing.md },
  statsGrid: { flexDirection: 'row', gap: Spacing.md },
  feeCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.card,
  },
  feeGradient: { padding: Spacing.base },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  feeInfo: { flex: 1, alignItems: 'flex-end' },
  feeTitle: {
    fontFamily: Fonts.montserratSemiBold,
    fontSize: FontSizes.sm,
    color: 'rgba(253,250,246,0.7)',
  },
  feeAmount: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes['2xl'],
    color: Colors.goldShimmer,
    marginTop: 4,
  },
  feeSub: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: 'rgba(253,250,246,0.5)',
  },
  feeRight: { alignItems: 'center' },
  feeIcon: { fontSize: 28 },
  feeNote: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: BorderRadius.sm,
  },
  feeNoteText: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: 'rgba(253,250,246,0.75)',
    textAlign: 'center',
  },
  ordersSection: { gap: Spacing.sm },
  sectionTitle: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.lg,
    color: Colors.emerald,
    textAlign: 'right',
  },
  emptyText: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  orderCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: Colors.separator,
    gap: Spacing.sm,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusText2: {
    fontFamily: Fonts.montserratSemiBold,
    fontSize: FontSizes.xs,
  },
  orderMeta: { alignItems: 'flex-end' },
  orderNumber: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.base,
    color: Colors.emerald,
  },
  orderTime: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: Colors.textLight,
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTypeChip: {
    backgroundColor: Colors.overlayLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  orderTypeText: {
    fontFamily: Fonts.montserrat,
    fontSize: FontSizes.xs,
    color: Colors.emerald,
  },
  orderTotal: {
    fontFamily: Fonts.montserratBold,
    fontSize: FontSizes.base,
    color: Colors.gold,
  },
  orderActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  actionBtn: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  confirmBtn: { backgroundColor: Colors.emerald },
  prepareBtn: { backgroundColor: '#8B5CF6' },
  readyBtn: { backgroundColor: '#10B981' },
  actionBtnText: {
    fontFamily: Fonts.montserratSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.white,
  },
});
