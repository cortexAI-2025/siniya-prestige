import {
  Franchisee, StockItem, CityStats, RevenueDataPoint, KPI,
} from '../types';

// ─── KPIs ────────────────────────────────────────────────────────────────────
export const MOCK_KPIS: KPI[] = [
  { id: 'k1', labelAr: 'رقم الأعمال الشهري', labelFr: 'CA Mensuel', value: 1275000, change: 12.4, changeType: 'increase', icon: '📈', unit: 'MAD', color: 'emerald' },
  { id: 'k2', labelAr: 'إجمالي الطلبات', labelFr: 'Total Commandes', value: 8420, change: 8.1, changeType: 'increase', icon: '🛍️', unit: '', color: 'gold' },
  { id: 'k3', labelAr: 'الفرانشايز النشطة', labelFr: 'Franchisés Actifs', value: 24, change: 3, changeType: 'increase', icon: '🏪', unit: '', color: 'blue' },
  { id: 'k4', labelAr: 'ريع الفرانشايز', labelFr: 'Redevances', value: 63750, change: 11.9, changeType: 'increase', icon: '💰', unit: 'MAD', color: 'purple' },
  { id: 'k6', labelAr: 'طلبات معلقة الموافقة', labelFr: 'En attente approbation', value: 7, change: 2, changeType: 'increase', icon: '⏳', unit: '', color: 'red' },
];

// ─── Revenue Chart ────────────────────────────────────────────────────────────
export const MOCK_REVENUE: RevenueDataPoint[] = [
  { month: 'يناير', revenue: 780000, orders: 5200, franchiseFees: 39000 },
  { month: 'فبراير', revenue: 820000, orders: 5480, franchiseFees: 41000 },
  { month: 'مارس', revenue: 960000, orders: 6400, franchiseFees: 48000 },
  { month: 'أبريل', revenue: 1050000, orders: 7000, franchiseFees: 52500 },
  { month: 'مايو', revenue: 1120000, orders: 7470, franchiseFees: 56000 },
  { month: 'يونيو', revenue: 1180000, orders: 7870, franchiseFees: 59000 },
  { month: 'يوليوز', revenue: 1090000, orders: 7250, franchiseFees: 54500 },
  { month: 'غشت', revenue: 1150000, orders: 7660, franchiseFees: 57500 },
  { month: 'شتنبر', revenue: 1200000, orders: 8000, franchiseFees: 60000 },
  { month: 'أكتوبر', revenue: 1220000, orders: 8130, franchiseFees: 61000 },
  { month: 'نونبر', revenue: 1250000, orders: 8330, franchiseFees: 62500 },
  { month: 'دجنبر', revenue: 1275000, orders: 8420, franchiseFees: 63750 },
];

// ─── Cities / Heatmap ────────────────────────────────────────────────────────
export const MOROCCO_CITIES: CityStats[] = [
  { id: 'casa', name: 'Casablanca', nameAr: 'الدار البيضاء', lat: 33.5731, lng: -7.5898, revenue: 485000, orders: 3200, growth: 14.2, franchiseeCount: 6, avgOrderValue: 151.5, intensity: 1.0 },
  { id: 'rabat', name: 'Rabat', nameAr: 'الرباط', lat: 33.9716, lng: -6.8498, revenue: 198000, orders: 1320, growth: 10.5, franchiseeCount: 3, avgOrderValue: 150, intensity: 0.7 },
  { id: 'marrakech', name: 'Marrakech', nameAr: 'مراكش', lat: 31.6295, lng: -7.9811, revenue: 175000, orders: 1160, growth: 18.3, franchiseeCount: 3, avgOrderValue: 150.8, intensity: 0.65 },
  { id: 'fes', name: 'Fès', nameAr: 'فاس', lat: 34.0181, lng: -5.0078, revenue: 142000, orders: 950, growth: 9.1, franchiseeCount: 2, avgOrderValue: 149.4, intensity: 0.55 },
  { id: 'agadir', name: 'Agadir', nameAr: 'أكادير', lat: 30.4278, lng: -9.5981, revenue: 95000, orders: 630, growth: 22.8, franchiseeCount: 2, avgOrderValue: 150.7, intensity: 0.4 },
  { id: 'tanger', name: 'Tanger', nameAr: 'طنجة', lat: 35.7595, lng: -5.8340, revenue: 88000, orders: 585, growth: 16.4, franchiseeCount: 2, avgOrderValue: 150.4, intensity: 0.38 },
  { id: 'meknes', name: 'Meknès', nameAr: 'مكناس', lat: 33.8935, lng: -5.5473, revenue: 52000, orders: 345, growth: 7.2, franchiseeCount: 1, avgOrderValue: 150.7, intensity: 0.25 },
  { id: 'oujda', name: 'Oujda', nameAr: 'وجدة', lat: 34.6867, lng: -1.9114, revenue: 40000, orders: 265, growth: 5.5, franchiseeCount: 1, avgOrderValue: 150.9, intensity: 0.2 },
];

