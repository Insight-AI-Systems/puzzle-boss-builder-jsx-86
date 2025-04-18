
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LegalPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  lastUpdated?: string;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  lastUpdated = "January 1, 2025"
}) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-game text-puzzle-aqua mb-4">{title}</h1>
          {subtitle && <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>}
        </header>

        <div className="flex items-center text-muted-foreground text-sm mb-6">
          <Link to="/" className="hover:text-puzzle-aqua">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="#" className="hover:text-puzzle-aqua">Legal</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-puzzle-aqua">{title}</span>
        </div>
        
        <div className="bg-puzzle-black/30 p-4 rounded-lg mb-8 text-sm text-muted-foreground">
          <p className="mb-0">Last Updated: <span className="text-puzzle-white">{lastUpdated}</span></p>
          <p className="mb-0">Effective Date: <span className="text-puzzle-white">{lastUpdated}</span></p>
        </div>
        
        <div className="prose prose-invert prose-headings:text-puzzle-white prose-a:text-puzzle-aqua max-w-4xl">
          {children}
          
          <Separator className="my-8 bg-puzzle-aqua/20" />
          
          <div className="text-sm text-muted-foreground">
            <p>
              If you have any questions about these terms, please contact us at <a href="mailto:legal@puzzleboss.com" className="text-puzzle-aqua hover:underline">legal@puzzleboss.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPageLayout;
