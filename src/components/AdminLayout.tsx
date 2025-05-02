
import React from 'react';
import { MainLayout } from './MainLayout';
import { Outlet } from 'react-router-dom';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-4rem)]">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default AdminLayout;
