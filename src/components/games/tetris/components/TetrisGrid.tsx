
import React from 'react';
import { TetrisGameState } from '../types/tetrisTypes';
import { findGhostPosition } from '../utils/tetrisEngine';

interface TetrisGridProps {
  gameState: TetrisGameState;
  cellSize?: number;
}

export function TetrisGrid({ gameState, cellSize = 30 }: TetrisGridProps) {
  const { grid, currentBlock } = gameState;

  // Create display grid with current block and ghost
  const displayGrid = grid.map(row => row.map(cell => ({ ...cell })));

  // Add ghost piece
  if (currentBlock) {
    const ghostPos = findGhostPosition(grid, currentBlock);
    
    for (let y = 0; y < currentBlock.shape.length; y++) {
      for (let x = 0; x < currentBlock.shape[y].length; x++) {
        if (currentBlock.shape[y][x]) {
          const gridY = ghostPos.y + y;
          const gridX = ghostPos.x + x;
          
          if (gridY >= 0 && gridY < grid.length && gridX >= 0 && gridX < grid[0].length) {
            if (!displayGrid[gridY][gridX].filled) {
              displayGrid[gridY][gridX] = {
                filled: true,
                color: currentBlock.color,
                type: currentBlock.type,
                isGhost: true
              };
            }
          }
        }
      }
    }

    // Add current block
    for (let y = 0; y < currentBlock.shape.length; y++) {
      for (let x = 0; x < currentBlock.shape[y].length; x++) {
        if (currentBlock.shape[y][x]) {
          const gridY = currentBlock.position.y + y;
          const gridX = currentBlock.position.x + x;
          
          if (gridY >= 0 && gridY < grid.length && gridX >= 0 && gridX < grid[0].length) {
            displayGrid[gridY][gridX] = {
              filled: true,
              color: currentBlock.color,
              type: currentBlock.type,
              isGhost: false
            };
          }
        }
      }
    }
  }

  return (
    <div className="relative bg-gray-900 border-2 border-gray-700 rounded-lg p-2">
      <div 
        className="grid gap-[1px] bg-gray-800"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${grid.length}, ${cellSize}px)`
        }}
      >
        {displayGrid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`
                border border-gray-800 transition-colors duration-150
                ${cell.filled 
                  ? (cell as any).isGhost 
                    ? 'opacity-30' 
                    : 'opacity-100'
                  : 'bg-gray-900'
                }
              `}
              style={{
                backgroundColor: cell.filled ? cell.color : '#1f2937',
                width: cellSize,
                height: cellSize
              }}
            />
          ))
        )}
      </div>
      
      {gameState.paused && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-white text-2xl font-bold">PAUSED</div>
        </div>
      )}
      
      {gameState.gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="text-red-400 text-2xl font-bold mb-2">GAME OVER</div>
            <div className="text-white">Score: {gameState.stats.score}</div>
          </div>
        </div>
      )}
    </div>
  );
}
