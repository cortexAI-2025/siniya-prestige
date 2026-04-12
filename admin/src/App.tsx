import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { FranchiseeManagement } from './pages/FranchiseeManagement';
import { StockManagement } from './pages/StockManagement';
import { SalesHeatmapPage } from './pages/SalesHeatmap';
import { OrdersPage } from './pages/OrdersPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="franchisees" element={<FranchiseeManagement />} />
        <Route path="stock" element={<StockManagement />} />
        <Route path="heatmap" element={<SalesHeatmapPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
