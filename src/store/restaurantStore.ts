import { create } from 'zustand';
import { Restaurant, FranchiseStats, FranchiseeOrder } from '../types';
import { RESTAURANTS } from '../constants/mockData';

interface RestaurantStore {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  nearestRestaurant: Restaurant | null;
  franchiseStats: FranchiseStats | null;
  liveOrders: FranchiseeOrder[];
  isLoadingOrders: boolean;

  setSelectedRestaurant: (restaurant: Restaurant) => void;
  setNearestRestaurant: (restaurant: Restaurant) => void;
  fetchFranchiseStats: (restaurantId: string) => Promise<void>;
  fetchLiveOrders: (restaurantId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: FranchiseeOrder['status']) => void;
}

// Mock franchise stats
const generateMockStats = (restaurantId: string): FranchiseStats => ({
  restaurantId,
  dailyRevenue: 4250,
  monthlyRevenue: 127500,
  totalOrders: 842,
  pendingOrders: 3,
  franchiseFeeOwed: 6375, // 5% of monthly revenue
  netProfit: 63750,
});

const generateMockOrders = (): FranchiseeOrder[] => [
  {
    id: 'ord001',
    orderNumber: '#0892',
    items: [],
    status: 'preparing',
    total: 275,
    createdAt: new Date(Date.now() - 15 * 60000),
    orderType: 'dine_in',
    tableId: 'T-04',
  },
  {
    id: 'ord002',
    orderNumber: '#0893',
    items: [],
    status: 'confirmed',
    total: 190,
    createdAt: new Date(Date.now() - 5 * 60000),
    orderType: 'takeaway',
  },
  {
    id: 'ord003',
    orderNumber: '#0894',
    items: [],
    status: 'pending',
    total: 460,
    createdAt: new Date(Date.now() - 2 * 60000),
    orderType: 'dine_in',
    tableId: 'T-07',
  },
];

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  restaurants: RESTAURANTS,
  selectedRestaurant: RESTAURANTS[0],
  nearestRestaurant: RESTAURANTS[0],
  franchiseStats: null,
  liveOrders: [],
  isLoadingOrders: false,

  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),

  setNearestRestaurant: (restaurant) => set({ nearestRestaurant: restaurant }),

  fetchFranchiseStats: async (restaurantId) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ franchiseStats: generateMockStats(restaurantId) });
  },

  fetchLiveOrders: async (restaurantId) => {
    set({ isLoadingOrders: true });
    await new Promise((resolve) => setTimeout(resolve, 600));
    set({ liveOrders: generateMockOrders(), isLoadingOrders: false });
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      liveOrders: state.liveOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    }));
  },
}));
