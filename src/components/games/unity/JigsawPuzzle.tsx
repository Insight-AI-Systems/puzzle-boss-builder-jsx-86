
import React, { useEffect, useRef, useState } from 'react';

// Extend Window interface for Unity callbacks
declare global {
  interface Window {
    unityInstance?: any;
    createUnityInstance?: (canvas: HTMLCanvasElement, config: any) => Promise<any>;
    onPuzzleComplete?: (score: number, timeSeconds: number) => void;
    onPuzzleProgress?: (percentage: number) => void;
    onHintUsed?: (hintCost: number) => void;
  }
}

interface JigsawPuzzleProps {
  puzzleId?: string;
  puzzlePrice?: number;
  isPaid?: boolean;
  onComplete?: (data: any) => void;
  onPaymentRequired?: (data: any) => void;
}

const JigsawPuzzle: React.FC<JigsawPuzzleProps> = ({ 
  puzzleId = 'default-puzzle',
  puzzlePrice = 2.99,
  isPaid = false, 
  onComplete, 
  onPaymentRequired 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameLoaded, setGameLoaded] = useState(false);
  
  // Your Netlify-hosted Unity game
  const UNITY_BASE = 'https://glittering-chimera-b6db41.netlify.app';

  useEffect(() => {
    console.log('🎮 JigsawPuzzle component mounted', { puzzleId, isPaid });
    
    if (isPaid) {
      loadUnityGame();
    } else {
      setIsLoading(false);
    }
  }, [isPaid, puzzleId]);

  const loadUnityGame = async () => {
    try {
      console.log('🔄 Loading Unity game...');
      setIsLoading(true);
      setError(null);
      
      // Clean up any existing Unity instances
      if (window.unityInstance) {
        try {
          window.unityInstance.Quit();
        } catch (e) {
          console.log('Previous Unity instance cleanup:', e);
        }
      }
      
      // Load Unity loader script
      const script = document.createElement('script');
      script.src = `${UNITY_BASE}/Build/build.loader.js`;
      script.id = 'unity-loader-script';
      
      script.onload = () => {
        console.log('📦 Unity loader script loaded');
        
        if (canvasRef.current && window.createUnityInstance) {
          window.createUnityInstance(canvasRef.current, {
            dataUrl: `${UNITY_BASE}/Build/build.data`,
            frameworkUrl: `${UNITY_BASE}/Build/build.framework.js`,
            codeUrl: `${UNITY_BASE}/Build/build.wasm`,
          }).then(unityInstance => {
            console.log('🎮 Unity jigsaw puzzle loaded successfully!');
            
            window.unityInstance = unityInstance;
            setGameLoaded(true);
            setIsLoading(false);
            
            setupUnityCallbacks();
            
          }).catch(err => {
            console.error('❌ Unity instance creation error:', err);
            setError('Failed to load puzzle game. Please try refreshing the page.');
            setIsLoading(false);
          });
        } else {
          setError('Game initialization failed. Canvas not ready.');
          setIsLoading(false);
        }
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Unity script');
        setError('Failed to load game files. Please check your internet connection.');
        setIsLoading(false);
      };
      
      // Remove existing script if any
      const existingScript = document.getElementById('unity-loader-script');
      if (existingScript) {
        existingScript.remove();
      }
      
      document.head.appendChild(script);
      
    } catch (err) {
      console.error('❌ Unity setup error:', err);
      setError('Failed to initialize puzzle game.');
      setIsLoading(false);
    }
  };

  const setupUnityCallbacks = () => {
    // Set up communication between Unity and your web app
    window.onPuzzleComplete = (score: number, timeSeconds: number) => {
      console.log('🎉 Puzzle completed!', { score, timeSeconds });
      
      const completionData = {
        puzzleId,
        score: score || 100,
        completionTime: timeSeconds || 0,
        timestamp: new Date().toISOString(),
        userId: 'current-user' // Replace with actual user ID
      };
      
      onComplete && onComplete(completionData);
    };

    window.onPuzzleProgress = (percentage: number) => {
      console.log('📊 Puzzle progress:', percentage + '%');
    };

    window.onHintUsed = (hintCost: number) => {
      console.log('💡 Hint used, cost:', hintCost);
    };
  };

  const handlePaymentClick = () => {
    console.log('💳 Payment requested for puzzle:', puzzleId);
    onPaymentRequired && onPaymentRequired({
      puzzleId,
      price: puzzlePrice,
      puzzleName: `Jigsaw Puzzle #${puzzleId}`
    });
  };

  const handleRestartPuzzle = () => {
    if (window.unityInstance) {
      // Restart the current puzzle
      try {
        // Unity restart functionality would go here
        window.location.reload(); // Simple restart for now
      } catch (e) {
        console.log('Restart error:', e);
        window.location.reload();
      }
    }
  };

  // Payment required state
  if (!isPaid) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-puzzle-black rounded-lg">
        <div className="max-w-md mx-auto p-8 bg-gray-900 rounded-lg border border-puzzle-border text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-xl font-bold text-puzzle-white mb-2">Premium Jigsaw Puzzle</h3>
            <p className="text-gray-400">
              Challenge yourself with this beautiful jigsaw puzzle! 
              Drag and drop pieces to complete the image.
            </p>
          </div>
          
          <div className="mb-6">
            <div className="text-3xl font-bold text-puzzle-aqua">${puzzlePrice}</div>
            <p className="text-sm text-gray-400">One-time purchase</p>
          </div>
          
          <button 
            className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold py-3 px-6 rounded-lg mb-4 transition-colors"
            onClick={handlePaymentClick}
          >
            🔓 Unlock Puzzle - ${puzzlePrice}
          </button>
          
          <div className="space-y-2 text-sm text-gray-400">
            <p>✅ Unlimited plays</p>
            <p>✅ Progress saving</p>
            <p>✅ Completion certificates</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-puzzle-black rounded-lg">
        <div className="max-w-md mx-auto p-8 bg-gray-900 rounded-lg border border-puzzle-border text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-puzzle-white mb-2">Puzzle Loading Error</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold py-3 px-6 rounded-lg transition-colors"
            onClick={() => {
              setError(null);
              loadUnityGame();
            }}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main puzzle interface
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-puzzle-white flex items-center gap-2">
            🧩 Jigsaw Puzzle Game
          </h2>
          <p className="text-gray-400">Drag pieces to complete the puzzle!</p>
        </div>
        
        {gameLoaded && (
          <button 
            className="bg-puzzle-gold hover:bg-puzzle-gold/80 text-puzzle-black font-semibold py-2 px-4 rounded-lg transition-colors"
            onClick={handleRestartPuzzle}
            title="Restart puzzle"
          >
            🔄 Restart
          </button>
        )}
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[600px] bg-gray-900 rounded-lg border border-puzzle-border">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-puzzle-aqua border-t-transparent mb-4"></div>
          <h3 className="text-xl font-bold text-puzzle-white mb-2">Loading Your Puzzle...</h3>
          <p className="text-gray-400 mb-6">Please wait while we prepare your jigsaw puzzle experience...</p>
          <div className="w-64 bg-gray-800 rounded-full h-2">
            <div className="bg-puzzle-aqua h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
      
      {/* Game area */}
      <div className="flex justify-center">
        <canvas 
          ref={canvasRef} 
          id="unity-canvas"
          className={`w-full max-w-4xl border-2 border-puzzle-border rounded-lg bg-black shadow-lg ${isLoading ? 'hidden' : 'block'}`}
          style={{
            height: '600px',
          }}
        />
      </div>
      
      {gameLoaded && (
        <div className="bg-gray-900 rounded-lg p-4 border border-puzzle-border">
          <p className="text-puzzle-white text-center">
            🎯 <strong>How to play:</strong> Click and drag puzzle pieces to move them. 
            Try to fit pieces together to complete the picture!
          </p>
        </div>
      )}
    </div>
  );
};

export default JigsawPuzzle;
