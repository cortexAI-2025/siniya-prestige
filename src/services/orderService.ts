import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { CartItem, Order, PaymentMethod } from '../types';
import { calculateLoyaltyPoints, calculateFranchiseFee } from '../utils/calculations';

const USE_MOCK = true;

export const orderService = {
  async createOrder(params: {
    userId: string;
    restaurantId: string;
    items: CartItem[];
    orderType: 'dine_in' | 'takeaway';
    tableId?: string;
    tip: number;
    paymentMethod: PaymentMethod;
  }): Promise<Order> {
    const subtotal = params.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const total = subtotal + params.tip;
    const loyaltyPointsEarned = calculateLoyaltyPoints(total);
    const franchiseFee = calculateFranchiseFee(subtotal);

    const orderData: Omit<Order, 'id'> = {
      userId: params.userId,
      restaurantId: params.restaurantId,
      items: params.items,
      status: 'pending',
      orderType: params.orderType,
      tableId: params.tableId,
      subtotal,
      tip: params.tip,
      total,
      paymentMethod: params.paymentMethod,
      loyaltyPointsEarned,
      franchiseFee,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1000));
      return {
        ...orderData,
        id: `order-${Date.now()}`,
      };
    }

    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { ...orderData, id: docRef.id };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return;
    }

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  subscribeToRestaurantOrders(
    restaurantId: string,
    callback: (orders: Order[]) => void
  ): Unsubscribe {
    if (USE_MOCK) {
      return () => {};
    }

    const q = query(
      collection(db, 'orders'),
      where('restaurantId', '==', restaurantId),
      where('status', 'in', ['pending', 'confirmed', 'preparing', 'ready']),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() } as Order)
      );
      callback(orders);
    });
  },

  async simulatePayment(amount: number, paymentMethod: PaymentMethod): Promise<{
    success: boolean;
    transactionId: string;
  }> {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      success: true,
      transactionId: `TXN-${Date.now()}`,
    };
  },
};
