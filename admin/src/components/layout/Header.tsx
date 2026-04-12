import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, RefreshCw } from 'lucide-react';
import { SidebarToggle } from './Sidebar';
import { useAdminStore } from '../../store/adminStore';

const PAGE_TITLES: Record<string, { ar: string; fr: string; emoji: string }> = {
  '/': { ar: 'لوحة القيادة المركزية', fr: 'Dashboard Central', emoji: '📊' },
  '/franchisees': { ar: 'إدارة الفرانشايز', fr: 'Gestion des Franchisés', emoji: '🏪' },
  '/stock': { ar: 'المخزون المركزي', fr: "Centrale d'Achat", emoji: '📦' },
  '/heatmap': { ar: 'خريطة المبيعات — المغرب', fr: 'Carte Heatmap — Maroc', emoji: '🗺️' },
  '/orders': { ar: 'الطلبات والمعاملات', fr: 'Commandes & Transactions', emoji: '🛍️' },
};

export const Header: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => {
  const { pathname } = useLocation();
  const page = PAGE_TITLES[pathname] ?? PAGE_TITLES['/'];
  const getPendingCount = useAdminStore((s) => s.getPendingCount);
  const notifCount = getPendingCount();

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-emerald/5 shadow-sm">
      <div className="flex items-center gap-4 px-6 py-4">
        <SidebarToggle onClick={onSidebarToggle} />

        {/* Page title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{page.emoji}</span>
            <h1 className="text-lg font-bold text-emerald truncate">{page.ar}</h1>
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wide">{page.fr}</p>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button className="p-2 rounded-xl text-gray-400 hover:text-emerald hover:bg-emerald/5 transition-colors">
            <Search size={18} />
          </button>

          {/* Refresh */}
          <button className="p-2 rounded-xl text-gray-400 hover:text-emerald hover:bg-emerald/5 transition-colors">
            <RefreshCw size={18} />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-gray-400 hover:text-emerald hover:bg-emerald/5 transition-colors">
            <Bell size={18} />
            {notifCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold text-white text-xs flex items-center justify-center font-bold">
                {notifCount}
              </span>
            )}
          </button>

          {/* Admin avatar */}
          <div className="flex items-center gap-2.5 mr-2 pl-4 border-r border-gray-100">
            <div className="text-right">
              <div className="text-sm font-semibold text-emerald">أحمد عكافو</div>
              <div className="text-xs text-gray-400">مستشار — Super Admin</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-gradient flex items-center justify-center text-gold-shimmer font-bold text-sm shadow-sm">
              AA
            </div>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="px-6 pb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs text-gray-400">
          مباشر • آخر تحديث: {new Date().toLocaleTimeString('ar-MA')}
        </span>
      </div>
    </header>
  );
};
