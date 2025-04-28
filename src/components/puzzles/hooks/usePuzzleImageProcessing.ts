
import { useState, useEffect } from 'react';
import { initializePuzzlePieces, ProcessedPieceImage } from '../utils/imageProcessing';

interface UsePuzzleImageProcessingProps {
  imageUrl: string;
  rows: number;
  columns: number;
  onProcessed?: (pieces: ProcessedPieceImage[]) => void;
  onError?: (error: Error) => void;
}

export function usePuzzleImageProcessing({
  imageUrl,
  rows,
  columns,
  onProcessed,
  onError
}: UsePuzzleImageProcessingProps) {
  const [pieces, setPieces] = useState<ProcessedPieceImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const processPuzzleImage = async () => {
      try {
        setIsLoading(true);
        const processedPieces = await initializePuzzlePieces(imageUrl, rows, columns);
        
        if (mounted) {
          setPieces(processedPieces);
          onProcessed?.(processedPieces);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to process puzzle image');
        if (mounted) {
          setError(error);
          onError?.(error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    processPuzzleImage();

    return () => {
      mounted = false;
    };
  }, [imageUrl, rows, columns, onProcessed, onError]);

  return {
    pieces,
    isLoading,
    error
  };
}
