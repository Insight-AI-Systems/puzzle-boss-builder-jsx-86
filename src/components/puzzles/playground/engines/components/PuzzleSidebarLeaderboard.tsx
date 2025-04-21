
import React from "react";
import { Users, Trophy } from "lucide-react";
import { useLeaderboard } from "../hooks/usePuzzleLeaderboard";

interface LeaderboardEntry {
  id: string;
  player_id: string;
  player_name: string | null;
  time_seconds: number;
  created_at: string;
}

interface Props {
  solveTime?: number | null;
  puzzleId?: string | null;
  currentPlayerId?: string | null;
}

export const PuzzleSidebarLeaderboard: React.FC<Props> = ({
  solveTime,
  puzzleId,
  currentPlayerId,
}) => {
  const { leaderboard, leaderboardLoading } = useLeaderboard(puzzleId);

  return (
    <aside className="fixed right-0 top-0 h-full w-[200px] md:w-[220px] bg-gradient-to-tl from-puzzle-aqua to-puzzle-gold/30 shadow-xl z-30 px-2 py-6 flex flex-col items-center border-l-4 border-puzzle-gold">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-puzzle-gold" />
        <h2 className="text-xl font-bold text-puzzle-black tracking-tight text-center">Leaderboard</h2>
      </div>
      <div className="w-full mt-1 min-h-[200px]">
        {leaderboardLoading ? (
          <div className="text-center text-xs text-puzzle-black/70">Loading...</div>
        ) : (
          <ol className="space-y-2">
            {leaderboard.length === 0 && (
              <li className="text-center text-xs text-puzzle-black/60">No records yet!</li>
            )}
            {leaderboard.map((entry, idx) => (
              <li
                key={entry.id}
                className={`flex items-center justify-between px-2 py-1 rounded-md shadow-xs border text-xs
                  ${
                    entry.player_id === currentPlayerId
                      ? "bg-puzzle-gold/80 text-black font-bold border-puzzle-gold scale-105"
                      : "bg-white/80 text-black"
                  }
                `}
                style={{ fontSize: entry.player_id === currentPlayerId ? "1.05rem" : undefined }}
              >
                <span>
                  {idx + 1}.{' '}
                  {entry.player_name
                    ? entry.player_name.length > 10
                      ? entry.player_name.slice(0, 9) + '…'
                      : entry.player_name
                    : 'Player'}
                </span>
                <span>
                  {Number(entry.time_seconds).toFixed(2)}
                  <span className="ml-1 text-[9px]">sec</span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="mt-auto w-full text-[10px] text-center text-puzzle-black/60 opacity-70 pt-8 pb-2">
        <span>Leaderboard updates in real time.<br/>Top 10 fastest times shown.</span>
      </div>
    </aside>
  );
};
