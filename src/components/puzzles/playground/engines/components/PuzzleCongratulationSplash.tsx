
import React from "react";
import { Award, RefreshCw, LogOut, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PuzzleCongratulationSplashProps {
  show: boolean;
  solveTime?: number | null;
  onPlayAgain?: () => void;
  onExit?: () => void;
  onMorePuzzles?: () => void;
}

export const PuzzleCongratulationSplash: React.FC<PuzzleCongratulationSplashProps> = ({
  show,
  solveTime,
  onPlayAgain,
  onExit,
  onMorePuzzles,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="relative flex flex-col items-center justify-center">
        <div className="relative px-10 py-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center border-4 border-puzzle-gold border-solid z-10 animate-scale-in">
          <Award className="text-puzzle-gold mb-4" size={50} strokeWidth={2.2} />
          <span className="text-5xl md:text-6xl font-bold text-puzzle-gold animate-fade-in">
            🎉 Congratulations!
          </span>
          <span className="block text-2xl mt-4 font-semibold text-puzzle-aqua">Puzzle Completed!</span>
          {typeof solveTime === "number" && (
            <span className="mt-2 text-lg text-puzzle-black">
              Time: <b>{solveTime.toFixed(2)}</b> seconds
            </span>
          )}
          
          {/* Puzzle Completion Menu */}
          <div className="mt-8 flex flex-col md:flex-row gap-3 w-full">
            <Button 
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80"
              onClick={onPlayAgain}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
            
            <Button 
              variant="outline" 
              className="border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold/10"
              onClick={onExit}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
            
            <Button 
              variant="secondary"
              onClick={onMorePuzzles}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              More Puzzles
            </Button>
          </div>
        </div>
        {/* Confetti overlay */}
        <div className="absolute inset-0 pointer-events-none z-40">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="confetti-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${6 + Math.random() * 8}px`,
                height: `${2 + Math.random() * 7}px`,
                backgroundColor: [
                  "#ffd700",
                  "#00b3b3",
                  "#ff5f91",
                  "#fff",
                  "#9b87f5",
                  "#0EA5E9"
                ][Math.floor(Math.random() * 6)],
                opacity: 0.89,
                position: "absolute",
                borderRadius: "2px",
                animation: `confetti-drop 2.4s ${0.09 * i}s cubic-bezier(0.17,0.67,0.83,0.67) infinite`,
                zIndex: 40,
              }}
            />
          ))}
        </div>
        {/* Styling */}
        <style>
          {`
            @keyframes confetti-drop {
              0% { transform: translateY(-60px) rotateZ(0deg);}
              70% { opacity:1;}
              100% { transform: translateY(480px) rotateZ(360deg); opacity: 0;}
            }
          `}
        </style>
      </div>
    </div>
  );
};
