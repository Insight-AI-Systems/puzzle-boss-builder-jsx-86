
/**
 * Generates an SVG path for a jigsaw puzzle piece with traditional bulb and socket shapes
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
  
  // Tab depth - increased for more pronounced bulb and socket shapes
  const tabDepth = Math.min(width, height) * 0.5; // More pronounced classic bulb/socket
  
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
    
    if (hasTopTab) {
      // Classic bulb shape - narrower neck, rounded bulb head
      path += `C ${(width - tabWidth) / 2 + tabWidth * 0.1},${-tabDepth * 0.2} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.25},${-tabDepth * 0.5} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.35},${-tabDepth * 0.8} `;
      
      // Rounded bulb top
      path += `C ${width / 2},${-tabDepth * 1.1} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.35},${-tabDepth * 0.8} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.25},${-tabDepth * 0.5} `;
      
      // Return to edge with narrow neck
      path += `C ${(width + tabWidth) / 2 - tabWidth * 0.1},${-tabDepth * 0.2} `;
      path += `${(width + tabWidth) / 2},0 `;
      path += `${(width + tabWidth) / 2},0 `;
    } else {
      // Classic socket shape - narrower opening, rounded inner cavity
      path += `C ${(width - tabWidth) / 2 + tabWidth * 0.1},${tabDepth * 0.2} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.25},${tabDepth * 0.5} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.35},${tabDepth * 0.8} `;
      
      // Rounded socket bottom
      path += `C ${width / 2},${tabDepth * 1.1} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.35},${tabDepth * 0.8} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.25},${tabDepth * 0.5} `;
      
      // Return to edge with narrow opening
      path += `C ${(width + tabWidth) / 2 - tabWidth * 0.1},${tabDepth * 0.2} `;
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
    
    if (hasRightTab) {
      // Classic bulb shape - narrower neck, rounded bulb head
      path += `C ${width + tabDepth * 0.2},${(height - tabHeight) / 2 + tabHeight * 0.1} `;
      path += `${width + tabDepth * 0.5},${(height - tabHeight) / 2 + tabHeight * 0.25} `;
      path += `${width + tabDepth * 0.8},${(height - tabHeight) / 2 + tabHeight * 0.35} `;
      
      // Rounded bulb side
      path += `C ${width + tabDepth * 1.1},${height / 2} `;
      path += `${width + tabDepth * 0.8},${(height + tabHeight) / 2 - tabHeight * 0.35} `;
      path += `${width + tabDepth * 0.5},${(height + tabHeight) / 2 - tabHeight * 0.25} `;
      
      // Return to edge with narrow neck
      path += `C ${width + tabDepth * 0.2},${(height + tabHeight) / 2 - tabHeight * 0.1} `;
      path += `${width},${(height + tabHeight) / 2} `;
      path += `${width},${(height + tabHeight) / 2} `;
    } else {
      // Classic socket shape - narrower opening, rounded inner cavity
      path += `C ${width - tabDepth * 0.2},${(height - tabHeight) / 2 + tabHeight * 0.1} `;
      path += `${width - tabDepth * 0.5},${(height - tabHeight) / 2 + tabHeight * 0.25} `;
      path += `${width - tabDepth * 0.8},${(height - tabHeight) / 2 + tabHeight * 0.35} `;
      
      // Rounded socket cavity
      path += `C ${width - tabDepth * 1.1},${height / 2} `;
      path += `${width - tabDepth * 0.8},${(height + tabHeight) / 2 - tabHeight * 0.35} `;
      path += `${width - tabDepth * 0.5},${(height + tabHeight) / 2 - tabHeight * 0.25} `;
      
      // Return to edge with narrow opening
      path += `C ${width - tabDepth * 0.2},${(height + tabHeight) / 2 - tabHeight * 0.1} `;
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
    
    if (hasBottomTab) {
      // Classic bulb shape - narrower neck, rounded bulb head
      path += `C ${(width + tabWidth) / 2 - tabWidth * 0.1},${height + tabDepth * 0.2} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.25},${height + tabDepth * 0.5} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.35},${height + tabDepth * 0.8} `;
      
      // Rounded bulb bottom
      path += `C ${width / 2},${height + tabDepth * 1.1} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.35},${height + tabDepth * 0.8} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.25},${height + tabDepth * 0.5} `;
      
      // Return to edge with narrow neck
      path += `C ${(width - tabWidth) / 2 + tabWidth * 0.1},${height + tabDepth * 0.2} `;
      path += `${(width - tabWidth) / 2},${height} `;
      path += `${(width - tabWidth) / 2},${height} `;
    } else {
      // Classic socket shape - narrower opening, rounded inner cavity
      path += `C ${(width + tabWidth) / 2 - tabWidth * 0.1},${height - tabDepth * 0.2} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.25},${height - tabDepth * 0.5} `;
      path += `${(width + tabWidth) / 2 - tabWidth * 0.35},${height - tabDepth * 0.8} `;
      
      // Rounded socket cavity
      path += `C ${width / 2},${height - tabDepth * 1.1} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.35},${height - tabDepth * 0.8} `;
      path += `${(width - tabWidth) / 2 + tabWidth * 0.25},${height - tabDepth * 0.5} `;
      
      // Return to edge with narrow opening
      path += `C ${(width - tabWidth) / 2 + tabWidth * 0.1},${height - tabDepth * 0.2} `;
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
    
    if (hasLeftTab) {
      // Classic bulb shape - narrower neck, rounded bulb head
      path += `C ${-tabDepth * 0.2},${(height + tabHeight) / 2 - tabHeight * 0.1} `;
      path += `${-tabDepth * 0.5},${(height + tabHeight) / 2 - tabHeight * 0.25} `;
      path += `${-tabDepth * 0.8},${(height + tabHeight) / 2 - tabHeight * 0.35} `;
      
      // Rounded bulb side
      path += `C ${-tabDepth * 1.1},${height / 2} `;
      path += `${-tabDepth * 0.8},${(height - tabHeight) / 2 + tabHeight * 0.35} `;
      path += `${-tabDepth * 0.5},${(height - tabHeight) / 2 + tabHeight * 0.25} `;
      
      // Return to edge with narrow neck
      path += `C ${-tabDepth * 0.2},${(height - tabHeight) / 2 + tabHeight * 0.1} `;
      path += `0,${(height - tabHeight) / 2} `;
      path += `0,${(height - tabHeight) / 2} `;
    } else {
      // Classic socket shape - narrower opening, rounded inner cavity
      path += `C ${tabDepth * 0.2},${(height + tabHeight) / 2 - tabHeight * 0.1} `;
      path += `${tabDepth * 0.5},${(height + tabHeight) / 2 - tabHeight * 0.25} `;
      path += `${tabDepth * 0.8},${(height + tabHeight) / 2 - tabHeight * 0.35} `;
      
      // Rounded socket cavity
      path += `C ${tabDepth * 1.1},${height / 2} `;
      path += `${tabDepth * 0.8},${(height - tabHeight) / 2 + tabHeight * 0.35} `;
      path += `${tabDepth * 0.5},${(height - tabHeight) / 2 + tabHeight * 0.25} `;
      
      // Return to edge with narrow opening
      path += `C ${tabDepth * 0.2},${(height - tabHeight) / 2 + tabHeight * 0.1} `;
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
