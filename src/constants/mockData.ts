import { MenuItem, Category, Restaurant, ChefCollection } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all',       nameAr: 'الكل',          nameEn: 'All',           icon: '🍽️' },
  { id: 'caljine',   nameAr: 'الكالجين',       nameEn: 'Caljine',       icon: '🫕' },
  { id: 'nemstilla', nameAr: 'النيمستيلا',     nameEn: 'Nemstilla',     icon: '🥟' },
  { id: 'tridos',    nameAr: 'التريدوس',       nameEn: 'Tridos',        icon: '🌯' },
  { id: 'burgers',   nameAr: 'البرغر البلدي',  nameEn: 'Beldi Burger',  icon: '🍔' },
  { id: 'sides',     nameAr: 'المرافقات',       nameEn: 'Sides',         icon: '🍟' },
];

export const CHEF_COLLECTIONS: ChefCollection[] = [
  {
    id: 'col1',
    nameAr: 'كولكسيون الكالجين',
    nameEn: 'Caljine Collection',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop',
    itemCount: 3,
  },
  {
    id: 'col2',
    nameAr: 'كولكسيون التريدوس',
    nameEn: 'Tridos Collection',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&h=200&fit=crop',
    itemCount: 2,
  },
  {
    id: 'col3',
    nameAr: 'أطباق سينيا',
    nameEn: 'Siniya Specials',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
    itemCount: 4,
  },
  {
    id: 'col4',
    nameAr: 'قائمة سريعة',
    nameEn: 'Quick Menu',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop',
    itemCount: 2,
  },
];

