
import React from 'react';
import PageLayout from './PageLayout';

interface LegalPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <PageLayout title={title} subtitle={subtitle}>
      <div className="prose prose-invert prose-headings:text-puzzle-white prose-headings:font-semibold prose-p:text-gray-300 prose-a:text-puzzle-aqua prose-strong:text-puzzle-aqua max-w-none">
        {children}
      </div>
    </PageLayout>
  );
};

export default LegalPageLayout;
