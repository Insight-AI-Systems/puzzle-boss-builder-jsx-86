import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MinimalJigsawGameProps {
  imageUrl?: string;
  pieceCount?: 20 | 100 | 500;
  onComplete?: () => void;
}

// Global variables that the original puzzle engine expects
declare global {
  var createjs: any;
  var CMain: any;
  var CANVAS_WIDTH: number;
  var CANVAS_HEIGHT: number;
}

export function MinimalJigsawGame({ 
  imageUrl, 
  pieceCount,
  onComplete 
}: MinimalJigsawGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all puzzle scripts and let the original engine take over
  const initializePuzzleEngine = async () => {
    try {
      console.log('🔄 Loading original puzzle engine...');
      
      // Fetch JavaScript files from database
      const { data: jsFiles, error } = await supabase
        .from('puzzle_js_files')
        .select('filename, content')
        .order('filename');

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      if (!jsFiles || jsFiles.length === 0) {
        throw new Error('No puzzle JavaScript files found');
      }

      console.log('📁 Loading files:', jsFiles.map(f => f.filename));

      // Load CreateJS first
      if (!window.createjs) {
        console.log('📦 Loading CreateJS...');
        await loadCreateJS();
      }

      // Execute all JavaScript files in order
      for (const file of jsFiles) {
        console.log(`🔧 Loading ${file.filename}...`);
        const script = document.createElement('script');
        script.textContent = file.content;
        document.head.appendChild(script);
      }

      // Give the engine a moment to initialize
      setTimeout(() => {
        console.log('🚀 Starting original puzzle engine...');
        
        // Check if CMain exists and initialize it
        if (window.CMain && typeof window.CMain.init === 'function') {
          console.log('✅ CMain found, initializing...');
          window.CMain.init();
        } else if (window.CMain) {
          console.log('✅ CMain found, calling constructor...');
          new window.CMain();
        } else {
          console.log('⚠️ CMain not found, looking for other initialization methods...');
          console.log('Available globals:', Object.keys(window).filter(k => k.startsWith('C')));
        }
        
        setIsLoading(false);
        console.log('✅ Puzzle engine initialization complete');
      }, 100);

    } catch (err) {
      console.error('❌ Error loading puzzle engine:', err);
      setError(`Failed to load puzzle: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  // Load CreateJS
  const loadCreateJS = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.createjs) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://code.createjs.com/1.0.0/createjs.min.js';
      script.onload = () => {
        console.log('✅ CreateJS loaded');
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load CreateJS'));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    if (canvasRef.current) {
      console.log('🎮 Canvas ready, initializing puzzle engine...');
      
      // Set canvas ID that the original engine expects
      canvasRef.current.id = 'canvas';
      
      initializePuzzleEngine();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div>Loading original puzzle engine...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <div className="text-red-600">Error: {error}</div>
        <button onClick={initializePuzzleEngine} className="px-4 py-2 bg-blue-500 text-white rounded">
          Try Again
        </button>
      </div>
    );
  }

  // Minimal container - let the original engine handle everything
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          id="canvas"
          className="border rounded shadow-lg"
        />
      </div>
    </div>
  );
}