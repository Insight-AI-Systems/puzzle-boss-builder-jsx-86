
import { useState } from 'react';

export function useMobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const openMenu = () => setIsMenuOpen(true);

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    openMenu,
  };
}
