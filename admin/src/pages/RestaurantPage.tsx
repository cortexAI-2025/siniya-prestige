import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Clock, UtensilsCrossed, BarChart3, Phone, MapPin, Edit2, Check, X, Plus, UserMinus, UserCheck, Star, Save } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { StaffMember, StaffRole, WeekDay, DaySchedule, AdminMenuItem } from '../types';
import { formatMAD, cn } from '../utils/cn';
import { StatusBadge } from '../components/ui/StatusBadge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

type Tab = 'overview' | 'menu' | 'hours' | 'staff';

const DAYS: { key: WeekDay; ar: string; fr: string }[] = [
  { key: 'monday', ar: 'الاثنين', fr: 'Lundi' },
  { key: 'tuesday', ar: 'الثلاثاء', fr: 'Mardi' },
  { key: 'wednesday', ar: 'الأربعاء', fr: 'Mercredi' },
  { key: 'thursday', ar: 'الخميس', fr: 'Jeudi' },
  { key: 'friday', ar: 'الجمعة', fr: 'Vendredi' },
  { key: 'saturday', ar: 'السبت', fr: 'Samedi' },
  { key: 'sunday', ar: 'الأحد', fr: 'Dimanche' },
];

const ROLE_LABELS: Record<StaffRole, { ar: string; color: string }> = {
  manager:  { ar: 'مدير', color: 'bg-emerald/10 text-emerald' },
  chef:     { ar: 'طاهٍ', color: 'bg-orange-100 text-orange-700' },
  server:   { ar: 'نادل', color: 'bg-blue-100 text-blue-700' },
  cashier:  { ar: 'محاسب', color: 'bg-purple-100 text-purple-700' },
  barista:  { ar: 'باريستا', color: 'bg-amber-100 text-amber-700' },
  delivery: { ar: 'توصيل', color: 'bg-gray-100 text-gray-600' },
};

