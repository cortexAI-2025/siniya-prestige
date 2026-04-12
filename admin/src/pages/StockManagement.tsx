import React, { useState } from 'react';
import {
  Package, ShoppingCart, AlertTriangle, TrendingDown,
  Plus, Minus, Send, Filter, Search, RefreshCw,
} from 'lucide-react';
import { StockItem, StockCategory } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAdminStore } from '../store/adminStore';
import { formatMAD, cn } from '../utils/cn';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const CATEGORY_LABELS: Record<StockCategory, { label: string; emoji: string }> = {
  spices: { label: 'البهارات والتوابل', emoji: '🌶️' },
  packaging: { label: 'التغليف والعبوات', emoji: '📦' },
  ingredients: { label: 'المكونات الأساسية', emoji: '🫒' },
  equipment: { label: 'المعدات', emoji: '🍳' },
  cleaning: { label: 'مواد التنظيف', emoji: '🧴' },
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as StockCategory[];

export const StockManagement: React.FC = () => {
  const { stock, updateStock, createStockOrder } = useAdminStore();
  const [categoryFilter, setCategoryFilter] = useState<StockCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [orderSent, setOrderSent] = useState(false);

  const filtered = stock.filter((item) => {
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch =
      item.nameAr.includes(search) ||
      item.nameFr.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const criticalItems = stock.filter((s) => s.status === 'out_of_stock' || s.status === 'low_stock');
  const totalStockValue = stock.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0);

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleOrder = () => {
    createStockOrder(Array.from(selectedItems));
    setSelectedItems(new Set());
    setOrderSent(true);
    setTimeout(() => setOrderSent(false), 3000);
  };

  const handleAutoOrder = () => {
    const criticalIds = criticalItems.map((i) => i.id);
    createStockOrder(criticalIds);
  };

  return (
    <div className="space-y-6">

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'قيمة المخزون الإجمالية', value: formatMAD(totalStockValue), icon: '💰', color: 'text-emerald' },
          { label: 'مواد نفذ مخزونها', value: String(stock.filter((s) => s.status === 'out_of_stock').length), icon: '🚨', color: 'text-red-600' },
          { label: 'مخزون منخفض', value: String(stock.filter((s) => s.status === 'low_stock').length), icon: '⚠️', color: 'text-amber-600' },
          { label: 'طلبات جارية', value: String(stock.filter((s) => s.status === 'ordered').length), icon: '🚚', color: 'text-blue-600' },
        ].map((item) => (
          <div key={item.label} className="card p-4 text-right">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
            <div className="text-xs text-gray-400 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Critical alert */}
      {criticalItems.length > 0 && (
        <div className="card border-2 border-red-100 p-4">
          <div className="flex items-center justify-between">
            <button onClick={handleAutoOrder} className="btn-gold text-xs">
              <Send size={14} />
              طلب تلقائي للموردين ({criticalItems.length} مادة)
            </button>
            <div className="flex items-center gap-2 text-right">
              <div>
                <p className="text-sm font-bold text-red-700">{criticalItems.length} مواد تحتاج إعادة تموين فورية</p>
                <p className="text-xs text-red-500">{criticalItems.map((i) => i.nameAr).join(' • ')}</p>
              </div>
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="بحث بالاسم، المورد..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald/20 bg-white"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-medium transition-all border',
              categoryFilter === 'all' ? 'bg-emerald text-white border-emerald' : 'border-gray-200 text-gray-500 hover:border-emerald hover:text-emerald bg-white'
            )}
          >
            الكل
          </button>
          {CATEGORIES.map((cat) => {
            const cfg = CATEGORY_LABELS[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-medium transition-all border',
                  categoryFilter === cat ? 'bg-emerald text-white border-emerald' : 'border-gray-200 text-gray-500 hover:border-emerald hover:text-emerald bg-white'
                )}
              >
                {cfg.emoji} {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Bulk order */}
        {selectedItems.size > 0 && (
          <button onClick={handleOrder} className="btn-gold">
            <Send size={16} />
            طلب {selectedItems.size} مواد
          </button>
        )}
      </div>

      {/* Stock table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">إجراء</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">الحالة</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">المورد</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">المخزون الحالي</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">التكلفة/وحدة</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">الاستهلاك الشهري</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">التصنيف</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">المادة</th>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) setSelectedItems(new Set(filtered.map((i) => i.id)));
                      else setSelectedItems(new Set());
                    }}
                    className="w-4 h-4 accent-emerald"
                  />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => {
                const pct = item.maxStock > 0 ? Math.min((item.currentStock / item.maxStock) * 100, 100) : 0;
                const daysLeft = item.monthlyConsumption > 0
                  ? Math.floor((item.currentStock / item.monthlyConsumption) * 30)
                  : 999;

                return (
                  <tr
                    key={item.id}
                    className={cn(
                      'hover:bg-gray-50/50 transition-colors',
                      selectedItems.has(item.id) && 'bg-emerald/5',
                      item.status === 'out_of_stock' && 'bg-red-50/30'
                    )}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 accent-emerald"
                      />
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-sm text-emerald">{item.nameAr}</div>
                      <div className="text-xs text-gray-400">{item.nameFr}</div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                        {CATEGORY_LABELS[item.category].emoji} {CATEGORY_LABELS[item.category].label}
                      </span>
                    </td>

                    {/* Monthly consumption */}
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {item.monthlyConsumption} {item.unit}/شهر
                    </td>

                    {/* Unit cost */}
                    <td className="px-4 py-3 text-sm font-medium text-gold-dark">
                      {item.unitCost} MAD
                    </td>

                    {/* Stock level */}
                    <td className="px-4 py-3 min-w-[140px]">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald">
                            {item.currentStock} {item.unit}
                          </div>
                          <div className="text-xs text-gray-400">
                            {daysLeft < 999 ? `~${daysLeft} يوم` : '—'}
                          </div>
                        </div>
                        <div className="w-16">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                item.status === 'out_of_stock' ? 'bg-red-500' :
                                item.status === 'low_stock' ? 'bg-amber-400' : 'bg-green-500'
                              )}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-400 text-center mt-0.5">{pct.toFixed(0)}%</div>
                        </div>
                      </div>
                    </td>

                    {/* Supplier */}
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[140px] truncate">
                      {item.supplier}
                      {item.nextDelivery && (
                        <div className="text-blue-500 font-medium mt-0.5">
                          🚚 {format(item.nextDelivery, 'dd/MM', { locale: ar })}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status as any} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => updateStock(item.id, -1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <button
                          onClick={() => updateStock(item.id, 10)}
                          className="w-7 h-7 rounded-lg border border-emerald/20 flex items-center justify-center text-emerald hover:bg-emerald/10 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => createStockOrder([item.id])}
                          className="w-7 h-7 rounded-lg border border-gold/30 flex items-center justify-center text-gold-dark hover:bg-gold-pale transition-colors"
                          title="طلب إعادة تموين"
                        >
                          <Send size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => {
          const items = stock.filter((s) => s.category === cat);
          const value = items.reduce((sum, i) => sum + i.currentStock * i.unitCost, 0);
          const critical = items.filter((i) => i.status === 'out_of_stock' || i.status === 'low_stock').length;
          return (
            <div key={cat} className="card p-4 text-right">
              <div className="text-2xl mb-2">{CATEGORY_LABELS[cat].emoji}</div>
              <div className="text-sm font-bold text-emerald">{CATEGORY_LABELS[cat].label}</div>
              <div className="text-xs text-gray-400 mt-1">{items.length} مادة • {formatMAD(value)}</div>
              {critical > 0 && (
                <div className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1 justify-end">
                  <AlertTriangle size={10} /> {critical} تنبيه
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
