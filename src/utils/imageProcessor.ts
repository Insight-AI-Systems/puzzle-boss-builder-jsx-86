// Client-side image processing utilities
export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ProcessedImageData {
  dimensions: ImageDimensions;
  thumbnailBlob: Blob;
  resizedBlob: Blob;
  thumbnailDataUrl: string;
}

// Get image dimensions from a file
export const getImageDimensions = (file: File): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Create thumbnail using Canvas API
export const createThumbnail = (file: File, maxSize: number = 200): Promise<{ blob: Blob; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Calculate thumbnail dimensions maintaining aspect ratio
      const { width: imgWidth, height: imgHeight } = img;
      let { width: thumbWidth, height: thumbHeight } = img;
      
      if (imgWidth > imgHeight) {
        if (imgWidth > maxSize) {
          thumbHeight = (imgHeight * maxSize) / imgWidth;
          thumbWidth = maxSize;
        }
      } else {
        if (imgHeight > maxSize) {
          thumbWidth = (imgWidth * maxSize) / imgHeight;
          thumbHeight = maxSize;
        }
      }

      canvas.width = thumbWidth;
      canvas.height = thumbHeight;

      // Draw and resize image
      ctx.drawImage(img, 0, 0, thumbWidth, thumbHeight);

      // Convert to blob and data URL
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create thumbnail blob'));
          return;
        }
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve({ blob, dataUrl });
      }, 'image/jpeg', 0.8);
    };
    
    img.onerror = () => reject(new Error('Failed to load image for thumbnail'));
    img.src = URL.createObjectURL(file);
  });
};

// Create puzzle-ready image (resize to standard puzzle dimensions)
export const createPuzzleImage = (file: File, targetSize: number = 800): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // For puzzles, we want square images
      canvas.width = targetSize;
      canvas.height = targetSize;

      // Calculate source crop to maintain aspect ratio and fill the square
      const { width: imgWidth, height: imgHeight } = img;
      let sourceX = 0, sourceY = 0, sourceSize = Math.min(imgWidth, imgHeight);
      
      if (imgWidth > imgHeight) {
        sourceX = (imgWidth - imgHeight) / 2;
      } else {
        sourceY = (imgHeight - imgWidth) / 2;
      }

      // Draw cropped and resized image
      ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, targetSize, targetSize);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create puzzle image blob'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg', 0.9);
    };
    
    img.onerror = () => reject(new Error('Failed to load image for puzzle processing'));
    img.src = URL.createObjectURL(file);
  });
};

// Process image completely (get dimensions, create thumbnail and puzzle image)
export const processImageComplete = async (file: File): Promise<ProcessedImageData> => {
  try {
    console.log('Starting complete image processing for:', file.name);
    
    // Get original dimensions
    const dimensions = await getImageDimensions(file);
    console.log('Image dimensions:', dimensions);
    
    // Create thumbnail
    const { blob: thumbnailBlob, dataUrl: thumbnailDataUrl } = await createThumbnail(file, 200);
    console.log('Thumbnail created, size:', thumbnailBlob.size);
    
    // Create puzzle-ready image
    const resizedBlob = await createPuzzleImage(file, 800);
    console.log('Puzzle image created, size:', resizedBlob.size);
    
    return {
      dimensions,
      thumbnailBlob,
      resizedBlob,
      thumbnailDataUrl
    };
  } catch (error) {
    console.error('Error in processImageComplete:', error);
    throw error;
  }
};