import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { KPICard } from '../components/ui/KPICard';
import { RevenueChart } from '../components/charts/RevenueChart';
import { FranchiseePerformanceChart } from '../components/charts/FranchiseePerformanceChart';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAdminStore } from '../store/adminStore';
import { formatMAD, formatNumber } from '../utils/cn';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export const Dashboard: React.FC = () => {
  const { kpis, revenue, franchisees, stock, zakatEntries, cities } = useAdminStore();

  const pendingFranchisees = franchisees.filter((f) => f.status === 'pending');
  const lowStockItems = stock.filter((s) => s.status === 'low_stock' || s.status === 'out_of_stock');
  const approvedFranchisees = franchisees.filter((f) => f.status === 'approved');
  const topCity = [...cities].sort((a, b) => b.revenue - a.revenue)[0];

  return (
    <div className="space-y-6">

      {/* Alert banner if pending franchisees */}
      {pendingFranchisees.length > 0 && (
        <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <AlertTriangle size={20} className="text-amber-500 flex-shrink-0" />
          <div className="flex-1 text-right">
            <p className="text-sm font-semibold text-amber-800">
              {pendingFranchisees.length} طلبات فرانشايز تنتظر الموافقة
            </p>
            <p className="text-xs text-amber-600">{pendingFranchisees.map((f) => f.nameAr).join(' • ')}</p>
          </div>
          <Link to="/franchisees" className="btn-gold text-sm whitespace-nowrap">
            مراجعة الطلبات
          </Link>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Main charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenue} />
        </div>
        <FranchiseePerformanceChart franchisees={franchisees} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Pending franchisees */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <Link to="/franchisees" className="text-gold text-xs font-medium flex items-center gap-1 hover:text-gold-dark">
              عرض الكل <ArrowLeft size={12} />
            </Link>
            <h3 className="text-sm font-bold text-emerald">طلبات الفرانشايز المعلقة</h3>
          </div>

          {pendingFranchisees.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <CheckCircle size={32} className="mx-auto mb-2 text-green-400" />
              <p className="text-sm">لا توجد طلبات معلقة</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingFranchisees.slice(0, 4).map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                  <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {f.avatar}
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <p className="text-sm font-semibold text-emerald truncate">{f.nameAr}</p>
                    <p className="text-xs text-gray-400">{f.cityAr} • {f.localSize}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <Clock size={12} />
                    {format(f.appliedAt, 'dd/MM', { locale: ar })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock alert */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <Link to="/stock" className="text-gold text-xs font-medium flex items-center gap-1 hover:text-gold-dark">
              إدارة المخزون <ArrowLeft size={12} />
            </Link>
            <h3 className="text-sm font-bold text-emerald">تنبيهات المخزون</h3>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <CheckCircle size={32} className="mx-auto mb-2 text-green-400" />
              <p className="text-sm">المخزون في حالة جيدة</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockItems.slice(0, 5).map((item) => {
                const pct = Math.min((item.currentStock / item.maxStock) * 100, 100);
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={item.status as any} />
                      <span className="text-xs font-medium text-emerald">{item.nameAr}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${item.status === 'out_of_stock' ? 'bg-red-500' : 'bg-amber-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>الحد الأدنى: {item.minStock} {item.unit}</span>
                      <span>{item.currentStock} {item.unit} متبقي</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top cities */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <Link to="/heatmap" className="text-gold text-xs font-medium flex items-center gap-1 hover:text-gold-dark">
              الخريطة <ArrowLeft size={12} />
            </Link>
            <h3 className="text-sm font-bold text-emerald">أفضل المدن مبيعاً</h3>
          </div>

          <div className="space-y-3">
            {[...cities]
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 5)
              .map((city, i) => (
                <div key={city.id} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0
                    ${i === 0 ? 'bg-gold' : i === 1 ? 'bg-emerald/60' : 'bg-gray-300'}`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <TrendingUp size={10} className="text-green-500" />
                        +{city.growth}%
                      </span>
                      <span className="text-sm font-semibold text-emerald">{city.nameAr}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-gray-400">{formatNumber(city.orders)} طلب</span>
                      <span className="text-xs font-medium text-gold-dark">{formatMAD(city.revenue)}</span>
                    </div>
                    {/* Mini progress bar */}
                    <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-gradient rounded-full"
                        style={{ width: `${city.intensity * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Zakat overview */}
      <div className="card overflow-hidden">
        <div className="bg-emerald-gradient px-6 py-4 flex items-center justify-between">
          <Link to="/zakat" className="text-gold-shimmer text-xs font-medium flex items-center gap-1 hover:text-gold">
            تقرير كامل <ArrowLeft size={12} />
          </Link>
          <div className="text-right">
            <h3 className="text-base font-bold text-white">🌙 صندوق الزكاة — دجنبر 2024</h3>
            <p className="text-xs text-white/50">Fonds Zakat El Maal — Bilan mensuel</p>
          </div>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'إجمالي المحصّل', value: formatMAD(zakatEntries.reduce((s, z) => s + z.amount, 0)), icon: '💰' },
            { label: 'تم التوزيع', value: formatMAD(zakatEntries.filter((z) => z.status === 'distributed').reduce((s, z) => s + z.amount, 0)), icon: '✅' },
            { label: 'المتبقي للتوزيع', value: formatMAD(zakatEntries.filter((z) => z.status !== 'distributed').reduce((s, z) => s + z.amount, 0)), icon: '⏳' },
            { label: 'عدد المستفيدين', value: '127 أسرة', icon: '🤲' },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 rounded-xl bg-emerald/5 border border-emerald/10">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-sm font-bold text-emerald">{item.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
