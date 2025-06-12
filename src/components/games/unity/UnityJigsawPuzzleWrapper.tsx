
import React from 'react';
import BaseGameWrapper from '../BaseGameWrapper';
import ResponsiveGameContainer from '../ResponsiveGameContainer';
import { UnityGameLoader } from './UnityGameLoader';
import { GameConfig, GameHooks } from '../types/GameTypes';

interface UnityJigsawPuzzleWrapperProps {
  requiresPayment?: boolean;
  entryFee?: number;
  timeLimit?: number;
}

export function UnityJigsawPuzzleWrapper({
  requiresPayment = false,
  entryFee = 0,
  timeLimit
}: UnityJigsawPuzzleWrapperProps) {
  const gameConfig: GameConfig = {
    gameType: 'unity-jigsaw-puzzle',
    requiresPayment,
    hasTimer: true,
    hasScore: true,
    hasMoves: true,
    timeLimit,
    entryFee,
    difficulty: 'medium'
  };

  const gameHooks: GameHooks = {
    onGameStart: () => {
      console.log('Unity Jigsaw Puzzle started!');
      // Send start signal to Unity if needed
      if (window.unityInstance && window.unityInstance.SendMessage) {
        window.unityInstance.SendMessage('GameManager', 'StartGame', '');
      }
    },
    onGameComplete: (result) => {
      console.log('Unity Jigsaw Puzzle completed:', result);
    },
    onScoreUpdate: (score) => {
      console.log('Score updated:', score);
    },
    onMoveUpdate: (moves) => {
      console.log('Moves updated:', moves);
    },
    onError: (error) => {
      console.error('Unity Jigsaw Puzzle error:', error);
    }
  };

  return (
    <ResponsiveGameContainer maxWidth="full" aspectRatio="16:9">
      <BaseGameWrapper config={gameConfig} hooks={gameHooks}>
        {(gameProps) => (
          <div className="w-full h-full min-h-[600px]">
            <UnityGameLoader
              gamePath="/unity-games/jigsaw-puzzle"
              gameTitle="Unity Jigsaw Puzzle"
              isActive={gameProps.isActive}
              onGameReady={() => {
                console.log('Unity game ready');
                // Game is loaded and ready
              }}
              onGameComplete={(stats) => {
                // Unity game sends completion data
                gameProps.onComplete(stats);
              }}
              onScoreUpdate={gameProps.onScoreUpdate}
              onMoveUpdate={gameProps.onMoveUpdate}
            />
          </div>
        )}
      </BaseGameWrapper>
    </ResponsiveGameContainer>
  );
}

export default UnityJigsawPuzzleWrapper;
