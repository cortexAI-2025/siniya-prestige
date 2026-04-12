import React from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { Franchisee } from '../../types';
import { formatMAD } from '../../utils/cn';

interface PerformanceChartProps {
  franchisees: Franchisee[];
}

export const FranchiseePerformanceChart: React.FC<PerformanceChartProps> = ({ franchisees }) => {
  const approved = franchisees.filter((f) => f.status === 'approved').slice(0, 5);

  const data = [
    { metric: 'رقم الأعمال', ...Object.fromEntries(approved.map((f) => [f.id, (f.monthlyRevenue / 90000) * 100])) },
    { metric: 'الطلبات', ...Object.fromEntries(approved.map((f) => [f.id, (f.totalOrders / 7000) * 100])) },
    { metric: 'الأداء', ...Object.fromEntries(approved.map((f) => [f.id, f.score])) },
    { metric: 'الالتزام بالريع', ...Object.fromEntries(approved.map((f) => [f.id, (f.franchiseeFeePaid / (f.franchiseFeeOwed || 1)) * 100])) },
  ];

  const COLORS = ['#022C22', '#B45309', '#3B82F6', '#8B5CF6', '#10B981'];

  return (
    <div className="card p-6">
      <div className="mb-4 text-right">
        <h3 className="text-base font-bold text-emerald">أداء الفرانشايز</h3>
        <p className="text-xs text-gray-400">Performance comparée des franchisés</p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#6B7280' }} />
          {approved.map((f, i) => (
            <Radar
              key={f.id}
              name={f.nameAr}
              dataKey={f.id}
              stroke={COLORS[i]}
              fill={COLORS[i]}
              fillOpacity={0.08}
              strokeWidth={2}
            />
          ))}
          <Tooltip
            formatter={(value: any, name: string) => {
              const f = approved.find((fr) => fr.id === name);
              return [`${Number(value).toFixed(0)}%`, f?.nameAr ?? name];
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {approved.map((f, i) => (
          <div key={f.id} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-3 h-3 rounded-sm" style={{ background: COLORS[i] }} />
            {f.nameAr}
          </div>
        ))}
      </div>
    </div>
  );
};
