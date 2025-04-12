
import React from 'react';
import MainHeaderLinks from './MainHeaderLinks';
import MainHeaderUserMenu from './MainHeaderUserMenu';

const MainHeaderMobile = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-black border-b border-cyan-500/20">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-col gap-4">
          <MainHeaderLinks isMobile={true} onItemClick={onClose} />
          <MainHeaderUserMenu isMobile={true} onItemClick={onClose} />
        </nav>
      </div>
    </div>
  );
};

export default MainHeaderMobile;
