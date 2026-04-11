import { create } from 'zustand';
import { User, LoyaltyAccount } from '../types';

interface UserStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateLoyaltyPoints: (points: number) => void;
  toggleFavorite: (itemId: string) => void;
  addLoyaltyPoints: (amount: number) => void;
  logout: () => void;
}

const LOYALTY_TIERS: Record<string, LoyaltyAccount['tier']> = {
  bronze: 'bronze',
  silver: 'silver',
  gold: 'gold',
  platinum: 'platinum',
};

const getTier = (totalSpent: number): LoyaltyAccount['tier'] => {
  if (totalSpent >= 5000) return 'platinum';
  if (totalSpent >= 2000) return 'gold';
  if (totalSpent >= 500) return 'silver';
  return 'bronze';
};

// Default mock user for demo
const DEMO_USER: User = {
  uid: 'demo-user-001',
  email: 'ahmed@siniya.ma',
  displayName: 'أحمد عكافو',
  phone: '+212 600 000 001',
  loyaltyAccount: {
    userId: 'demo-user-001',
    points: 340,
    tier: 'silver',
    totalSpent: 1200,
    totalOrders: 24,
  },
  favoriteItems: ['item3', 'item12'],
  addresses: [
    {
      id: 'addr1',
      label: 'المنزل',
      street: 'شارع محمد الخامس رقم 12',
      city: 'الدار البيضاء',
      isDefault: true,
    },
  ],
  role: 'customer',
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: DEMO_USER,
  isLoading: false,
  isAuthenticated: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setLoading: (loading) => set({ isLoading: loading }),

  updateLoyaltyPoints: (points) => {
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          loyaltyAccount: {
            ...state.user.loyaltyAccount,
            points,
          },
        },
      };
    });
  },

  addLoyaltyPoints: (amount) => {
    // 10 DH = 1 point
    const pointsToAdd = Math.floor(amount / 10);
    set((state) => {
      if (!state.user) return state;
      const newPoints = state.user.loyaltyAccount.points + pointsToAdd;
      const newTotalSpent = state.user.loyaltyAccount.totalSpent + amount;
      return {
        user: {
          ...state.user,
          loyaltyAccount: {
            ...state.user.loyaltyAccount,
            points: newPoints,
            totalSpent: newTotalSpent,
            tier: getTier(newTotalSpent),
            totalOrders: state.user.loyaltyAccount.totalOrders + 1,
          },
        },
      };
    });
  },

  toggleFavorite: (itemId) => {
    set((state) => {
      if (!state.user) return state;
      const favorites = state.user.favoriteItems;
      const isFav = favorites.includes(itemId);
      return {
        user: {
          ...state.user,
          favoriteItems: isFav
            ? favorites.filter((id) => id !== itemId)
            : [...favorites, itemId],
        },
      };
    });
  },

  logout: () => set({ user: null, isAuthenticated: false }),
}));
