// ─── Franchisee ───────────────────────────────────────────────────────────────
export type FranchiseeStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type LocalSize = '60m2' | '100m2';

export interface Franchisee {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  city: string;
  cityAr: string;
  address: string;
  localSize: LocalSize;
  status: FranchiseeStatus;
  appliedAt: Date;
  approvedAt?: Date;
  monthlyRevenue: number;
  totalRevenue: number;
  totalOrders: number;
  franchiseFeeOwed: number;
  franchiseeFeePaid: number;
  score: number; // 0-100 performance score
  avatar: string;
  cin: string;
  rc: string; // Registre de Commerce
}

// ─── Stock / Centrale d'Achat ─────────────────────────────────────────────────
export type StockCategory = 'spices' | 'packaging' | 'ingredients' | 'equipment' | 'cleaning';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'ordered';

export interface StockItem {
  id: string;
  nameAr: string;
  nameFr: string;
  category: StockCategory;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  supplier: string;
  status: StockStatus;
  lastOrderDate: Date;
  nextDelivery?: Date;
  monthlyConsumption: number;
  image?: string;
}

export interface StockOrder {
  id: string;
  items: { itemId: string; quantity: number; unitCost: number }[];
  supplier: string;
  status: 'draft' | 'sent' | 'confirmed' | 'delivered';
  totalAmount: number;
  createdAt: Date;
  deliveryDate?: Date;
}

// ─── Sales / Heatmap ──────────────────────────────────────────────────────────
export interface CityStats {
  id: string;
  name: string;
  nameAr: string;
  lat: number;
  lng: number;
  revenue: number;
  orders: number;
  growth: number; // % vs last month
  franchiseeCount: number;
  avgOrderValue: number;
  intensity: number; // 0-1 for heatmap
}

// ─── Dashboard KPIs ───────────────────────────────────────────────────────────
export interface KPI {
  id: string;
  labelAr: string;
  labelFr: string;
  value: number | string;
  change: number; // % change
  changeType: 'increase' | 'decrease';
  icon: string;
  unit?: string;
  color: 'emerald' | 'gold' | 'blue' | 'purple' | 'red';
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  orders: number;
  franchiseFees: number;
}

// ─── Menu Management ──────────────────────────────────────────────────────────
export interface MenuCategory {
  id: string;
  nameAr: string;
  nameFr: string;
  icon: string;
  order: number;
}

export interface AdminMenuItem {
  id: string;
  nameAr: string;
  nameFr: string;
  descriptionAr: string;
  price: number;
  categoryId: string;
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
  tags: string[];
  preparationTime: number; // minutes
  allergens: string[];
}

// ─── Staff ────────────────────────────────────────────────────────────────────
export type StaffRole = 'manager' | 'chef' | 'server' | 'cashier' | 'barista' | 'delivery';

export interface StaffMember {
  id: string;
  restaurantId: string; // matches franchisee id
  name: string;
  nameAr: string;
  role: StaffRole;
  phone: string;
  email?: string;
  hireDate: Date;
  isActive: boolean;
  avatar: string;
}

// ─── Opening Hours ────────────────────────────────────────────────────────────
export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface RestaurantHours {
  restaurantId: string;
  schedule: Record<WeekDay, DaySchedule>;
}

// ─── Admin User ───────────────────────────────────────────────────────────────
export interface AdminUser {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  role: 'super_admin' | 'operations' | 'finance';
  avatar: string;
}
