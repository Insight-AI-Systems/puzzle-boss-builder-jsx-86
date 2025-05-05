
import { PuzzleConfig } from '../types/puzzleTypes';

/**
 * Generates the HTML/CSS structure for the Phaser puzzle game
 */
export function generateHtmlTemplate(puzzleConfig: PuzzleConfig): string {
  const difficulty = puzzleConfig.rows <= 3 ? 'easy' : puzzleConfig.rows <= 4 ? 'medium' : 'hard';
  const totalPieces = puzzleConfig.rows * puzzleConfig.columns;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PuzzleBoss Phaser Game</title>
        <script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            overflow: hidden;
            font-family: system-ui, sans-serif;
          }
          #game-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          #phaser-game {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            max-width: 100%;
            max-height: 100%;
            margin: 0 auto;
          }
          .controls {
            margin-top: 12px;
            display: flex;
            gap: 8px;
          }
          .btn {
            background: #334155;
            color: #f8fafc;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .btn:hover {
            background: #475569;
          }
          .btn.primary {
            background: #fbbf24;
            color: #0f172a;
          }
          .btn.primary:hover {
            background: #f59e0b;
          }
          .timer {
            position: absolute;
            top: 16px;
            right: 16px;
            background: rgba(15, 23, 42, 0.8);
            color: #fbbf24;
            padding: 8px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 14px;
            z-index: 100;
          }
          .load-message {
            color: #f8fafc;
            text-align: center;
            font-size: 18px;
            margin-bottom: 24px;
          }
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid #fbbf24;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div id="game-container">
          <div class="load-message">Loading puzzle game...</div>
          <div class="spinner" style="margin: 0 auto 16px auto;"></div>
          <div id="phaser-game"></div>
          <div class="controls">
            <button class="btn" id="reset-button">Reset</button>
            <button class="btn" id="shuffle-button">Shuffle</button>
            <button class="btn primary" id="hint-button">Hint</button>
          </div>
          <div class="timer" id="timer">00:00</div>
          <script>
            // Send loaded message to parent as soon as DOM is ready
            document.addEventListener('DOMContentLoaded', function() {
              setTimeout(function() {
                window.parent.postMessage({ type: 'PHASER_PUZZLE_LOADING' }, '*');
              }, 100);
            });
          </script>
        </div>
      </body>
    </html>
  `;
}
