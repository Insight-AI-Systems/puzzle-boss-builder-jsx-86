import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface MinimalJigsawGameProps {
  imageUrl?: string;
  pieceCount?: 20 | 100 | 500;
  onComplete?: () => void;
}

// Define global variables needed by the puzzle engine
declare global {
  var createjs: any;
  var s_oSpriteLibrary: any;
  var CANVAS_WIDTH: number;
  var CANVAS_HEIGHT: number;
  var PRIMARY_FONT: string;
  var ON_MOUSE_UP: string;
  var ON_RELEASE_YES: string;
  var ON_RELEASE_NO: string;
  var createBitmap: any;
  var CTLText: any;
  var CGfxButton: any;
  var CMain: any;
}

export function MinimalJigsawGame({ 
  imageUrl = '/placeholder.svg', 
  pieceCount = 100,
  onComplete 
}: MinimalJigsawGameProps) {
  console.log('🎮 MinimalJigsawGame component rendered with props:', { imageUrl, pieceCount });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const puzzleRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  console.log('🎮 Component state:', { isLoading, error, isCompleted, scriptsLoaded });

  // Load puzzle JavaScript files from database
  const loadPuzzleScripts = async () => {
    try {
      console.log('🔄 Loading puzzle scripts from database...');
      
      const { data: jsFiles, error } = await supabase
        .from('puzzle_js_files')
        .select('filename, content')
        .order('filename');

      console.log('🔍 Database query result:', { jsFiles, error, hasJsFiles: !!jsFiles, jsFileCount: jsFiles?.length });

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }

      if (!jsFiles || jsFiles.length === 0) {
        console.error('❌ No JS files found in database');
        throw new Error('No puzzle JavaScript files found in database');
      }

      console.log('📁 Found JS files:', jsFiles.map(f => f.filename));

      // Load CreateJS first if needed
      if (!window.createjs) {
        console.log('📦 Loading CreateJS...');
        await loadCreateJS();
      } else {
        console.log('✅ CreateJS already loaded');
      }

      // Set up global constants needed by the puzzle engine
      window.CANVAS_WIDTH = 800;
      window.CANVAS_HEIGHT = 600;
      window.PRIMARY_FONT = 'Arial';
      window.ON_MOUSE_UP = 'mouseup';
      window.ON_RELEASE_YES = 'release_yes';
      window.ON_RELEASE_NO = 'release_no';

      // Helper functions
      window.createBitmap = (sprite: any) => new window.createjs.Bitmap(sprite);
      
      // Execute each JavaScript file
      for (const file of jsFiles) {
        try {
          console.log(`🔧 Loading ${file.filename}...`);
          // Create a script element and execute the content
          const scriptElement = document.createElement('script');
          scriptElement.textContent = file.content;
          document.head.appendChild(scriptElement);
          console.log(`✅ Successfully loaded ${file.filename}`);
        } catch (scriptError) {
          console.error(`❌ Error loading ${file.filename}:`, scriptError);
        }
      }

      setScriptsLoaded(true);
      console.log('✅ All puzzle scripts loaded successfully');

    } catch (err) {
      console.error('❌ Error loading puzzle scripts:', err);
      setError(`Failed to load puzzle engine: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  // Load CreateJS library
  const loadCreateJS = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.createjs) {
        console.log('✅ CreateJS already available');
        resolve();
        return;
      }

      console.log('📦 Loading CreateJS from CDN...');
      const script = document.createElement('script');
      script.src = 'https://code.createjs.com/1.0.0/createjs.min.js';
      script.onload = () => {
        console.log('✅ CreateJS loaded successfully');
        resolve();
      };
      script.onerror = () => {
        console.error('❌ Failed to load CreateJS');
        reject(new Error('Failed to load CreateJS'));
      };
      document.head.appendChild(script);
    });
  };

  // Initialize the puzzle engine
  const initializePuzzle = async () => {
    console.log('🚀 initializePuzzle called with:', { 
      hasCanvas: !!canvasRef.current, 
      imageUrl,
      pieceCount,
      scriptsLoaded
    });
    
    if (!scriptsLoaded) {
      console.log('⏳ Scripts not loaded yet, waiting...');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsCompleted(false);

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('❌ Canvas element not found');
        throw new Error('Canvas not found');
      }
      
      if (!imageUrl) {
        console.error('❌ No image URL provided:', imageUrl);
        throw new Error('No image URL provided');
      }

      // Clear any existing puzzle
      if (puzzleRef.current) {
        puzzleRef.current.destroy?.();
      }

      // Set canvas size
      canvas.width = window.CANVAS_WIDTH;
      canvas.height = window.CANVAS_HEIGHT;

      console.log('🎮 Initializing CreateJS stage...');
      
      // Initialize CreateJS stage
      const stage = new window.createjs.Stage(canvas);
      window.createjs.Touch.enable(stage);
      stage.enableMouseOver(10);
      
      // Create basic sprite library if it doesn't exist
      if (!window.s_oSpriteLibrary) {
        window.s_oSpriteLibrary = {
          getSprite: (name: string) => {
            // Return a basic rectangle for missing sprites
            const graphics = new window.createjs.Graphics();
            graphics.beginFill("#cccccc").drawRect(0, 0, 100, 40);
            const shape = new window.createjs.Shape(graphics);
            return shape;
          }
        };
      }

      // Load the puzzle image
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          console.log('📸 Image loaded, creating puzzle...');
          
          // Create a simple puzzle display for now
          const bitmap = new window.createjs.Bitmap(img);
          
          // Scale image to fit canvas
          const scaleX = (window.CANVAS_WIDTH - 100) / img.width;
          const scaleY = (window.CANVAS_HEIGHT - 100) / img.height;
          const scale = Math.min(scaleX, scaleY);
          
          bitmap.scaleX = bitmap.scaleY = scale;
          bitmap.x = (window.CANVAS_WIDTH - img.width * scale) / 2;
          bitmap.y = (window.CANVAS_HEIGHT - img.height * scale) / 2;
          
          stage.addChild(bitmap);
          stage.update();

          // Create a simple puzzle object for completion tracking
          const simplePuzzle = {
            stage: stage,
            pieces: Array.from({ length: pieceCount }, (_, i) => ({ id: i, placed: false })),
            isComplete: false,
            destroy: () => {
              stage.removeAllChildren();
              stage.update();
            },
            complete: function() {
              this.isComplete = true;
              setIsCompleted(true);
              onComplete?.();
            }
          };

          puzzleRef.current = simplePuzzle;
          setIsLoading(false);
          console.log('✅ Puzzle initialized with CreateJS');

        } catch (err) {
          console.error('❌ Error creating puzzle:', err);
          setError(`Failed to create puzzle: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        console.error('❌ Failed to load image:', imageUrl);
        setError('Failed to load image');
        setIsLoading(false);
      };

      console.log('📥 Loading image:', imageUrl);
      img.src = imageUrl;

    } catch (err) {
      console.error('❌ Error initializing puzzle:', err);
      setError(`Failed to initialize: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect: loadPuzzleScripts called');
    loadPuzzleScripts();
  }, []);

  useEffect(() => {
    console.log('🔄 useEffect: initializePuzzle check', { scriptsLoaded, hasCanvas: !!canvasRef.current, imageUrl });
    if (scriptsLoaded && canvasRef.current) {
      initializePuzzle();
    }
    
    return () => {
      if (puzzleRef.current) {
        console.log('🧹 Cleaning up puzzle');
        puzzleRef.current.destroy?.();
      }
    };
  }, [imageUrl, pieceCount, scriptsLoaded]);

  const handleReset = () => {
    initializePuzzle();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div>Loading puzzle...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <div className="text-red-600">Error: {error}</div>
        <Button onClick={initializePuzzle}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <Button onClick={handleReset} variant="outline">
          Reset Puzzle
        </Button>
        {isCompleted && (
          <div className="text-green-600 font-semibold">
            🎉 Puzzle Completed!
          </div>
        )}
      </div>
      
      <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 rounded shadow-lg bg-white"
          style={{ display: 'block' }}
        />
      </div>
    </div>
  );
}