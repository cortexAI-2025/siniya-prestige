import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Star, Clock, X, Check, ChevronDown } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { AdminMenuItem } from '../types';
import { formatMAD, cn } from '../utils/cn';

const ALLERGEN_OPTIONS = ['gluten', 'lactose', 'oeufs', 'fruits à coque', 'crustacés', 'poisson', 'céleri', 'soja'];

const ROLE_LABELS: Record<string, string> = {
  starters: '🥗 المقبلات', mains: '🍖 الرئيسية', tajines: '🫕 الطاجين',
  burgers: '🍔 البرغر', pasta: '🍝 المعكرونة', wraps: '🌯 الرول',
  sides: '🍟 الجانبية', desserts: '🍰 الحلويات', drinks: '🥤 المشروبات',
};

const EMPTY_ITEM: Omit<AdminMenuItem, 'id'> = {
  nameAr: '', nameFr: '', descriptionAr: '', price: 0, categoryId: 'mains',
  image: '', isAvailable: true, isFeatured: false, tags: [], preparationTime: 15, allergens: [],
};

export const MenuManagement: React.FC = () => {
  const { menuItems, menuCategories, toggleMenuItemAvailability, updateMenuItem, addMenuItem, deleteMenuItem } = useAdminStore();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<AdminMenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<Omit<AdminMenuItem, 'id'>>(EMPTY_ITEM);

  const filtered = menuItems.filter((item) => {
    const matchCat = categoryFilter === 'all' || item.categoryId === categoryFilter;
    const matchSearch = item.nameAr.includes(search) || item.nameFr.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openEdit = (item: AdminMenuItem) => {
    setEditingItem(item);
    setDraft({ ...item });
    setIsAdding(false);
  };

  const openAdd = () => {
    setEditingItem(null);
    setDraft(EMPTY_ITEM);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!draft.nameAr || !draft.price) return;
    if (isAdding) {
      addMenuItem({ ...draft, id: `item${Date.now()}` });
    } else if (editingItem) {
      updateMenuItem({ ...draft, id: editingItem.id });
    }
    setIsAdding(false);
    setEditingItem(null);
  };

  const showPanel = isAdding || !!editingItem;

  return (
    <div className="flex gap-6 h-full">

      {/* Left — list */}
      <div className={cn('flex-1 space-y-4 min-w-0', showPanel && 'lg:max-w-2xl')}>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="بحث في القائمة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald/20 bg-white"
            />
          </div>
          <button onClick={openAdd} className="btn-emerald text-sm px-4 py-2.5">
            <Plus size={16} />
            إضافة طبق
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={cn('px-3 py-1.5 text-xs font-medium rounded-xl transition-all', categoryFilter === 'all' ? 'bg-emerald text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald/40')}
          >
            الكل ({menuItems.length})
          </button>
          {menuCategories.map((cat) => {
            const count = menuItems.filter((i) => i.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={cn('px-3 py-1.5 text-xs font-medium rounded-xl transition-all', categoryFilter === cat.id ? 'bg-emerald text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald/40')}
              >
                {cat.icon} {cat.nameAr} ({count})
              </button>
            );
          })}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const cat = menuCategories.find((c) => c.id === item.categoryId);
            return (
              <div key={item.id} className={cn('card p-4 flex gap-3 transition-all', !item.isAvailable && 'opacity-60')}>
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {item.image ? (
                    <img src={item.image} alt={item.nameFr} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">{cat?.icon}</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex gap-1">
                      {item.isFeatured && <Star size={12} className="text-gold fill-gold mt-0.5" />}
                      <button
                        onClick={() => toggleMenuItemAvailability(item.id)}
                        className={cn('w-10 h-5 rounded-full transition-all flex-shrink-0', item.isAvailable ? 'bg-emerald' : 'bg-gray-200')}
                      >
                        <span className={cn('block w-4 h-4 rounded-full bg-white shadow transition-all mx-0.5', item.isAvailable ? 'translate-x-5' : 'translate-x-0')} />
                      </button>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-emerald truncate">{item.nameAr}</p>
                      <p className="text-xs text-gray-400 truncate">{item.nameFr}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald hover:bg-emerald/5">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => deleteMenuItem(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gold-dark">{formatMAD(item.price)}</span>
                      <div className="flex items-center gap-1 justify-end mt-0.5">
                        <Clock size={10} className="text-gray-300" />
                        <span className="text-xs text-gray-400">{item.preparationTime} دقيقة</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-gray-400 text-sm">لا توجد أطباق مطابقة</p>
          </div>
        )}
      </div>

      {/* Right — edit / add panel */}
      {showPanel && (
        <div className="hidden lg:block w-96 flex-shrink-0">
          <div className="card p-6 sticky top-24 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <button onClick={() => { setIsAdding(false); setEditingItem(null); }} className="text-gray-400 hover:text-emerald">
                <X size={18} />
              </button>
              <h3 className="text-sm font-bold text-emerald">
                {isAdding ? 'إضافة طبق جديد' : 'تعديل الطبق'}
              </h3>
            </div>

            {/* Image preview */}
            {draft.image && (
              <img src={draft.image} alt="preview" className="w-full h-36 object-cover rounded-xl" />
            )}

            {/* Fields */}
            <div className="space-y-3">
              <Field label="الاسم بالعربية" value={draft.nameAr} onChange={(v) => setDraft({ ...draft, nameAr: v })} placeholder="شريحة لحم..." />
              <Field label="Nom en français" value={draft.nameFr} onChange={(v) => setDraft({ ...draft, nameFr: v })} placeholder="Steak sauce poivre..." />
              <Field label="الوصف" value={draft.descriptionAr} onChange={(v) => setDraft({ ...draft, descriptionAr: v })} placeholder="وصف مختصر..." multiline />
              <Field label="رابط الصورة (URL)" value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} placeholder="https://..." />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1 text-right">السعر (MAD)</label>
                  <input type="number" value={draft.price || ''} onChange={(e) => setDraft({ ...draft, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1 text-right">وقت التحضير (د)</label>
                  <input type="number" value={draft.preparationTime || ''} onChange={(e) => setDraft({ ...draft, preparationTime: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald/20" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1 text-right">الفئة</label>
                <div className="relative">
                  <select value={draft.categoryId} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald/20 appearance-none bg-white">
                    {menuCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.nameAr}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-4 justify-end">
                <Toggle label="متاح" value={draft.isAvailable} onChange={(v) => setDraft({ ...draft, isAvailable: v })} />
                <Toggle label="مميز ⭐" value={draft.isFeatured} onChange={(v) => setDraft({ ...draft, isFeatured: v })} />
              </div>

              {/* Allergens */}
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-2 text-right">المواد المثيرة للحساسية</label>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {ALLERGEN_OPTIONS.map((a) => (
                    <button key={a} onClick={() => setDraft({ ...draft, allergens: draft.allergens.includes(a) ? draft.allergens.filter((x) => x !== a) : [...draft.allergens, a] })}
                      className={cn('px-2 py-1 text-xs rounded-lg transition-all', draft.allergens.includes(a) ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-500')}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleSave} className="btn-emerald w-full justify-center py-2.5 mt-2">
              <Check size={16} />
              {isAdding ? 'إضافة الطبق' : 'حفظ التعديلات'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }> = ({ label, value, onChange, placeholder, multiline }) => (
  <div>
    <label className="text-xs font-medium text-gray-500 block mb-1 text-right">{label}</label>
    {multiline ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={2}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald/20 resize-none" />
    ) : (
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald/20" />
    )}
  </div>
);

const Toggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, value, onChange }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-gray-500">{label}</span>
    <button onClick={() => onChange(!value)} className={cn('w-10 h-5 rounded-full transition-all', value ? 'bg-emerald' : 'bg-gray-200')}>
      <span className={cn('block w-4 h-4 rounded-full bg-white shadow transition-all mx-0.5', value ? 'translate-x-5' : 'translate-x-0')} />
    </button>
  </div>
);
