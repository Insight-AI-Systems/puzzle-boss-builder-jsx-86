
# Adding New Puzzle Engines to the Playground

This directory contains implementations of different puzzle engines that can be tested in the Puzzle Test Playground.

## How to Add a New Puzzle Engine

1. Create a new file in this directory for your engine (e.g., `MyCustomPuzzleEngine.tsx`)
2. Implement your engine as a React component with these standardized props:
   - `imageUrl`: URL of the image to use for the puzzle
   - `rows`: Number of rows in the puzzle grid
   - `columns`: Number of columns in the puzzle grid

3. Update the `PUZZLE_ENGINES` array in `PuzzleEnginePlayground.tsx` to include your new engine:

```typescript
const PUZZLE_ENGINES = [
  { id: 'react-jigsaw-puzzle', name: 'React Jigsaw Puzzle' },
  { id: 'my-custom-engine', name: 'My Custom Engine' }, // Add your new engine here
  // Add more engines as they become available
];
```

4. Update the component rendering logic in `PuzzleEnginePlayground.tsx` to render your engine when selected:

```typescript
{selectedEngine === 'my-custom-engine' && (
  <MyCustomPuzzleEngine
    key={`my-engine-${resetKey}`}
    imageUrl={currentImage}
    rows={currentDifficultyPreset.rows}
    columns={currentDifficultyPreset.columns}
  />
)}
```

## Engine Interface Guidelines

For consistency across engines, follow these guidelines:

- Use the provided props (`imageUrl`, `rows`, `columns`) for configuration
- Handle puzzle completion and notify the user when the puzzle is solved
- Display loading states when appropriate
- Ensure the engine works in both light and dark themes
- Maintain responsive behavior for different screen sizes

## Example Engine Template

```typescript
import React, { useState } from 'react';

interface MyCustomPuzzleEngineProps {
  imageUrl: string;
  rows: number;
  columns: number;
}

const MyCustomPuzzleEngine: React.FC<MyCustomPuzzleEngineProps> = ({ 
  imageUrl, 
  rows, 
  columns 
}) => {
  const [completed, setCompleted] = useState(false);
  
  // Your puzzle implementation logic here
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Your puzzle UI here */}
      
      {completed && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md">
          Puzzle completed!
        </div>
      )}
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p className="font-medium">Engine: My Custom Engine</p>
        <p className="text-xs">Difficulty: {rows}x{columns}</p>
      </div>
    </div>
  );
};

export default MyCustomPuzzleEngine;
```

## Performance Considerations

When implementing a new engine, consider these performance aspects:

1. Initial load time
2. Interaction smoothness
3. Memory usage
4. Mobile responsiveness
5. Accessibility

Document your observations in the evaluation notes section of the playground.
