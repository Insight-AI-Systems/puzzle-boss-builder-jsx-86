
/**
 * Generates an SVG path for a jigsaw puzzle piece
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
  const hasTopTab = row > 0;
  const hasRightTab = col < columns - 1;
  const hasBottomTab = row < rows - 1; 
  const hasLeftTab = col > 0;
  
  // Size of tab/slot (as percentage of width/height)
  const tabSize = 0.25;
  
  // Randomize tab/slot direction based on position
  // Use position as seed for consistent results
  const topTabOut = ((position * 13) % 2) === 0;
  const rightTabOut = ((position * 7) % 2) === 0;
  const bottomTabOut = ((position * 11) % 2) === 0;
  const leftTabOut = ((position * 5) % 2) === 0;
  
  // Start path at top-left corner
  let path = `M 0 0`;
  
  // Top edge
  if (hasTopTab) {
    // First third of top edge
    path += ` L ${width * (0.5 - tabSize)} 0`;
    
    // Tab or slot on top edge
    if (topTabOut) {
      // Outward tab
      path += ` C ${width * (0.5 - tabSize)} ${-height * tabSize * 0.5}, ${width * (0.5 + tabSize)} ${-height * tabSize * 0.5}, ${width * (0.5 + tabSize)} 0`;
    } else {
      // Inward slot
      path += ` C ${width * (0.5 - tabSize)} ${height * tabSize * 0.5}, ${width * (0.5 + tabSize)} ${height * tabSize * 0.5}, ${width * (0.5 + tabSize)} 0`;
    }
    
    // Remaining top edge
    path += ` L ${width} 0`;
  } else {
    // Straight line if at top of puzzle
    path += ` L ${width} 0`;
  }
  
  // Right edge
  if (hasRightTab) {
    // First third of right edge
    path += ` L ${width} ${height * (0.5 - tabSize)}`;
    
    // Tab or slot on right edge
    if (rightTabOut) {
      // Outward tab
      path += ` C ${width + width * tabSize * 0.5} ${height * (0.5 - tabSize)}, ${width + width * tabSize * 0.5} ${height * (0.5 + tabSize)}, ${width} ${height * (0.5 + tabSize)}`;
    } else {
      // Inward slot
      path += ` C ${width - width * tabSize * 0.5} ${height * (0.5 - tabSize)}, ${width - width * tabSize * 0.5} ${height * (0.5 + tabSize)}, ${width} ${height * (0.5 + tabSize)}`;
    }
    
    // Remaining right edge
    path += ` L ${width} ${height}`;
  } else {
    // Straight line if at right edge of puzzle
    path += ` L ${width} ${height}`;
  }
  
  // Bottom edge
  if (hasBottomTab) {
    // First third of bottom edge
    path += ` L ${width * (0.5 + tabSize)} ${height}`;
    
    // Tab or slot on bottom edge
    if (bottomTabOut) {
      // Outward tab
      path += ` C ${width * (0.5 + tabSize)} ${height + height * tabSize * 0.5}, ${width * (0.5 - tabSize)} ${height + height * tabSize * 0.5}, ${width * (0.5 - tabSize)} ${height}`;
    } else {
      // Inward slot
      path += ` C ${width * (0.5 + tabSize)} ${height - height * tabSize * 0.5}, ${width * (0.5 - tabSize)} ${height - height * tabSize * 0.5}, ${width * (0.5 - tabSize)} ${height}`;
    }
    
    // Remaining bottom edge
    path += ` L 0 ${height}`;
  } else {
    // Straight line if at bottom of puzzle
    path += ` L 0 ${height}`;
  }
  
  // Left edge
  if (hasLeftTab) {
    // First third of left edge
    path += ` L 0 ${height * (0.5 + tabSize)}`;
    
    // Tab or slot on left edge
    if (leftTabOut) {
      // Outward tab
      path += ` C ${-width * tabSize * 0.5} ${height * (0.5 + tabSize)}, ${-width * tabSize * 0.5} ${height * (0.5 - tabSize)}, 0 ${height * (0.5 - tabSize)}`;
    } else {
      // Inward slot
      path += ` C ${width * tabSize * 0.5} ${height * (0.5 + tabSize)}, ${width * tabSize * 0.5} ${height * (0.5 - tabSize)}, 0 ${height * (0.5 - tabSize)}`;
    }
    
    // Back to start
    path += ` L 0 0`;
  } else {
    // Straight line if at left edge of puzzle
    path += ` L 0 0`;
  }
  
  // Close path
  path += ` Z`;
  
  return path;
}