// ─── Franchisees ──────────────────────────────────────────────────────────────
export const MOCK_FRANCHISEES: Franchisee[] = [
  { id: 'fr001', name: 'Mohammed Alaoui', nameAr: 'محمد العلوي', email: 'alaoui@siniya.ma', phone: '+212 600 123 456', city: 'Casablanca', cityAr: 'الدار البيضاء', address: 'شارع محمد الخامس، الدار البيضاء', localSize: '100m2', status: 'approved', appliedAt: new Date('2024-01-15'), approvedAt: new Date('2024-01-20'), monthlyRevenue: 85000, totalRevenue: 980000, totalOrders: 6530, franchiseFeeOwed: 4250, franchiseeFeePaid: 4000, score: 94, avatar: 'MA', cin: 'BK789123', rc: 'RC-CASA-45231' },
  { id: 'fr002', name: 'Fatima Zahra Benali', nameAr: 'فاطمة الزهراء بنعلي', email: 'benali@siniya.ma', phone: '+212 600 234 567', city: 'Rabat', cityAr: 'الرباط', address: 'شارع أبو عبيدة، أكدال، الرباط', localSize: '60m2', status: 'approved', appliedAt: new Date('2024-02-10'), approvedAt: new Date('2024-02-14'), monthlyRevenue: 66000, totalRevenue: 720000, totalOrders: 4800, franchiseFeeOwed: 3300, franchiseeFeePaid: 3300, score: 88, avatar: 'FZ', cin: 'AA234567', rc: 'RC-RAB-32145' },
  { id: 'fr003', name: 'Youssef El Mansouri', nameAr: 'يوسف المنصوري', email: 'mansouri@siniya.ma', phone: '+212 600 345 678', city: 'Marrakech', cityAr: 'مراكش', address: 'شارع محمد السادس، جليز، مراكش', localSize: '100m2', status: 'approved', appliedAt: new Date('2024-02-20'), approvedAt: new Date('2024-02-25'), monthlyRevenue: 58000, totalRevenue: 640000, totalOrders: 4260, franchiseFeeOwed: 2900, franchiseeFeePaid: 2900, score: 91, avatar: 'YM', cin: 'W456789', rc: 'RC-MAR-28967' },
  { id: 'fr004', name: 'Khadija Tazi', nameAr: 'خديجة الطازي', email: 'tazi.k@siniya.ma', phone: '+212 600 456 789', city: 'Fès', cityAr: 'فاس', address: 'شارع الحسن الثاني، فاس الجديد', localSize: '60m2', status: 'approved', appliedAt: new Date('2024-03-05'), approvedAt: new Date('2024-03-10'), monthlyRevenue: 47000, totalRevenue: 498000, totalOrders: 3320, franchiseFeeOwed: 2350, franchiseeFeePaid: 2000, score: 79, avatar: 'KT', cin: 'N678901', rc: 'RC-FES-19823' },
  { id: 'fr005', name: 'Omar Chaoui', nameAr: 'عمر الشاوي', email: 'chaoui@siniya.ma', phone: '+212 600 567 890', city: 'Agadir', cityAr: 'أكادير', address: 'شارع الأمير سيدي محمد، أكادير', localSize: '100m2', status: 'approved', appliedAt: new Date('2024-04-01'), approvedAt: new Date('2024-04-08'), monthlyRevenue: 48000, totalRevenue: 430000, totalOrders: 2870, franchiseFeeOwed: 2400, franchiseeFeePaid: 2400, score: 85, avatar: 'OC', cin: 'JH890123', rc: 'RC-AGA-15674' },
  { id: 'fr006', name: 'Hasnae Benkirane', nameAr: 'حسناء بنكيران', email: 'benkirane@gmail.com', phone: '+212 600 678 901', city: 'Tanger', cityAr: 'طنجة', address: 'شارع محمد السادس، طنجة المدينة', localSize: '60m2', status: 'pending', appliedAt: new Date('2025-01-10'), monthlyRevenue: 0, totalRevenue: 0, totalOrders: 0, franchiseFeeOwed: 0, franchiseeFeePaid: 0, score: 0, avatar: 'HB', cin: 'TN123456', rc: 'RC-TNG-PENDING' },
  { id: 'fr007', name: 'Rachid Squalli', nameAr: 'رشيد السقلي', email: 'squalli@gmail.com', phone: '+212 600 789 012', city: 'Casablanca', cityAr: 'الدار البيضاء', address: 'شارع أنفا، عين الذياب، الدار البيضاء', localSize: '100m2', status: 'pending', appliedAt: new Date('2025-01-12'), monthlyRevenue: 0, totalRevenue: 0, totalOrders: 0, franchiseFeeOwed: 0, franchiseeFeePaid: 0, score: 0, avatar: 'RS', cin: 'BJ456789', rc: 'RC-CASA-PENDING' },
  { id: 'fr008', name: 'Zineb Lahlou', nameAr: 'زينب لحلو', email: 'lahlou@gmail.com', phone: '+212 600 890 123', city: 'Rabat', cityAr: 'الرباط', address: 'حي الرياض، الرباط', localSize: '60m2', status: 'pending', appliedAt: new Date('2025-01-14'), monthlyRevenue: 0, totalRevenue: 0, totalOrders: 0, franchiseFeeOwed: 0, franchiseeFeePaid: 0, score: 0, avatar: 'ZL', cin: 'AA567890', rc: 'RC-RAB-PENDING' },
  { id: 'fr009', name: 'Amine Filali', nameAr: 'أمين الفيلالي', email: 'filali.a@gmail.com', phone: '+212 600 901 234', city: 'Meknès', cityAr: 'مكناس', address: 'شارع علال الفاسي، مكناس', localSize: '60m2', status: 'rejected', appliedAt: new Date('2024-12-01'), monthlyRevenue: 0, totalRevenue: 0, totalOrders: 0, franchiseFeeOwed: 0, franchiseeFeePaid: 0, score: 0, avatar: 'AF', cin: 'EE012345', rc: 'RC-MEK-REJ' },
];

