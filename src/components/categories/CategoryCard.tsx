
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CategoryCardProps {
  title: string;
  description: string;
  icon?: string;
  color: string;
  imageUrl?: string;
  categoryId?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  imageUrl, 
  categoryId 
}) => {
  return (
    <div className="card-highlight p-6 hover:translate-y-[-5px] transition-all duration-300">
      {imageUrl ? (
        <div className="w-full h-40 mb-4 overflow-hidden rounded-md">
          <img 
            src={imageUrl} 
            alt={`${title} category`} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <span className="text-3xl">{icon || '🎯'}</span>
        </div>
      )}
      <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
      <p className="text-muted-foreground text-center mb-4">{description}</p>
      
      {categoryId && (
        <div className="text-center">
          <Button asChild className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
            <Link to={`/categories/${categoryId}`}>View Puzzles</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
