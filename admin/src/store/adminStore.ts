import { create } from 'zustand';
import toast from 'react-hot-toast';
import { Franchisee, StockItem, AdminMenuItem, StaffMember, RestaurantHours } from '../types';
import {
  MOCK_FRANCHISEES,
  MOCK_STOCK,
  MOCK_KPIS,
  MOCK_REVENUE,
  MOROCCO_CITIES,
  MOCK_MENU_ITEMS,
  MOCK_MENU_CATEGORIES,
  MOCK_STAFF,
  MOCK_RESTAURANT_HOURS,
} from '../constants/mockData';

interface AdminStore {
  franchisees: Franchisee[];
  stock: StockItem[];
  menuItems: AdminMenuItem[];
  menuCategories: typeof MOCK_MENU_CATEGORIES;
  staff: StaffMember[];
  restaurantHours: RestaurantHours[];
  kpis: typeof MOCK_KPIS;
  revenue: typeof MOCK_REVENUE;
  cities: typeof MOROCCO_CITIES;
  isLoading: boolean;
  selectedFranchiseeId: string | null;

  // Menu actions
  toggleMenuItemAvailability: (id: string) => void;
  updateMenuItem: (item: AdminMenuItem) => void;
  addMenuItem: (item: AdminMenuItem) => void;
  deleteMenuItem: (id: string) => void;

  // Staff actions
  toggleStaffActive: (id: string) => void;
  addStaffMember: (member: StaffMember) => void;
  updateStaffMember: (member: StaffMember) => void;

  // Hours actions
  updateRestaurantHours: (hours: RestaurantHours) => void;

  // Actions
  approveFranchisee: (id: string) => void;
  rejectFranchisee: (id: string) => void;
  suspendFranchisee: (id: string) => void;
  updateStock: (id: string, quantity: number) => void;
  createStockOrder: (itemIds: string[]) => void;
  setSelectedFranchisee: (id: string | null) => void;
  getSelectedFranchisee: () => Franchisee | null;

  // Stats
  getPendingCount: () => number;
  getLowStockCount: () => number;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  franchisees: MOCK_FRANCHISEES,
  stock: MOCK_STOCK,
  menuItems: MOCK_MENU_ITEMS,
  menuCategories: MOCK_MENU_CATEGORIES,
  staff: MOCK_STAFF,
  restaurantHours: MOCK_RESTAURANT_HOURS,
  kpis: MOCK_KPIS,
  revenue: MOCK_REVENUE,
  cities: MOROCCO_CITIES,
  isLoading: false,
  selectedFranchiseeId: null,

  toggleMenuItemAvailability: (id) => {
    set((state) => ({
      menuItems: state.menuItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      ),
    }));
  },

  updateMenuItem: (updated) => {
    set((state) => ({
      menuItems: state.menuItems.map((item) => item.id === updated.id ? updated : item),
    }));
    toast.success('✏️ تم تحديث الطبق بنجاح');
  },

  addMenuItem: (item) => {
    set((state) => ({ menuItems: [...state.menuItems, item] }));
    toast.success('➕ تم إضافة طبق جديد');
  },

  deleteMenuItem: (id) => {
    set((state) => ({ menuItems: state.menuItems.filter((item) => item.id !== id) }));
    toast.success('🗑️ تم حذف الطبق');
  },

  toggleStaffActive: (id) => {
    set((state) => ({
      staff: state.staff.map((m) =>
        m.id === id ? { ...m, isActive: !m.isActive } : m
      ),
    }));
  },

  addStaffMember: (member) => {
    set((state) => ({ staff: [...state.staff, member] }));
    toast.success('👤 تم إضافة موظف جديد');
  },

  updateStaffMember: (updated) => {
    set((state) => ({
      staff: state.staff.map((m) => m.id === updated.id ? updated : m),
    }));
    toast.success('✏️ تم تحديث بيانات الموظف');
  },

  updateRestaurantHours: (hours) => {
    set((state) => ({
      restaurantHours: state.restaurantHours.some((h) => h.restaurantId === hours.restaurantId)
        ? state.restaurantHours.map((h) => h.restaurantId === hours.restaurantId ? hours : h)
        : [...state.restaurantHours, hours],
    }));
    toast.success('🕐 تم حفظ أوقات العمل');
  },

  approveFranchisee: (id) => {
    set((state) => ({
      franchisees: state.franchisees.map((f) =>
        f.id === id ? { ...f, status: 'approved', approvedAt: new Date() } : f
      ),
    }));
    toast.success('✅ تم قبول طلب الفرانشايز بنجاح');
  },

  rejectFranchisee: (id) => {
    set((state) => ({
      franchisees: state.franchisees.map((f) =>
        f.id === id ? { ...f, status: 'rejected' } : f
      ),
    }));
    toast.error('❌ تم رفض طلب الفرانشايز');
  },

  suspendFranchisee: (id) => {
    set((state) => ({
      franchisees: state.franchisees.map((f) =>
        f.id === id ? { ...f, status: 'suspended' } : f
      ),
    }));
    toast('⚠️ تم تعليق الفرانشايز مؤقتاً', { icon: '⚠️' });
  },

  updateStock: (id, quantity) => {
    set((state) => ({
      stock: state.stock.map((item) => {
        if (item.id !== id) return item;
        const newQty = item.currentStock + quantity;
        const status = newQty === 0 ? 'out_of_stock' : newQty < item.minStock ? 'low_stock' : 'in_stock';
        return { ...item, currentStock: newQty, status };
      }),
    }));
    toast.success('📦 تم تحديث المخزون');
  },

  createStockOrder: (itemIds) => {
    set((state) => ({
      stock: state.stock.map((item) =>
        itemIds.includes(item.id) ? { ...item, status: 'ordered' } : item
      ),
    }));
    toast.success(`🚚 تم إرسال طلب ${itemIds.length} مادة للمورد`);
  },

  setSelectedFranchisee: (id) => set({ selectedFranchiseeId: id }),

  getSelectedFranchisee: () => {
    const { franchisees, selectedFranchiseeId } = get();
    return franchisees.find((f) => f.id === selectedFranchiseeId) ?? null;
  },

  getPendingCount: () =>
    get().franchisees.filter((f) => f.status === 'pending').length,

  getLowStockCount: () =>
    get().stock.filter((s) => s.status === 'low_stock' || s.status === 'out_of_stock').length,
}));
