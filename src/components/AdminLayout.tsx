
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Admin layout doesn't include the Navbar to prevent duplication */}
      <div className="flex-1 min-h-[calc(100vh-4rem)]">
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
