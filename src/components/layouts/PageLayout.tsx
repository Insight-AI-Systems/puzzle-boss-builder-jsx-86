
import React from 'react';
import Footer from '@/components/Footer';

// This component is deprecated in favor of MainLayout
// It's kept for reference but shouldn't be used in new code
interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  className = ""
}) => {
  console.warn('PageLayout is deprecated. Use MainLayout instead.');
  
  return (
    <div className="min-h-screen flex flex-col bg-puzzle-black text-white w-full">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-game text-puzzle-aqua mb-4">{title}</h1>
            {subtitle && <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>}
          </header>
          <div className={`max-w-4xl mx-auto ${className}`}>
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
