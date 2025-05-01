
import React from 'react';
import { MainLayout } from './MainLayout';
import AdminMenu from './AdminMenu';
import { Outlet } from 'react-router-dom';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <MainLayout>
      <div className="flex flex-row min-h-[calc(100vh-4rem)]">
        <AdminMenu />
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
