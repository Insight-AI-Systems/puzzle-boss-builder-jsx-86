
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

/**
 * Returns an appropriate image URL for a given category name.
 * This function uses a comprehensive mapping of category names to relevant images,
 * with specialized logic for finding the best match.
 */
const getCategoryImage = (categoryName: string): string => {
  // Comprehensive mapping of categories to appropriate images
  const categoryMap: Record<string, string> = {
    // Technology categories
    'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop', // Circuit board
    'Computers': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop', // Computer/coding
    'Programming': 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop', // Code on screen
    'Software': 'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?w=400&h=300&fit=crop', // Software development
    'Gadgets': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop', // Tech gadgets
    'Hardware': 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop', // Computer hardware
    
    // Mobile & devices
    'Smartphones': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop', // Smartphone
    'Laptops': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop', // Laptop
    'Headphones': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop', // Headphones
    'Smartwatches': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=300&fit=crop', // Smartwatch
    'Electronics': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop', // Electronics workbench
    'Mobile': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', // Mobile phone
    
    // Entertainment categories
    'Gaming': 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop', // Gaming setup
    'Movies': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop', // Cinema
    'Music': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop', // Music studio
    'Entertainment': 'https://images.unsplash.com/photo-1603739903239-8b6e64c3b185?w=400&h=300&fit=crop', // Entertainment
    'Books': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=300&fit=crop', // Books
    'Literature': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop', // Book reading
    
    // Art & creative categories
    'Art': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop', // Art supplies
    'Photography': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop', // Camera
    'Design': 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop', // Design tools
    'Creative': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop', // Creative workspace
    
    // Science & education
    'Science': 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop', // Science lab
    'Education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop', // Education
    'History': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=300&fit=crop', // History books/museum
    'Space': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop', // Space/astronomy
    
    // Nature & outdoors
    'Nature': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop', // Nature landscape
    'Travel': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop', // Travel
    'Outdoors': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop', // Outdoors
    'Adventure': 'https://images.unsplash.com/photo-1533130061792-64b345e4d833?w=400&h=300&fit=crop', // Adventure
    
    // Lifestyle categories
    'Food': 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop', // Food
    'Fashion': 'https://images.unsplash.com/photo-1490481651871-ab68de25b43d?w=400&h=300&fit=crop', // Fashion
    'Fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop', // Fitness
    'Health': 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=300&fit=crop', // Health
    'Home': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop', // Home interior
    'Lifestyle': 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop', // Lifestyle
    
    // Sports categories
    'Sports': 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&h=300&fit=crop', // Sports
    'Football': 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=300&fit=crop', // Football
    'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop', // Basketball
    'Soccer': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop', // Soccer
    
    // Business categories
    'Business': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop', // Business
    'Finance': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', // Finance
    'Marketing': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop' // Marketing
  };

  // Default fallback image - a puzzle-related image that's neutral
  const defaultImage = 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=400&h=300&fit=crop'; // Puzzle/brain teaser
  
  // 1. Check for exact match (case insensitive)
  const lowerCaseName = categoryName.toLowerCase();
  for (const [key, url] of Object.entries(categoryMap)) {
    if (key.toLowerCase() === lowerCaseName) {
      return url;
    }
  }
  
  // 2. Check for partial match - word is contained in category name
  for (const [key, url] of Object.entries(categoryMap)) {
    if (lowerCaseName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerCaseName)) {
      return url;
    }
  }

  // 3. Check for semantic matches based on related terms
  const semanticGroups: Record<string, string[]> = {
    'Technology': ['tech', 'digital', 'computer', 'computing', 'it', 'iot'],
    'Art': ['artistic', 'drawing', 'painting', 'sculpture', 'visual'],
    'Music': ['audio', 'sound', 'musical', 'instrument', 'song'],
    'Nature': ['environment', 'natural', 'ecological', 'landscape', 'wildlife'],
    'Science': ['scientific', 'research', 'laboratory', 'experiment', 'stem']
  };
  
  for (const [groupKey, terms] of Object.entries(semanticGroups)) {
    if (terms.some(term => lowerCaseName.includes(term))) {
      return categoryMap[groupKey] || defaultImage;
    }
  }
  
  // 4. Return default image if no match found
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
