
import React from 'react';
import { MahjongTile as MahjongTileType } from '../types/mahjongTypes';
import { MahjongTile } from './MahjongTile';

interface MahjongBoardProps {
  tiles: MahjongTileType[];
  onTileClick: (tile: MahjongTileType) => void;
  hintTiles?: MahjongTileType[];
}

export const MahjongBoard: React.FC<MahjongBoardProps> = ({ 
  tiles, 
  onTileClick, 
  hintTiles = [] 
}) => {
  const activeTiles = tiles.filter(tile => !tile.isMatched);
  const maxX = Math.max(...activeTiles.map(t => t.x)) + 40;
  const maxY = Math.max(...activeTiles.map(t => t.y)) + 50;

  return (
    <div className="flex justify-center items-center p-4">
      <div 
        className="relative bg-green-100 rounded-lg border-2 border-green-300 p-4"
        style={{ 
          width: `${Math.max(400, maxX)}px`, 
          height: `${Math.max(300, maxY)}px` 
        }}
      >
        {activeTiles.map(tile => (
          <MahjongTile
            key={tile.id}
            tile={tile}
            onClick={onTileClick}
            isHint={hintTiles.some(h => h.id === tile.id)}
          />
        ))}
      </div>
    </div>
  );
};
