
import React from 'react';
import { Link } from 'react-router-dom';
import PermissionGate from '../PermissionGate';
import { ROLES } from '@/utils/permissions';

const NavbarLinks = ({ isMobile = false, onItemClick = () => {} }) => {
  return (
    <>
      <Link to="/" className="nav-link" onClick={onItemClick}>Home</Link>
      <a href="#categories" className="nav-link" onClick={onItemClick}>Categories</a>
      <a href="#how-it-works" className="nav-link" onClick={onItemClick}>How It Works</a>
      <a href="#prizes" className="nav-link" onClick={onItemClick}>Prizes</a>
      
      {/* Admin links based on permissions */}
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
        <Link to="/admin" className="nav-link text-puzzle-gold" onClick={onItemClick}>
          Admin
        </Link>
      </PermissionGate>
    </>
  );
};

export default NavbarLinks;
