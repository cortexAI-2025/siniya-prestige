import { useLanguageStore } from '../store/languageStore';

export function useLang() {
  const { lang, toggle } = useLanguageStore();
  const isFr = lang === 'fr';
  return {
    lang,
    toggle,
    isFr,
    isRtl: !isFr,
    name:  (item: { nameAr: string; nameEn: string })          => isFr ? item.nameEn : item.nameAr,
    desc:  (item: { descriptionAr: string; descriptionEn: string }) => isFr ? item.descriptionEn : item.descriptionAr,
  };
}
