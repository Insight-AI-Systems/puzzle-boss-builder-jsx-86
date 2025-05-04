
import React, { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  subtitle?: string; // Add support for subtitle
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  children, 
  className = "max-w-6xl",
  maxWidth,
  subtitle
}) => {
  // Update the document title
  React.useEffect(() => {
    document.title = `${title} | PuzzleBoss`;
  }, [title]);

  return (
    <main className={`container mx-auto px-4 py-8 ${className}`} style={maxWidth ? { maxWidth } : undefined}>
      {subtitle && (
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      )}
      {children}
    </main>
  );
};

export default PageLayout;
