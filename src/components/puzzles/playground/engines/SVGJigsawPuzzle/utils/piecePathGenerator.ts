
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
  // Increased from 0.25 to 0.35 for more pronounced tabs/slots
  const tabSize = 0.35;
  // Curve intensity controls how much the tabs/slots curve (higher = more curved)
  const curveIntensity = 0.5;
  
  // Randomize tab/slot direction based on position
  // Using a more consistent seed pattern to ensure tabs match with neighbor slots
  const topTabOut = ((position + row) % 2) === 0;
  const rightTabOut = ((position + col) % 2) === 0;
  const bottomTabOut = ((position + row + 1) % 2) === 0; // Inverse of top for connecting pieces
  const leftTabOut = ((position + col + 1) % 2) === 0;   // Inverse of right for connecting pieces
  
  // Start path at top-left corner
  let path = `M 0 0`;
  
  // Top edge
  if (hasTopTab) {
    // First third of top edge
    path += ` L ${width * (0.5 - tabSize)} 0`;
    
    // Tab or slot on top edge
    if (topTabOut) {
      // Outward tab - more pronounced curve
      path += ` C ${width * (0.5 - tabSize * 0.8)} ${-height * tabSize * curveIntensity}, 
                  ${width * (0.5 + tabSize * 0.8)} ${-height * tabSize * curveIntensity}, 
                  ${width * (0.5 + tabSize)} 0`;
    } else {
      // Inward slot - more pronounced curve
      path += ` C ${width * (0.5 - tabSize * 0.8)} ${height * tabSize * curveIntensity}, 
                  ${width * (0.5 + tabSize * 0.8)} ${height * tabSize * curveIntensity}, 
                  ${width * (0.5 + tabSize)} 0`;
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
      path += ` C ${width + width * tabSize * curveIntensity} ${height * (0.5 - tabSize * 0.8)}, 
                  ${width + width * tabSize * curveIntensity} ${height * (0.5 + tabSize * 0.8)}, 
                  ${width} ${height * (0.5 + tabSize)}`;
    } else {
      // Inward slot
      path += ` C ${width - width * tabSize * curveIntensity} ${height * (0.5 - tabSize * 0.8)}, 
                  ${width - width * tabSize * curveIntensity} ${height * (0.5 + tabSize * 0.8)}, 
                  ${width} ${height * (0.5 + tabSize)}`;
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
      path += ` C ${width * (0.5 + tabSize * 0.8)} ${height + height * tabSize * curveIntensity}, 
                  ${width * (0.5 - tabSize * 0.8)} ${height + height * tabSize * curveIntensity}, 
                  ${width * (0.5 - tabSize)} ${height}`;
    } else {
      // Inward slot
      path += ` C ${width * (0.5 + tabSize * 0.8)} ${height - height * tabSize * curveIntensity}, 
                  ${width * (0.5 - tabSize * 0.8)} ${height - height * tabSize * curveIntensity}, 
                  ${width * (0.5 - tabSize)} ${height}`;
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
      path += ` C ${-width * tabSize * curveIntensity} ${height * (0.5 + tabSize * 0.8)}, 
                  ${-width * tabSize * curveIntensity} ${height * (0.5 - tabSize * 0.8)}, 
                  0 ${height * (0.5 - tabSize)}`;
    } else {
      // Inward slot
      path += ` C ${width * tabSize * curveIntensity} ${height * (0.5 + tabSize * 0.8)}, 
                  ${width * tabSize * curveIntensity} ${height * (0.5 - tabSize * 0.8)}, 
                  0 ${height * (0.5 - tabSize)}`;
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
