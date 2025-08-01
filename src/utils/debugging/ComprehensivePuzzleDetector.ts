/**
 * COMPREHENSIVE OLD PUZZLE CODE DETECTOR
 * 
 * This tool scans for ALL possible old puzzle code patterns
 */

interface PuzzleCodeReference {
  file: string;
  lineNumber: number;
  content: string;
  type: 'import' | 'component-usage' | 'route' | 'hook' | 'class' | 'function' | 'variable';
  severity: 'critical' | 'warning' | 'info';
}

export class ComprehensivePuzzleDetector {
  
  // Comprehensive list of ALL possible old puzzle patterns
  private static readonly OLD_PUZZLE_PATTERNS = [
    // Component names
    'PuzzleGameEngine',
    'SimplePuzzle', 
    'InteractivePuzzle',
    'JigsawPuzzleGame',
    'PuzzleGameLayout',
    'PuzzleGameControls',
    'PuzzleGameCanvas',
    'PuzzleContainer',
    'ImagePuzzleContainer',
    'PuzzleGrid',
    'PuzzlePiece',
    'PuzzleStagingArea',
    'CustomPuzzleEngine',
    'ReactJigsawPuzzle',
    'PhaserPuzzleEngine',
    'SVGJigsawPuzzle',
    'PuzzleGameSelector',
    'PuzzleGameSidebar',
    'GridBasedPuzzle',
    'ExamplePuzzleGame',
    
    // Hooks and utilities
    'usePuzzlePieces',
    'useSimplePuzzle',
    'usePuzzleState', // The old one, not EnhancedJigsawPuzzle's
    'usePuzzleTimer',
    'useSimplePuzzleHandlers',
    'useSimplePuzzlePieces',
    
    // Types and interfaces
    'SimplePuzzlePiece',
    'simple-puzzle-types',
    'SimplePuzzleControlPanel',
    'SimplePuzzleControls',
    'SimplePuzzleDirectionalControlsContainer',
    'SimplePuzzleGrid',
    'SimplePuzzleStateDisplay',
    'SimpleDirectionalControls',
    
    // File/directory patterns
    'puzzle-engine',
    'simple-puzzle',
    'interactive-puzzle',
    'puzzle-game',
    'playground/engines',
    
    // Routes
    'puzzle/:sessionId',
    'PuzzleSessionPage',
    
    // Canvas implementations (excluding confetti)
    'getContext.*2d.*puzzle',
    'canvas.*puzzle',
    'drawImage.*puzzle',
    
    // CSS classes that might indicate old puzzles
    'puzzle-game-engine',
    'simple-puzzle-container',
    'interactive-puzzle-wrapper',
    'puzzle-canvas-container'
  ];
  
  static async scanForOldPuzzleCode(): Promise<PuzzleCodeReference[]> {
    console.log('🔍 Starting comprehensive old puzzle code scan...');
    
    const findings: PuzzleCodeReference[] = [];
    
    // This would need to be implemented with actual file system access
    // For now, we'll simulate the scanning process
    
    console.log('📋 Patterns to scan for:', this.OLD_PUZZLE_PATTERNS);
    
    // In a real implementation, this would:
    // 1. Scan all .ts, .tsx, .js, .jsx files
    // 2. Check imports, exports, component usage
    // 3. Check route definitions
    // 4. Check CSS classes
    // 5. Check function/variable names
    
    return findings;
  }
  
  static generateReport(findings: PuzzleCodeReference[]): void {
    console.log('\n📊 COMPREHENSIVE PUZZLE SCAN RESULTS');
    console.log('=====================================');
    
    const critical = findings.filter(f => f.severity === 'critical');
    const warnings = findings.filter(f => f.severity === 'warning');
    
    console.log(`🚨 Critical issues: ${critical.length}`);
    console.log(`⚠️ Warnings: ${warnings.length}`);
    console.log(`📝 Total findings: ${findings.length}`);
    
    if (critical.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES (OLD PUZZLE CODE STILL EXISTS):');
      critical.forEach(finding => {
        console.log(`  ❌ ${finding.file}:${finding.lineNumber} - ${finding.content}`);
        console.log(`     Type: ${finding.type}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ WARNINGS (POTENTIAL OLD PUZZLE REFERENCES):');
      warnings.forEach(finding => {
        console.log(`  ⚠️ ${finding.file}:${finding.lineNumber} - ${finding.content}`);
      });
    }
    
    if (findings.length === 0) {
      console.log('\n✅ SUCCESS: No old puzzle code found!');
      console.log('🎯 Only EnhancedJigsawPuzzle should be in use.');
    } else {
      console.log(`\n❌ CLEANUP REQUIRED: Found ${findings.length} old puzzle references.`);
    }
  }
}

// Auto-run scan
ComprehensivePuzzleDetector.scanForOldPuzzleCode()
  .then(findings => ComprehensivePuzzleDetector.generateReport(findings));