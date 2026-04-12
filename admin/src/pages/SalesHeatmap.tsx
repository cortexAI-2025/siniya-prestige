import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MapPin, Users, ShoppingBag } from 'lucide-react';
import { CityStats } from '../types';
import { useAdminStore } from '../store/adminStore';
import { formatMAD, formatNumber, cn } from '../utils/cn';

// ─── Simple SVG Morocco Map with city bubbles ─────────────────────────────────
// Morocco cities positioned on simplified coordinate grid
const MAP_CITIES: Record<string, { x: number; y: number }> = {
  casa:      { x: 245, y: 205 },
  rabat:     { x: 240, y: 170 },
  tanger:    { x: 225, y: 90 },
  fes:       { x: 330, y: 150 },
  meknes:    { x: 295, y: 155 },
  marrakech: { x: 255, y: 290 },
  agadir:    { x: 195, y: 345 },
  oujda:     { x: 440, y: 145 },
};

// Morocco SVG path (simplified outline)
const MOROCCO_PATH = `
  M 150,70 L 175,60 L 200,55 L 240,50 L 280,48 L 310,52 L 340,58 L 370,65 L 400,80
  L 430,95 L 455,115 L 465,135 L 470,155 L 465,175 L 460,200 L 450,220 L 445,245
  L 450,265 L 455,285 L 450,305 L 440,320 L 420,335 L 395,345 L 365,355
  L 340,370 L 315,382 L 290,390 L 265,395 L 240,392 L 215,385 L 190,375
  L 170,360 L 155,345 L 140,325 L 128,300 L 120,272 L 115,245 L 112,218
  L 110,190 L 112,165 L 118,140 L 128,115 L 140,92 L 150,70 Z
`;

const SAHARA_PATH = `
  M 128,300 L 120,330 L 115,360 L 112,390 L 110,420 L 112,450 L 118,480
  L 130,500 L 155,515 L 185,525 L 220,530 L 260,533 L 300,530 L 340,523
  L 375,512 L 405,498 L 425,480 L 440,458 L 448,432 L 450,405 L 448,378
  L 440,355 L 420,335 L 395,345
  Z
`;