export const MENU_ITEMS: MenuItem[] = [
  // ── Caljine ───────────────────────────────────────────────────────────────
  {
    id: 'item1',
    nameAr: 'الكالجين',
    nameEn: 'Caljine',
    descriptionAr: 'اندماج البيتزا والطاجين. عجينة بتوقيع زيت الزيتون وزعتر الأطلس.',
    descriptionEn: 'La fusion Pizza-Tajine. Pâte signature à l\'huile d\'olive et origan de l\'Atlas.',
    price: 39,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    category: 'caljine',
    isAvailable: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 312,
    tags: ['بقري', 'دجاج', 'سمك'],
    extras: [
      { id: 'e1', nameAr: 'بقري', nameEn: 'Bœuf', price: 0 },
      { id: 'e2', nameAr: 'دجاج', nameEn: 'Poulet', price: 0 },
      { id: 'e3', nameAr: 'سمك', nameEn: 'Poisson', price: 0 },
    ],
  },

  // ── Nemstilla ─────────────────────────────────────────────────────────────
  {
    id: 'item2',
    nameAr: 'النيمستيلا',
    nameEn: 'Nemstilla',
    descriptionAr: 'نيم باستيلا في ورقة مُبَهَّرة. انفجار من الألوان والنكهات.',
    descriptionEn: 'Le Nem Pastilla en feuille épicée infusée. Une explosion de couleurs.',
    price: 10,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
    category: 'nemstilla',
    isAvailable: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 245,
    tags: ['كاري', 'بابريكا', 'فلفل'],
    extras: [
      { id: 'e4', nameAr: 'كاري', nameEn: 'Curry', price: 0 },
      { id: 'e5', nameAr: 'بابريكا', nameEn: 'Paprika', price: 0 },
      { id: 'e6', nameAr: 'فلفل أحمر', nameEn: 'Piment', price: 0 },
    ],
  },

  // ── Tridos ────────────────────────────────────────────────────────────────
  {
    id: 'item3',
    nameAr: 'التريدوس',
    nameEn: 'Tridos',
    descriptionAr: 'رول الطريد التقليدي بحبوب السمسم. يشمل: فريطوس وصلصة خضراء.',
    descriptionEn: 'Le wrap Trid traditionnel aux graines de sésame. Inclus : Fritatoes & Sauce verte.',
    price: 29,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
    category: 'tridos',
    isAvailable: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 198,
    tags: ['سمسم', 'توقيع سينيا', 'فريطوس'],
    extras: [
      { id: 'e7', nameAr: 'سمسم', nameEn: 'Sésame', price: 0 },
      { id: 'e8', nameAr: 'توقيع', nameEn: 'Signature', price: 0 },
    ],
  },

  // ── Beldi Burger ──────────────────────────────────────────────────────────
  {
    id: 'item4',
    nameAr: 'البرغر البلدي',
    nameEn: 'Beldi Burger',
    descriptionAr: 'خبز كامل بزيت الزيتون. كفتة مشوية، خوخ مجفف وفتات اللوز.',
    descriptionEn: 'Pain complet à l\'huile d\'olive. Kefta grillée, pruneaux et éclats d\'amandes.',
    price: 35,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    category: 'burgers',
    isAvailable: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 412,
    tags: ['كفتة', 'زيتون', 'بلدي'],
    extras: [
      { id: 'e9',  nameAr: 'رويال',            nameEn: 'Royal',          price: 0  },
      { id: 'e10', nameAr: 'سمك',              nameEn: 'Poisson',        price: 0  },
      { id: 'e11', nameAr: 'Ma3r9oTower +8',   nameEn: 'Ma3r9oTower',   price: 8  },
    ],
  },

  // ── Ma3r9ocheese ──────────────────────────────────────────────────────────
  {
    id: 'item5',
    nameAr: 'المعرقة بالجبن',
    nameEn: 'Ma3r9ocheese',
    descriptionAr: 'قرصة بطاطس متبلة (12سم) بقلب من الجبن الذائب.',
    descriptionEn: 'Galette de pomme de terre épicée (12cm) avec cœur fondant au fromage.',
    price: 15,
    image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop',
    category: 'sides',
    isAvailable: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 167,
    tags: ['جبن', 'بطاطس', 'مذاب'],
    extras: [
      { id: 'e12', nameAr: 'Cheese-Pull', nameEn: 'Cheese-Pull', price: 0 },
      { id: 'e13', nameAr: 'Solo',        nameEn: 'Solo',        price: 0 },
    ],
  },

  // ── Fritatoes ─────────────────────────────────────────────────────────────
  {
    id: 'item6',
    nameAr: 'الفريطوس',
    nameEn: 'Fritatoes',
    descriptionAr: 'فريتات موجية (Crinkle Cut) بتوليفة التوابل الأربعة السرية لسينيا.',
    descriptionEn: 'Frites ondulées (Crinkle Cut) aux 4 épices secrètes Siniya.',
    price: 10,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    category: 'sides',
    isAvailable: true,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 289,
    tags: ['بطاطس', 'توابل', 'كريسبي'],
    extras: [
      { id: 'e14', nameAr: 'Chips',  nameEn: 'Chips',  price: 0 },
      { id: 'e15', nameAr: 'Spices', nameEn: 'Spices', price: 0 },
    ],
  },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'rest1',
    nameAr: 'سينيا بريستيج - الدار البيضاء المركز',
    nameEn: 'Siniya Prestige - Casablanca Center',
    address: 'شارع محمد الخامس، الدار البيضاء',
    size: '100m2',
    franchiseeId: 'fr001',
    latitude: 33.5731,
    longitude: -7.5898,
    phone: '+212 522 123 456',
    openingHours: '09:00 - 23:00',
    isOpen: true,
  },
  {
    id: 'rest2',
    nameAr: 'سينيا بريستيج - الرباط أكدال',
    nameEn: 'Siniya Prestige - Rabat Agdal',
    address: 'شارع أبو عبيدة، أكدال، الرباط',
    size: '60m2',
    franchiseeId: 'fr002',
    latitude: 33.9716,
    longitude: -6.8498,
    phone: '+212 537 234 567',
    openingHours: '10:00 - 22:00',
    isOpen: true,
  },
  {
    id: 'rest3',
    nameAr: 'سينيا بريستيج - مراكش جليز',
    nameEn: 'Siniya Prestige - Marrakech Gueliz',
    address: 'شارع محمد السادس، جليز، مراكش',
    size: '100m2',
    franchiseeId: 'fr003',
    latitude: 31.6295,
    longitude: -7.9811,
    phone: '+212 524 345 678',
    openingHours: '09:00 - 23:30',
    isOpen: true,
  },
];
