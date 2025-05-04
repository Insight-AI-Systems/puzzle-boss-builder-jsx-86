
// Generate SVG path for puzzle piece with interlocking tabs and slots
export function generatePiecePath(
  position: number,
  rows: number,
  columns: number,
  width: number,
  height: number
): string {
  const row = Math.floor(position / columns);
  const col = position % columns;
  
  // Tab/slot size as a percentage of the piece size
  const tabSize = Math.min(width, height) * 0.2;
  
  // Determine which sides have tabs or slots
  // We'll use a deterministic approach based on position:
  // - Right side: tab if position is even, slot if odd
  // - Bottom side: tab if row + col is even, slot if odd
  // - Left side: opposite of the piece to the left (slot if left piece has tab)
  // - Top side: opposite of the piece above (slot if piece above has tab)
  
  const hasRightTab = col < columns - 1 && col % 2 === 0;
  const hasBottomTab = row < rows - 1 && (row + col) % 2 === 0;
  const hasLeftTab = col > 0 && (col - 1) % 2 !== 0; // Opposite of the left piece
  const hasTopTab = row > 0 && (row - 1 + col) % 2 !== 0; // Opposite of the top piece
  
  // Start path at top-left corner
  let path = `M 0,0 `;
  
  // Top edge
  if (row === 0) {
    // Straight line for top row
    path += `H ${width} `;
  } else if (hasTopTab) {
    // Tab on top
    path += `H ${width * 0.3} `;
    path += `Q ${width * 0.35},${-tabSize * 0.2} ${width * 0.4},${-tabSize} `;
    path += `Q ${width * 0.5},${-tabSize * 1.5} ${width * 0.6},${-tabSize} `;
    path += `Q ${width * 0.65},${-tabSize * 0.2} ${width * 0.7},0 `;
    path += `H ${width} `;
  } else {
    // Slot on top
    path += `H ${width * 0.3} `;
    path += `Q ${width * 0.35},${tabSize * 0.2} ${width * 0.4},${tabSize} `;
    path += `Q ${width * 0.5},${tabSize * 1.5} ${width * 0.6},${tabSize} `;
    path += `Q ${width * 0.65},${tabSize * 0.2} ${width * 0.7},0 `;
    path += `H ${width} `;
  }
  
  // Right edge
  if (col === columns - 1) {
    // Straight line for rightmost column
    path += `V ${height} `;
  } else if (hasRightTab) {
    // Tab on right
    path += `V ${height * 0.3} `;
    path += `Q ${width + tabSize * 0.2},${height * 0.35} ${width + tabSize},${height * 0.4} `;
    path += `Q ${width + tabSize * 1.5},${height * 0.5} ${width + tabSize},${height * 0.6} `;
    path += `Q ${width + tabSize * 0.2},${height * 0.65} ${width},${height * 0.7} `;
    path += `V ${height} `;
  } else {
    // Slot on right
    path += `V ${height * 0.3} `;
    path += `Q ${width - tabSize * 0.2},${height * 0.35} ${width - tabSize},${height * 0.4} `;
    path += `Q ${width - tabSize * 1.5},${height * 0.5} ${width - tabSize},${height * 0.6} `;
    path += `Q ${width - tabSize * 0.2},${height * 0.65} ${width},${height * 0.7} `;
    path += `V ${height} `;
  }
  
  // Bottom edge
  if (row === rows - 1) {
    // Straight line for bottom row
    path += `H 0 `;
  } else if (hasBottomTab) {
    // Tab on bottom
    path += `H ${width * 0.7} `;
    path += `Q ${width * 0.65},${height + tabSize * 0.2} ${width * 0.6},${height + tabSize} `;
    path += `Q ${width * 0.5},${height + tabSize * 1.5} ${width * 0.4},${height + tabSize} `;
    path += `Q ${width * 0.35},${height + tabSize * 0.2} ${width * 0.3},${height} `;
    path += `H 0 `;
  } else {
    // Slot on bottom
    path += `H ${width * 0.7} `;
    path += `Q ${width * 0.65},${height - tabSize * 0.2} ${width * 0.6},${height - tabSize} `;
    path += `Q ${width * 0.5},${height - tabSize * 1.5} ${width * 0.4},${height - tabSize} `;
    path += `Q ${width * 0.35},${height - tabSize * 0.2} ${width * 0.3},${height} `;
    path += `H 0 `;
  }
  
  // Left edge
  if (col === 0) {
    // Straight line for leftmost column
    path += `V 0 `;
  } else if (hasLeftTab) {
    // Tab on left
    path += `V ${height * 0.7} `;
    path += `Q ${-tabSize * 0.2},${height * 0.65} ${-tabSize},${height * 0.6} `;
    path += `Q ${-tabSize * 1.5},${height * 0.5} ${-tabSize},${height * 0.4} `;
    path += `Q ${-tabSize * 0.2},${height * 0.35} 0,${height * 0.3} `;
    path += `V 0 `;
  } else {
    // Slot on left
    path += `V ${height * 0.7} `;
    path += `Q ${tabSize * 0.2},${height * 0.65} ${tabSize},${height * 0.6} `;
    path += `Q ${tabSize * 1.5},${height * 0.5} ${tabSize},${height * 0.4} `;
    path += `Q ${tabSize * 0.2},${height * 0.35} 0,${height * 0.3} `;
    path += `V 0 `;
  }
  
  // Close path
  path += 'Z';
  
  return path;
}
