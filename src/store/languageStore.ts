import { create } from 'zustand';

type Lang = 'ar' | 'fr';

interface LanguageStore {
  lang: Lang;
  toggle: () => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  lang: 'ar',
  toggle: () => set((s) => ({ lang: s.lang === 'ar' ? 'fr' : 'ar' })),
}));
