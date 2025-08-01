/**
 * COMPREHENSIVE PUZZLE ROUTE DIAGNOSTIC TOOL
 * 
 * This tool will help us understand exactly what's being loaded on /puzzles/jigsaw/puzzle-1
 */

import React from 'react';

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
    PuzzleRouteDiagnostic?: typeof PuzzleRouteDiagnostic;
  }
}

export class PuzzleRouteDiagnostic {
  
  static diagnoseCurrentRoute() {
    console.log('🔍 PUZZLE ROUTE DIAGNOSTIC STARTING...');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    
    // Check what components are actually mounted
    const puzzleElements = document.querySelectorAll('[class*="puzzle"], [id*="puzzle"]');
    console.log('🧩 Found puzzle-related DOM elements:', puzzleElements.length);
    
    puzzleElements.forEach((element, index) => {
      console.log(`Element ${index + 1}:`, {
        tagName: element.tagName,
        className: element.className,
        id: element.id,
        innerHTML: element.innerHTML.substring(0, 100) + '...'
      });
    });
    
    // Check for specific old puzzle patterns
    const oldPuzzleIndicators = [
      'PuzzleGameEngine',
      'SimplePuzzle',
      'InteractivePuzzle',
      'PuzzleGameLayout',
      'puzzle-game-engine',
      'simple-puzzle',
      'interactive-puzzle'
    ];
    
    console.log('🚨 Checking for old puzzle indicators...');
    oldPuzzleIndicators.forEach(indicator => {
      const found = document.querySelector(`[class*="${indicator}"], [id*="${indicator}"]`);
      if (found) {
        console.error(`❌ OLD PUZZLE FOUND: ${indicator}`, found);
      } else {
        console.log(`✅ Clean: ${indicator}`);
      }
    });
    
    // Check for EnhancedJigsawPuzzle
    const enhancedPuzzle = document.querySelector('.enhanced-jigsaw-puzzle');
    if (enhancedPuzzle) {
      console.log('✅ EnhancedJigsawPuzzle found:', enhancedPuzzle);
    } else {
      console.error('❌ EnhancedJigsawPuzzle NOT found!');
    }
    
    // Check React component tree (if React DevTools available)
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('🔧 React DevTools detected - checking component tree...');
    }
    
    return {
      url: window.location.href,
      puzzleElementsFound: puzzleElements.length,
      hasEnhancedPuzzle: !!enhancedPuzzle,
      oldPuzzleIndicatorsFound: oldPuzzleIndicators.filter(indicator => 
        document.querySelector(`[class*="${indicator}"], [id*="${indicator}"]`)
      )
    };
  }
  
  static logComponentLoadTrace() {
    // This will help us trace which components are being loaded
    const originalCreateElement = React.createElement;
    (React as any).createElement = function(type: any, props: any, ...children: any[]) {
      if (typeof type === 'string' && type.toLowerCase().includes('puzzle')) {
        console.log('🧩 Creating puzzle-related element:', type, props);
      } else if (typeof type === 'function' && type.name && type.name.toLowerCase().includes('puzzle')) {
        console.log('🧩 Creating puzzle component:', type.name, props);
      }
      return originalCreateElement.apply(this, arguments as any);
    };
  }
}

// Auto-run diagnostic when module loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      PuzzleRouteDiagnostic.diagnoseCurrentRoute();
    }, 1000);
  });
}

// Make it globally available for manual testing
if (typeof window !== 'undefined') {
  window.PuzzleRouteDiagnostic = PuzzleRouteDiagnostic;
}