
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex-1 min-h-[calc(100vh-4rem)]">
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            {children ? children : <Outlet />}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
