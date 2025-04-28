
/**
 * Generates an SVG path for a jigsaw puzzle piece with traditional rounded tabs and slots
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
  
  // Determine which edges should have tabs/slots
  const hasTopEdge = row > 0;
  const hasRightEdge = col < columns - 1;
  const hasBottomEdge = row < rows - 1; 
  const hasLeftEdge = col > 0;
  
  // Tab/slot size as percentage of width/height (increased for more pronounced shape)
  const tabSizePercent = 0.4;
  
  // Calculate actual tab size based on piece dimensions
  const tabWidth = width * tabSizePercent;
  const tabHeight = height * tabSizePercent;
  
  // Control points for creating bezier curves
  // These values control the roundedness of the tabs/slots
  const tabCurveDepth = 0.7; // Higher value = more pronounced curve
  
  // Use consistent seeding to ensure tabs match with neighbor slots
  // Top piece's bottom tab matches bottom piece's top slot, etc.
  const topTabOut = ((position * 77 + row * 11) % 2) === 0;
  const rightTabOut = ((position * 67 + col * 13) % 2) === 0;
  const bottomTabOut = !topTabOut; // Ensures connecting pieces fit together
  const leftTabOut = !rightTabOut; // Ensures connecting pieces fit together
  
  // Start path at top-left corner
  let path = `M 0,0`;
  
  // Top edge
  if (hasTopEdge) {
    const tabStart = width * 0.3;
    const tabEnd = width * 0.7;
    
    // Path to start of tab/slot
    path += ` L ${tabStart},0`;
    
    if (topTabOut) {
      // Outward tab (bump) with rounded corners
      path += ` C ${tabStart + tabWidth * 0.1},0 ${tabStart + tabWidth * 0.1},-${tabHeight * tabCurveDepth} ${tabStart + tabWidth * 0.3},-${tabHeight * 0.8}`;
      path += ` C ${tabStart + tabWidth * 0.4},-${tabHeight} ${tabStart + tabWidth * 0.6},-${tabHeight} ${tabStart + tabWidth * 0.7},-${tabHeight * 0.8}`;
      path += ` C ${tabStart + tabWidth * 0.9},-${tabHeight * tabCurveDepth} ${tabStart + tabWidth * 0.9},0 ${tabEnd},0`;
    } else {
      // Inward slot (dip) with rounded corners
      path += ` C ${tabStart + tabWidth * 0.1},0 ${tabStart + tabWidth * 0.1},${tabHeight * tabCurveDepth} ${tabStart + tabWidth * 0.3},${tabHeight * 0.8}`;
      path += ` C ${tabStart + tabWidth * 0.4},${tabHeight} ${tabStart + tabWidth * 0.6},${tabHeight} ${tabStart + tabWidth * 0.7},${tabHeight * 0.8}`;
      path += ` C ${tabStart + tabWidth * 0.9},${tabHeight * tabCurveDepth} ${tabStart + tabWidth * 0.9},0 ${tabEnd},0`;
    }
    
    // Path to end of top edge
    path += ` L ${width},0`;
  } else {
    // Straight line if at top of puzzle
    path += ` L ${width},0`;
  }
  
  // Right edge
  if (hasRightEdge) {
    const tabStart = height * 0.3;
    const tabEnd = height * 0.7;
    
    // Path to start of tab/slot
    path += ` L ${width},${tabStart}`;
    
    if (rightTabOut) {
      // Outward tab with rounded corners
      path += ` C ${width},${tabStart + tabHeight * 0.1} ${width + tabWidth * tabCurveDepth},${tabStart + tabHeight * 0.1} ${width + tabWidth * 0.8},${tabStart + tabHeight * 0.3}`;
      path += ` C ${width + tabWidth},${tabStart + tabHeight * 0.4} ${width + tabWidth},${tabStart + tabHeight * 0.6} ${width + tabWidth * 0.8},${tabStart + tabHeight * 0.7}`;
      path += ` C ${width + tabWidth * tabCurveDepth},${tabStart + tabHeight * 0.9} ${width},${tabStart + tabHeight * 0.9} ${width},${tabEnd}`;
    } else {
      // Inward slot with rounded corners
      path += ` C ${width},${tabStart + tabHeight * 0.1} ${width - tabWidth * tabCurveDepth},${tabStart + tabHeight * 0.1} ${width - tabWidth * 0.8},${tabStart + tabHeight * 0.3}`;
      path += ` C ${width - tabWidth},${tabStart + tabHeight * 0.4} ${width - tabWidth},${tabStart + tabHeight * 0.6} ${width - tabWidth * 0.8},${tabStart + tabHeight * 0.7}`;
      path += ` C ${width - tabWidth * tabCurveDepth},${tabStart + tabHeight * 0.9} ${width},${tabStart + tabHeight * 0.9} ${width},${tabEnd}`;
    }
    
    // Path to end of right edge
    path += ` L ${width},${height}`;
  } else {
    // Straight line if at right edge of puzzle
    path += ` L ${width},${height}`;
  }
  
  // Bottom edge
  if (hasBottomEdge) {
    const tabStart = width * 0.7;
    const tabEnd = width * 0.3;
    
    // Path to start of tab/slot (going right to left)
    path += ` L ${tabStart},${height}`;
    
    if (bottomTabOut) {
      // Outward tab with rounded corners
      path += ` C ${tabStart - tabWidth * 0.1},${height} ${tabStart - tabWidth * 0.1},${height + tabHeight * tabCurveDepth} ${tabStart - tabWidth * 0.3},${height + tabHeight * 0.8}`;
      path += ` C ${tabStart - tabWidth * 0.4},${height + tabHeight} ${tabStart - tabWidth * 0.6},${height + tabHeight} ${tabStart - tabWidth * 0.7},${height + tabHeight * 0.8}`;
      path += ` C ${tabStart - tabWidth * 0.9},${height + tabHeight * tabCurveDepth} ${tabStart - tabWidth * 0.9},${height} ${tabEnd},${height}`;
    } else {
      // Inward slot with rounded corners
      path += ` C ${tabStart - tabWidth * 0.1},${height} ${tabStart - tabWidth * 0.1},${height - tabHeight * tabCurveDepth} ${tabStart - tabWidth * 0.3},${height - tabHeight * 0.8}`;
      path += ` C ${tabStart - tabWidth * 0.4},${height - tabHeight} ${tabStart - tabWidth * 0.6},${height - tabHeight} ${tabStart - tabWidth * 0.7},${height - tabHeight * 0.8}`;
      path += ` C ${tabStart - tabWidth * 0.9},${height - tabHeight * tabCurveDepth} ${tabStart - tabWidth * 0.9},${height} ${tabEnd},${height}`;
    }
    
    // Path to end of bottom edge
    path += ` L 0,${height}`;
  } else {
    // Straight line if at bottom of puzzle
    path += ` L 0,${height}`;
  }
  
  // Left edge
  if (hasLeftEdge) {
    const tabStart = height * 0.7;
    const tabEnd = height * 0.3;
    
    // Path to start of tab/slot
    path += ` L 0,${tabStart}`;
    
    if (leftTabOut) {
      // Outward tab with rounded corners
      path += ` C 0,${tabStart - tabHeight * 0.1} -${tabWidth * tabCurveDepth},${tabStart - tabHeight * 0.1} -${tabWidth * 0.8},${tabStart - tabHeight * 0.3}`;
      path += ` C -${tabWidth},${tabStart - tabHeight * 0.4} -${tabWidth},${tabStart - tabHeight * 0.6} -${tabWidth * 0.8},${tabStart - tabHeight * 0.7}`;
      path += ` C -${tabWidth * tabCurveDepth},${tabStart - tabHeight * 0.9} 0,${tabStart - tabHeight * 0.9} 0,${tabEnd}`;
    } else {
      // Inward slot with rounded corners
      path += ` C 0,${tabStart - tabHeight * 0.1} ${tabWidth * tabCurveDepth},${tabStart - tabHeight * 0.1} ${tabWidth * 0.8},${tabStart - tabHeight * 0.3}`;
      path += ` C ${tabWidth},${tabStart - tabHeight * 0.4} ${tabWidth},${tabStart - tabHeight * 0.6} ${tabWidth * 0.8},${tabStart - tabHeight * 0.7}`;
      path += ` C ${tabWidth * tabCurveDepth},${tabStart - tabHeight * 0.9} 0,${tabStart - tabHeight * 0.9} 0,${tabEnd}`;
    }
    
    // Path to start position
    path += ` L 0,0`;
  } else {
    // Straight line if at left edge of puzzle
    path += ` L 0,0`;
  }
  
  // Close path
  path += ` Z`;
  
  return path;
}
