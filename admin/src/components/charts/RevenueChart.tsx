import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { RevenueDataPoint } from '../../types';

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

type ViewMode = 'revenue' | 'fees' | 'all';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-card-hover border border-emerald/10 p-3 min-w-[180px]" dir="rtl">
      <p className="text-sm font-bold text-emerald mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-3 text-xs text-gray-600 py-0.5">
          <span>{(p.value / 1000).toFixed(0)}K MAD</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span>{p.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [view, setView] = useState<ViewMode>('revenue');

  const tabs: { id: ViewMode; label: string }[] = [
    { id: 'revenue', label: 'رقم الأعمال' },
    { id: 'fees', label: 'ريع الفرانشايز' },
    { id: 'all', label: 'الكل' },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                view === t.id
                  ? 'bg-white text-emerald shadow-sm'
                  : 'text-gray-500 hover:text-emerald'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div>
          <h3 className="text-base font-bold text-emerald text-right">تطور رقم الأعمال</h3>
          <p className="text-xs text-gray-400 text-right">Évolution du CA — 2024</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        {view === 'fees' ? (
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span className="text-xs text-gray-500">{v}</span>} />
            <Bar dataKey="franchiseFees" name="ريع الفرانشايز" fill="#B45309" radius={[6, 6, 0, 0]} />
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#022C22" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#022C22" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B45309" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#B45309" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span className="text-xs text-gray-500">{v}</span>} />
            <Area type="monotone" dataKey="revenue" name="رقم الأعمال" stroke="#022C22" strokeWidth={2.5} fill="url(#colorRevenue)" dot={false} activeDot={{ r: 5, fill: '#022C22' }} />
            {view === 'all' && (
              <>
                <Area type="monotone" dataKey="franchiseFees" name="ريع الفرانشايز" stroke="#B45309" strokeWidth={2} fill="url(#colorFees)" dot={false} activeDot={{ r: 4, fill: '#B45309' }} />
              </>
            )}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
