import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { KPI } from '../../types';
import { cn, formatMAD, formatNumber } from '../../utils/cn';

const COLOR_MAP: Record<KPI['color'], { bg: string; ring: string; text: string }> = {
  emerald: { bg: 'bg-emerald/8', ring: 'ring-emerald/15', text: 'text-emerald' },
  gold: { bg: 'bg-gold-pale', ring: 'ring-gold/20', text: 'text-gold-dark' },
  blue: { bg: 'bg-blue-50', ring: 'ring-blue-200', text: 'text-blue-700' },
  purple: { bg: 'bg-purple-50', ring: 'ring-purple-200', text: 'text-purple-700' },
  red: { bg: 'bg-red-50', ring: 'ring-red-200', text: 'text-red-700' },
};

interface KPICardProps {
  kpi: KPI;
  loading?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi, loading }) => {
  const colors = COLOR_MAP[kpi.color];
  const isMonetary = kpi.unit === 'MAD';
  const displayValue = typeof kpi.value === 'number'
    ? isMonetary ? formatMAD(kpi.value) : formatNumber(kpi.value)
    : kpi.value;

  if (loading) {
    return (
      <div className="card p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  return (
    <div className="card card-hover p-5 group transition-all duration-200 cursor-default">
      {/* Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xl ring-1', colors.bg, colors.ring)}>
          {kpi.icon}
        </div>
        {/* Change badge */}
        <div className={cn(
          'flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
          kpi.changeType === 'increase' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        )}>
          {kpi.changeType === 'increase'
            ? <TrendingUp size={11} />
            : <TrendingDown size={11} />
          }
          {kpi.changeType === 'increase' ? '+' : '-'}{Math.abs(kpi.change)}{isMonetary ? '' : kpi.unit === '' ? '' : '%'}
        </div>
      </div>

      {/* Value */}
      <div className={cn('text-2xl font-bold mb-1', colors.text)}>
        {displayValue}
        {kpi.unit && kpi.unit !== 'MAD' && (
          <span className="text-sm font-normal text-gray-400 mr-1">{kpi.unit}</span>
        )}
      </div>

      {/* Label */}
      <div className="text-sm text-gray-500 font-medium">{kpi.labelAr}</div>
      <div className="text-xs text-gray-300 mt-0.5">{kpi.labelFr}</div>
    </div>
  );
};
