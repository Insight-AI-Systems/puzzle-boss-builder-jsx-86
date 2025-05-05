
import * as Phaser from 'phaser';
import { PuzzleConfig } from '../types/puzzleTypes';
import { generateHtmlTemplate } from './htmlTemplateGenerator';
import { generateGameScript } from './gameScriptGenerator';

/**
 * Creates the complete HTML content for the Phaser puzzle game
 * @param puzzleConfig The configuration for the puzzle
 * @returns HTML string with the complete game content
 */
export function createPhaserGameContent(puzzleConfig: PuzzleConfig): string {
  // Generate the HTML template
  const htmlTemplate = generateHtmlTemplate(puzzleConfig);
  
  // Insert the game script before the closing body tag
  const gameScript = generateGameScript(puzzleConfig);
  
  // Combine HTML and script
  return htmlTemplate.replace('</body>', `${gameScript}\n  </body>`);
}
