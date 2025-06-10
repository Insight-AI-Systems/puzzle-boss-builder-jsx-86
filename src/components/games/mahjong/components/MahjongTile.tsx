
import React from 'react';
import { MahjongTile as MahjongTileType } from '../types/mahjongTypes';

interface MahjongTileProps {
  tile: MahjongTileType;
  onClick: (tile: MahjongTileType) => void;
  isHint?: boolean;
}

export const MahjongTile: React.FC<MahjongTileProps> = ({ tile, onClick, isHint = false }) => {
  const getTileDisplay = () => {
    switch (tile.type) {
      case 'bamboo':
        return `🎋${tile.value}`;
      case 'circle':
        return `⭕${tile.value}`;
      case 'character':
        return `文${tile.value}`;
      case 'wind':
        return tile.value === 'east' ? '🌪️E' : 
               tile.value === 'south' ? '🌪️S' : 
               tile.value === 'west' ? '🌪️W' : '🌪️N';
      case 'dragon':
        return tile.value === 'red' ? '🐉R' : 
               tile.value === 'green' ? '🐉G' : '🐉W';
      case 'flower':
        return `🌸${tile.value}`;
      case 'season':
        return `🍃${tile.value}`;
      default:
        return '?';
    }
  };

  const handleClick = () => {
    if (!tile.isBlocked && !tile.isMatched) {
      onClick(tile);
    }
  };

  return (
    <div
      className={`
        absolute cursor-pointer select-none transition-all duration-200
        w-8 h-10 rounded border-2 flex items-center justify-center text-xs font-bold
        ${tile.isMatched ? 'opacity-0 pointer-events-none' : ''}
        ${tile.isSelected ? 'border-puzzle-aqua bg-puzzle-aqua/20 scale-105' : 'border-gray-400 bg-white'}
        ${tile.isBlocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:border-puzzle-aqua'}
        ${isHint ? 'animate-pulse border-yellow-400 bg-yellow-100' : ''}
      `}
      style={{
        left: `${tile.x}px`,
        top: `${tile.y}px`,
        zIndex: tile.layer + (tile.isSelected ? 100 : 0)
      }}
      onClick={handleClick}
    >
      <span className="text-[10px]">{getTileDisplay()}</span>
    </div>
  );
};
