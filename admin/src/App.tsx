import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { FranchiseeManagement } from './pages/FranchiseeManagement';
import { StockManagement } from './pages/StockManagement';
import { SalesHeatmapPage } from './pages/SalesHeatmap';
import { OrdersPage } from './pages/OrdersPage';
import { MenuManagement } from './pages/MenuManagement';
import { RestaurantPage } from './pages/RestaurantPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="franchisees" element={<FranchiseeManagement />} />
        <Route path="stock" element={<StockManagement />} />
        <Route path="heatmap" element={<SalesHeatmapPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="menu" element={<MenuManagement />} />
        <Route path="restaurants/:id" element={<RestaurantPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
