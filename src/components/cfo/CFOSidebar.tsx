
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  DollarSign, 
  TrendingDown, 
  Users, 
  ChartBar 
} from 'lucide-react';

const menuItems = [
  {
    title: 'Overview',
    path: '/cfo-dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Income',
    path: '/cfo-dashboard/income',
    icon: DollarSign
  },
  {
    title: 'Expenses',
    path: '/cfo-dashboard/expenses',
    icon: TrendingDown
  },
  {
    title: 'Memberships',
    path: '/cfo-dashboard/memberships',
    icon: Users
  },
  {
    title: 'Category Commissions',
    path: '/cfo-dashboard/commissions',
    icon: ChartBar
  }
];

const CFOSidebar = () => {
  return (
    <nav className="w-64 bg-sidebar border-r border-sidebar-border h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground mb-6">
          Financial Management
        </h2>
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-2 rounded-md transition-colors
                  ${isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default CFOSidebar;
