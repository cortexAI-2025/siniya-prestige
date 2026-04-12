import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { Moon, Heart, BookOpen, Stethoscope, Home, Download } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatMAD, cn } from '../utils/cn';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const CATEGORY_CONFIG = {
  food:      { labelAr: 'غذاء وسلال',       icon: Heart,       color: '#10B981', emoji: '🥗' },
  education: { labelAr: 'تعليم ومستلزمات',   icon: BookOpen,    color: '#3B82F6', emoji: '📚' },
  medical:   { labelAr: 'رعاية صحية',        icon: Stethoscope, color: '#8B5CF6', emoji: '💊' },
  housing:   { labelAr: 'سكن وإصلاح',        icon: Home,        color: '#F59E0B', emoji: '🏠' },
};

const MONTHS = [
  { month: 'يناير',  collected: 18500, distributed: 18500 },
  { month: 'فبراير', collected: 19200, distributed: 17000 },
  { month: 'مارس',   collected: 22800, distributed: 22800 },
  { month: 'أبريل',  collected: 24900, distributed: 24900 },
  { month: 'مايو',   collected: 26600, distributed: 25000 },
  { month: 'يونيو',  collected: 28100, distributed: 28100 },
  { month: 'يوليوز', collected: 25900, distributed: 25900 },
  { month: 'غشت',    collected: 27300, distributed: 27300 },
  { month: 'شتنبر',  collected: 28500, distributed: 28000 },
  { month: 'أكتوبر', collected: 29000, distributed: 29000 },
  { month: 'نونبر',  collected: 29800, distributed: 29800 },
  { month: 'دجنبر',  collected: 31875, distributed: 28400 },
];

const DISTRIBUTION_PIE = [
  { name: 'غذاء وسلال',     value: 42, color: '#10B981' },
  { name: 'تعليم',          value: 25, color: '#3B82F6' },
  { name: 'رعاية صحية',    value: 20, color: '#8B5CF6' },
  { name: 'سكن وإصلاح',    value: 13, color: '#F59E0B' },
];

const CustomTooltipBar = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-card-hover border border-emerald/10 p-3 text-right" dir="rtl">
      <p className="text-xs font-bold text-emerald mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="text-xs text-gray-600 flex justify-between gap-3">
          <span className="font-medium">{(p.value / 1000).toFixed(1)}K MAD</span>
          <span style={{ color: p.color }}>{p.name}</span>
        </div>
      ))}
    </div>
  );
};

