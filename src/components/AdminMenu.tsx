
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, User, Settings } from 'lucide-react';

const AdminMenu = () => {
  return (
    <aside className="w-64 bg-puzzle-black border-r border-puzzle-aqua/20 h-full min-h-screen p-4">
      <div className="font-game text-xl mb-6 text-puzzle-aqua">Admin Portal</div>
      <nav className="space-y-2">
        <Link to="/admin-dashboard" className="flex items-center space-x-2 p-2 hover:bg-puzzle-aqua/10 rounded-md text-puzzle-white hover:text-puzzle-aqua transition-colors">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/admin-dashboard?tab=users" className="flex items-center space-x-2 p-2 hover:bg-puzzle-aqua/10 rounded-md text-puzzle-white hover:text-puzzle-aqua transition-colors">
          <User size={20} />
          <span>User Management</span>
        </Link>
        <Link to="/cfo-dashboard" className="flex items-center space-x-2 p-2 hover:bg-puzzle-aqua/10 rounded-md text-puzzle-white hover:text-puzzle-aqua transition-colors">
          <Settings size={20} />
          <span>CFO Dashboard</span>
        </Link>
      </nav>
    </aside>
  );
};

export default AdminMenu;
