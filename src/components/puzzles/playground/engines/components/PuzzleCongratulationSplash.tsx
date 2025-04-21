
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const PuzzleCongratulationSplash: React.FC<{ show: boolean; solveTime?: number | null; onPlayAgain: () => void }> = ({
  show,
  solveTime,
  onPlayAgain
}) => {
  const navigate = useNavigate();
  
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="relative flex flex-col items-center justify-center">
        <div className="relative px-10 py-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center gap-6 z-10 animate-scale-in">
          <span className="text-5xl md:text-6xl font-bold text-puzzle-gold drop-shadow-glow animate-fade-in">
            🎉 Congratulations!
          </span>
          <span className="block text-2xl font-semibold text-puzzle-aqua">Puzzle Completed!</span>
          {typeof solveTime === "number" && (
            <span className="mt-2 text-lg text-puzzle-black">
              Time: <b>{solveTime.toFixed(2)}</b> seconds
            </span>
          )}
          
          <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
            <Button 
              onClick={onPlayAgain}
              variant="default"
              className="w-full bg-puzzle-gold hover:bg-puzzle-gold/90"
            >
              Play Again
            </Button>
            <Button 
              onClick={() => navigate('/puzzles')}
              variant="outline"
              className="w-full"
            >
              More Puzzles
            </Button>
            <Button 
              onClick={() => navigate('/categories')}
              variant="outline"
              className="w-full"
            >
              Categories
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
        <style>
          {`
            @keyframes confetti-drop {
              0% { transform: translateY(-60px) rotateZ(0deg);}
              70% { opacity:1;}
              100% { transform: translateY(480px) rotateZ(360deg); opacity: 0;}
            }
            .drop-shadow-glow {
              text-shadow: 0px 2px 3px #ffd70099, 0px 5px 18px #ffd70033, 0px 0.5px 0.5px #fff;
            }
          `}
        </style>
      </div>
    </div>
  );
};
