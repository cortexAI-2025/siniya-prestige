import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-silk">
      {/* Sidebar */}
      <Sidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
