import {
  Franchisee, StockItem, CityStats, RevenueDataPoint, KPI,
  AdminMenuItem, MenuCategory, StaffMember, RestaurantHours,
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

// ─── Menu Categories ──────────────────────────────────────────────────────────
export const MOCK_MENU_CATEGORIES: MenuCategory[] = [
  { id: 'starters', nameAr: 'المقبلات', nameFr: 'Entrées', icon: '🥗', order: 1 },
  { id: 'mains', nameAr: 'الأطباق الرئيسية', nameFr: 'Plats principaux', icon: '🍖', order: 2 },
  { id: 'tajines', nameAr: 'الطاجين', nameFr: 'Tajines', icon: '🫕', order: 3 },
  { id: 'burgers', nameAr: 'البرغر', nameFr: 'Burgers', icon: '🍔', order: 4 },
  { id: 'pasta', nameAr: 'المعكرونة', nameFr: 'Pâtes', icon: '🍝', order: 5 },
  { id: 'wraps', nameAr: 'الرول', nameFr: 'Wraps & Tacos', icon: '🌯', order: 6 },
  { id: 'sides', nameAr: 'الأطباق الجانبية', nameFr: 'Accompagnements', icon: '🍟', order: 7 },
  { id: 'desserts', nameAr: 'الحلويات', nameFr: 'Desserts', icon: '🍰', order: 8 },
  { id: 'drinks', nameAr: 'المشروبات', nameFr: 'Boissons', icon: '🥤', order: 9 },
];

// ─── Menu Items ───────────────────────────────────────────────────────────────
export const MOCK_MENU_ITEMS: AdminMenuItem[] = [
  { id: 'item1', nameAr: 'سلطة الأفوكادو والجمبري', nameFr: 'Salade Avocat & Crevettes', descriptionAr: 'سلطة طازجة بالجمبري وشرائح الأفوكادو الكريمية', price: 85, categoryId: 'starters', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', isAvailable: true, isFeatured: true, tags: ['صحي', 'خفيف'], preparationTime: 10, allergens: ['crustacés'] },
  { id: 'item2', nameAr: 'مقبلات المعلق', nameFr: 'Assortiment Marocain', descriptionAr: 'تشكيلة من المقبلات المغربية الأصيلة: الزعلوك، التكتوكة والبيصارة', price: 65, categoryId: 'starters', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop', isAvailable: true, isFeatured: false, tags: ['مغربي', 'تقليدي'], preparationTime: 8, allergens: [] },
  { id: 'item3', nameAr: 'شريحة لحم بصوص الفلفل', nameFr: 'Steak Sauce Poivre', descriptionAr: 'شريحة لحم بقري فاخر مطهوة على درجة مثالية', price: 190, categoryId: 'mains', image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop', isAvailable: true, isFeatured: true, tags: ['لحم بقري', 'فاخر'], preparationTime: 20, allergens: ['lactose'] },
  { id: 'item4', nameAr: 'طاجين الدجاج بالزيتون', nameFr: 'Tajine Poulet aux Olives', descriptionAr: 'طاجين دجاج مغربي أصيل بالزيتون والليمون المعصفر', price: 120, categoryId: 'tajines', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', isAvailable: true, isFeatured: true, tags: ['مغربي', 'تقليدي'], preparationTime: 30, allergens: [] },
  { id: 'item5', nameAr: 'طاجين كفتة بالبيض', nameFr: 'Tajine Kefta aux Œufs', descriptionAr: 'كفتة لحم مفروم بالبهارات المغربية مع بيض طازج', price: 95, categoryId: 'tajines', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', isAvailable: true, isFeatured: false, tags: ['مغربي'], preparationTime: 25, allergens: ['oeufs'] },
  { id: 'item6', nameAr: 'البرغر المغربي الفاخر', nameFr: 'Burger Marocain Premium', descriptionAr: 'لحم بقري مشوي مع تتبيلة الأطلسي الخاصة', price: 85, categoryId: 'burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', isAvailable: true, isFeatured: true, tags: ['برغر', 'لحم بقري'], preparationTime: 15, allergens: ['gluten', 'lactose'] },
  { id: 'item7', nameAr: 'برغر الدجاج المقرمش', nameFr: 'Burger Poulet Croustillant', descriptionAr: 'دجاج مقرمش مع صلصة الثوم والأعشاب', price: 70, categoryId: 'burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop', isAvailable: true, isFeatured: false, tags: ['برغر', 'دجاج'], preparationTime: 12, allergens: ['gluten'] },
  { id: 'item8', nameAr: 'مكرونة الترافل الأسود', nameFr: 'Pâtes Truffe Noire', descriptionAr: 'معكرونة فيتوشيني بصلصة الكريمة والترافل الأسود', price: 130, categoryId: 'pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop', isAvailable: true, isFeatured: true, tags: ['إيطالي', 'كريمي'], preparationTime: 18, allergens: ['gluten', 'lactose'] },
  { id: 'item9', nameAr: 'شاورما الدجاج المغربية', nameFr: 'Shawarma Poulet Marocain', descriptionAr: 'شاورما دجاج متبلة بأجود البهارات المغربية', price: 190, categoryId: 'wraps', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop', isAvailable: true, isFeatured: true, tags: ['شاورما', 'دجاج'], preparationTime: 15, allergens: ['gluten'] },
  { id: 'item10', nameAr: 'تاكوس المغرب', nameFr: 'Tacos du Maroc', descriptionAr: 'تاكوس ضخم محشو بلحم البقر المفروم', price: 130, categoryId: 'wraps', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop', isAvailable: true, isFeatured: true, tags: ['تاكوس'], preparationTime: 12, allergens: ['gluten'] },
  { id: 'item11', nameAr: 'البطاطس المقلية بالتوابل', nameFr: 'Frites Épicées', descriptionAr: 'بطاطس مقلية ذهبية متبلة بمزيج بهارات البيرير', price: 45, categoryId: 'sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', isAvailable: true, isFeatured: false, tags: ['بطاطس'], preparationTime: 8, allergens: [] },
  { id: 'item12', nameAr: 'تارت التوت البري', nameFr: 'Tarte Fruits Rouges', descriptionAr: 'تارت كريمي بالتوت البري الطازج', price: 55, categoryId: 'desserts', image: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400&h=300&fit=crop', isAvailable: true, isFeatured: true, tags: ['حلو', 'طازج'], preparationTime: 5, allergens: ['gluten', 'lactose', 'oeufs'] },
  { id: 'item13', nameAr: 'كنافة بالقشطة', nameFr: 'Kunafa à la Crème', descriptionAr: 'كنافة مغربية بالقشطة الطازجة والعسل الطبيعي', price: 50, categoryId: 'desserts', image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&h=300&fit=crop', isAvailable: true, isFeatured: false, tags: ['مغربي', 'تقليدي'], preparationTime: 8, allergens: ['gluten', 'lactose'] },
  { id: 'item14', nameAr: 'عصير المانجو الطازج', nameFr: 'Jus de Mangue Frais', descriptionAr: 'عصير مانجو طبيعي 100% بدون إضافات', price: 35, categoryId: 'drinks', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop', isAvailable: true, isFeatured: false, tags: ['عصير', 'طازج'], preparationTime: 3, allergens: [] },
  { id: 'item15', nameAr: 'أتاي المغربي', nameFr: 'Thé à la Menthe', descriptionAr: 'الشاي المغربي الأصيل بالنعناع الطازج', price: 25, categoryId: 'drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop', isAvailable: true, isFeatured: false, tags: ['شاي', 'تقليدي'], preparationTime: 5, allergens: [] },
];

// ─── Staff ────────────────────────────────────────────────────────────────────
export const MOCK_STAFF: StaffMember[] = [
  { id: 'st001', restaurantId: 'fr001', name: 'Karim Boulahiane', nameAr: 'كريم بولهيان', role: 'manager', phone: '+212 661 100 001', hireDate: new Date('2024-01-20'), isActive: true, avatar: 'KB' },
  { id: 'st002', restaurantId: 'fr001', name: 'Yassine El Amrani', nameAr: 'ياسين العمراني', role: 'chef', phone: '+212 661 100 002', hireDate: new Date('2024-01-20'), isActive: true, avatar: 'YA' },
  { id: 'st003', restaurantId: 'fr001', name: 'Sara Benchekroun', nameAr: 'سارة بنشقرون', role: 'server', phone: '+212 661 100 003', hireDate: new Date('2024-02-01'), isActive: true, avatar: 'SB' },
  { id: 'st004', restaurantId: 'fr001', name: 'Hamid Ouali', nameAr: 'حميد أوالي', role: 'cashier', phone: '+212 661 100 004', hireDate: new Date('2024-02-01'), isActive: true, avatar: 'HO' },
  { id: 'st005', restaurantId: 'fr001', name: 'Nadia Lahrichi', nameAr: 'نادية لحريشي', role: 'server', phone: '+212 661 100 005', hireDate: new Date('2024-03-01'), isActive: false, avatar: 'NL' },
  { id: 'st006', restaurantId: 'fr002', name: 'Omar Benjelloun', nameAr: 'عمر بنجلون', role: 'manager', phone: '+212 661 200 001', hireDate: new Date('2024-02-14'), isActive: true, avatar: 'OB' },
  { id: 'st007', restaurantId: 'fr002', name: 'Houda Chraibi', nameAr: 'هدى الشرايبي', role: 'chef', phone: '+212 661 200 002', hireDate: new Date('2024-02-14'), isActive: true, avatar: 'HC' },
  { id: 'st008', restaurantId: 'fr002', name: 'Amine Bakkali', nameAr: 'أمين البقالي', role: 'server', phone: '+212 661 200 003', hireDate: new Date('2024-03-01'), isActive: true, avatar: 'AB' },
  { id: 'st009', restaurantId: 'fr003', name: 'Fatine Sekkouri', nameAr: 'فاتن السكوري', role: 'manager', phone: '+212 661 300 001', hireDate: new Date('2024-02-25'), isActive: true, avatar: 'FS' },
  { id: 'st010', restaurantId: 'fr003', name: 'Mehdi Talbi', nameAr: 'مهدي الطالبي', role: 'chef', phone: '+212 661 300 002', hireDate: new Date('2024-02-25'), isActive: true, avatar: 'MT' },
  { id: 'st011', restaurantId: 'fr003', name: 'Chaimae Nejjar', nameAr: 'شيماء النجار', role: 'barista', phone: '+212 661 300 003', hireDate: new Date('2024-03-05'), isActive: true, avatar: 'CN' },
  { id: 'st012', restaurantId: 'fr004', name: 'Soufiane Idrissi', nameAr: 'سفيان الإدريسي', role: 'manager', phone: '+212 661 400 001', hireDate: new Date('2024-03-10'), isActive: true, avatar: 'SI' },
  { id: 'st013', restaurantId: 'fr004', name: 'Widad Amzil', nameAr: 'وداد أمزيل', role: 'chef', phone: '+212 661 400 002', hireDate: new Date('2024-03-10'), isActive: true, avatar: 'WA' },
  { id: 'st014', restaurantId: 'fr005', name: 'Khalid Oulhaj', nameAr: 'خالد أولحاج', role: 'manager', phone: '+212 661 500 001', hireDate: new Date('2024-04-08'), isActive: true, avatar: 'KO' },
  { id: 'st015', restaurantId: 'fr005', name: 'Imane Berrada', nameAr: 'إيمان برادة', role: 'barista', phone: '+212 661 500 002', hireDate: new Date('2024-04-08'), isActive: true, avatar: 'IB' },
];

// ─── Opening Hours ────────────────────────────────────────────────────────────
const defaultWeekSchedule = {
  monday:    { isOpen: true, openTime: '09:00', closeTime: '23:00' },
  tuesday:   { isOpen: true, openTime: '09:00', closeTime: '23:00' },
  wednesday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
  thursday:  { isOpen: true, openTime: '09:00', closeTime: '23:00' },
  friday:    { isOpen: true, openTime: '09:00', closeTime: '00:00' },
  saturday:  { isOpen: true, openTime: '09:00', closeTime: '00:00' },
  sunday:    { isOpen: true, openTime: '10:00', closeTime: '22:00' },
};

export const MOCK_RESTAURANT_HOURS: RestaurantHours[] = [
  { restaurantId: 'fr001', schedule: { ...defaultWeekSchedule, friday: { isOpen: true, openTime: '09:00', closeTime: '00:30' }, saturday: { isOpen: true, openTime: '09:00', closeTime: '00:30' } } },
  { restaurantId: 'fr002', schedule: { ...defaultWeekSchedule, monday: { isOpen: true, openTime: '10:00', closeTime: '22:00' }, sunday: { isOpen: false, openTime: '10:00', closeTime: '22:00' } } },
  { restaurantId: 'fr003', schedule: { ...defaultWeekSchedule, friday: { isOpen: true, openTime: '09:00', closeTime: '01:00' }, saturday: { isOpen: true, openTime: '09:00', closeTime: '01:00' } } },
  { restaurantId: 'fr004', schedule: { ...defaultWeekSchedule, sunday: { isOpen: false, openTime: '10:00', closeTime: '22:00' } } },
  { restaurantId: 'fr005', schedule: defaultWeekSchedule },
];

