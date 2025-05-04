
/**
 * Generates an SVG path for a jigsaw puzzle piece with traditional rounded tabs and slots
 * that closely match classic jigsaw puzzle appearance
 * 
 * @param position The position of the piece in the puzzle grid
 * @param rows Total number of rows in the puzzle
 * @param columns Total number of columns in the puzzle
 * @param width Width of the piece
 * @param height Height of the piece
 * @returns SVG path string for the piece shape
 */
export function generatePiecePath(
  position: number, 
  rows: number, 
  columns: number,
  width: number,
  height: number
): string {
  // Calculate row and column of this piece
  const row = Math.floor(position / columns);
  const col = position % columns;
  
  // Determine which edges need tabs/slots
  const isTopEdge = row === 0;
  const isRightEdge = col === columns - 1;
  const isBottomEdge = row === rows - 1;
  const isLeftEdge = col === 0;
  
  // Size of the tab/slot as a percentage of the piece width/height
  const tabWidth = width * 0.45; // Wider, more traditional tab
  const tabHeight = height * 0.45; // Wider, more traditional tab
  
  // Tab depth (how much it protrudes or intrudes)
  const tabDepth = Math.min(width, height) * 0.25; // More pronounced depth for traditional look
  
  // Use pseudo-random but consistent tabs/slots based on position
  // This ensures connected pieces fit together
  const hasTopTab = !isTopEdge && ((position * 11) % 2 === 0);
  const hasRightTab = !isRightEdge && ((position * 7 + col) % 2 === 0);
  const hasBottomTab = !isBottomEdge && ((position * 13 + row) % 2 === 0);
  const hasLeftTab = !isLeftEdge && ((position * 5 + col + row) % 2 === 0);
  
  // Start building the path at the top-left corner
  let path = "M 0,0 ";
  
  // Top edge
  if (isTopEdge) {
    // Straight line if at the top edge of the puzzle
    path += `H ${width} `;
  } else {
    // First part of the top edge (before the tab/slot)
    path += `H ${(width - tabWidth) / 2} `;
    
    // Create tab or slot on the top edge with a more traditional rounded shape
    if (hasTopTab) {
      // Create a protruding tab with classic rounded shape
      // Starting curve
      path += `Q ${(width - tabWidth) / 2 + tabWidth * 0.2},${-tabDepth * 0.3} ${(width - tabWidth) / 2 + tabWidth * 0.35},${-tabDepth * 0.6} `;
      // Main bulging curve of the tab
      path += `Q ${width / 2},${-tabDepth * 1.3} ${(width + tabWidth) / 2 - tabWidth * 0.35},${-tabDepth * 0.6} `;
      // Ending curve
      path += `Q ${(width + tabWidth) / 2 - tabWidth * 0.2},${-tabDepth * 0.3} ${(width + tabWidth) / 2},0 `;
    } else {
      // Create an intruding slot with classic rounded indent shape
      // Starting curve
      path += `Q ${(width - tabWidth) / 2 + tabWidth * 0.2},${tabDepth * 0.3} ${(width - tabWidth) / 2 + tabWidth * 0.35},${tabDepth * 0.6} `;
      // Main bulging curve of the slot
      path += `Q ${width / 2},${tabDepth * 1.3} ${(width + tabWidth) / 2 - tabWidth * 0.35},${tabDepth * 0.6} `;
      // Ending curve
      path += `Q ${(width + tabWidth) / 2 - tabWidth * 0.2},${tabDepth * 0.3} ${(width + tabWidth) / 2},0 `;
    }
    
    // Complete the top edge
    path += `H ${width} `;
  }
  
  // Right edge
  if (isRightEdge) {
    // Straight line if at the right edge of the puzzle
    path += `V ${height} `;
  } else {
    // First part of the right edge (before the tab/slot)
    path += `V ${(height - tabHeight) / 2} `;
    
    // Create tab or slot on the right edge with traditional rounded shape
    if (hasRightTab) {
      // Create a protruding tab with classic rounded shape
      // Starting curve
      path += `Q ${width + tabDepth * 0.3},${(height - tabHeight) / 2 + tabHeight * 0.2} ${width + tabDepth * 0.6},${(height - tabHeight) / 2 + tabHeight * 0.35} `;
      // Main bulging curve of the tab
      path += `Q ${width + tabDepth * 1.3},${height / 2} ${width + tabDepth * 0.6},${(height + tabHeight) / 2 - tabHeight * 0.35} `;
      // Ending curve
      path += `Q ${width + tabDepth * 0.3},${(height + tabHeight) / 2 - tabHeight * 0.2} ${width},${(height + tabHeight) / 2} `;
    } else {
      // Create an intruding slot with classic rounded indent shape
      // Starting curve
      path += `Q ${width - tabDepth * 0.3},${(height - tabHeight) / 2 + tabHeight * 0.2} ${width - tabDepth * 0.6},${(height - tabHeight) / 2 + tabHeight * 0.35} `;
      // Main bulging curve of the slot
      path += `Q ${width - tabDepth * 1.3},${height / 2} ${width - tabDepth * 0.6},${(height + tabHeight) / 2 - tabHeight * 0.35} `;
      // Ending curve
      path += `Q ${width - tabDepth * 0.3},${(height + tabHeight) / 2 - tabHeight * 0.2} ${width},${(height + tabHeight) / 2} `;
    }
    
    // Complete the right edge
    path += `V ${height} `;
  }
  
  // Bottom edge (drawn from right to left)
  if (isBottomEdge) {
    // Straight line if at the bottom edge of the puzzle
    path += `H 0 `;
  } else {
    // First part of the bottom edge (before the tab/slot)
    path += `H ${(width + tabWidth) / 2} `;
    
    // Create tab or slot on the bottom edge with traditional rounded shape
    if (hasBottomTab) {
      // Create a protruding tab with classic rounded shape (inverted)
      // Starting curve
      path += `Q ${(width + tabWidth) / 2 - tabWidth * 0.2},${height + tabDepth * 0.3} ${(width + tabWidth) / 2 - tabWidth * 0.35},${height + tabDepth * 0.6} `;
      // Main bulging curve of the tab
      path += `Q ${width / 2},${height + tabDepth * 1.3} ${(width - tabWidth) / 2 + tabWidth * 0.35},${height + tabDepth * 0.6} `;
      // Ending curve
      path += `Q ${(width - tabWidth) / 2 + tabWidth * 0.2},${height + tabDepth * 0.3} ${(width - tabWidth) / 2},${height} `;
    } else {
      // Create an intruding slot with classic rounded indent shape (inverted)
      // Starting curve
      path += `Q ${(width + tabWidth) / 2 - tabWidth * 0.2},${height - tabDepth * 0.3} ${(width + tabWidth) / 2 - tabWidth * 0.35},${height - tabDepth * 0.6} `;
      // Main bulging curve of the slot
      path += `Q ${width / 2},${height - tabDepth * 1.3} ${(width - tabWidth) / 2 + tabWidth * 0.35},${height - tabDepth * 0.6} `;
      // Ending curve
      path += `Q ${(width - tabWidth) / 2 + tabWidth * 0.2},${height - tabDepth * 0.3} ${(width - tabWidth) / 2},${height} `;
    }
    
    // Complete the bottom edge
    path += `H 0 `;
  }
  
  // Left edge (drawn from bottom to top)
  if (isLeftEdge) {
    // Straight line if at the left edge of the puzzle
    path += `V 0 `;
  } else {
    // First part of the left edge (before the tab/slot)
    path += `V ${(height + tabHeight) / 2} `;
    
    // Create tab or slot on the left edge with traditional rounded shape
    if (hasLeftTab) {
      // Create a protruding tab with classic rounded shape
      // Starting curve
      path += `Q ${-tabDepth * 0.3},${(height + tabHeight) / 2 - tabHeight * 0.2} ${-tabDepth * 0.6},${(height + tabHeight) / 2 - tabHeight * 0.35} `;
      // Main bulging curve of the tab
      path += `Q ${-tabDepth * 1.3},${height / 2} ${-tabDepth * 0.6},${(height - tabHeight) / 2 + tabHeight * 0.35} `;
      // Ending curve
      path += `Q ${-tabDepth * 0.3},${(height - tabHeight) / 2 + tabHeight * 0.2} 0,${(height - tabHeight) / 2} `;
    } else {
      // Create an intruding slot with classic rounded indent shape
      // Starting curve
      path += `Q ${tabDepth * 0.3},${(height + tabHeight) / 2 - tabHeight * 0.2} ${tabDepth * 0.6},${(height + tabHeight) / 2 - tabHeight * 0.35} `;
      // Main bulging curve of the slot
      path += `Q ${tabDepth * 1.3},${height / 2} ${tabDepth * 0.6},${(height - tabHeight) / 2 + tabHeight * 0.35} `;
      // Ending curve
      path += `Q ${tabDepth * 0.3},${(height - tabHeight) / 2 + tabHeight * 0.2} 0,${(height - tabHeight) / 2} `;
    }
    
    // Complete the left edge
    path += `V 0 `;
  }
  
  // Close the path
  path += "Z";
  
  return path;
}
