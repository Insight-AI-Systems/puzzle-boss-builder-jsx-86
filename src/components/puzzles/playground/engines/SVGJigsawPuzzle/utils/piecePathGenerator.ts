
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
  const tabWidth = width * 0.4; // Wider, traditional tab
  const tabHeight = height * 0.4; // Wider, traditional tab
  
  // Tab depth (how much it protrudes or intrudes)
  const tabDepth = Math.min(width, height) * 0.45; // More pronounced depth for traditional look
  
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
      // Create a more pronounced bulb shape for the tab
      path += `C ${(width - tabWidth) / 2 + tabWidth * 0.1},${-tabDepth * 0.15} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.3},${-tabDepth * 0.4} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.4},${-tabDepth * 0.7} `;
      
      // Rounded top of tab with a traditional bulb shape
      path += `C ${width / 2},${-tabDepth * 0.9} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.4},${-tabDepth * 0.7} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.3},${-tabDepth * 0.4} `;
      
      // Ending curve back to edge
      path += `C ${(width + tabWidth) / 2 - tabWidth * 0.1},${-tabDepth * 0.15} `;
      path += `${(width + tabWidth) / 2},0 `;
      path += `${(width + tabWidth) / 2},0 `;
    } else {
      // Create an intruding slot with traditional rounded shape
      path += `C ${(width - tabWidth) / 2 + tabWidth * 0.1},${tabDepth * 0.15} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.3},${tabDepth * 0.4} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.4},${tabDepth * 0.7} `;
      
      // Rounded bottom of slot with a traditional socket shape
      path += `C ${width / 2},${tabDepth * 0.9} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.4},${tabDepth * 0.7} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.3},${tabDepth * 0.4} `;
      
      // Ending curve back to edge
      path += `C ${(width + tabWidth) / 2 - tabWidth * 0.1},${tabDepth * 0.15} `;
      path += `${(width + tabWidth) / 2},0 `;
      path += `${(width + tabWidth) / 2},0 `;
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
      // Create a more pronounced bulb shape for the tab
      path += `C ${width + tabDepth * 0.15},${(height - tabHeight) / 2 + tabHeight * 0.1} `;
      path += `${width + tabDepth * 0.4},${(height - tabHeight) / 2 + tabHeight * 0.3} `;
      path += `${width + tabDepth * 0.7},${(height - tabHeight) / 2 + tabHeight * 0.4} `;
      
      // Rounded side of tab with a traditional bulb shape
      path += `C ${width + tabDepth * 0.9},${height / 2} `;
      path += `${width + tabDepth * 0.7},${(height + tabHeight) / 2 - tabHeight * 0.4} `;
      path += `${width + tabDepth * 0.4},${(height + tabHeight) / 2 - tabHeight * 0.3} `;
      
      // Ending curve back to edge
      path += `C ${width + tabDepth * 0.15},${(height + tabHeight) / 2 - tabHeight * 0.1} `;
      path += `${width},${(height + tabHeight) / 2} `;
      path += `${width},${(height + tabHeight) / 2} `;
    } else {
      // Create an intruding slot with traditional rounded shape
      path += `C ${width - tabDepth * 0.15},${(height - tabHeight) / 2 + tabHeight * 0.1} `;
      path += `${width - tabDepth * 0.4},${(height - tabHeight) / 2 + tabHeight * 0.3} `;
      path += `${width - tabDepth * 0.7},${(height - tabHeight) / 2 + tabHeight * 0.4} `;
      
      // Rounded indentation of slot with a traditional socket shape
      path += `C ${width - tabDepth * 0.9},${height / 2} `;
      path += `${width - tabDepth * 0.7},${(height + tabHeight) / 2 - tabHeight * 0.4} `;
      path += `${width - tabDepth * 0.4},${(height + tabHeight) / 2 - tabHeight * 0.3} `;
      
      // Ending curve back to edge
      path += `C ${width - tabDepth * 0.15},${(height + tabHeight) / 2 - tabHeight * 0.1} `;
      path += `${width},${(height + tabHeight) / 2} `;
      path += `${width},${(height + tabHeight) / 2} `;
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
      // Create a more pronounced bulb shape for the tab
      path += `C ${(width + tabWidth) / 2 - tabWidth * 0.1},${height + tabDepth * 0.15} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.3},${height + tabDepth * 0.4} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.4},${height + tabDepth * 0.7} `;
      
      // Rounded bottom of tab with a traditional bulb shape
      path += `C ${width / 2},${height + tabDepth * 0.9} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.4},${height + tabDepth * 0.7} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.3},${height + tabDepth * 0.4} `;
      
      // Ending curve back to edge
      path += `C ${(width - tabWidth) / 2 + tabWidth * 0.1},${height + tabDepth * 0.15} `;
      path += `${(width - tabWidth) / 2},${height} `;
      path += `${(width - tabWidth) / 2},${height} `;
    } else {
      // Create an intruding slot with traditional rounded shape
      path += `C ${(width + tabWidth) / 2 - tabWidth * 0.1},${height - tabDepth * 0.15} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.3},${height - tabDepth * 0.4} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.4},${height - tabDepth * 0.7} `;
      
      // Rounded indentation of slot with a traditional socket shape
      path += `C ${width / 2},${height - tabDepth * 0.9} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.4},${height - tabDepth * 0.7} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.3},${height - tabDepth * 0.4} `;
      
      // Ending curve back to edge
      path += `C ${(width - tabWidth) / 2 + tabWidth * 0.1},${height - tabDepth * 0.15} `;
      path += `${(width - tabWidth) / 2},${height} `;
      path += `${(width - tabWidth) / 2},${height} `;
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
      // Create a more pronounced bulb shape for the tab
      path += `C ${-tabDepth * 0.15},${(height + tabHeight) / 2 - tabHeight * 0.1} `;
      path += `${-tabDepth * 0.4},${(height + tabHeight) / 2 - tabHeight * 0.3} `;
      path += `${-tabDepth * 0.7},${(height + tabHeight) / 2 - tabHeight * 0.4} `;
      
      // Rounded side of tab with a traditional bulb shape
      path += `C ${-tabDepth * 0.9},${height / 2} `;
      path += `${-tabDepth * 0.7},${(height - tabHeight) / 2 + tabHeight * 0.4} `;
      path += `${-tabDepth * 0.4},${(height - tabHeight) / 2 + tabHeight * 0.3} `;
      
      // Ending curve back to edge
      path += `C ${-tabDepth * 0.15},${(height - tabHeight) / 2 + tabHeight * 0.1} `;
      path += `0,${(height - tabHeight) / 2} `;
      path += `0,${(height - tabHeight) / 2} `;
    } else {
      // Create an intruding slot with traditional rounded shape
      path += `C ${tabDepth * 0.15},${(height + tabHeight) / 2 - tabHeight * 0.1} `;
      path += `${tabDepth * 0.4},${(height + tabHeight) / 2 - tabHeight * 0.3} `;
      path += `${tabDepth * 0.7},${(height + tabHeight) / 2 - tabHeight * 0.4} `;
      
      // Rounded indentation of slot with a traditional socket shape
      path += `C ${tabDepth * 0.9},${height / 2} `;
      path += `${tabDepth * 0.7},${(height - tabHeight) / 2 + tabHeight * 0.4} `;
      path += `${tabDepth * 0.4},${(height - tabHeight) / 2 + tabHeight * 0.3} `;
      
      // Ending curve back to edge
      path += `C ${tabDepth * 0.15},${(height - tabHeight) / 2 + tabHeight * 0.1} `;
      path += `0,${(height - tabHeight) / 2} `;
      path += `0,${(height - tabHeight) / 2} `;
    }
    
    // Complete the left edge
    path += `V 0 `;
  }
  
  // Close the path
  path += "Z";
  
  return path;
}
