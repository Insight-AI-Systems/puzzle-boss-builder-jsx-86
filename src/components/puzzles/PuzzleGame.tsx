import React, { useState } from "react";
import { JigsawPuzzle } from "react-jigsaw-puzzle/lib";
import "react-jigsaw-puzzle/lib/jigsaw-puzzle.css";
import "./PuzzleGame.css";
interface PuzzleGameProps {
  imageUrl: string;
  rows?: number;
  columns?: number;
}
const PuzzleGame: React.FC<PuzzleGameProps> = ({
  imageUrl,
  rows = 3,
  columns = 4
}) => {
  const [isSolved, setSolved] = useState(false);
  return <div className="puzzle-container">
      
      <div className="jigsaw-puzzle">
        <JigsawPuzzle imageSrc={imageUrl} rows={rows} columns={columns} onSolved={() => setSolved(true)} />
      </div>
      {isSolved && <div className="success-message">
          Congratulations! You solved the puzzle!
        </div>}
    </div>;
};
export default PuzzleGame;