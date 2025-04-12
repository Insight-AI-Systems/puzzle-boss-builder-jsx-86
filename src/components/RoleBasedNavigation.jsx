
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { 
  ROLES, 
  PERMISSIONS, 
  hasPermission, 
  getRoleDisplayName 
} from '@/utils/permissions';
import {
  Shield,
  ShieldCheck,
  LayoutDashboard,
  PuzzlePiece,
  Users,
  DollarSign,
  Share2,
  Package,
  Settings,
  User,
} from 'lucide-react';

/**
 * Customizable navigation based on user role and permissions
 */
const RoleBasedNavigation = ({ className = "" }) => {
  const { profile } = useAuth();
  
  // Cannot render navigation without profile info
  if (!profile) return null;

  // Define navigation items based on permissions
  const navItems = [
    // Admin dashboard - for all admin roles
    ...(hasPermission(profile, PERMISSIONS.MANAGE_USERS) ? [
      {
        name: 'Admin Dashboard',
        path: '/admin',
        icon: <ShieldCheck size={18} />,
      }
    ] : []),
    
    // User management - for super admins and admins
    ...(hasPermission(profile, PERMISSIONS.MANAGE_USERS) ? [
      {
        name: 'Users',
        path: '/admin/users',
        icon: <Users size={18} />,
      }
    ] : []),
    
    // Puzzle management - for admins and category managers
    ...(hasPermission(profile, PERMISSIONS.MANAGE_PUZZLES) || 
        hasPermission(profile, PERMISSIONS.MANAGE_CATEGORIES) ? [
      {
        name: 'Puzzles',
        path: '/admin/puzzles',
        icon: <PuzzlePiece size={18} />,
      }
    ] : []),
    
    // Financial management - for CFOs
    ...(hasPermission(profile, PERMISSIONS.MANAGE_FINANCES) ? [
      {
        name: 'Finances',
        path: '/admin/finances',
        icon: <DollarSign size={18} />,
      }
    ] : []),
    
    // Marketing management - for social media managers
    ...(hasPermission(profile, PERMISSIONS.MANAGE_MARKETING) ? [
      {
        name: 'Marketing',
        path: '/admin/marketing',
        icon: <Share2 size={18} />,
      }
    ] : []),
    
    // Partner management - for partner managers
    ...(hasPermission(profile, PERMISSIONS.MANAGE_PARTNERS) ? [
      {
        name: 'Partners',
        path: '/admin/partners',
        icon: <Package size={18} />,
      }
    ] : []),
    
    // My profile - for all users
    {
      name: 'My Profile',
      path: '/profile',
      icon: <User size={18} />,
    },
    
    // Settings - for all users
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings size={18} />,
    },
  ];

  return (
    <div className={`role-based-navigation ${className}`}>
      <div className="mb-4 px-3">
        <div className="flex items-center space-x-2 p-2 rounded-md bg-puzzle-aqua/10">
          <Shield size={16} className="text-puzzle-aqua" />
          <span className="text-sm font-medium text-puzzle-white">
            {getRoleDisplayName(profile.role)}
          </span>
        </div>
      </div>
      
      <nav>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center px-3 py-2 rounded-md text-puzzle-white hover:bg-puzzle-aqua/10 transition-colors"
              >
                <span className="mr-2 text-puzzle-aqua">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default RoleBasedNavigation;
