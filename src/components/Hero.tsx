
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import CustomPuzzleEngine from './puzzles/playground/engines/CustomPuzzleEngine';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
];

const Hero: React.FC = () => {
  const [imageIdx, setImageIdx] = useState(0);
  const [showGuide, setShowGuide] = useState(true);

  const handlePrev = () => {
    setImageIdx((idx) => (idx === 0 ? HERO_IMAGES.length - 1 : idx - 1));
  };

  const handleNext = () => {
    setImageIdx((idx) => (idx === HERO_IMAGES.length - 1 ? 0 : idx + 1));
  };

  const toggleGuide = () => {
    setShowGuide(prev => !prev);
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
          
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative flex flex-col items-center">
              <div className="absolute inset-0 bg-puzzle-aqua/30 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="card-highlight p-4 md:p-8 relative w-[340px] max-w-full">
                <h3 className="text-xl font-bold text-center mb-4 text-puzzle-white">Try a Mini Puzzle</h3>
                
                {/* GUIDE IMAGE SHOWN ABOVE PUZZLE BOX - TOGGLEABLE */}
                {showGuide && (
                  <div className="w-full flex flex-col items-center mb-4">
                    <div
                      className="rounded-lg overflow-hidden border border-puzzle-aqua shadow"
                      style={{
                        width: 300,
                        height: 300,
                        backgroundColor: '#222',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        src={HERO_IMAGES[imageIdx]}
                        alt="Completed puzzle preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: 0.9,
                          display: 'block'
                        }}
                        draggable={false}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <Eye className="w-4 h-4" /> Guide: Completed Solution
                    </span>
                  </div>
                )}

                <div className="w-[300px] h-[300px] flex items-center justify-center mx-auto relative">
                  <CustomPuzzleEngine
                    imageUrl={HERO_IMAGES[imageIdx]}
                    rows={3}
                    columns={3}
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
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleGuide}
                    className="text-xs flex items-center gap-1"
                  >
                    {showGuide ? (
                      <>
                        <EyeOff className="w-4 h-4" /> Hide Guide
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" /> Show Guide
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
