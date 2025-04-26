
import React from 'react';
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageSelector } from '../image-library/components/ImageSelector';
import { getGridSizeByPieces } from '@/utils/puzzleUtils';

interface PuzzlePreviewProps {
  puzzle: any;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (field: string, value: any) => void;
}

export const PuzzlePreview: React.FC<PuzzlePreviewProps> = ({
  puzzle,
  onImageUpload,
  onChange,
}) => {
  const [isImageSelectorOpen, setIsImageSelectorOpen] = React.useState(false);
  
  // Safely extract grid size from puzzle data
  let gridSize = 4; // Default value
  
  if (puzzle?.gridSize) {
    // Direct grid size property (e.g. "4x4")
    const match = puzzle.gridSize.match(/^(\d+)x/);
    if (match) {
      gridSize = parseInt(match[1]) || 4;
    }
  } else if (puzzle?.pieces) {
    // Get grid size from pieces count
    const gridSizeObj = getGridSizeByPieces(puzzle.pieces);
    const match = gridSizeObj.value.match(/^(\d+)x/);
    gridSize = match ? parseInt(match[1]) : 4;
  } else if (puzzle?.difficulty) {
    // Fallback to difficulty setting
    gridSize = puzzle.difficulty === 'easy' ? 3 : (puzzle.difficulty === 'medium' ? 5 : 7);
  }
  
  const boxSize = 56;
  const total = gridSize * gridSize;

  const handleSelectImage = (imageUrl: string) => {
    onChange("imageUrl", imageUrl);
    setIsImageSelectorOpen(false);
  };

  console.log("PuzzlePreview rendering with gridSize:", gridSize, "from puzzle:", puzzle);

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="text-xs mb-1">Puzzle Preview ({gridSize}×{gridSize} Grid)</label>
      <div 
        className="relative bg-gradient-to-br from-puzzle-aqua/20 to-puzzle-black/70 rounded border border-puzzle-aqua/40 flex items-center justify-center overflow-hidden transition-all"
        style={{ width: boxSize * gridSize, height: boxSize * gridSize }}
      >
        <img
          src={puzzle.imageUrl}
          alt="Puzzle Ghost"
          className="absolute inset-0 w-full h-full object-contain opacity-40 pointer-events-none"
        />
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="border border-puzzle-aqua/30"
              style={{
                width: boxSize,
                height: boxSize,
                background: "rgba(255,255,255,0.07)",
              }}
            />
          ))}
        </div>
        <span className="absolute left-1 top-1 text-xs rounded px-2 py-0.5 bg-black/60 text-puzzle-aqua z-10">
          Ghost Image
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <label htmlFor="edit-upload-img" className="flex items-center text-xs cursor-pointer px-2 py-1 rounded border border-puzzle-aqua/50 bg-puzzle-aqua/10 text-puzzle-aqua hover:bg-puzzle-aqua/20">
          <Image className="h-4 w-4 mr-1" />
          Upload image
        </label>
        <input
          id="edit-upload-img"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageUpload}
        />
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          className="text-xs px-2 py-1 h-auto"
          onClick={() => setIsImageSelectorOpen(true)}
        >
          <Image className="h-3 w-3 mr-1" />
          Browse library
        </Button>

        <ImageSelector
          isOpen={isImageSelectorOpen}
          onClose={() => setIsImageSelectorOpen(false)}
          onSelectImage={handleSelectImage}
        />
      </div>
    </div>
  );
};
