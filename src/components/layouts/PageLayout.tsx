
import React, { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  children, 
  className = "max-w-6xl",
  maxWidth
}) => {
  // Update the document title
  React.useEffect(() => {
    document.title = `${title} | PuzzleBoss`;
  }, [title]);

  return (
    <main className={`container mx-auto px-4 py-8 ${className}`} style={maxWidth ? { maxWidth } : undefined}>
      {children}
    </main>
  );
};

export default PageLayout;
