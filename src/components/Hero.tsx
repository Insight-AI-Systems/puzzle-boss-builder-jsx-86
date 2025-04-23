import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomPuzzleEngine from './puzzles/playground/engines/CustomPuzzleEngine';
import HeroPuzzleMini from './puzzles/playground/HeroPuzzleMini';

// Leaderboard mock data
const MOCK_LEADERBOARD = [{
  name: "Alice",
  time: 52.7
}, {
  name: "Morgan",
  time: 54.2
}, {
  name: "Jordan",
  time: 61.8
}, {
  name: "Taylor",
  time: 70.2
}, {
  name: "Casey",
  time: 99.1
}];
const HERO_IMAGES = ["https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7", "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b", "https://images.unsplash.com/photo-1518770660439-4636190af475"];
const Hero: React.FC = () => {
  const [imageIdx, setImageIdx] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<boolean[]>([]);
  const [key, setKey] = useState(Date.now()); // Force re-render when changing images

  // Preload images to ensure they're in cache
  useEffect(() => {
    const preloadImage = (url: string, index: number) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setPreloadedImages(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        console.log(`Hero image ${index} preloaded successfully:`, url);
      };
      img.onerror = e => {
        console.error(`Failed to preload hero image ${index}:`, url, e);
      };
      img.src = `${url}?w=600&h=600&fit=crop&auto=format`;
    };
    HERO_IMAGES.forEach((url, index) => {
      preloadImage(url, index);
    });
  }, []);
  const handlePrev = () => {
    setImageIdx(idx => {
      const newIdx = idx === 0 ? HERO_IMAGES.length - 1 : idx - 1;
      setKey(Date.now()); // Force re-render
      return newIdx;
    });
  };
  const handleNext = () => {
    setImageIdx(idx => {
      const newIdx = idx === HERO_IMAGES.length - 1 ? 0 : idx + 1;
      setKey(Date.now()); // Force re-render
      return newIdx;
    });
  };

  // Add image query params for optimization
  const optimizedImageUrl = `${HERO_IMAGES[imageIdx]}?w=600&h=600&fit=crop&auto=format`;
  return <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-puzzle-white">Race to solve.</span>
              <br />
              <span className="text-puzzle-aqua">Win amazing</span>
              <br />
              <span className="text-puzzle-gold">prizes.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
              Join thousands of puzzle enthusiasts competing to win premium brand-name prizes through skill-based challenges.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90 text-lg px-6 py-3 h-auto" asChild>
                <Link to="/auth?signup=true">Join Now</Link>
              </Button>
              <Button variant="outline" className="border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold/10 text-lg px-6 py-3 h-auto" asChild>
                <Link to="/about">
                  Learn More <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="relative flex flex-col items-center">
              <div className="absolute inset-0 bg-puzzle-aqua/30 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="card-highlight p-4 md:p-8 relative w-[340px] max-w-full">
                <h3 className="text-xl font-bold text-center mb-4 text-puzzle-white">Try a Mini Puzzle</h3>
                <div className="w-[300px] h-[320px] flex items-center justify-center mx-auto relative">
                  <HeroPuzzleMini />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;