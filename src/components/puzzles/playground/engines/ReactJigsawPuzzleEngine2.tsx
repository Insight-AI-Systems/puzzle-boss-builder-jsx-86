
import React, { useState, useRef } from 'react';
import { usePuzzleTimer } from './hooks/usePuzzleTimer';
import { usePuzzleImagePreload } from './hooks/usePuzzleImagePreload';
import { usePuzzleCompletion } from './hooks/usePuzzleCompletion';
import { PuzzleLayout } from './components/PuzzleLayout';
import './styles/jigsaw-puzzle.css';

interface ReactJigsawPuzzleEngine2Props {
  imageUrl: string;
  rows: number;
  columns: number;
}

const ReactJigsawPuzzleEngine2: React.FC<ReactJigsawPuzzleEngine2Props> = ({
  imageUrl, rows, columns
}) => {
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showBorder, setShowBorder] = useState(true);
  const [key, setKey] = useState(Date.now());

  const {
    elapsed, start, stop, reset, startTime, setElapsed, setStartTime
  } = usePuzzleTimer();

  const {
    completed,
    solveTime,
    handlePuzzleComplete,
    resetCompletion
  } = usePuzzleCompletion({ imageUrl, rows, columns });

  usePuzzleImagePreload({
    imageUrl,
    onLoad: () => {
      console.log('Image preloaded successfully:', imageUrl);
      setLoading(false);
      setElapsed(0);
      setHasStarted(false);
      resetCompletion();
    },
    onError: (error) => {
      console.error('Error loading puzzle image:', error);
      setLoading(false);
    }
  });

  const handleStartIfFirstMove = () => {
    if (!hasStarted && !completed) {
      setHasStarted(true);
      start();
      setStartTime(Date.now());
    }
  };

  const handlePuzzleSolved = async () => {
    if (!completed) {
      const totalTime = await handlePuzzleComplete(startTime);
      if (totalTime) {
        setElapsed(Math.floor(totalTime));
      }
      stop();
    }
  };

  const handleReset = () => {
    setKey(Date.now());
    setElapsed(0);
    setHasStarted(false);
    resetCompletion();
    reset();
    setStartTime(null);
  };

  const handleToggleBorder = () => {
    setShowBorder(prev => !prev);
    console.log("Border toggled:", !showBorder);
  };

  return (
    <PuzzleLayout
      elapsed={elapsed}
      onReset={handleReset}
      onToggleBorder={handleToggleBorder}
      showBorder={showBorder}
      loading={loading}
      imageUrl={imageUrl}
      rows={rows}
      columns={columns}
      keyProp={key}
      onSolved={handlePuzzleSolved}
      solveTime={solveTime}
      completed={completed}
      onPlayAgain={handleReset}
      hasStarted={hasStarted}
      handleStartIfFirstMove={handleStartIfFirstMove}
    />
  );
};

export default ReactJigsawPuzzleEngine2;
