
# Memory Game Hook Interface Stability Guide

## Overview
This document defines the stable interface contract for the `useMemoryGame` hook to prevent breaking changes.

## Interface Version
- **Current Version**: 1.0.0
- **Last Updated**: 2025-01-07
- **Status**: Stable

## Stable Interface Contract

### Core Interface: `MemoryGameHookInterface`

The `useMemoryGame` hook MUST return an object conforming to this interface:

```typescript
interface MemoryGameHookInterface {
  // Game state (read-only)
  gameState: {
    layout: MemoryLayout;
    theme: MemoryTheme;
    cards: MemoryCard[];
    isGameComplete: boolean;
    matchedPairs: number;
    moves: number;
  };
  
  // Game actions (functions)
  handleCardClick: (cardId: string) => void;
  initializeGame: (newLayout?: MemoryLayout, newTheme?: MemoryTheme) => void;
  startGame: () => void;
  resetGame: () => void;
  
  // Utilities
  getGameStats: () => GameStats;
  
  // Status flags
  isGameActive: boolean;
  disabled: boolean;
  gameInitialized: boolean;
  
  // Backward compatibility properties
  cards: MemoryCard[];
  moves: number;
  gameTime: number;
  score: number;
  leaderboard: any[];
  flipCard: (cardId: string) => void;
  gridSize: GridSize;
}
```

## Breaking Change Prevention Rules

### 1. **DO NOT** remove or rename existing properties
- All properties in the interface are considered public API
- Removing properties will break components that depend on them

### 2. **DO NOT** change function signatures
- Parameter types and return types must remain consistent
- Adding optional parameters is allowed

### 3. **DO** add new properties carefully
- New properties should be optional or have sensible defaults
- Document all additions in this file

### 4. **DO** use semantic versioning for interface changes
- Patch (1.0.1): Bug fixes, no interface changes
- Minor (1.1.0): New optional properties or methods
- Major (2.0.0): Breaking changes (avoid if possible)

## Testing Interface Stability

### Automated Tests
Use `MemoryGameInterfaceValidator` to validate the interface:

```typescript
import { MemoryGameInterfaceValidator } from '../tests/memoryGameInterfaceTests';

// In your component or test
const hookResult = useMemoryGame('3x4', 'animals');
MemoryGameInterfaceValidator.runInterfaceTests(hookResult);
```

### Manual Testing Checklist
- [ ] All required properties are present
- [ ] Function signatures match expected types
- [ ] No runtime errors when accessing properties
- [ ] Backward compatibility maintained

## Architecture Benefits

### Separation of Concerns
The hook is now split into focused sub-hooks:
- `useMemoryGameLogic`: Core game state and rules
- `useMemoryGameScoring`: Scoring calculations and leaderboards
- `useMemoryGame`: Main interface that composes the others

### Maintainability
- Changes to internal logic don't affect the public interface
- Each sub-hook can be tested independently
- Easier to add new features without breaking existing ones

## Change Management Process

### Before Making Changes
1. Review this documentation
2. Consider if the change affects the public interface
3. If yes, follow the versioning rules above

### After Making Changes
1. Run interface validation tests
2. Update this documentation if needed
3. Test all components that use the hook
4. Update version number if interface changed

## Emergency Breaking Changes

If a breaking change is absolutely necessary:

1. **Create a migration path**
   - Support both old and new interfaces temporarily
   - Provide clear migration instructions
   - Log deprecation warnings

2. **Communicate the change**
   - Update this document
   - Add comments in the code
   - Document the migration process

3. **Version appropriately**
   - Bump major version
   - Update interface version constant

## File Structure

```
src/components/games/memory/
├── interfaces/
│   └── memoryGameInterfaces.ts    # Stable interface definitions
├── hooks/
│   ├── useMemoryGame.ts           # Main hook (stable interface)
│   ├── useMemoryGameLogic.ts      # Game logic (internal)
│   └── useMemoryGameScoring.ts    # Scoring logic (internal)
├── tests/
│   └── memoryGameInterfaceTests.ts # Interface validation
└── docs/
    └── INTERFACE_STABILITY.md     # This document
```

## Future Considerations

### Planned Improvements
- Add TypeScript strict mode enforcement
- Implement runtime type checking in development
- Create automated regression tests
- Add performance monitoring hooks

### Extension Points
- Plugin system for custom game modes
- Configurable scoring algorithms
- Custom theme support
- Multiplayer functionality

Remember: **Stability over features**. A stable interface is more valuable than adding new features that break existing code.
