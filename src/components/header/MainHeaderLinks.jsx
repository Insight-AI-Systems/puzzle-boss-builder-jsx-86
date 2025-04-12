
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
  
  // Animation classes for links
  const linkBaseClass = `transition-all duration-300 ${paddingClass}`;
  const linkActiveClass = 'text-cyan-400 scale-105';
  const linkInactiveClass = 'text-white hover:text-cyan-400 hover:scale-105';
  const adminLinkActiveClass = 'text-yellow-400 scale-105';
  const adminLinkInactiveClass = 'text-white hover:text-yellow-400 hover:scale-105';
  
  return (
    <>
      <Link 
        to="/" 
        className={`${linkBaseClass} ${isActive('/') ? linkActiveClass : linkInactiveClass}`}
        onClick={onItemClick}
      >
        <span className={`flex items-center ${gapClass}`}>
          <Home size={iconSize} className="transition-transform group-hover:rotate-3" />
          <span>Home</span>
        </span>
      </Link>
      
      <Link 
        to="/terms" 
        className={`${linkBaseClass} ${isActive('/terms') ? linkActiveClass : linkInactiveClass}`}
        onClick={onItemClick}
      >
        <span className={`flex items-center ${gapClass}`}>
          <FileText size={iconSize} className="transition-transform group-hover:rotate-3" />
          <span>Terms</span>
        </span>
      </Link>
      
      <Link 
        to="/privacy" 
        className={`${linkBaseClass} ${isActive('/privacy') ? linkActiveClass : linkInactiveClass}`}
        onClick={onItemClick}
      >
        <span className={`flex items-center ${gapClass}`}>
          <InfoIcon size={iconSize} className="transition-transform group-hover:rotate-3" />
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
          className={`${linkBaseClass} ${isActive('/admin') ? adminLinkActiveClass : adminLinkInactiveClass}`}
          onClick={onItemClick}
        >
          <span className={`flex items-center ${gapClass}`}>
            <LayoutDashboard size={iconSize} className="transition-transform group-hover:rotate-3" />
            <span>Admin Dashboard</span>
          </span>
        </Link>
      </PermissionGate>
    </>
  );
};

export default MainHeaderLinks;