export const ZakatReport: React.FC = () => {
  const { zakatEntries, zakatDistributions } = useAdminStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'entries' | 'distributions'>('overview');

  const totalCollected = zakatEntries.reduce((s, z) => s + z.amount, 0);
  const totalDistributed = zakatDistributions.reduce((s, d) => s + d.amount, 0);
  const totalYearCollected = MONTHS.reduce((s, m) => s + m.collected, 0);
  const totalYearDistributed = MONTHS.reduce((s, m) => s + m.distributed, 0);
  const pending = totalCollected - zakatEntries.filter((z) => z.status === 'distributed').reduce((s, z) => s + z.amount, 0);

  return (
    <div className="space-y-6">

      {/* Hero banner */}
      <div className="rounded-3xl overflow-hidden bg-emerald-gradient p-8 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-6 text-8xl">🌙</div>
          <div className="absolute bottom-4 left-6 text-6xl">☪️</div>
        </div>
        <div className="relative text-right">
          <h2 className="text-2xl font-bold text-gold-shimmer mb-1">🌙 صندوق الزكاة — سينيا بريستيج</h2>
          <p className="text-white/60 text-sm mb-6">
            Fonds Zakat El Maal — 2.5% des bénéfices nets de chaque commande
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'إجمالي محصّل (2024)', value: formatMAD(totalYearCollected), icon: '💰' },
              { label: 'إجمالي موزّع',         value: formatMAD(totalYearDistributed), icon: '🤲' },
              { label: 'المتبقي للتوزيع',      value: formatMAD(totalYearCollected - totalYearDistributed), icon: '⏳' },
              { label: 'أسر استفادت',          value: '127 أسرة', icon: '👨‍👩‍👧‍👦' },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-lg font-bold text-gold-shimmer">{item.value}</div>
                <div className="text-xs text-white/60 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Quranic verse */}
        <div className="mt-6 text-center">
          <p className="text-gold-shimmer text-lg font-medium" style={{ fontFamily: 'serif' }}>
            «خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِمْ بِهَا»
          </p>
          <p className="text-white/40 text-xs mt-1">— سورة التوبة، الآية 103</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1.5 w-fit">
        {[
          { id: 'overview', label: 'نظرة عامة' },
          { id: 'entries', label: 'التحصيل' },
          { id: 'distributions', label: 'التوزيع' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-5 py-2 text-sm font-medium rounded-xl transition-all',
              activeTab === tab.id
                ? 'bg-emerald text-white shadow-sm'
                : 'text-gray-500 hover:text-emerald'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Overview ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Annual bar chart */}
            <div className="lg:col-span-2 card p-6">
              <div className="text-right mb-4">
                <h3 className="text-base font-bold text-emerald">تطور الزكاة الشهري — 2024</h3>
                <p className="text-xs text-gray-400">Évolution mensuelle du fonds Zakat</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={MONTHS} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltipBar />} />
                  <Legend formatter={(v) => <span className="text-xs text-gray-500">{v}</span>} />
                  <Bar dataKey="collected" name="المحصّل" fill="#022C22" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="distributed" name="الموزّع" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="card p-6">
              <div className="text-right mb-4">
                <h3 className="text-base font-bold text-emerald">توزيع الزكاة حسب القطاع</h3>
                <p className="text-xs text-gray-400">Répartition par secteur</p>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={DISTRIBUTION_PIE}
                    cx="50%" cy="50%"
                    innerRadius={45} outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {DISTRIBUTION_PIE.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {DISTRIBUTION_PIE.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <span className="font-semibold" style={{ color: item.color }}>{item.value}%</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
              const Icon = cfg.icon;
              const dist = zakatDistributions.filter((d) => d.category === key);
              const total = dist.reduce((s, d) => s + d.amount, 0);
              return (
                <div key={key} className="card p-5 text-right">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${cfg.color}15` }}>
                    <Icon size={20} style={{ color: cfg.color }} />
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{cfg.emoji} {cfg.labelAr}</div>
                  <div className="text-lg font-bold" style={{ color: cfg.color }}>{formatMAD(total)}</div>
                  <div className="text-xs text-gray-400">{dist.length} عمليات توزيع</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB: Entries (collection) ── */}
      {activeTab === 'entries' && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <button className="btn-outline text-xs">
              <Download size={14} /> تصدير CSV
            </button>
            <h3 className="text-base font-bold text-emerald">سجل التحصيل</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['الحالة', 'التاريخ', 'الفترة', 'المبلغ', 'المدينة', 'المطعم'].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {zakatEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4"><StatusBadge status={entry.status as any} /></td>
                    <td className="px-5 py-4 text-xs text-gray-500">
                      {format(entry.createdAt, 'dd MMMM yyyy', { locale: ar })}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600 font-medium">{entry.period}</td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-gold-dark">{formatMAD(entry.amount)}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{entry.city}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-emerald">{entry.restaurantName}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-emerald/5 border-t-2 border-emerald/10">
                  <td colSpan={3} className="px-5 py-3 text-sm font-bold text-emerald text-right">الإجمالي</td>
                  <td className="px-5 py-3 text-sm font-bold text-gold-dark">{formatMAD(totalCollected)}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: Distributions ── */}
      {activeTab === 'distributions' && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="card p-5 border-2 border-emerald/10">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <h3 className="text-base font-bold text-emerald">إجمالي الموزّع</h3>
                <p className="text-2xl font-bold text-gold-dark mt-1">{formatMAD(totalDistributed)}</p>
              </div>
              <div className="text-5xl">🤲</div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-gradient rounded-full"
                style={{ width: `${Math.min((totalDistributed / totalCollected) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatMAD(totalCollected - totalDistributed)} متبقي</span>
              <span>{((totalDistributed / totalCollected) * 100).toFixed(1)}% تم توزيعه</span>
            </div>
          </div>

          {/* Distribution cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zakatDistributions.map((dist) => {
              const cfg = CATEGORY_CONFIG[dist.category];
              const Icon = cfg.icon;
              return (
                <div key={dist.id} className="card p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cfg.color}15` }}
                    >
                      <Icon size={22} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold" style={{ color: cfg.color }}>
                          {formatMAD(dist.amount)}
                        </span>
                        <h4 className="text-sm font-bold text-emerald">{dist.recipient}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{dist.notes}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{format(dist.date, 'dd/MM/yyyy', { locale: ar })}</span>
                        <span className="badge-emerald">{cfg.emoji} {cfg.labelAr}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">📍 {dist.city}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add distribution button */}
          <button className="btn-emerald w-full justify-center py-3">
            <Moon size={18} />
            تسجيل توزيع جديد
          </button>
        </div>
      )}
    </div>
  );
};
