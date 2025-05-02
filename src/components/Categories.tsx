import React, { useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryProps {
  title: string;
  description: string;
  icon?: string;
  color: string;
  imageUrl?: string;
}

const CategoryCard: React.FC<CategoryProps> = ({ title, description, icon, color, imageUrl }) => {
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
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
};

const getColorForIndex = (index: number): string => {
  const colors = [
    'bg-puzzle-aqua/20',
    'bg-puzzle-gold/20',
    'bg-puzzle-burgundy/20',
    'bg-purple-500/20',
    'bg-green-500/20',
    'bg-blue-500/20'
  ];
  return colors[index % colors.length];
};

// Function to get a placeholder image URL based on category name
const getCategoryImage = (categoryName: string): string => {
  const categoryMap: Record<string, string> = {
    'Technology': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
    'Gaming': 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop',
    'Sports': 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&h=300&fit=crop',
    'Music': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
    'Art': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop',
    'Science': 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop',
    'Nature': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
    'History': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=300&fit=crop',
    'Literature': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop',
    'Movies': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop',
    'Food': 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop',
    'Smartphones': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop',
    'Laptops': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
    'Headphones': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop',
    'Smartwatches': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=300&fit=crop'
  };
  
  // Default fallback image
  const defaultImage = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop';
  
  // Check if we have a specific image for this category name
  if (categoryMap[categoryName]) {
    return categoryMap[categoryName];
  }
  
  // Check if category name contains any of our keys (case insensitive)
  const lowerCaseName = categoryName.toLowerCase();
  for (const [key, url] of Object.entries(categoryMap)) {
    if (lowerCaseName.includes(key.toLowerCase())) {
      return url;
    }
  }
  
  // Return default image if no match found
  return defaultImage;
};

const Categories: React.FC = () => {
  const { data: categories, isLoading, error, refetch } = useCategories();
  
  // Enhanced debugging - log when component mounts/unmounts
  useEffect(() => {
    console.log('Categories component mounted');
    return () => console.log('Categories component unmounted');
  }, []);
  
  // Debug categories whenever they change
  useEffect(() => {
    console.log('Categories data changed:', categories);
  }, [categories]);
  
  // Force refetch on mount
  useEffect(() => {
    console.log('Forcing initial categories fetch');
    refetch();
  }, [refetch]);

  const handleManualRefresh = () => {
    console.log('Manual refresh requested');
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
      </div>
    );
  }

  if (error) {
    console.error('Error loading categories:', error);
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          Failed to load categories. Please try again later.
        </div>
        <Button onClick={handleManualRefresh} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (!categories?.length) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-4">
          No categories available in the database.
        </div>
        <Button onClick={handleManualRefresh} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-puzzle-black/50" id="categories">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="section-title text-puzzle-white">
              Puzzle <span className="text-puzzle-gold">Categories</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mb-4">
              Explore a wide variety of puzzle types and challenges that test different skills and abilities.
            </p>
          </div>
          <Button onClick={handleManualRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Categories
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              title={category.name}
              description={category.description || `Explore our ${category.name} puzzle collection`}
              icon={category.icon || undefined}
              color={getColorForIndex(index)}
              imageUrl={category.image_url || getCategoryImage(category.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
