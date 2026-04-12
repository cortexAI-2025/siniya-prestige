import { create } from 'zustand';
import toast from 'react-hot-toast';
import { Franchisee, StockItem } from '../types';
import {
  MOCK_FRANCHISEES,
  MOCK_STOCK,
  MOCK_KPIS,
  MOCK_REVENUE,
  MOROCCO_CITIES,
} from '../constants/mockData';

interface AdminStore {
  franchisees: Franchisee[];
  stock: StockItem[];
  kpis: typeof MOCK_KPIS;
  revenue: typeof MOCK_REVENUE;
  cities: typeof MOROCCO_CITIES;
  isLoading: boolean;
  selectedFranchiseeId: string | null;

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
  kpis: MOCK_KPIS,
  revenue: MOCK_REVENUE,
  cities: MOROCCO_CITIES,
  isLoading: false,
  selectedFranchiseeId: null,

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
