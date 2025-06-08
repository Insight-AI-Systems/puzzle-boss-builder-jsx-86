
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameStats, Block } from '../types/tetrisTypes';

interface TetrisStatsProps {
  stats: GameStats;
  nextBlock: Block | null;
  holdBlock: Block | null;
}

export function TetrisStats({ stats, nextBlock, holdBlock }: TetrisStatsProps) {
  const renderMiniBlock = (block: Block | null, title: string) => (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="w-16 h-16 bg-gray-900 border border-gray-700 rounded flex items-center justify-center">
          {block && (
            <div 
              className="grid gap-[1px]"
              style={{
                gridTemplateColumns: `repeat(${block.shape[0].length}, 8px)`,
                gridTemplateRows: `repeat(${block.shape.length}, 8px)`
              }}
            >
              {block.shape.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className="w-2 h-2"
                    style={{
                      backgroundColor: cell ? block.color : 'transparent'
                    }}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Score and Stats */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold text-puzzle-aqua">
            {stats.score.toLocaleString()}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Lines</div>
              <div className="text-white font-semibold">{stats.lines}</div>
            </div>
            <div>
              <div className="text-gray-400">Level</div>
              <div className="text-white font-semibold">{stats.level}</div>
            </div>
            <div>
              <div className="text-gray-400">Tetrises</div>
              <div className="text-white font-semibold">{stats.tetrises}</div>
            </div>
            <div>
              <div className="text-gray-400">Rate</div>
              <div className="text-white font-semibold">
                {stats.lines > 0 ? Math.round((stats.tetrises / stats.lines) * 100) : 0}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next and Hold blocks */}
      <div className="grid grid-cols-2 gap-4">
        {renderMiniBlock(nextBlock, 'Next')}
        {renderMiniBlock(holdBlock, 'Hold')}
      </div>
    </div>
  );
}
