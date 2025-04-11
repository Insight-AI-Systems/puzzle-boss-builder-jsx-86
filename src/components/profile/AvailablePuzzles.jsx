
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Tag, Clock, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';

/**
 * Component that displays available puzzles for the user
 */
const AvailablePuzzles = ({ user, profile }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Placeholder data - would be fetched from backend in a real implementation
  const categories = [
    "Smartphones", "Laptops", "Headphones", "Gaming", "Fashion", 
    "Jewelry", "Gift Cards", "Experiences"
  ];
  
  const puzzles = [
    {
      id: 1,
      title: "iPhone 15 Pro Challenge",
      category: "Smartphones",
      fee: 10,
      difficulty: "Medium",
      expiry: "Apr 20, 2025",
      isNew: true,
      isFeatured: true
    },
    {
      id: 2,
      title: "Sony Headphones Puzzle",
      category: "Headphones",
      fee: 5,
      difficulty: "Easy",
      expiry: "Apr 25, 2025",
      isNew: false,
      isFeatured: false
    },
    {
      id: 3,
      title: "Gaming Console Mystery",
      category: "Gaming",
      fee: 15,
      difficulty: "Hard",
      expiry: "May 5, 2025",
      isNew: true,
      isFeatured: true
    }
  ];
  
  const filteredPuzzles = puzzles.filter(puzzle => {
    const matchesSearch = puzzle.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || puzzle.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <Card className="bg-puzzle-black border-puzzle-aqua/30">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-puzzle-gold" />
          Available Puzzles
        </CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search puzzles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
            />
          </div>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-md bg-puzzle-black border border-puzzle-aqua/30 text-puzzle-white"
          >
            <option value="all">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredPuzzles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPuzzles.map((puzzle) => (
              <div 
                key={puzzle.id} 
                className="border border-puzzle-aqua/30 rounded-md p-4 bg-gradient-to-br from-puzzle-black to-puzzle-black/90 hover:border-puzzle-aqua/60 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-puzzle-white">{puzzle.title}</h3>
                  <div className="flex space-x-1">
                    {puzzle.isNew && (
                      <Badge className="bg-puzzle-aqua text-puzzle-black">New</Badge>
                    )}
                    {puzzle.isFeatured && (
                      <Badge className="bg-puzzle-gold text-puzzle-black">Featured</Badge>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="text-puzzle-white">{puzzle.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry Fee:</span>
                    <span className="text-puzzle-gold font-semibold">{puzzle.fee} Credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className="text-puzzle-white">{puzzle.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available Until:</span>
                    <span className="text-puzzle-white">{puzzle.expiry}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button className="w-full bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/80">
                    Play Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Filter className="h-12 w-12 text-puzzle-aqua/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No puzzles match your filters</p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
              }}
              className="mt-4 bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/80"
            >
              Clear Filters
            </Button>
          </div>
        )}
        
        <Collapsible className="mt-6 border-t border-puzzle-aqua/20 pt-4">
          <CollapsibleTrigger className="flex w-full justify-between items-center text-sm font-semibold text-puzzle-white">
            <span className="flex items-center">
              <Tag className="h-4 w-4 text-puzzle-gold mr-2" />
              Featured Categories
            </span>
            <span className="text-puzzle-aqua">+</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map((category, index) => (
                <Button 
                  key={index}
                  variant="outline"
                  onClick={() => setCategoryFilter(category)}
                  className="border-puzzle-aqua/30 text-puzzle-white hover:bg-puzzle-aqua/20 hover:text-puzzle-white"
                >
                  {category}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default AvailablePuzzles;
