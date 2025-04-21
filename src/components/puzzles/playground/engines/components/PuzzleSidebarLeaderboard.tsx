
import React, { useMemo } from "react";

interface LeaderboardEntry {
  player: string;
  time: number;
}

// Mock data for other players
const mockLeaderboardBase: LeaderboardEntry[] = [
  { player: "Alex", time: 52.76 },
  { player: "Morgan", time: 55.80 },
  { player: "Jordan", time: 61.24 },
  { player: "Taylor", time: 71.59 },
  { player: "Casey", time: 99.20 },
];

export const PuzzleSidebarLeaderboard: React.FC<{ solveTime?: number | null }> = ({ solveTime }) => {
  // Create leaderboard dynamically based on the user's solve time
  const leaderboard = useMemo(() => {
    if (!solveTime) {
      return [
        { player: "You", time: 43.92 },
        ...mockLeaderboardBase
      ];
    }
    
    // Use the exact solve time passed from the puzzle completion
    const userEntry = { 
      player: "You", 
      // Ensure we display with 2 decimal places for consistency
      time: parseFloat(solveTime.toFixed(2))
    };
    const allEntries = [userEntry, ...mockLeaderboardBase];
    
    // Sort the leaderboard by time (fastest first)
    return allEntries.sort((a, b) => a.time - b.time);
  }, [solveTime]);

  return (
    <aside className="fixed right-0 top-0 h-full w-[290px] md:w-[330px] bg-gradient-to-tl from-puzzle-aqua to-puzzle-gold/50 shadow-xl z-20 px-3 py-6 flex flex-col items-center border-l-4 border-puzzle-gold">
      <h2 className="text-2xl font-bold text-puzzle-black mb-4 tracking-tight text-center">Leaderboard</h2>
      <div className="w-full mt-1">
        <ol className="space-y-3">
          {leaderboard.map((entry, idx) => (
            <li
              key={`${entry.player}-${idx}`}
              className={`flex items-center justify-between px-4 py-2 rounded-lg shadow-sm border ${
                entry.player === "You" ? "bg-puzzle-gold/80 text-black font-bold border-puzzle-gold scale-105 animate-pulse-gentle" : "bg-white/80 text-black"
              }`}
              style={{ fontSize: entry.player === "You" ? "1.125rem" : undefined }}
            >
              <span>
                {idx + 1}. {entry.player}
              </span>
              <span>
                {entry.time.toFixed(2)}
                <span className="ml-1 text-xs">sec</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-auto w-full text-xs text-center text-puzzle-black/70 opacity-70 pt-8">
        <span>Times shown are sample data{solveTime ? " (except yours)" : ""}</span>
      </div>
    </aside>
  );
};
