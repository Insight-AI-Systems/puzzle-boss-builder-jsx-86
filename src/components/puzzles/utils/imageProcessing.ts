interface ImageSliceOptions {
  image: HTMLImageElement;
  rows: number;
  columns: number;
  pieceSize?: { width: number; height: number };
}

interface ProcessedPieceImage {
  id: string;
  imageData: string;
  row: number;
  column: number;
}

class ImageCache {
  private static instance: ImageCache;
  private cache: Map<string, ProcessedPieceImage[]>;
  private readonly maxSize: number = 10; // Maximum number of puzzle images to cache

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): ImageCache {
    if (!this.instance) {
      this.instance = new ImageCache();
    }
    return this.instance;
  }

  getPieceImages(puzzleId: string): ProcessedPieceImage[] | undefined {
    return this.cache.get(puzzleId);
  }

  setPieceImages(puzzleId: string, pieces: ProcessedPieceImage[]): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(puzzleId, pieces);
  }

  clear(): void {
    this.cache.clear();
  }
}

export async function slicePuzzleImage({ 
  image,
  rows,
  columns,
  pieceSize 
}: ImageSliceOptions): Promise<ProcessedPieceImage[]> {
  const imageCache = ImageCache.getInstance();
  const puzzleId = `${image.src}-${rows}x${columns}`;
  
  // Check cache first
  const cachedPieces = imageCache.getPieceImages(puzzleId);
  if (cachedPieces) {
    console.log('Using cached puzzle pieces');
    return cachedPieces;
  }

  // Create an offscreen canvas for processing
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Calculate piece dimensions
  const pieceWidth = pieceSize?.width || image.width / columns;
  const pieceHeight = pieceSize?.height || image.height / rows;
  
  canvas.width = pieceWidth;
  canvas.height = pieceHeight;

  const pieces: ProcessedPieceImage[] = [];

  // Slice the image into pieces
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the slice of the original image
      ctx.drawImage(
        image,
        col * (image.width / columns),
        row * (image.height / rows),
        image.width / columns,
        image.height / rows,
        0,
        0,
        pieceWidth,
        pieceHeight
      );

      // Convert to base64
      const imageData = canvas.toDataURL('image/webp', 0.8); // Use WebP for better compression
      
      pieces.push({
        id: `piece-${row * columns + col}`,
        imageData,
        row,
        column: col
      });
    }
  }

  // Cache the processed pieces
  imageCache.setPieceImages(puzzleId, pieces);
  
  return pieces;
}

export function preloadPuzzleImage(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    
    img.src = imageUrl;
  });
}

export async function initializePuzzlePieces(imageUrl: string, rows: number, columns: number): Promise<ProcessedPieceImage[]> {
  try {
    console.time('puzzleInitialization');
    const image = await preloadPuzzleImage(imageUrl);
    const pieces = await slicePuzzleImage({ image, rows, columns });
    console.timeEnd('puzzleInitialization');
    return pieces;
  } catch (error) {
    console.error('Failed to initialize puzzle pieces:', error);
    throw error;
  }
}

// Helper to clean up cached images when needed
export function clearImageCache(): void {
  ImageCache.getInstance().clear();
}
