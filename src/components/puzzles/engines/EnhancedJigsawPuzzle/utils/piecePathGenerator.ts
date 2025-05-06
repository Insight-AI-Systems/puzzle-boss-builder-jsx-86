
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
  
  // Tab/slot size as a percentage of the piece size - increased for more pronounced bulb and socket
  const tabSize = Math.min(width, height) * 0.42; // Larger tabs for traditional appearance
  
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
    // Traditional bulb on top with pronounced narrow neck and rounded head
    path += `H ${width * 0.3} `;
    
    // Narrow neck into the bulb
    path += `C ${width * 0.32},${-tabSize * 0.2} ${width * 0.35},${-tabSize * 0.4} ${width * 0.4},${-tabSize * 0.6} `;
    
    // Rounded bulb top with a pronounced bulb shape
    path += `C ${width * 0.5},${-tabSize * 0.9} ${width * 0.6},${-tabSize * 0.6} ${width * 0.65},${-tabSize * 0.4} `;
    
    // Narrow neck returning to the edge
    path += `C ${width * 0.7},${-tabSize * 0.2} ${width * 0.7},0 ${width * 0.7},0 `;
    path += `H ${width} `;
  } else {
    // Traditional socket on top with pronounced narrow opening and rounded cavity
    path += `H ${width * 0.3} `;
    
    // Narrow opening into the socket
    path += `C ${width * 0.32},${tabSize * 0.2} ${width * 0.35},${tabSize * 0.4} ${width * 0.4},${tabSize * 0.6} `;
    
    // Rounded socket cavity
    path += `C ${width * 0.5},${tabSize * 0.9} ${width * 0.6},${tabSize * 0.6} ${width * 0.65},${tabSize * 0.4} `;
    
    // Narrow opening returning to the edge
    path += `C ${width * 0.7},${tabSize * 0.2} ${width * 0.7},0 ${width * 0.7},0 `;
    path += `H ${width} `;
  }
  
  // Right edge
  if (col === columns - 1) {
    // Straight line for rightmost column
    path += `V ${height} `;
  } else if (hasRightTab) {
    // Traditional bulb on right with pronounced narrow neck and rounded head
    path += `V ${height * 0.3} `;
    
    // Narrow neck into the bulb
    path += `C ${width + tabSize * 0.2},${height * 0.32} ${width + tabSize * 0.4},${height * 0.35} ${width + tabSize * 0.6},${height * 0.4} `;
    
    // Rounded bulb side
    path += `C ${width + tabSize * 0.9},${height * 0.5} ${width + tabSize * 0.6},${height * 0.6} ${width + tabSize * 0.4},${height * 0.65} `;
    
    // Narrow neck returning to the edge
    path += `C ${width + tabSize * 0.2},${height * 0.7} ${width},${height * 0.7} ${width},${height * 0.7} `;
    path += `V ${height} `;
  } else {
    // Traditional socket on right with pronounced narrow opening and rounded cavity
    path += `V ${height * 0.3} `;
    
    // Narrow opening into the socket
    path += `C ${width - tabSize * 0.2},${height * 0.32} ${width - tabSize * 0.4},${height * 0.35} ${width - tabSize * 0.6},${height * 0.4} `;
    
    // Rounded socket cavity
    path += `C ${width - tabSize * 0.9},${height * 0.5} ${width - tabSize * 0.6},${height * 0.6} ${width - tabSize * 0.4},${height * 0.65} `;
    
    // Narrow opening returning to the edge
    path += `C ${width - tabSize * 0.2},${height * 0.7} ${width},${height * 0.7} ${width},${height * 0.7} `;
    path += `V ${height} `;
  }
  
  // Bottom edge
  if (row === rows - 1) {
    // Straight line for bottom row
    path += `H 0 `;
  } else if (hasBottomTab) {
    // Traditional bulb on bottom with pronounced narrow neck and rounded head
    path += `H ${width * 0.7} `;
    
    // Narrow neck into the bulb
    path += `C ${width * 0.68},${height + tabSize * 0.2} ${width * 0.65},${height + tabSize * 0.4} ${width * 0.6},${height + tabSize * 0.6} `;
    
    // Rounded bulb bottom
    path += `C ${width * 0.5},${height + tabSize * 0.9} ${width * 0.4},${height + tabSize * 0.6} ${width * 0.35},${height + tabSize * 0.4} `;
    
    // Narrow neck returning to the edge
    path += `C ${width * 0.3},${height + tabSize * 0.2} ${width * 0.3},${height} ${width * 0.3},${height} `;
    path += `H 0 `;
  } else {
    // Traditional socket on bottom with pronounced narrow opening and rounded cavity
    path += `H ${width * 0.7} `;
    
    // Narrow opening into the socket
    path += `C ${width * 0.68},${height - tabSize * 0.2} ${width * 0.65},${height - tabSize * 0.4} ${width * 0.6},${height - tabSize * 0.6} `;
    
    // Rounded socket cavity
    path += `C ${width * 0.5},${height - tabSize * 0.9} ${width * 0.4},${height - tabSize * 0.6} ${width * 0.35},${height - tabSize * 0.4} `;
    
    // Narrow opening returning to the edge
    path += `C ${width * 0.3},${height - tabSize * 0.2} ${width * 0.3},${height} ${width * 0.3},${height} `;
    path += `H 0 `;
  }
  
  // Left edge
  if (col === 0) {
    // Straight line for leftmost column
    path += `V 0 `;
  } else if (hasLeftTab) {
    // Traditional bulb on left with pronounced narrow neck and rounded head
    path += `V ${height * 0.7} `;
    
    // Narrow neck into the bulb
    path += `C ${-tabSize * 0.2},${height * 0.68} ${-tabSize * 0.4},${height * 0.65} ${-tabSize * 0.6},${height * 0.6} `;
    
    // Rounded bulb side
    path += `C ${-tabSize * 0.9},${height * 0.5} ${-tabSize * 0.6},${height * 0.4} ${-tabSize * 0.4},${height * 0.35} `;
    
    // Narrow neck returning to the edge
    path += `C ${-tabSize * 0.2},${height * 0.3} 0,${height * 0.3} 0,${height * 0.3} `;
    path += `V 0 `;
  } else {
    // Traditional socket on left with pronounced narrow opening and rounded cavity
    path += `V ${height * 0.7} `;
    
    // Narrow opening into the socket
    path += `C ${tabSize * 0.2},${height * 0.68} ${tabSize * 0.4},${height * 0.65} ${tabSize * 0.6},${height * 0.6} `;
    
    // Rounded socket cavity
    path += `C ${tabSize * 0.9},${height * 0.5} ${tabSize * 0.6},${height * 0.4} ${tabSize * 0.4},${height * 0.35} `;
    
    // Narrow opening returning to the edge
    path += `C ${tabSize * 0.2},${height * 0.3} 0,${height * 0.3} 0,${height * 0.3} `;
    path += `V 0 `;
  }
  
  // Close path
  path += 'Z';
  
  return path;
}
