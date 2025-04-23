
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomPuzzleEngine from './puzzles/playground/engines/CustomPuzzleEngine';

// Leaderboard mock data
const MOCK_LEADERBOARD = [
  { name: "Alice", time: 52.7 },
  { name: "Morgan", time: 54.2 },
  { name: "Jordan", time: 61.8 },
  { name: "Taylor", time: 70.2 },
  { name: "Casey", time: 99.1 },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
];

const Hero: React.FC = () => {
  const [imageIdx, setImageIdx] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<boolean[]>([]);

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
      img.onerror = (e) => {
        console.error(`Failed to preload hero image ${index}:`, url, e);
      };
      img.src = url;
    };

    HERO_IMAGES.forEach((url, index) => {
      preloadImage(url, index);
    });
  }, []);

  const handlePrev = () => {
    setImageIdx((idx) => (idx === 0 ? HERO_IMAGES.length - 1 : idx - 1));
  };

  const handleNext = () => {
    setImageIdx((idx) => (idx === HERO_IMAGES.length - 1 ? 0 : idx + 1));
  };

  return (
    <section className="py-12 md:py-20">
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
              <Button 
                className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90 text-lg px-6 py-3 h-auto" 
                asChild
              >
                <Link to="/auth?signup=true">Join Now</Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold/10 text-lg px-6 py-3 h-auto"
                asChild
              >
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
                <div className="w-[300px] h-[300px] flex items-center justify-center mx-auto relative">
                  <CustomPuzzleEngine
                    imageUrl={HERO_IMAGES[imageIdx]}
                    rows={3}
                    columns={3}
                    showGuideImage={true}
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Previous puzzle image"
                      onClick={handlePrev}
                      className="rounded-full"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <span className="text-muted-foreground text-xs">
                      Image {imageIdx + 1} of {HERO_IMAGES.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Next puzzle image"
                      onClick={handleNext}
                      className="rounded-full"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* Leaderboard */}
            <div className="bg-gradient-to-tr from-puzzle-gold via-puzzle-aqua to-puzzle-gold rounded-2xl shadow-2xl p-6 w-[240px] max-w-[95vw] flex flex-col justify-between">
              <h4 className="text-lg text-center font-bold text-puzzle-black drop-shadow mb-3 tracking-wide">🏅 Top 5 Players</h4>
              <ol className="space-y-3">
                {MOCK_LEADERBOARD.map((entry, idx) => (
                  <li
                    key={entry.name}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg font-semibold shadow
                      ${idx === 0 ? 'bg-puzzle-gold text-black scale-105 animate-pulse-gentle border-2 border-puzzle-gold' :
                        'bg-white/90 text-puzzle-black'}
                    `}
                    style={{ fontSize: idx === 0 ? "1.15rem" : undefined }}
                  >
                    <span>
                      <span className="inline-block w-5 text-center mr-1">{idx + 1}.</span> {entry.name}
                    </span>
                    <span className="text-right">
                      {entry.time.toFixed(2)}
                      <span className="ml-1 text-xs">sec</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
