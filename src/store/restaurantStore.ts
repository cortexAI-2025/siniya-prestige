import { create } from 'zustand';
import { Restaurant, FranchiseStats, FranchiseeOrder, StaffMember, WeekDay, DaySchedule } from '../types';
import { RESTAURANTS } from '../constants/mockData';

interface RestaurantHours {
  restaurantId: string;
  schedule: Record<WeekDay, DaySchedule>;
}

interface RestaurantStore {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  nearestRestaurant: Restaurant | null;
  franchiseStats: FranchiseStats | null;
  liveOrders: FranchiseeOrder[];
  isLoadingOrders: boolean;
  staff: StaffMember[];
  restaurantHours: RestaurantHours | null;

  setSelectedRestaurant: (restaurant: Restaurant) => void;
  setNearestRestaurant: (restaurant: Restaurant) => void;
  fetchFranchiseStats: (restaurantId: string) => Promise<void>;
  fetchLiveOrders: (restaurantId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: FranchiseeOrder['status']) => void;
  toggleStaffActive: (staffId: string) => void;
  addStaffMember: (member: StaffMember) => void;
  updateRestaurantHours: (restaurantId: string, schedule: Record<WeekDay, DaySchedule>) => void;
  updateRestaurantInfo: (restaurantId: string, info: Partial<Pick<Restaurant, 'phone' | 'openingHours'>>) => void;
}

const generateMockStats = (restaurantId: string): FranchiseStats => ({
  restaurantId,
  dailyRevenue: 4250,
  monthlyRevenue: 127500,
  totalOrders: 842,
  pendingOrders: 3,
  franchiseFeeOwed: 6375,
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

const MOCK_STAFF: StaffMember[] = [
  { id: 's1', restaurantId: 'r1', name: 'Karim Benali', nameAr: 'كريم بنعلي', role: 'manager', phone: '+212 661 234 567', isActive: true, avatar: 'ك', hireDate: new Date('2023-01-15') },
  { id: 's2', restaurantId: 'r1', name: 'Youssef Alami', nameAr: 'يوسف العلمي', role: 'chef', phone: '+212 662 345 678', isActive: true, avatar: 'ي', hireDate: new Date('2023-03-10') },
  { id: 's3', restaurantId: 'r1', name: 'Fatima Zahra', nameAr: 'فاطمة الزهراء', role: 'server', phone: '+212 663 456 789', isActive: true, avatar: 'ف', hireDate: new Date('2023-06-20') },
  { id: 's4', restaurantId: 'r1', name: 'Omar Tazi', nameAr: 'عمر الطازي', role: 'cashier', phone: '+212 664 567 890', isActive: true, avatar: 'ع', hireDate: new Date('2023-08-05') },
  { id: 's5', restaurantId: 'r1', name: 'Hamid Chraibi', nameAr: 'حميد الشرايبي', role: 'barista', phone: '+212 665 678 901', isActive: false, avatar: 'ح', hireDate: new Date('2023-09-14') },
  { id: 's6', restaurantId: 'r1', name: 'Samir Idrissi', nameAr: 'سمير الإدريسي', role: 'delivery', phone: '+212 666 789 012', isActive: true, avatar: 'س', hireDate: new Date('2024-01-08') },
];

const MOCK_HOURS: RestaurantHours = {
  restaurantId: 'r1',
  schedule: {
    monday:    { isOpen: true,  openTime: '09:00', closeTime: '23:00' },
    tuesday:   { isOpen: true,  openTime: '09:00', closeTime: '23:00' },
    wednesday: { isOpen: true,  openTime: '09:00', closeTime: '23:00' },
    thursday:  { isOpen: true,  openTime: '09:00', closeTime: '23:00' },
    friday:    { isOpen: true,  openTime: '12:00', closeTime: '00:00' },
    saturday:  { isOpen: true,  openTime: '10:00', closeTime: '00:00' },
    sunday:    { isOpen: false, openTime: '10:00', closeTime: '22:00' },
  },
};

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  restaurants: RESTAURANTS,
  selectedRestaurant: RESTAURANTS[0],
  nearestRestaurant: RESTAURANTS[0],
  franchiseStats: null,
  liveOrders: [],
  isLoadingOrders: false,
  staff: MOCK_STAFF,
  restaurantHours: MOCK_HOURS,

  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
  setNearestRestaurant: (restaurant) => set({ nearestRestaurant: restaurant }),

  fetchFranchiseStats: async (restaurantId) => {
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

  toggleStaffActive: (staffId) => {
    set((state) => ({
      staff: state.staff.map((s) => s.id === staffId ? { ...s, isActive: !s.isActive } : s),
    }));
  },

  addStaffMember: (member) => {
    set((state) => ({ staff: [...state.staff, member] }));
  },

  updateRestaurantHours: (restaurantId, schedule) => {
    set({ restaurantHours: { restaurantId, schedule } });
  },

  updateRestaurantInfo: (restaurantId, info) => {
    set((state) => ({
      restaurants: state.restaurants.map((r) =>
        r.id === restaurantId ? { ...r, ...info } : r
      ),
      selectedRestaurant: state.selectedRestaurant?.id === restaurantId
        ? { ...state.selectedRestaurant, ...info }
        : state.selectedRestaurant,
    }));
  },
}));
