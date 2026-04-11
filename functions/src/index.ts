/**
 * Siniya Prestige - Firebase Cloud Functions
 * ==========================================
 * Auteur: Ahmed Akafou | Client: Abdelkader Houari
 *
 * Fonctions:
 * 1. calculateMonthlyFranchiseFee  — Calcule la redevance de 5% en fin de mois
 * 2. onOrderCreated                — Déclenché à chaque nouvelle commande
 * 3. onOrderStatusUpdate           — Notifie le client lors du changement de statut
 * 4. calculateLoyaltyPoints        — Attribue les points de fidélité
 * 5. calculateZakat                — Alloue 2.5% au fonds Zakat
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// ─── Constants ────────────────────────────────────────────────────────────────
const FRANCHISE_FEE_RATE = 0.05;   // 5% du bénéfice net
const ZAKAT_RATE = 0.025;          // 2.5% du bénéfice net
const LOYALTY_RATE = 10;           // 10 MAD = 1 point

// ─── Types ────────────────────────────────────────────────────────────────────
interface OrderData {
  restaurantId: string;
  userId: string;
  subtotal: number;
  tip: number;
  total: number;
  status: string;
  orderType: 'dine_in' | 'takeaway';
  createdAt: admin.firestore.Timestamp;
}

interface FranchiseMonthlyReport {
  restaurantId: string;
  franchiseeId: string;
  month: string;
  year: number;
  totalRevenue: number;
  totalOrders: number;
  netProfit: number;
  franchiseFee: number;
  zakatContribution: number;
  generatedAt: admin.firestore.Timestamp;
}

// ─── 1. Monthly Franchise Fee Calculation (Scheduled: end of month) ───────────
export const calculateMonthlyFranchiseFee = functions.pubsub
  .schedule('0 23 28-31 * *')
  .timeZone('Africa/Casablanca')
  .onRun(async (_context) => {
    const now = new Date();

    // Only run on the last day of the month
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.getMonth() === now.getMonth()) {
      functions.logger.info('Not the last day of month, skipping.');
      return null;
    }

    const restaurants = await db.collection('restaurants').get();
    const batch = db.batch();
    const reports: FranchiseMonthlyReport[] = [];

    for (const restaurantDoc of restaurants.docs) {
      const restaurant = restaurantDoc.data();

      // Get all orders for this restaurant in the current month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const ordersSnap = await db
        .collection('orders')
        .where('restaurantId', '==', restaurantDoc.id)
        .where('status', '==', 'delivered')
        .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startOfMonth))
        .get();

      let totalRevenue = 0;
      let totalOrders = 0;

      ordersSnap.forEach((orderDoc) => {
        const order = orderDoc.data() as OrderData;
        totalRevenue += order.subtotal;
        totalOrders++;
      });

      // Assume 40% net profit margin (configurable per restaurant)
      const profitMargin = restaurant.profitMarginRate ?? 0.40;
      const netProfit = totalRevenue * profitMargin;
      const franchiseFee = parseFloat((netProfit * FRANCHISE_FEE_RATE).toFixed(2));
      const zakatContribution = parseFloat((netProfit * ZAKAT_RATE).toFixed(2));

      const monthNames = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر'
      ];

      const report: FranchiseMonthlyReport = {
        restaurantId: restaurantDoc.id,
        franchiseeId: restaurant.franchiseeId,
        month: monthNames[now.getMonth()],
        year: now.getFullYear(),
        totalRevenue,
        totalOrders,
        netProfit,
        franchiseFee,
        zakatContribution,
        generatedAt: admin.firestore.Timestamp.now(),
      };

      reports.push(report);

      // Save report to Firestore
      const reportRef = db
        .collection('franchiseReports')
        .doc(`${restaurantDoc.id}_${now.getFullYear()}_${now.getMonth() + 1}`);
      batch.set(reportRef, report);

      // Update restaurant franchise balance
      const restaurantRef = db.collection('restaurants').doc(restaurantDoc.id);
      batch.update(restaurantRef, {
        pendingFranchiseFee: admin.firestore.FieldValue.increment(franchiseFee),
        pendingZakat: admin.firestore.FieldValue.increment(zakatContribution),
        lastReportDate: admin.firestore.Timestamp.now(),
      });

      functions.logger.info(
        `Restaurant ${restaurantDoc.id}: Revenue=${totalRevenue} MAD, Fee=${franchiseFee} MAD, Zakat=${zakatContribution} MAD`
      );
    }

    await batch.commit();
    functions.logger.info(`Monthly report generated for ${reports.length} restaurants.`);
    return null;
  });

// ─── 2. On Order Created — Trigger ───────────────────────────────────────────
export const onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data() as OrderData;
    const { orderId } = context.params;

    functions.logger.info(`New order created: ${orderId}`, { restaurantId: order.restaurantId });

    const batch = db.batch();

    // 1. Add loyalty points to user (10 MAD = 1 point)
    const pointsEarned = Math.floor(order.total / LOYALTY_RATE);
    const userRef = db.collection('users').doc(order.userId);
    batch.update(userRef, {
      'loyaltyAccount.points': admin.firestore.FieldValue.increment(pointsEarned),
      'loyaltyAccount.totalSpent': admin.firestore.FieldValue.increment(order.total),
      'loyaltyAccount.totalOrders': admin.firestore.FieldValue.increment(1),
    });

    // 2. Calculate and record Zakat for this order
    const zakatAmount = parseFloat((order.subtotal * ZAKAT_RATE).toFixed(2));
    const zakatRef = db.collection('zakatFund').doc();
    batch.set(zakatRef, {
      orderId,
      restaurantId: order.restaurantId,
      amount: zakatAmount,
      createdAt: admin.firestore.Timestamp.now(),
    });

    // 3. Update restaurant daily stats
    const today = new Date().toISOString().split('T')[0];
    const dailyStatsRef = db
      .collection('restaurants')
      .doc(order.restaurantId)
      .collection('dailyStats')
      .doc(today);

    batch.set(
      dailyStatsRef,
      {
        revenue: admin.firestore.FieldValue.increment(order.subtotal),
        orders: admin.firestore.FieldValue.increment(1),
        tips: admin.firestore.FieldValue.increment(order.tip),
      },
      { merge: true }
    );

    await batch.commit();

    functions.logger.info(
      `Order ${orderId}: +${pointsEarned} loyalty points for user ${order.userId}, Zakat: ${zakatAmount} MAD`
    );

    return null;
  });

// ─── 3. On Order Status Update — Notify Customer ─────────────────────────────
export const onOrderStatusUpdate = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data() as OrderData;
    const after = change.after.data() as OrderData;

    if (before.status === after.status) return null;

    const { orderId } = context.params;

    const statusMessages: Record<string, string> = {
      confirmed: 'تم تأكيد طلبك! نبدأ التحضير الآن. 🍽️',
      preparing: 'طلبك الآن قيد التحضير. يرجى الانتظار! 👨‍🍳',
      ready: 'طلبك جاهز! يمكنك الآن استلامه. ✅',
      delivered: 'تم تسليم طلبك. بالصحة والهناء! 🌟',
      cancelled: 'تم إلغاء طلبك. نعتذر عن الإزعاج.',
    };

    const message = statusMessages[after.status];
    if (!message) return null;

    // Get user FCM token
    const userDoc = await db.collection('users').doc(before.userId).get();
    const userData = userDoc.data();
    if (!userData?.fcmToken) return null;

    await admin.messaging().send({
      token: userData.fcmToken,
      notification: {
        title: 'سينيا بريستيج 🌿',
        body: message,
      },
      data: {
        orderId,
        status: after.status,
        type: 'order_status',
      },
      android: {
        notification: {
          channelId: 'orders',
          priority: 'high',
          color: '#022C22',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    });

    functions.logger.info(`Notification sent for order ${orderId}: ${after.status}`);
    return null;
  });

// ─── 4. HTTP: Get Franchise Report ────────────────────────────────────────────
export const getFranchiseReport = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'يجب تسجيل الدخول');
  }

  const { restaurantId, year, month } = data;

  const reportDoc = await db
    .collection('franchiseReports')
    .doc(`${restaurantId}_${year}_${month}`)
    .get();

  if (!reportDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'التقرير غير موجود');
  }

  return reportDoc.data();
});

// ─── 5. HTTP: Calculate Real-time Franchise Fee ───────────────────────────────
export const calculateRealtimeFee = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'يجب تسجيل الدخول');
  }

  const { restaurantId } = data;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const ordersSnap = await db
    .collection('orders')
    .where('restaurantId', '==', restaurantId)
    .where('status', '==', 'delivered')
    .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startOfMonth))
    .get();

  let totalRevenue = 0;
  let totalOrders = 0;

  ordersSnap.forEach((doc) => {
    const order = doc.data() as OrderData;
    totalRevenue += order.subtotal;
    totalOrders++;
  });

  const netProfit = totalRevenue * 0.40;
  const franchiseFee = parseFloat((netProfit * FRANCHISE_FEE_RATE).toFixed(2));
  const zakatAmount = parseFloat((netProfit * ZAKAT_RATE).toFixed(2));

  return {
    restaurantId,
    period: `${startOfMonth.getFullYear()}-${startOfMonth.getMonth() + 1}`,
    totalRevenue,
    totalOrders,
    netProfit,
    franchiseFee,
    zakatAmount,
    franchiseFeeRate: `${FRANCHISE_FEE_RATE * 100}%`,
    zakatRate: `${ZAKAT_RATE * 100}%`,
    calculatedAt: new Date().toISOString(),
  };
});

// ─── 6. Cleanup: Archive old orders ──────────────────────────────────────────
export const archiveOldOrders = functions.pubsub
  .schedule('0 2 * * 0')  // Every Sunday at 2am
  .timeZone('Africa/Casablanca')
  .onRun(async (_context) => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 3); // Archive orders older than 3 months

    const oldOrdersSnap = await db
      .collection('orders')
      .where('status', 'in', ['delivered', 'cancelled'])
      .where('createdAt', '<', admin.firestore.Timestamp.fromDate(cutoffDate))
      .limit(500)
      .get();

    if (oldOrdersSnap.empty) {
      functions.logger.info('No orders to archive.');
      return null;
    }

    const batch = db.batch();
    oldOrdersSnap.forEach((doc) => {
      const archiveRef = db.collection('archivedOrders').doc(doc.id);
      batch.set(archiveRef, { ...doc.data(), archivedAt: admin.firestore.Timestamp.now() });
      batch.delete(doc.ref);
    });

    await batch.commit();
    functions.logger.info(`Archived ${oldOrdersSnap.size} old orders.`);
    return null;
  });
