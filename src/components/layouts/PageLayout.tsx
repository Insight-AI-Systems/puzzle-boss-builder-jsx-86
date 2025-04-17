
import React from 'react';
import Navbar from '@/components/navbar/index';
import Footer from '@/components/Footer';

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
  return (
    <div className="min-h-screen flex flex-col bg-puzzle-black text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12 flex-grow">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-game text-puzzle-aqua mb-4">{title}</h1>
          {subtitle && <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>}
        </header>
        <div className={`max-w-4xl mx-auto ${className}`}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