const MoroccoSVGMap: React.FC<{
  cities: CityStats[];
  selectedId: string | null;
  onSelect: (city: CityStats) => void;
}> = ({ cities, selectedId, onSelect }) => {
  const maxRevenue = Math.max(...cities.map((c) => c.revenue));

  return (
    <svg
      viewBox="0 0 600 560"
      className="w-full h-full"
      style={{ maxHeight: 440 }}
    >
      <defs>
        <radialGradient id="mapBg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#e8f4f0" />
          <stop offset="100%" stopColor="#d4e8e0" />
        </radialGradient>
        <radialGradient id="saharaBg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#fef9e7" />
          <stop offset="100%" stopColor="#fdebd0" />
        </radialGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#022C22" floodOpacity="0.15" />
        </filter>
        {cities.map((city) => (
          <radialGradient key={city.id} id={`grad-${city.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#B45309" stopOpacity={0.7} />
          </radialGradient>
        ))}
      </defs>

      {/* Ocean background */}
      <rect width="600" height="560" fill="#dbeafe" opacity={0.3} rx="12" />

      {/* Sahara */}
      <path d={SAHARA_PATH} fill="url(#saharaBg)" stroke="#e5d4b0" strokeWidth="1" opacity={0.8} />

      {/* Morocco territory */}
      <path
        d={MOROCCO_PATH}
        fill="url(#mapBg)"
        stroke="#022C22"
        strokeWidth="1.5"
        strokeOpacity={0.4}
        filter="url(#shadow)"
      />

      {/* Grid lines (subtle) */}
      {[150, 200, 250, 300, 350].map((y) => (
        <line key={y} x1="100" y1={y} x2="490" y2={y} stroke="#022C22" strokeOpacity={0.04} strokeDasharray="4" />
      ))}
      {[150, 200, 250, 300, 350, 400, 450].map((x) => (
        <line key={x} x1={x} y1="50" x2={x} y2="500" stroke="#022C22" strokeOpacity={0.04} strokeDasharray="4" />
      ))}

      {/* City bubbles */}
      {cities.map((city) => {
        const pos = MAP_CITIES[city.id];
        if (!pos) return null;
        const radius = 10 + (city.revenue / maxRevenue) * 32;
        const isSelected = selectedId === city.id;
        const pct = city.revenue / maxRevenue;

        return (
          <g
            key={city.id}
            onClick={() => onSelect(city)}
            className="cursor-pointer"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
          >
            {/* Pulse ring */}
            {isSelected && (
              <circle
                r={radius + 8}
                fill="none"
                stroke="#B45309"
                strokeWidth="2"
                opacity={0.5}
                className="animate-ping"
              />
            )}

            {/* Heatmap glow */}
            <circle
              r={radius + 12}
              fill={`rgba(180, 83, 9, ${pct * 0.15})`}
            />

            {/* Main bubble */}
            <circle
              r={radius}
              fill={`url(#grad-${city.id})`}
              stroke={isSelected ? '#022C22' : 'rgba(255,255,255,0.6)'}
              strokeWidth={isSelected ? 2.5 : 1.5}
              opacity={0.88}
            />

            {/* City label */}
            <text
              textAnchor="middle"
              dy="-0.3em"
              fontSize={radius > 22 ? 11 : 9}
              fill="white"
              fontWeight="700"
              style={{ pointerEvents: 'none', fontFamily: 'Inter, sans-serif' }}
            >
              {city.nameAr}
            </text>
            <text
              textAnchor="middle"
              dy="0.9em"
              fontSize={radius > 22 ? 9 : 8}
              fill="white"
              opacity={0.85}
              style={{ pointerEvents: 'none', fontFamily: 'Inter, sans-serif' }}
            >
              {(city.revenue / 1000).toFixed(0)}K
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(20, 490)">
        <text fontSize="10" fill="#6B7280" fontFamily="Inter, sans-serif">الحجم ∝ رقم الأعمال</text>
        {[0.2, 0.5, 1.0].map((scale, i) => (
          <g key={scale} transform={`translate(${i * 55 + 10}, -14)`}>
            <circle r={10 + scale * 12} fill="#B45309" opacity={0.7} cy={14} />
            <text textAnchor="middle" dy="32" fontSize="8" fill="#9CA3AF" fontFamily="Inter, sans-serif">
              {scale === 1 ? 'أعلى' : scale === 0.5 ? 'وسط' : 'أدنى'}
            </text>
          </g>
        ))}
      </g>

      {/* Compass */}
      <g transform="translate(540, 80)">
        <circle r="16" fill="white" opacity={0.8} />
        <text textAnchor="middle" dy="-8" fontSize="9" fill="#022C22" fontWeight="700" fontFamily="Inter, sans-serif">N</text>
        <line x1="0" y1="-12" x2="0" y2="12" stroke="#022C22" strokeWidth="1" opacity={0.4} />
        <line x1="-12" y1="0" x2="12" y2="0" stroke="#022C22" strokeWidth="1" opacity={0.4} />
      </g>
    </svg>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const SalesHeatmapPage: React.FC = () => {
  const { cities } = useAdminStore();
  const [selectedCity, setSelectedCity] = useState<CityStats | null>(cities[0]);
  const [metric, setMetric] = useState<'revenue' | 'orders' | 'growth'>('revenue');

  const sortedCities = [...cities].sort((a, b) => {
    if (metric === 'revenue') return b.revenue - a.revenue;
    if (metric === 'orders') return b.orders - a.orders;
    return b.growth - a.growth;
  });

  return (
    <div className="space-y-6">

      {/* Metric toggle */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {[
            { id: 'revenue', label: 'رقم الأعمال' },
            { id: 'orders', label: 'عدد الطلبات' },
            { id: 'growth', label: 'النمو %' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id as any)}
              className={cn(
                'px-4 py-2 text-xs font-medium rounded-lg transition-all',
                metric === m.id ? 'bg-emerald text-white shadow-sm' : 'text-gray-500 hover:text-emerald'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-400">تصور توزيع المبيعات على خريطة المغرب</span>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Map */}
        <div className="lg:col-span-2 card p-6">
          <div className="mb-4 text-right">
            <h3 className="text-base font-bold text-emerald">🗺️ خريطة حرارة المبيعات — المغرب</h3>
            <p className="text-xs text-gray-400">Heatmap des ventes par ville • Cliquer sur une ville pour les détails</p>
          </div>

          <MoroccoSVGMap
            cities={cities}
            selectedId={selectedCity?.id ?? null}
            onSelect={setSelectedCity}
          />
        </div>

        {/* City detail + ranking */}
        <div className="space-y-4">

          {/* Selected city detail */}
          {selectedCity && (
            <div className="card p-5 border-2 border-gold/20">
              <div className="flex items-center justify-between mb-4">
                <span className="badge-gold text-xs">{selectedCity.franchiseeCount} فرانشايز</span>
                <h3 className="text-lg font-bold text-emerald">{selectedCity.nameAr}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'رقم الأعمال', value: formatMAD(selectedCity.revenue), icon: '💰' },
                  { label: 'الطلبات', value: formatNumber(selectedCity.orders), icon: '🛍️' },
                  { label: 'متوسط الطلب', value: formatMAD(selectedCity.avgOrderValue), icon: '📊' },
                  { label: 'النمو الشهري', value: `+${selectedCity.growth}%`, icon: '📈' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 rounded-xl p-3 text-right">
                    <div className="text-lg mb-1">{stat.icon}</div>
                    <div className="text-sm font-bold text-emerald">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Growth indicator */}
              <div className={cn(
                'flex items-center gap-2 justify-end px-3 py-2 rounded-xl text-sm font-semibold',
                selectedCity.growth > 10 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
              )}>
                {selectedCity.growth > 10
                  ? <TrendingUp size={16} />
                  : <TrendingDown size={16} />
                }
                نمو {selectedCity.growth}% مقارنة بالشهر الماضي
              </div>
            </div>
          )}

          {/* City ranking */}
          <div className="card p-5">
            <h4 className="text-sm font-bold text-emerald text-right mb-3">
              ترتيب المدن — {metric === 'revenue' ? 'رقم الأعمال' : metric === 'orders' ? 'الطلبات' : 'النمو'}
            </h4>
            <div className="space-y-2">
              {sortedCities.map((city, i) => {
                const maxVal = sortedCities[0][metric];
                const val = city[metric];
                const pct = (val / maxVal) * 100;
                return (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city)}
                    className={cn(
                      'w-full text-right rounded-xl p-3 transition-all hover:bg-gray-50',
                      selectedCity?.id === city.id && 'bg-emerald/5 ring-1 ring-emerald/20'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0',
                        i === 0 ? 'bg-gold' : i === 1 ? 'bg-emerald/70' : 'bg-gray-300'
                      )}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">
                            {metric === 'revenue' ? formatMAD(val) : metric === 'orders' ? `${formatNumber(val)} طلب` : `+${val}%`}
                          </span>
                          <span className="text-sm font-semibold text-emerald truncate">{city.nameAr}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-gradient rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* City cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sortedCities.map((city) => (
          <button
            key={city.id}
            onClick={() => setSelectedCity(city)}
            className={cn(
              'card card-hover p-4 text-right transition-all',
              selectedCity?.id === city.id && 'border-2 border-gold shadow-gold'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={cn(
                'text-xs font-semibold flex items-center gap-1',
                city.growth > 15 ? 'text-green-600' : city.growth > 8 ? 'text-blue-600' : 'text-gray-500'
              )}>
                <TrendingUp size={11} />
                +{city.growth}%
              </div>
              <h4 className="font-bold text-emerald">{city.nameAr}</h4>
            </div>
            <div className="text-lg font-bold text-gold-dark">{formatMAD(city.revenue)}</div>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Users size={10} />{city.franchiseeCount}</span>
              <span className="flex items-center gap-1"><ShoppingBag size={10} />{formatNumber(city.orders)}</span>
            </div>
            {/* Mini intensity bar */}
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-gradient rounded-full"
                style={{ width: `${city.intensity * 100}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
