import React, { useState } from 'react';
import { ShoppingBag, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAdminStore } from '../store/adminStore';
import { formatMAD, formatNumber, cn } from '../utils/cn';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

// Mock live orders for demo
const LIVE_ORDERS = [
  { id: 'o1', number: '#8942', restaurant: 'الدار البيضاء المركز', city: 'الدار البيضاء', items: 3, total: 275, status: 'preparing', type: 'dine_in', table: 'T-04', createdAt: new Date(Date.now() - 12 * 60000) },
  { id: 'o2', number: '#8943', restaurant: 'الرباط أكدال', city: 'الرباط', items: 2, total: 190, status: 'confirmed', type: 'takeaway', table: null, createdAt: new Date(Date.now() - 6 * 60000) },
  { id: 'o3', number: '#8944', restaurant: 'مراكش جليز', city: 'مراكش', items: 5, total: 460, status: 'pending', type: 'dine_in', table: 'T-07', createdAt: new Date(Date.now() - 2 * 60000) },
  { id: 'o4', number: '#8941', restaurant: 'فاس الجديد', city: 'فاس', items: 1, total: 85, status: 'ready', type: 'takeaway', table: null, createdAt: new Date(Date.now() - 22 * 60000) },
  { id: 'o5', number: '#8940', restaurant: 'أكادير المدينة', city: 'أكادير', items: 4, total: 380, status: 'delivered', type: 'dine_in', table: 'T-02', createdAt: new Date(Date.now() - 45 * 60000) },
  { id: 'o6', number: '#8939', restaurant: 'الدار البيضاء المركز', city: 'الدار البيضاء', items: 2, total: 140, status: 'delivered', type: 'dine_in', table: 'T-11', createdAt: new Date(Date.now() - 60 * 60000) },
];

const STATUS_PIPELINE = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
const STATUS_LABELS: Record<string, string> = {
  pending: 'في الانتظار', confirmed: 'مؤكد', preparing: 'قيد التحضير',
  ready: 'جاهز', delivered: 'تم التسليم', cancelled: 'ملغي',
};

export const OrdersPage: React.FC = () => {
  const { cities } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = statusFilter === 'all'
    ? LIVE_ORDERS
    : LIVE_ORDERS.filter((o) => o.status === statusFilter);

  // Pipeline counts
  const pipelineCounts = STATUS_PIPELINE.map((s) => ({
    status: s,
    count: LIVE_ORDERS.filter((o) => o.status === s).length,
    total: LIVE_ORDERS.filter((o) => o.status === s).reduce((sum, o) => sum + o.total, 0),
  }));

  const todayRevenue = LIVE_ORDERS.filter((o) => o.status === 'delivered').reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'طلبات اليوم', value: String(LIVE_ORDERS.length), icon: '🛍️', color: 'text-emerald' },
          { label: 'رقم أعمال اليوم', value: formatMAD(todayRevenue + 3750), icon: '💰', color: 'text-gold-dark' },
          { label: 'طلبات نشطة', value: String(LIVE_ORDERS.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length), icon: '⚡', color: 'text-blue-600' },
          { label: 'متوسط وقت التسليم', value: '18 دقيقة', icon: '⏱️', color: 'text-purple-600' },
        ].map((item) => (
          <div key={item.label} className="card p-4 text-right">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
            <div className="text-xs text-gray-400 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Pipeline kanban */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-emerald text-right mb-4">مسار الطلبات الحية</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {pipelineCounts.map((stage, i) => (
            <div key={stage.status} className="flex-1 min-w-[140px]">
              <div className={cn(
                'rounded-2xl p-4 text-center border-2 transition-all cursor-pointer',
                statusFilter === stage.status
                  ? 'border-emerald bg-emerald/5'
                  : 'border-gray-100 bg-gray-50/50 hover:border-emerald/30'
              )}
                onClick={() => setStatusFilter(statusFilter === stage.status ? 'all' : stage.status)}
              >
                <div className="text-2xl font-bold text-emerald mb-1">{stage.count}</div>
                <div className="text-xs font-medium text-gray-600">{STATUS_LABELS[stage.status]}</div>
                {stage.total > 0 && (
                  <div className="text-xs text-gold-dark font-medium mt-1">{formatMAD(stage.total)}</div>
                )}
              </div>
              {/* Connector arrow */}
              {i < pipelineCounts.length - 1 && (
                <div className="flex justify-center mt-2 text-gray-300 text-lg">›</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex gap-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                statusFilter === 'all' ? 'bg-emerald text-white' : 'text-gray-500 hover:text-emerald'
              )}
            >
              الكل ({LIVE_ORDERS.length})
            </button>
            {['pending', 'preparing', 'delivered'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                  statusFilter === s ? 'bg-emerald text-white' : 'text-gray-500 hover:text-emerald'
                )}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <h3 className="text-sm font-bold text-emerald">الطلبات الجارية</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['الحالة', 'نوع الطلب', 'المبلغ', 'الوقت', 'الفرع', 'الرقم'].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => {
                const elapsed = Math.floor((Date.now() - order.createdAt.getTime()) / 60000);
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status as any} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                        {order.type === 'dine_in' ? `🍽️ طاولة ${order.table}` : '🥡 للخارج'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-gold-dark">{formatMAD(order.total)}</div>
                      <div className="text-xs text-gray-400">{order.items} أصناف</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-xs justify-end">
                        <span className={cn(elapsed > 30 ? 'text-red-500' : elapsed > 15 ? 'text-amber-500' : 'text-green-500')}>
                          <Clock size={11} />
                        </span>
                        <span className="text-gray-500">منذ {elapsed} د</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-emerald">{order.restaurant}</div>
                      <div className="text-xs text-gray-400">{order.city}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-bold text-emerald">{order.number}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue by city (today) */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-emerald text-right mb-4">توزيع المبيعات اليومية حسب المدينة</h3>
        <div className="space-y-3">
          {[...cities]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map((city) => {
              const dayRevenue = city.revenue / 30;
              const maxDay = cities[0].revenue / 30;
              return (
                <div key={city.id} className="flex items-center gap-4">
                  <div className="w-20 text-xs font-medium text-gold-dark text-left flex-shrink-0">
                    {formatMAD(dayRevenue)}
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-gradient rounded-full"
                      style={{ width: `${(dayRevenue / maxDay) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm font-semibold text-emerald w-24 text-right flex-shrink-0">
                    {city.nameAr}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
