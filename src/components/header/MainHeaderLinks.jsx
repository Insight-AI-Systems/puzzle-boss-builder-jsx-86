
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, InfoIcon, LayoutDashboard } from 'lucide-react';
import PermissionGate from '../PermissionGate';
import { ROLES } from '@/utils/permissions';

const MainHeaderLinks = ({ isMobile = false, onItemClick = () => {} }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Adjust size and gap based on mobile or desktop view
  const iconSize = isMobile ? 18 : 16;
  const gapClass = isMobile ? 'gap-2' : 'gap-1';
  const paddingClass = isMobile ? 'py-2' : '';
  
  return (
    <>
      <Link 
        to="/" 
        className={`transition-colors ${isActive('/') ? 'text-cyan-400' : 'text-white hover:text-cyan-400'} ${paddingClass}`}
        onClick={onItemClick}
      >
        <span className={`flex items-center ${gapClass}`}>
          <Home size={iconSize} />
          <span>Home</span>
        </span>
      </Link>
      
      <Link 
        to="/terms" 
        className={`transition-colors ${isActive('/terms') ? 'text-cyan-400' : 'text-white hover:text-cyan-400'} ${paddingClass}`}
        onClick={onItemClick}
      >
        <span className={`flex items-center ${gapClass}`}>
          <FileText size={iconSize} />
          <span>Terms</span>
        </span>
      </Link>
      
      <Link 
        to="/privacy" 
        className={`transition-colors ${isActive('/privacy') ? 'text-cyan-400' : 'text-white hover:text-cyan-400'} ${paddingClass}`}
        onClick={onItemClick}
      >
        <span className={`flex items-center ${gapClass}`}>
          <InfoIcon size={iconSize} />
          <span>Privacy</span>
        </span>
      </Link>
      
      {/* Admin dashboard link for admins */}
      <PermissionGate
        role={[
          ROLES.SUPER_ADMIN,
          ROLES.ADMIN,
          ROLES.CATEGORY_MANAGER,
          ROLES.CFO,
          ROLES.SOCIAL_MEDIA_MANAGER,
          ROLES.PARTNER_MANAGER
        ]}
      >
        <Link 
          to="/admin" 
          className={`transition-colors ${isActive('/admin') ? 'text-yellow-400' : 'text-white hover:text-yellow-400'} ${paddingClass}`}
          onClick={onItemClick}
        >
          <span className={`flex items-center ${gapClass}`}>
            <LayoutDashboard size={iconSize} />
            <span>Admin Dashboard</span>
          </span>
        </Link>
      </PermissionGate>
    </>
  );
};

export default MainHeaderLinks;
