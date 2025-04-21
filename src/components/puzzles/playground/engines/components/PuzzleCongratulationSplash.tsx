
import React from "react";

export const PuzzleCongratulationSplash: React.FC<{ show: boolean; solveTime?: number | null }> = ({
  show,
  solveTime,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="relative flex flex-col items-center justify-center">
        {/* Starburst background effect */}
        <div className="absolute">
          {/* CSS Only Starburst animation */}
          <div className="starburst animate-[spin_2s_linear_infinite]"></div>
          <div className="starburst starburst2 animate-[spin_6s_linear_infinite_reverse]"></div>
        </div>
        <div className="relative px-10 py-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center border-4 border-puzzle-gold border-solid z-10 animate-scale-in">
          <span className="text-5xl md:text-6xl font-bold text-puzzle-gold drop-shadow-glow animate-fade-in">
            🎉 Congratulations!
          </span>
          <span className="block text-2xl mt-4 font-semibold text-puzzle-aqua">Puzzle Completed!</span>
          {typeof solveTime === "number" && (
            <span className="mt-2 text-lg text-puzzle-black">
              Time: <b>{solveTime.toFixed(2)}</b> seconds
            </span>
          )}
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
            .starburst {
              width: 340px;
              height: 340px;
              border-radius: 50%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              box-shadow:
                0 0 90px 48px #ffd70033,
                0 0 140px 60px #fffda555,
                0 0 38px 10px #0EA5E966;
              background: radial-gradient(circle, #fffbe3 60%, #ffd70022 100%);
              opacity: 1;
              z-index: 1;
              pointer-events: none;
            }
            .starburst2 {
              width: 360px;
              height: 360px;
              border-radius: 50%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: radial-gradient(circle, #fff7, #00b3b322 70%, transparent 100%);
              filter: blur(8px);
              opacity:0.5;
              z-index: 0;
            }
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
