// ─── Menu Types ───────────────────────────────────────────────────────────────

export interface Extra {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
}

export interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  extras: Extra[];
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
}

export interface ChefCollection {
  id: string;
  nameAr: string;
  nameEn: string;
  image: string;
  itemCount: number;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedExtras: Extra[];
  note?: string;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  restaurantId: string | null;
  orderType: 'dine_in' | 'takeaway' | null;
  tableId?: string;
}

// ─── Order Types ──────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'wallet';

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  status: OrderStatus;
  orderType: 'dine_in' | 'takeaway';
  tableId?: string;
  subtotal: number;
  tip: number;
  total: number;
  paymentMethod: PaymentMethod;
  loyaltyPointsEarned: number;
  franchiseFee: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── User Types ───────────────────────────────────────────────────────────────

export interface LoyaltyAccount {
  userId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  totalOrders: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;
  loyaltyAccount: LoyaltyAccount;
  favoriteItems: string[];
  addresses: Address[];
  role: 'customer' | 'franchisee' | 'admin';
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  isDefault: boolean;
}

// ─── Restaurant / Franchise Types ─────────────────────────────────────────────

export interface Restaurant {
  id: string;
  nameAr: string;
  nameEn: string;
  address: string;
  size: '60m2' | '100m2';
  franchiseeId: string;
  latitude: number;
  longitude: number;
  phone: string;
  openingHours: string;
  isOpen: boolean;
}

export interface FranchiseStats {
  restaurantId: string;
  dailyRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  franchiseFeeOwed: number;
  netProfit: number;
}

export interface FranchiseeOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
  orderType: 'dine_in' | 'takeaway';
  tableId?: string;
}

// ─── Payment Types ────────────────────────────────────────────────────────────

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
}

export interface TipOption {
  id: string;
  label: string;
  percentage?: number;
  isCustom: boolean;
}

// ─── Navigation Types ─────────────────────────────────────────────────────────

export type RootStackParamList = {
  Main: undefined;
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  ProductDetail: { itemId: string };
  FranchiseDashboard: undefined;
  Auth: undefined;
};

export type BottomTabParamList = {
  Menu: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};
