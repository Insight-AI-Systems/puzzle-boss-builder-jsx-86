
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="flex items-center text-muted-foreground text-sm mb-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {item.path && !item.active ? (
            <Link to={item.path} className="hover:text-puzzle-aqua">
              {item.label}
            </Link>
          ) : (
            <span className={item.active ? "text-puzzle-aqua" : ""}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
