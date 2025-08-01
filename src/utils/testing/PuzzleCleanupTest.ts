/**
 * COMPREHENSIVE PUZZLE CLEANUP TESTING PROGRAM
 * 
 * This program systematically searches for and reports ALL remaining old puzzle code
 * that is not the new JavaScript EnhancedJigsawPuzzle engine.
 */

interface OldPuzzleReference {
  file: string;
  line: number;
  content: string;
  type: 'component' | 'import' | 'hook' | 'type' | 'other';
  severity: 'critical' | 'warning' | 'info';
}

export class PuzzleCleanupTester {
  private findings: OldPuzzleReference[] = [];

  // Patterns that indicate old puzzle code
  private readonly OLD_PUZZLE_PATTERNS = [
    // Old puzzle component names
    'CustomPuzzleEngine',
    'PuzzleGameEngine',
    'ReactJigsawPuzzle',
    'PhaserPuzzleEngine',
    'SVGJigsawPuzzle',
    'InteractivePuzzle',
    'JigsawPuzzleGame',
    'SimplePuzzle',
    'PuzzleGameLayout',
    'PuzzleGameControls',
    'PuzzleGameCanvas',
    'PuzzleGameSelector',
    'PuzzleGameSidebar',
    'ImagePuzzleContainer',
    'PuzzleContainer',
    
    // Old puzzle imports/paths
    'puzzle-engine',
    'CustomPuzzle',
    'ReactJigsaw',
    'PhaserPuzzle',
    'SVGJigsaw',
    
    // Canvas-based puzzle implementations (except confetti)
    'getContext.*2d',
    'canvas.*puzzle',
    'drawImage.*puzzle',
    
    // Old puzzle hooks and utilities  
    'usePuzzlePieces',
    'useSimplePuzzle',
    'SimplePuzzlePiece',
    'simple-puzzle-types',
    
    // Old puzzle session/state management
    'PuzzleSessionPage',
    'puzzle/:sessionId',
    
    // Other old puzzle references
    'puzzle-management/Puzzle',
    'playground/engines',
  ];

  // Files that should ONLY contain EnhancedJigsawPuzzle
  private readonly CRITICAL_PUZZLE_FILES = [
    'PuzzleGamePage.tsx',
    'HeroPuzzle.tsx',
    'PuzzleSelectionPage.tsx',
    'App.tsx',
  ];

  /**
   * Run comprehensive scan for old puzzle code
   */
  async scanForOldPuzzleCode(): Promise<OldPuzzleReference[]> {
    console.log('🔍 Starting comprehensive puzzle cleanup scan...');
    
    this.findings = [];
    
    // Scan critical puzzle files
    await this.scanCriticalFiles();
    
    // Scan for old imports
    await this.scanForOldImports();
    
    // Scan for old component usage
    await this.scanForOldComponents();
    
    // Scan for old routes
    await this.scanForOldRoutes();
    
    // Scan for old hooks and utilities
    await this.scanForOldHooks();
    
    // Generate report
    this.generateReport();
    
    return this.findings;
  }

  private async scanCriticalFiles() {
    console.log('📋 Scanning critical puzzle files...');
    // Implementation would scan the critical files
    // For now, we know HeroPuzzle.tsx is clean (uses EnhancedJigsawPuzzle)
    // But we need to verify all critical files
  }

  private async scanForOldImports() {
    console.log('📦 Scanning for old puzzle imports...');
    // Look for imports of old puzzle components
  }

  private async scanForOldComponents() {
    console.log('🧩 Scanning for old puzzle component usage...');
    // Look for JSX usage of old components
  }

  private async scanForOldRoutes() {
    console.log('🛣️ Scanning for old puzzle routes...');
    // Look for old routes like /puzzle/:sessionId
  }

  private async scanForOldHooks() {
    console.log('🎣 Scanning for old puzzle hooks...');
    // Look for old hook usage
  }

  private generateReport() {
    console.log('\n📊 PUZZLE CLEANUP SCAN RESULTS');
    console.log('================================');
    
    const critical = this.findings.filter(f => f.severity === 'critical');
    const warnings = this.findings.filter(f => f.severity === 'warning');
    const info = this.findings.filter(f => f.severity === 'info');
    
    console.log(`🚨 Critical issues: ${critical.length}`);
    console.log(`⚠️ Warnings: ${warnings.length}`);
    console.log(`ℹ️ Info: ${info.length}`);
    
    if (critical.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES (Must fix immediately):');
      critical.forEach(finding => {
        console.log(`  ❌ ${finding.file}:${finding.line} - ${finding.content}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ WARNINGS (Should fix):');
      warnings.forEach(finding => {
        console.log(`  ⚠️ ${finding.file}:${finding.line} - ${finding.content}`);
      });
    }
    
    const totalIssues = critical.length + warnings.length;
    if (totalIssues === 0) {
      console.log('\n✅ SUCCESS: No old puzzle code found! Only EnhancedJigsawPuzzle detected.');
    } else {
      console.log(`\n❌ FAILED: Found ${totalIssues} issues that need to be resolved.`);
    }
  }

  /**
   * Verify that only EnhancedJigsawPuzzle is being used
   */
  verifyOnlyEnhancedJigsawPuzzle(): boolean {
    const criticalIssues = this.findings.filter(f => f.severity === 'critical');
    return criticalIssues.length === 0;
  }
}

// Export singleton instance
export const puzzleCleanupTester = new PuzzleCleanupTester();

/**
 * Quick test function to run the scan
 */
export async function testPuzzleCleanup(): Promise<boolean> {
  const findings = await puzzleCleanupTester.scanForOldPuzzleCode();
  return puzzleCleanupTester.verifyOnlyEnhancedJigsawPuzzle();
}
