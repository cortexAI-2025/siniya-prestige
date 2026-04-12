import React, { useState } from 'react';
import {
  CheckCircle, XCircle, Eye, AlertCircle, Filter,
  MapPin, Phone, Mail, TrendingUp, Award, Search,
} from 'lucide-react';
import { Franchisee, FranchiseeStatus } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAdminStore } from '../store/adminStore';
import { formatMAD, formatNumber } from '../utils/cn';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '../utils/cn';

const STATUS_FILTERS: { value: FranchiseeStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'pending', label: 'في الانتظار' },
  { value: 'approved', label: 'مقبول' },
  { value: 'rejected', label: 'مرفوض' },
  { value: 'suspended', label: 'معلق' },
];

export const FranchiseeManagement: React.FC = () => {
  const { franchisees, approveFranchisee, rejectFranchisee, suspendFranchisee } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState<FranchiseeStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = franchisees.filter((f) => {
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    const matchesSearch =
      f.nameAr.includes(search) ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.cityAr.includes(search) ||
      f.email.includes(search);
    return matchesStatus && matchesSearch;
  });

  const selected = franchisees.find((f) => f.id === selectedId) ?? null;

  return (
    <div className="flex gap-6">
      {/* List panel */}
      <div className={cn('flex-1 space-y-4 min-w-0', selected && 'lg:max-w-xl')}>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="بحث بالاسم، المدينة، البريد..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald/20 bg-white"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  statusFilter === f.value
                    ? 'bg-emerald text-white shadow-sm'
                    : 'text-gray-500 hover:text-emerald hover:bg-emerald/5'
                )}
              >
                {f.label}
                {f.value !== 'all' && (
                  <span className="mr-1 text-[10px]">
                    ({franchisees.filter((fr) => fr.status === f.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Franchisee cards */}
        <div className="space-y-3">
          {filtered.map((f) => (
            <FranchiseeCard
              key={f.id}
              franchisee={f}
              isSelected={selectedId === f.id}
              onSelect={() => setSelectedId(selectedId === f.id ? null : f.id)}
              onApprove={() => approveFranchisee(f.id)}
              onReject={() => rejectFranchisee(f.id)}
              onSuspend={() => suspendFranchisee(f.id)}
            />
          ))}

          {filtered.length === 0 && (
            <div className="card p-12 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-400 text-sm">لا توجد نتائج</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="hidden lg:block w-96 flex-shrink-0">
          <FranchiseeDetail
            franchisee={selected}
            onClose={() => setSelectedId(null)}
            onApprove={() => approveFranchisee(selected.id)}
            onReject={() => rejectFranchisee(selected.id)}
            onSuspend={() => suspendFranchisee(selected.id)}
          />
        </div>
      )}
    </div>
  );
};

// ─── Franchisee Card ────────────────────────────────────────────────────────
const FranchiseeCard: React.FC<{
  franchisee: Franchisee;
  isSelected: boolean;
  onSelect: () => void;
  onApprove: () => void;
  onReject: () => void;
  onSuspend: () => void;
}> = ({ franchisee: f, isSelected, onSelect, onApprove, onReject, onSuspend }) => (
  <div
    className={cn(
      'card card-hover p-5 cursor-pointer transition-all border-2',
      isSelected ? 'border-emerald shadow-card-hover' : 'border-transparent'
    )}
    onClick={onSelect}
  >
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div className={cn(
        'w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0',
        f.status === 'approved' ? 'bg-emerald-gradient' :
        f.status === 'pending' ? 'bg-gold-gradient' : 'bg-gray-400'
      )}>
        {f.avatar}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <StatusBadge status={f.status} />
          <div className="text-right">
            <h3 className="font-bold text-emerald truncate">{f.nameAr}</h3>
            <p className="text-xs text-gray-400">{f.name}</p>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 justify-end">
          <span className="flex items-center gap-1">
            {f.localSize}
            <span className="font-medium text-emerald">📐</span>
          </span>
          <span className="flex items-center gap-1">
            {f.cityAr}
            <MapPin size={11} />
          </span>
          <span className="flex items-center gap-1">
            {format(f.appliedAt, 'dd MMMM yyyy', { locale: ar })}
            <span>📅</span>
          </span>
        </div>

        {/* Stats for approved */}
        {f.status === 'approved' && (
          <div className="mt-3 flex items-center gap-4 justify-end">
            <div className="text-center">
              <div className="text-sm font-bold text-emerald">{formatMAD(f.monthlyRevenue)}</div>
              <div className="text-xs text-gray-400">شهري</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-gold-dark">{formatMAD(f.franchiseFeeOwed)}</div>
              <div className="text-xs text-gray-400">الريع</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-purple-600">{f.score}/100</div>
              <div className="text-xs text-gray-400">الأداء</div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Actions for pending */}
    {f.status === 'pending' && (
      <div className="mt-4 flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onReject}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
        >
          <XCircle size={14} />
          رفض
        </button>
        <button
          onClick={onApprove}
          className="btn-emerald text-xs px-4 py-1.5"
        >
          <CheckCircle size={14} />
          قبول
        </button>
      </div>
    )}

    {/* Actions for approved */}
    {f.status === 'approved' && (
      <div className="mt-3 flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onSuspend}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-600 border border-orange-200 hover:bg-orange-50 transition-colors"
        >
          <AlertCircle size={14} />
          تعليق
        </button>
        <button
          onClick={onSelect}
          className="btn-outline text-xs px-3 py-1.5"
        >
          <Eye size={14} />
          التفاصيل
        </button>
      </div>
    )}
  </div>
);

// ─── Detail Panel ────────────────────────────────────────────────────────────
const FranchiseeDetail: React.FC<{
  franchisee: Franchisee;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onSuspend: () => void;
}> = ({ franchisee: f, onClose, onApprove, onReject, onSuspend }) => (
  <div className="card p-6 sticky top-24 space-y-5">
    {/* Header */}
    <div className="flex items-center justify-between">
      <button onClick={onClose} className="text-gray-400 hover:text-emerald text-sm">✕ إغلاق</button>
      <StatusBadge status={f.status} />
    </div>

    {/* Avatar + name */}
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-gradient flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-card">
        {f.avatar}
      </div>
      <h2 className="text-lg font-bold text-emerald">{f.nameAr}</h2>
      <p className="text-sm text-gray-400">{f.name}</p>
    </div>

    {/* Contact */}
    <div className="space-y-2">
      <DetailRow icon={<MapPin size={14} />} label={f.cityAr} sub={f.address} />
      <DetailRow icon={<Phone size={14} />} label={f.phone} />
      <DetailRow icon={<Mail size={14} />} label={f.email} />
    </div>

    <div className="border-t border-gray-100" />

    {/* Documents */}
    <div className="space-y-2 text-right">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">الوثائق القانونية</h4>
      <div className="flex items-center justify-between text-sm">
        <span className="badge-emerald">✓ مرفوع</span>
        <span className="text-gray-600">CIN: {f.cin}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className={f.rc.includes('PENDING') ? 'badge-yellow' : 'badge-emerald'}>
          {f.rc.includes('PENDING') ? '⏳ في الانتظار' : '✓ مرفوع'}
        </span>
        <span className="text-gray-600">RC: {f.rc}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="badge-emerald">✓ مرفوع</span>
        <span className="text-gray-600">📐 محل: {f.localSize}</span>
      </div>
    </div>

    {/* Financial (if approved) */}
    {f.status === 'approved' && (
      <>
        <div className="border-t border-gray-100" />
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider text-right">الأداء المالي</h4>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'شهري', value: formatMAD(f.monthlyRevenue), color: 'text-emerald' },
              { label: 'إجمالي', value: formatMAD(f.totalRevenue), color: 'text-emerald' },
              { label: 'الريع المستحق', value: formatMAD(f.franchiseFeeOwed), color: 'text-gold-dark' },
              { label: 'الريع المدفوع', value: formatMAD(f.franchiseeFeePaid), color: 'text-green-600' },
              { label: 'الزكاة', value: formatMAD(f.zakatContribution), color: 'text-purple-600' },
              { label: 'الطلبات', value: formatNumber(f.totalOrders), color: 'text-blue-600' },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-right">
                <div className={`text-sm font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Score bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-emerald">{f.score}/100</span>
              <span className="text-gray-500">درجة الأداء</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-gradient rounded-full"
                style={{ width: `${f.score}%` }}
              />
            </div>
          </div>
        </div>
      </>
    )}

    {/* Actions */}
    <div className="space-y-2 pt-2">
      {f.status === 'pending' && (
        <>
          <button onClick={onApprove} className="btn-emerald w-full justify-center py-2.5">
            <CheckCircle size={16} /> قبول الفرانشايز
          </button>
          <button
            onClick={onReject}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
          >
            <XCircle size={16} /> رفض الطلب
          </button>
        </>
      )}
      {f.status === 'approved' && (
        <button
          onClick={onSuspend}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-orange-600 border border-orange-200 hover:bg-orange-50 transition-colors"
        >
          <AlertCircle size={16} /> تعليق الفرانشايز
        </button>
      )}
    </div>
  </div>
);

const DetailRow: React.FC<{ icon: React.ReactNode; label: string; sub?: string }> = ({ icon, label, sub }) => (
  <div className="flex items-start gap-2.5 justify-end text-right">
    <div className="min-w-0">
      <p className="text-sm text-gray-700 font-medium">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
    <span className="text-emerald flex-shrink-0 mt-0.5">{icon}</span>
  </div>
);