export const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    franchisees, menuItems, menuCategories, staff, restaurantHours,
    toggleMenuItemAvailability, toggleStaffActive, addStaffMember,
    updateStaffMember, updateRestaurantHours,
  } = useAdminStore();

  const franchisee = franchisees.find((f) => f.id === id);
  const restaurantStaff = staff.filter((s) => s.restaurantId === id);
  const restaurantMenu = menuItems; // shared menu
  const hours = restaurantHours.find((h) => h.restaurantId === id);

  const [tab, setTab] = useState<Tab>('overview');
  const [editHours, setEditHours] = useState(false);
  const [draftHours, setDraftHours] = useState<Record<WeekDay, DaySchedule>>(
    hours?.schedule ?? {} as Record<WeekDay, DaySchedule>
  );
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newMember, setNewMember] = useState<Partial<StaffMember>>({ role: 'server', restaurantId: id, isActive: true, hireDate: new Date() });
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

  if (!franchisee) return (
    <div className="text-center py-20">
      <p className="text-gray-400">لم يتم العثور على المطعم</p>
      <button onClick={() => navigate('/franchisees')} className="btn-outline mt-4">رجوع</button>
    </div>
  );

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'نظرة عامة', icon: <BarChart3 size={15} /> },
    { id: 'menu', label: 'القائمة', icon: <UtensilsCrossed size={15} /> },
    { id: 'hours', label: 'أوقات العمل', icon: <Clock size={15} /> },
    { id: 'staff', label: 'الفريق', icon: <Users size={15} /> },
  ];

  const handleSaveHours = () => {
    updateRestaurantHours({ restaurantId: id!, schedule: draftHours });
    setEditHours(false);
  };

  const handleAddStaff = () => {
    if (!newMember.name || !newMember.phone) return;
    addStaffMember({
      id: `st${Date.now()}`,
      restaurantId: id!,
      name: newMember.name!,
      nameAr: newMember.nameAr || newMember.name!,
      role: (newMember.role as StaffRole) || 'server',
      phone: newMember.phone!,
      email: newMember.email,
      hireDate: new Date(),
      isActive: true,
      avatar: (newMember.name || 'XX').slice(0, 2).toUpperCase(),
    });
    setShowAddStaff(false);
    setNewMember({ role: 'server', restaurantId: id, isActive: true, hireDate: new Date() });
  };

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/franchisees')} className="p-2 rounded-xl text-gray-400 hover:text-emerald hover:bg-emerald/5 transition-colors">
          <ArrowRight size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-gradient flex items-center justify-center text-white font-bold text-lg">
              {franchisee.avatar}
            </div>
            <div>
              <h1 className="text-lg font-bold text-emerald">{franchisee.nameAr}</h1>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={11} />{franchisee.cityAr} • {franchisee.address}</span>
                <span className="flex items-center gap-1"><Phone size={11} />{franchisee.phone}</span>
              </div>
            </div>
          </div>
        </div>
        <StatusBadge status={franchisee.status} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all',
              tab === t.id ? 'bg-white text-emerald shadow-sm' : 'text-gray-500 hover:text-emerald'
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Vue d'ensemble ───────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'رقم الأعمال الشهري', value: formatMAD(franchisee.monthlyRevenue), icon: '📈', color: 'text-emerald' },
              { label: 'إجمالي الطلبات', value: franchisee.totalOrders.toLocaleString(), icon: '🛍️', color: 'text-gold-dark' },
              { label: 'عدد الموظفين', value: String(restaurantStaff.filter((s) => s.isActive).length), icon: '👥', color: 'text-blue-600' },
              { label: 'درجة الأداء', value: `${franchisee.score}/100`, icon: '⭐', color: 'text-purple-600' },
            ].map((item) => (
              <div key={item.label} className="card p-4 text-right">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Financial */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-emerald text-right mb-4">الأداء المالي</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'الإجمالي المتراكم', value: formatMAD(franchisee.totalRevenue), color: 'text-emerald' },
                { label: 'الريع المستحق', value: formatMAD(franchisee.franchiseFeeOwed), color: 'text-gold-dark' },
                { label: 'الريع المدفوع', value: formatMAD(franchisee.franchiseeFeePaid), color: 'text-green-600' },
                { label: 'الرصيد المتبقي', value: formatMAD(franchisee.franchiseFeeOwed - franchisee.franchiseeFeePaid), color: franchisee.franchiseFeeOwed > franchisee.franchiseeFeePaid ? 'text-red-500' : 'text-green-600' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-right">
                  <div className={`text-base font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span className="font-bold text-emerald">{franchisee.score}%</span>
                <span>درجة الأداء العام</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-gradient rounded-full" style={{ width: `${franchisee.score}%` }} />
              </div>
            </div>
          </div>

          {/* Legal docs */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-emerald text-right mb-4">الوثائق القانونية</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'CIN', value: franchisee.cin },
                { label: 'RC', value: franchisee.rc },
                { label: 'المحل', value: franchisee.localSize },
              ].map((doc) => (
                <div key={doc.label} className="bg-gray-50 rounded-xl p-3 text-right">
                  <div className="text-xs text-gray-400">{doc.label}</div>
                  <div className="text-sm font-semibold text-emerald mt-0.5">{doc.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Menu ─────────────────────────────────────────────────── */}
      {tab === 'menu' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 text-right">القائمة مشتركة بين جميع الفروع. يمكن تفعيل/تعطيل كل طبق.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurantMenu.map((item) => {
              const cat = menuCategories.find((c) => c.id === item.categoryId);
              return (
                <div key={item.id} className={cn('card p-3 flex gap-3 transition-all', !item.isAvailable && 'opacity-50')}>
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {item.image ? (
                      <img src={item.image} alt={item.nameFr} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">{cat?.icon}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-sm font-semibold text-emerald truncate">{item.nameAr}</p>
                    <p className="text-xs text-gray-400">{formatMAD(item.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => toggleMenuItemAvailability(item.id)}
                        className={cn('w-9 h-4.5 rounded-full transition-all', item.isAvailable ? 'bg-emerald' : 'bg-gray-200')}
                        style={{ height: 18 }}
                      >
                        <span className={cn('block w-3.5 h-3.5 rounded-full bg-white shadow transition-all mx-px', item.isAvailable ? 'translate-x-4' : 'translate-x-0')} />
                      </button>
                      {item.isFeatured && <Star size={12} className="text-gold fill-gold" />}
                      <span className={cn('text-xs px-1.5 py-0.5 rounded-md', item.isAvailable ? 'bg-emerald/10 text-emerald' : 'bg-gray-100 text-gray-400')}>
                        {item.isAvailable ? 'متاح' : 'غير متاح'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB: Horaires ─────────────────────────────────────────────── */}
      {tab === 'hours' && (
        <div className="card p-6 max-w-lg">
          <div className="flex items-center justify-between mb-5">
            {editHours ? (
              <div className="flex gap-2">
                <button onClick={handleSaveHours} className="btn-emerald text-xs px-3 py-1.5">
                  <Save size={13} /> حفظ
                </button>
                <button onClick={() => { setEditHours(false); setDraftHours(hours?.schedule ?? {} as any); }} className="btn-outline text-xs px-3 py-1.5">
                  <X size={13} /> إلغاء
                </button>
              </div>
            ) : (
              <button onClick={() => setEditHours(true)} className="btn-outline text-xs px-3 py-1.5">
                <Edit2 size={13} /> تعديل
              </button>
            )}
            <h3 className="text-sm font-bold text-emerald">أوقات العمل الأسبوعية</h3>
          </div>

          <div className="space-y-3">
            {DAYS.map(({ key, ar: dayAr, fr: dayFr }) => {
              const day = (editHours ? draftHours : hours?.schedule)?.[key];
              if (!day) return null;
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className={cn('text-xs px-2 py-1 rounded-lg w-20 text-center font-medium flex-shrink-0', day.isOpen ? 'bg-emerald/10 text-emerald' : 'bg-gray-100 text-gray-400')}>
                    {day.isOpen ? 'مفتوح' : 'مغلق'}
                  </div>
                  {editHours ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input type="time" value={day.closeTime} onChange={(e) => setDraftHours({ ...draftHours, [key]: { ...day, closeTime: e.target.value } })}
                        className="px-2 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald/30 w-24" />
                      <span className="text-gray-300 text-xs">—</span>
                      <input type="time" value={day.openTime} onChange={(e) => setDraftHours({ ...draftHours, [key]: { ...day, openTime: e.target.value } })}
                        className="px-2 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald/30 w-24" />
                      <button onClick={() => setDraftHours({ ...draftHours, [key]: { ...day, isOpen: !day.isOpen } })}
                        className={cn('w-8 h-4 rounded-full transition-all flex-shrink-0', day.isOpen ? 'bg-emerald' : 'bg-gray-200')}
                        style={{ height: 18 }}>
                        <span className={cn('block w-3.5 h-3.5 rounded-full bg-white shadow transition-all mx-px', day.isOpen ? 'translate-x-3' : 'translate-x-0')} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 text-right">
                      {day.isOpen ? (
                        <span className="text-sm text-gray-700">{day.openTime} — {day.closeTime}</span>
                      ) : (
                        <span className="text-sm text-gray-300">—</span>
                      )}
                    </div>
                  )}
                  <div className="w-20 text-right flex-shrink-0">
                    <span className="text-sm font-medium text-emerald">{dayAr}</span>
                    <span className="text-xs text-gray-400 block">{dayFr}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB: Staff ────────────────────────────────────────────────── */}
      {tab === 'staff' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setShowAddStaff(!showAddStaff)} className="btn-emerald text-sm px-4 py-2">
              <Plus size={15} /> إضافة موظف
            </button>
            <div className="text-right">
              <span className="text-sm text-gray-500">
                {restaurantStaff.filter((s) => s.isActive).length} موظف نشط من أصل {restaurantStaff.length}
              </span>
            </div>
          </div>

          {/* Add form */}
          {showAddStaff && (
            <div className="card p-5 border-2 border-emerald/20">
              <h4 className="text-sm font-bold text-emerald text-right mb-4">موظف جديد</h4>
              <div className="grid grid-cols-2 gap-3">
                <StaffField label="الاسم (بالفرنسية)" value={newMember.name || ''} onChange={(v) => setNewMember({ ...newMember, name: v })} />
                <StaffField label="الاسم (بالعربية)" value={newMember.nameAr || ''} onChange={(v) => setNewMember({ ...newMember, nameAr: v })} />
                <StaffField label="الهاتف" value={newMember.phone || ''} onChange={(v) => setNewMember({ ...newMember, phone: v })} />
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1 text-right">المنصب</label>
                  <select value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value as StaffRole })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald/20 bg-white">
                    {Object.entries(ROLE_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>{val.ar}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-3">
                <button onClick={() => setShowAddStaff(false)} className="btn-outline text-xs px-3">إلغاء</button>
                <button onClick={handleAddStaff} className="btn-emerald text-xs px-4"><Check size={13} /> إضافة</button>
              </div>
            </div>
          )}

          {/* Staff list */}
          <div className="space-y-3">
            {restaurantStaff.length === 0 && (
              <div className="card p-10 text-center text-gray-400 text-sm">لا يوجد موظفون مسجلون</div>
            )}
            {restaurantStaff.map((member) => (
              <div key={member.id} className={cn('card p-4 flex items-center gap-4', !member.isActive && 'opacity-60')}>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0',
                  member.isActive ? 'bg-emerald-gradient' : 'bg-gray-300')}>
                  {member.avatar}
                </div>
                <div className="flex-1 text-right min-w-0">
                  <div className="flex items-center justify-end gap-2">
                    <span className={cn('text-xs px-2 py-0.5 rounded-lg font-medium', ROLE_LABELS[member.role].color)}>
                      {ROLE_LABELS[member.role].ar}
                    </span>
                    <p className="text-sm font-semibold text-emerald">{member.nameAr || member.name}</p>
                  </div>
                  <div className="flex items-center justify-end gap-3 mt-0.5 text-xs text-gray-400">
                    <span>{member.phone}</span>
                    <span>•</span>
                    <span>منذ {format(member.hireDate, 'MMM yyyy', { locale: ar })}</span>
                  </div>
                </div>
                <button onClick={() => toggleStaffActive(member.id)}
                  className={cn('p-2 rounded-xl transition-colors flex-shrink-0', member.isActive ? 'text-red-400 hover:bg-red-50' : 'text-green-500 hover:bg-green-50')}>
                  {member.isActive ? <UserMinus size={16} /> : <UserCheck size={16} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StaffField: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs font-medium text-gray-500 block mb-1 text-right">{label}</label>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald/20" />
  </div>
);
