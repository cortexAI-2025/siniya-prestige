import { create } from 'zustand';
import { CartItem, Extra, MenuItem } from '../types';

interface CartStore {
  items: CartItem[];
  restaurantId: string | null;
  orderType: 'dine_in' | 'takeaway' | null;
  tableId: string | undefined;

  // Actions
  addItem: (menuItem: MenuItem, quantity?: number, extras?: Extra[], note?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  setRestaurant: (restaurantId: string) => void;
  setOrderType: (type: 'dine_in' | 'takeaway') => void;
  setTableId: (tableId: string) => void;

  // Computed
  getTotalItems: () => number;
  getSubtotal: () => number;
  getItemCount: (menuItemId: string) => number;
}

const calculateItemTotal = (item: MenuItem, extras: Extra[], quantity: number): number => {
  const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
  return (item.price + extrasTotal) * quantity;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  restaurantId: null,
  orderType: null,
  tableId: undefined,

  addItem: (menuItem, quantity = 1, extras = [], note = '') => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (ci) =>
          ci.menuItem.id === menuItem.id &&
          JSON.stringify(ci.selectedExtras.map((e) => e.id).sort()) ===
            JSON.stringify(extras.map((e) => e.id).sort())
      );

      if (existingIndex >= 0) {
        const updated = [...state.items];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: calculateItemTotal(menuItem, extras, newQty),
        };
        return { items: updated };
      }

      const newItem: CartItem = {
        id: `${menuItem.id}-${Date.now()}`,
        menuItem,
        quantity,
        selectedExtras: extras,
        note,
        totalPrice: calculateItemTotal(menuItem, extras, quantity),
      };

      return { items: [...state.items, newItem] };
    });
  },

  removeItem: (cartItemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== cartItemId),
    }));
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === cartItemId
          ? {
              ...item,
              quantity,
              totalPrice: calculateItemTotal(item.menuItem, item.selectedExtras, quantity),
            }
          : item
      ),
    }));
  },

  clearCart: () => set({ items: [], orderType: null, tableId: undefined }),

  setRestaurant: (restaurantId) => set({ restaurantId }),

  setOrderType: (type) => set({ orderType: type }),

  setTableId: (tableId) => set({ tableId }),

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
  },

  getItemCount: (menuItemId) => {
    const cartItem = get().items.find((ci) => ci.menuItem.id === menuItemId);
    return cartItem ? cartItem.quantity : 0;
  },
}));
