
import React from 'react';

interface CategoryProps {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const CategoryCard: React.FC<CategoryProps> = ({ title, description, icon, color }) => {
  return (
    <div className="card-highlight p-6 hover:translate-y-[-5px] transition-all duration-300">
      <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
};

const Categories: React.FC = () => {
  const categories = [
    {
      title: "Jigsaw",
      description: "Classic picture puzzles with pieces that interlock",
      icon: "🧩",
      color: "bg-puzzle-aqua/20"
    },
    {
      title: "Crosswords",
      description: "Word puzzles with interlocking letters in a grid",
      icon: "📝",
      color: "bg-puzzle-gold/20"
    },
    {
      title: "Logic",
      description: "Deductive reasoning challenges and brain teasers",
      icon: "🧠",
      color: "bg-puzzle-burgundy/20"
    },
    {
      title: "Sudoku",
      description: "Number placement puzzles with grids and blocks",
      icon: "🔢",
      color: "bg-purple-500/20"
    },
    {
      title: "Word Search",
      description: "Find hidden words in a grid of random letters",
      icon: "🔍",
      color: "bg-green-500/20"
    },
    {
      title: "3D Puzzles",
      description: "Three-dimensional constructions and challenges",
      icon: "🔮",
      color: "bg-blue-500/20"
    }
  ];

  return (
    <section className="py-16 bg-puzzle-black/50" id="categories">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-puzzle-white">
          Puzzle <span className="text-puzzle-gold">Categories</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Explore a wide variety of puzzle types and challenges that test different skills and abilities.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
