
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Star } from "lucide-react";

// Fancy Bright Confetti Colors
const CONFETTI_COLORS = [
  "#ffd700", // vivid gold
  "#00e5ff", // aqua
  "#ff5f91", // magenta
  "#d946ef", // pink
  "#fff",    // white
  "#8B5CF6", // vivid purple
  "#F97316", // orange
  "#9b87f5", // purple
];

export const PuzzleCongratulationSplash: React.FC<{ show: boolean; solveTime?: number | null; onPlayAgain: () => void }> = ({
  show,
  solveTime,
  onPlayAgain
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 animate-fade-in">
      {/* Sparkling BG */}
      <div className="absolute inset-0 pointer-events-none z-40">
        {[...Array(44)].map((_, i) => {
          const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
          return (
            <div
              key={i}
              className="confetti-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${6 + Math.random() * 9}px`,
                height: `${2 + Math.random() * 7}px`,
                backgroundColor: color,
                opacity: 0.9,
                borderRadius: '2px',
                position: "absolute",
                animation: `confetti-drop 2.6s ${0.1 * i}s cubic-bezier(0.19,0.67,0.89,0.74) infinite`,
                zIndex: 40,
              }}
            />
          );
        })}
        {/* Random sparkle icons */}
        {[...Array(14)].map((_, i) => (
          <Sparkles
            key={"sparkle" + i}
            className="absolute"
            style={{
              left: `${Math.random() * 92 + 4}%`,
              top: `${Math.random() * 84 + 4}%`,
              width: `${18 + Math.random() * 20}px`,
              height: `${18 + Math.random() * 16}px`,
              opacity: 0.24 + Math.random() * 0.15,
              color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
              animation: `twinkle 1.8s ${0.05 * i}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>
      {/* Main Card */}
      <div className="relative px-6 py-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center gap-5 z-10 animate-scale-in border-4 border-puzzle-gold">
        <span className="block text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-puzzle-gold via-puzzle-aqua to-puzzle-gold drop-shadow-glow animate-fade-in flex items-center gap-2">
          <Star className="text-puzzle-gold w-12 h-12 animate-pulse" strokeWidth={2.5}/>
          Congratulations!
          <Star className="text-puzzle-gold w-12 h-12 animate-pulse" strokeWidth={2.5}/>
        </span>
        <span className="block text-2xl md:text-3xl font-semibold text-puzzle-aqua text-center">Puzzle Complete!</span>
        {typeof solveTime === "number" && (
          <span className="mt-1 text-xl text-puzzle-black text-center">
            Time: <b>{solveTime.toFixed(2)}</b> seconds
          </span>
        )}

        <div className="flex flex-col gap-3 w-full max-w-xs mt-3">
          <Button 
            onClick={onPlayAgain}
            variant="default"
            className="w-full bg-puzzle-gold text-puzzle-black shadow-lg hover:bg-puzzle-gold/90 text-lg font-bold"
          >
            Play Again
          </Button>
        </div>
      </div>
      <style>
        {`
          @keyframes confetti-drop {
            0% { transform: translateY(-60px) rotateZ(0deg);}
            70% { opacity:1;}
            100% { transform: translateY(430px) rotateZ(390deg); opacity: 0;}
          }
          @keyframes twinkle {
            0%, 100% { opacity: .18; }
            40% { opacity: .55; }
            67% { opacity: .26; }
          }
          .drop-shadow-glow {
            text-shadow: 0px 2px 6px #ffd700b8, 0px 7px 30px #ffd70022, 0px 0.5px 0.5px #fff;
          }
        `}
      </style>
    </div>
  );
};
