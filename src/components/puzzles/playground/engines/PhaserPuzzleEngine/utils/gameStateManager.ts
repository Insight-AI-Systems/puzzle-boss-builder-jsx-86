
import { GameStats } from '../types/puzzleTypes';

/**
 * Generates the game state management script
 * @returns JavaScript code for the game state manager
 */
export function generateGameStateManager(): string {
  return `
    // Game state management
    window.gameState = (function() {
      let startTime = 0;
      let timerInterval;
      let gameStarted = false;
      let gameCompleted = false;
      let moves = 0;
      
      function updateTimer() {
        if (!gameStarted) return;
        
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        const timerEl = document.getElementById('timer');
        if (timerEl) {
          timerEl.textContent = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
        }
      }
      
      function updateMoveCount() {
        window.parent.postMessage({ 
          type: 'PHASER_PUZZLE_MOVE',
          stats: { moves }
        }, '*');
      }
      
      return {
        startGame: function() {
          if (gameStarted) return;
          
          gameStarted = true;
          startTime = Date.now();
          
          timerInterval = setInterval(updateTimer, 1000);
          updateTimer();
          
          window.parent.postMessage({ type: 'PHASER_PUZZLE_START' }, '*');
        },
        
        resetGame: function() {
          gameStarted = false;
          gameCompleted = false;
          moves = 0;
          updateMoveCount();
          clearInterval(timerInterval);
          
          const timerEl = document.getElementById('timer');
          if (timerEl) {
            timerEl.textContent = '00:00';
          }
          
          window.parent.postMessage({ type: 'PHASER_PUZZLE_RESET' }, '*');
          
          return {
            shufflePieces: true
          };
        },
        
        completeGame: function() {
          if (gameCompleted) return;
          
          gameCompleted = true;
          clearInterval(timerInterval);
          
          const completionTime = Math.floor((Date.now() - startTime) / 1000);
          
          window.parent.postMessage({ 
            type: 'PHASER_PUZZLE_COMPLETE',
            stats: {
              time: completionTime,
              moves: moves
            }
          }, '*');
          
          this.showCompletionMessage(completionTime);
        },
        
        incrementMoves: function() {
          moves++;
          updateMoveCount();
        },
        
        showCompletionMessage: function(completionTime) {
          const gameContainer = document.getElementById('game-container');
          const completionMsg = document.createElement('div');
          completionMsg.style.position = 'absolute';
          completionMsg.style.top = '50%';
          completionMsg.style.left = '50%';
          completionMsg.style.transform = 'translate(-50%, -50%)';
          completionMsg.style.background = 'rgba(15, 23, 42, 0.9)';
          completionMsg.style.color = '#fbbf24';
          completionMsg.style.padding = '24px';
          completionMsg.style.borderRadius = '8px';
          completionMsg.style.textAlign = 'center';
          completionMsg.style.zIndex = '1000';
          
          completionMsg.innerHTML = \`
            <h2 style="margin-top:0">Puzzle Complete!</h2>
            <p>Time: \${Math.floor(completionTime / 60)}:\${(completionTime % 60).toString().padStart(2, '0')}</p>
            <p>Moves: \${moves}</p>
            <button class="btn primary">Play Again</button>
          \`;
          
          gameContainer.appendChild(completionMsg);
          
          completionMsg.querySelector('button').addEventListener('click', function() {
            completionMsg.remove();
            window.gameState.resetGame();
          });
        },
        
        getStats: function(): GameStats {
          return {
            moves,
            time: gameStarted ? Math.floor((Date.now() - startTime) / 1000) : 0,
            completionPercentage: 0 // You could calculate this based on correct pieces
          };
        }
      };
    })();
  `;
}