// ─── Stock Items ──────────────────────────────────────────────────────────────
export const MOCK_STOCK: StockItem[] = [
  { id: 's1', nameAr: 'رأس الحانوت', nameFr: 'Ras El Hanout', category: 'spices', unit: 'kg', currentStock: 45, minStock: 20, maxStock: 100, unitCost: 180, supplier: 'Épices Atlas SARL', status: 'in_stock', lastOrderDate: new Date('2025-01-01'), monthlyConsumption: 30 },
  { id: 's2', nameAr: 'الكمون', nameFr: 'Cumin', category: 'spices', unit: 'kg', currentStock: 8, minStock: 15, maxStock: 60, unitCost: 85, supplier: 'Épices Atlas SARL', status: 'low_stock', lastOrderDate: new Date('2024-12-20'), nextDelivery: new Date('2025-01-18'), monthlyConsumption: 20 },
  { id: 's3', nameAr: 'الكركم', nameFr: 'Curcuma', category: 'spices', unit: 'kg', currentStock: 0, minStock: 10, maxStock: 40, unitCost: 120, supplier: 'Épices Atlas SARL', status: 'out_of_stock', lastOrderDate: new Date('2024-12-15'), nextDelivery: new Date('2025-01-17'), monthlyConsumption: 12 },
  { id: 's4', nameAr: 'الزعفران', nameFr: 'Safran', category: 'spices', unit: 'g', currentStock: 350, minStock: 100, maxStock: 500, unitCost: 45, supplier: 'Safran Taliouine', status: 'in_stock', lastOrderDate: new Date('2025-01-05'), monthlyConsumption: 150 },
  { id: 's5', nameAr: 'الفلفل الأحمر', nameFr: 'Paprika', category: 'spices', unit: 'kg', currentStock: 18, minStock: 15, maxStock: 50, unitCost: 65, supplier: 'Épices Atlas SARL', status: 'in_stock', lastOrderDate: new Date('2025-01-01'), monthlyConsumption: 16 },
  { id: 's6', nameAr: 'علب الطعام الورقية', nameFr: 'Boîtes carton Siniya', category: 'packaging', unit: 'unité', currentStock: 1200, minStock: 500, maxStock: 5000, unitCost: 4.5, supplier: 'PackMa Maroc', status: 'in_stock', lastOrderDate: new Date('2025-01-03'), monthlyConsumption: 800 },
  { id: 's7', nameAr: 'أكياس الشعار', nameFr: 'Sacs logo Siniya', category: 'packaging', unit: 'unité', currentStock: 450, minStock: 300, maxStock: 2000, unitCost: 2.8, supplier: 'PackMa Maroc', status: 'in_stock', lastOrderDate: new Date('2025-01-03'), monthlyConsumption: 600 },
  { id: 's8', nameAr: 'الأطباق الورقية الفاخرة', nameFr: 'Assiettes prestige', category: 'packaging', unit: 'unité', currentStock: 280, minStock: 400, maxStock: 2000, unitCost: 6.5, supplier: 'PackMa Maroc', status: 'low_stock', lastOrderDate: new Date('2025-01-08'), nextDelivery: new Date('2025-01-19'), monthlyConsumption: 500 },
  { id: 's9', nameAr: 'زيت الزيتون البكر', nameFr: 'Huile d\'olive extra vierge', category: 'ingredients', unit: 'L', currentStock: 85, minStock: 40, maxStock: 200, unitCost: 55, supplier: 'Huilerie du Maroc', status: 'in_stock', lastOrderDate: new Date('2025-01-02'), monthlyConsumption: 60 },
  { id: 's10', nameAr: 'العسل الطبيعي', nameFr: 'Miel naturel', category: 'ingredients', unit: 'kg', currentStock: 22, minStock: 10, maxStock: 50, unitCost: 95, supplier: 'Miel Atlas', status: 'in_stock', lastOrderDate: new Date('2025-01-02'), monthlyConsumption: 15 },
  { id: 's11', nameAr: 'خبز مغربي (دقيق)', nameFr: 'Farine khobz', category: 'ingredients', unit: 'kg', currentStock: 12, minStock: 30, maxStock: 150, unitCost: 8, supplier: 'Meunerie Nationale', status: 'low_stock', lastOrderDate: new Date('2025-01-09'), nextDelivery: new Date('2025-01-16'), monthlyConsumption: 80 },
  { id: 's12', nameAr: 'مناديل سينيا', nameFr: 'Serviettes logo', category: 'packaging', unit: 'unité', currentStock: 3500, minStock: 1000, maxStock: 10000, unitCost: 0.8, supplier: 'PackMa Maroc', status: 'in_stock', lastOrderDate: new Date('2025-01-03'), monthlyConsumption: 2000 },
];

