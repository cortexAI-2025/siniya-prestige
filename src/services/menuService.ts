import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import { MenuItem, Category } from '../types';
import { MENU_ITEMS, CATEGORIES } from '../constants/mockData';

const USE_MOCK = true; // Switch to false when Firebase is configured

export const menuService = {
  async getMenuItems(restaurantId?: string): Promise<MenuItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300)); // Simulate network
      return MENU_ITEMS.filter((item) => item.isAvailable);
    }

    try {
      const q = query(
        collection(db, 'menuItems'),
        where('isAvailable', '==', true),
        orderBy('category'),
        orderBy('nameAr')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as MenuItem));
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return MENU_ITEMS;
    }
  },

  async getMenuItemById(itemId: string): Promise<MenuItem | null> {
    if (USE_MOCK) {
      return MENU_ITEMS.find((item) => item.id === itemId) || null;
    }

    try {
      const docRef = doc(db, 'menuItems', itemId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() } as MenuItem;
    } catch (error) {
      console.error('Error fetching menu item:', error);
      return null;
    }
  },

  async getMenuByCategory(categoryId: string): Promise<MenuItem[]> {
    if (USE_MOCK) {
      if (categoryId === 'all') return MENU_ITEMS.filter((item) => item.isAvailable);
      return MENU_ITEMS.filter(
        (item) => item.category === categoryId && item.isAvailable
      );
    }

    try {
      const q = query(
        collection(db, 'menuItems'),
        where('category', '==', categoryId),
        where('isAvailable', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as MenuItem));
    } catch (error) {
      console.error('Error fetching by category:', error);
      return [];
    }
  },

  async getFeaturedItems(): Promise<MenuItem[]> {
    if (USE_MOCK) {
      return MENU_ITEMS.filter((item) => item.isFeatured && item.isAvailable);
    }

    try {
      const q = query(
        collection(db, 'menuItems'),
        where('isFeatured', '==', true),
        where('isAvailable', '==', true),
        limit(8)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as MenuItem));
    } catch (error) {
      console.error('Error fetching featured items:', error);
      return [];
    }
  },

  async getCategories(): Promise<Category[]> {
    if (USE_MOCK) {
      return CATEGORIES;
    }

    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return CATEGORIES;
    }
  },

  async searchMenuItems(query: string): Promise<MenuItem[]> {
    const normalizedQuery = query.toLowerCase().trim();
    return MENU_ITEMS.filter(
      (item) =>
        item.isAvailable &&
        (item.nameAr.includes(normalizedQuery) ||
          item.nameEn.toLowerCase().includes(normalizedQuery) ||
          item.descriptionAr.includes(normalizedQuery) ||
          item.tags.some((tag) => tag.includes(normalizedQuery)))
    );
  },
};
