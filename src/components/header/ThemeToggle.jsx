
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/theme';
import { Toggle } from '@/components/ui/toggle';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Toggle 
      aria-label="Toggle theme"
      pressed={theme === 'dark'}
      onPressedChange={toggleTheme}
      className="border border-cyan-500/20 bg-black/60 hover:bg-cyan-400/10 data-[state=on]:bg-cyan-400/20 transition-all duration-300 rounded-full p-2"
    >
      {theme === 'dark' ? (
        <Moon size={16} className="text-cyan-400" />
      ) : (
        <Sun size={16} className="text-yellow-400" />
      )}
    </Toggle>
  );
};

export default ThemeToggle;
