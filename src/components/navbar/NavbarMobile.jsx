
import React from 'react';
import NavbarLinks from './NavbarLinks';
import NavbarUserMenu from './NavbarUserMenu';

const NavbarMobile = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-4 py-4 space-y-4 flex flex-col items-center">
      <div className="flex flex-col items-center space-y-4">
        <NavbarLinks isMobile={true} onItemClick={onClose} />
      </div>
      
      <NavbarUserMenu isMobile={true} onItemClick={onClose} />
    </div>
  );
};

export default NavbarMobile;
