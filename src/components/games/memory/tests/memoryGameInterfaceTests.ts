
import { MemoryGameHookInterface, MEMORY_GAME_INTERFACE_VERSION } from '../interfaces/memoryGameInterfaces';

/**
 * Interface Contract Tests for Memory Game Hook
 * These tests ensure the hook interface remains stable across changes
 */

export class MemoryGameInterfaceValidator {
  static validateInterface(hookResult: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check required top-level properties
    const requiredProps = [
      'gameState', 'handleCardClick', 'initializeGame', 'startGame', 'resetGame',
      'getGameStats', 'isGameActive', 'disabled', 'gameInitialized',
      'cards', 'moves', 'gameTime', 'score', 'leaderboard', 'flipCard', 'gridSize'
    ];
    
    for (const prop of requiredProps) {
      if (!(prop in hookResult)) {
        errors.push(`Missing required property: ${prop}`);
      }
    }
    
    // Check gameState structure
    if (hookResult.gameState) {
      const gameStateProps = ['layout', 'theme', 'cards', 'isGameComplete', 'matchedPairs', 'moves'];
      for (const prop of gameStateProps) {
        if (!(prop in hookResult.gameState)) {
          errors.push(`Missing gameState property: ${prop}`);
        }
      }
    } else {
      errors.push('gameState is missing or null');
    }
    
    // Check function types
    const functionProps = ['handleCardClick', 'initializeGame', 'startGame', 'resetGame', 'getGameStats', 'flipCard'];
    for (const prop of functionProps) {
      if (hookResult[prop] && typeof hookResult[prop] !== 'function') {
        errors.push(`${prop} should be a function`);
      }
    }
    
    // Check array types
    const arrayProps = ['cards', 'leaderboard'];
    for (const prop of arrayProps) {
      if (hookResult[prop] && !Array.isArray(hookResult[prop])) {
        errors.push(`${prop} should be an array`);
      }
    }
    
    // Check boolean types
    const booleanProps = ['isGameActive', 'disabled', 'gameInitialized'];
    for (const prop of booleanProps) {
      if (hookResult[prop] !== undefined && typeof hookResult[prop] !== 'boolean') {
        errors.push(`${prop} should be a boolean`);
      }
    }
    
    // Check number types
    const numberProps = ['moves', 'gameTime', 'score'];
    for (const prop of numberProps) {
      if (hookResult[prop] !== undefined && typeof hookResult[prop] !== 'number') {
        errors.push(`${prop} should be a number`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static runInterfaceTests(hookResult: any): void {
    console.group(`🧪 Memory Game Interface Tests (v${MEMORY_GAME_INTERFACE_VERSION})`);
    
    const validation = this.validateInterface(hookResult);
    
    if (validation.isValid) {
      console.log('✅ All interface tests passed');
    } else {
      console.error('❌ Interface validation failed:');
      validation.errors.forEach(error => console.error(`  - ${error}`));
    }
    
    console.groupEnd();
  }
}

// Development-only interface monitoring
if (process.env.NODE_ENV === 'development') {
  (window as any).memoryGameInterfaceValidator = MemoryGameInterfaceValidator;
}
