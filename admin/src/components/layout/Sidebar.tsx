import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, Map, Moon,
  ChevronRight, ShoppingBag, Settings, LogOut, Menu, X,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAdminStore } from '../../store/adminStore';

const NAV_ITEMS = [
  { path: '/', label: 'لوحة القيادة', labelFr: 'Dashboard', icon: LayoutDashboard, badge: null },
  { path: '/franchisees', label: 'الفرانشايز', labelFr: 'Franchisés', icon: Users, badge: 'pending' },
  { path: '/stock', label: 'المخزون المركزي', labelFr: "Centrale d'Achat", icon: Package, badge: 'stock' },
  { path: '/heatmap', label: 'خريطة المبيعات', labelFr: 'Carte des Ventes', icon: Map, badge: null },
  { path: '/zakat', label: 'صندوق الزكاة', labelFr: 'Fonds Zakat', icon: Moon, badge: null },
  { path: '/orders', label: 'الطلبات', labelFr: 'Commandes', icon: ShoppingBag, badge: null },
];

export const Sidebar: React.FC<{ collapsed: boolean; onToggle: () => void }> = ({
  collapsed, onToggle,
}) => {
  const getPendingCount = useAdminStore((s) => s.getPendingCount);
  const getLowStockCount = useAdminStore((s) => s.getLowStockCount);

  const getBadge = (badge: string | null): number | null => {
    if (badge === 'pending') return getPendingCount();
    if (badge === 'stock') return getLowStockCount();
    return null;
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          'fixed right-0 top-0 h-full z-30 flex flex-col transition-all duration-300',
          'bg-emerald-gradient shadow-2xl',
          collapsed ? 'w-0 lg:w-18 overflow-hidden' : 'w-72',
          'lg:relative lg:translate-x-0'
        )}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-8">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          {!collapsed && (
            <div>
              <div className="font-display text-gold-shimmer font-bold text-lg leading-tight tracking-wide">
                Siniya
              </div>
              <div className="text-white/50 text-xs tracking-widest">ADMIN PANEL</div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="mr-auto text-white/60 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const badgeCount = getBadge(item.badge);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn('sidebar-item group relative', isActive ? 'sidebar-item-active' : 'sidebar-item-inactive')
                }
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.label}</div>
                      <div className="text-xs text-white/40 truncate">{item.labelFr}</div>
                    </div>
                    {badgeCount && badgeCount > 0 ? (
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold text-white text-xs flex items-center justify-center font-bold animate-pulse-gold">
                        {badgeCount}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 my-3 border-t border-white/10" />

        {/* Bottom */}
        <div className="px-3 pb-6 space-y-1">
          <button className="sidebar-item sidebar-item-inactive w-full text-right">
            <Settings size={18} />
            {!collapsed && <span className="flex-1">الإعدادات</span>}
          </button>
          <button className="sidebar-item sidebar-item-inactive w-full text-right text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut size={18} />
            {!collapsed && <span className="flex-1">خروج</span>}
          </button>
        </div>

        {/* Version */}
        {!collapsed && (
          <div className="px-6 pb-4 text-white/20 text-xs text-center">
            سينيا بريستيج v1.0 — Panel Admin
          </div>
        )}
      </aside>
    </>
  );
};

// Mobile toggle button
export const SidebarToggle: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-xl text-emerald hover:bg-emerald/10 lg:hidden"
  >
    <Menu size={22} />
  </button>
);
