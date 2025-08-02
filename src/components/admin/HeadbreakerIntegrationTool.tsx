import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedFile {
  name: string;
  content: string;
  saved: boolean;
}

export function HeadbreakerIntegrationTool() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const content = reader.result as string;
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          content,
          saved: false
        }]);
        
        console.log('📁 File ready for integration:', file.name);
      };
      
      reader.readAsText(file);
    });
  }, []);

  const saveFilesToProject = async () => {
    setIsProcessing(true);
    
    try {
      // Mark files as ready (no actual saving needed for blob approach)
      setUploadedFiles(prev => 
        prev.map(f => ({ ...f, saved: true }))
      );

      toast.success('Files ready for testing!');
      
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Error processing files. Please try again.');
    }
    
    setIsProcessing(false);
  };

  const validateJavaScriptFile = (content: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check for basic JavaScript syntax indicators
    if (!content.trim()) {
      errors.push("File is empty");
      return { isValid: false, errors };
    }
    
    // Check for headbreaker-specific patterns
    const hasHeadbreaker = content.includes('headbreaker') || content.includes('Headbreaker');
    if (!hasHeadbreaker) {
      errors.push("File doesn't appear to contain headbreaker library code");
    }
    
    // Check for obvious syntax errors
    const hasUnclosedBraces = (content.match(/\{/g) || []).length !== (content.match(/\}/g) || []).length;
    if (hasUnclosedBraces) {
      errors.push("Mismatched braces detected");
    }
    
    const hasUnclosedParens = (content.match(/\(/g) || []).length !== (content.match(/\)/g) || []).length;
    if (hasUnclosedParens) {
      errors.push("Mismatched parentheses detected");
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const generateTestHTML = () => {
    const jsFiles = uploadedFiles.filter(f => f.name.endsWith('.js'));
    const cssFiles = uploadedFiles.filter(f => f.name.endsWith('.css'));
    
    const cssContent = cssFiles.map(f => 
      `<style>\n${f.content}\n</style>`
    ).join('\n    ');
    
    // Enhanced JavaScript validation and error handling
    let jsContent = '';
    const jsValidationResults: string[] = [];
    
    jsFiles.forEach(f => {
      const validation = validateJavaScriptFile(f.content);
      jsValidationResults.push(`File ${f.name}: ${validation.isValid ? '✅ Valid' : '❌ ' + validation.errors.join(', ')}`);
      
      if (validation.isValid) {
        jsContent += `
    <script>
    try {
      console.log('Loading ${f.name}...');
      ${f.content}
      console.log('✅ ${f.name} loaded successfully');
    } catch (error) {
      console.error('❌ Error loading ${f.name}:', error);
      document.getElementById('diagnostics').innerHTML += '<div style="color: red;">❌ Error in ${f.name}: ' + error.message + '</div>';
    }
    </script>`;
      } else {
        jsContent += `
    <script>
    document.getElementById('diagnostics').innerHTML += '<div style="color: red;">❌ ${f.name} validation failed: ${validation.errors.join(', ')}</div>';
    </script>`;
      }
    });
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Headbreaker Test</title>
    ${cssContent}
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        #puzzle-container { width: 800px; height: 600px; border: 1px solid #ccc; margin: 20px 0; }
        .controls { margin: 10px 0; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        button { margin: 5px; padding: 10px 15px; cursor: pointer; }
        .image-upload { margin: 10px 0; }
        .image-upload input { margin-right: 10px; }
        .current-image { max-width: 200px; max-height: 150px; border: 1px solid #ddd; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>Headbreaker Puzzle Test</h1>
    
    <div class="image-upload">
        <label for="imageUpload">Select puzzle image:</label>
        <input type="file" id="imageUpload" accept="image/*">
        <button onclick="loadSelectedImage()">Load Image</button>
    </div>
    
    <div id="current-image-preview"></div>
    
    <div class="controls">
        <button onclick="testBasicJS()">🧪 Test Basic JS</button>
        <button onclick="diagnosticCheck()">🔍 Check Library Status</button>
        <button onclick="createPuzzle()">Create Puzzle</button>
        <button onclick="shufflePuzzle()">Shuffle</button>
        <button onclick="solvePuzzle()">Solve</button>
        <label>
            Pieces: 
            <select id="pieceCount" onchange="createPuzzle()">
                <option value="2x2">4 pieces (2x2)</option>
                <option value="3x3">9 pieces (3x3)</option>
                <option value="4x3" selected>12 pieces (4x3)</option>
                <option value="4x4">16 pieces (4x4)</option>
                <option value="5x4">20 pieces (5x4)</option>
            </select>
        </label>
    </div>
    <div id="puzzle-container"></div>
    <div id="diagnostics" style="background: #f5f5f5; padding: 10px; margin: 10px 0; font-family: monospace; font-size: 12px;"></div>
    
    ${jsContent}
    
    <script>
        let puzzle;
        let canvas;
        let currentImageUrl = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop';
        
        function log(message) {
            const diagnostics = document.getElementById('diagnostics');
            diagnostics.innerHTML += '<div>' + new Date().toLocaleTimeString() + ': ' + message + '</div>';
            console.log(message);
        }
        
        function testBasicJS() {
            const diagnostics = document.getElementById('diagnostics');
            diagnostics.innerHTML = '<h4>🧪 Basic JavaScript Test:</h4>';
            
            try {
                log('✅ Basic JavaScript is working');
                log('✅ DOM access is working');
                log('✅ Console logging is working');
                log('✅ Try-catch blocks are working');
                log('Current time: ' + new Date().toLocaleString());
                log('Math.random(): ' + Math.random());
                log('Available functions: testBasicJS, diagnosticCheck, createPuzzle');
                
                // Test DOM manipulation
                const testDiv = document.createElement('div');
                testDiv.textContent = 'Test element created successfully';
                log('✅ DOM createElement is working');
                
            } catch (error) {
                log('❌ Basic JavaScript test failed: ' + error.message);
                console.error('Basic JS test error:', error);
            }
        }
        
        function diagnosticCheck() {
            const diagnostics = document.getElementById('diagnostics');
            diagnostics.innerHTML = '<h4>🔍 Library Diagnostic Check:</h4>';
            
            log('Checking global window object...');
            log('Available global variables: ' + Object.keys(window).filter(k => k.toLowerCase().includes('head')).join(', '));
            
            log('Checking for headbreaker...');
            log('typeof headbreaker: ' + typeof headbreaker);
            
            if (typeof headbreaker !== 'undefined') {
                log('✅ headbreaker is available!');
                log('headbreaker keys: ' + Object.keys(headbreaker).join(', '));
                
                if (headbreaker.Canvas) log('✅ headbreaker.Canvas found');
                if (headbreaker.Puzzle) log('✅ headbreaker.Puzzle found');
                if (headbreaker.canvas) log('✅ headbreaker.canvas function found');
                
            } else {
                log('❌ headbreaker is NOT available');
                log('Checking window.headbreaker: ' + typeof window.headbreaker);
                log('Checking window.Headbreaker: ' + typeof window.Headbreaker);
                log('Checking window.HEADBREAKER: ' + typeof window.HEADBREAKER);
            }
            
            log('All available global variables: ');
            Object.keys(window).forEach(key => {
                if (key.length > 3 && !key.startsWith('webkit') && !key.startsWith('chrome')) {
                    log('  - ' + key + ': ' + typeof window[key]);
                }
            });
        }
        
        function loadSelectedImage() {
            const fileInput = document.getElementById('imageUpload');
            const file = fileInput.files[0];
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    currentImageUrl = e.target.result;
                    
                    // Show preview
                    const preview = document.getElementById('current-image-preview');
                    preview.innerHTML = '<h4>Current image:</h4><img src="' + currentImageUrl + '" class="current-image">';
                    
                    // Auto-create puzzle with new image
                    createPuzzle();
                };
                reader.readAsDataURL(file);
            }
        }
        
        function createPuzzle() {
            console.log('=== Create Puzzle Function Called ===');
            const container = document.getElementById('puzzle-container');
            console.log('Container element:', container);
            container.innerHTML = '';
            
            const pieceSelect = document.getElementById('pieceCount');
            const pieceConfig = pieceSelect.value.split('x');
            const horizontalPieces = parseInt(pieceConfig[0]);
            const verticalPieces = parseInt(pieceConfig[1]);
            
            console.log('Piece configuration:', { horizontalPieces, verticalPieces, currentImageUrl });
            console.log('Headbreaker available:', typeof headbreaker);
            console.log('Headbreaker object:', headbreaker);
            
            try {
                if (typeof headbreaker !== 'undefined') {
                    console.log('Creating headbreaker canvas...');
                    
                    // Try different headbreaker API patterns
                    let canvas, puzzle;
                    
                    // Pattern 1: headbreaker.Canvas constructor
                    if (headbreaker.Canvas) {
                        console.log('Using headbreaker.Canvas constructor');
                        canvas = new headbreaker.Canvas(container, {
                            width: 800,
                            height: 600,
                            imageUrl: currentImageUrl,
                            pieceSize: 100,
                            proximity: 20,
                            borderFill: 10,
                            strokeWidth: 2,
                            lineSoftness: 0.18
                        });
                    }
                    // Pattern 2: headbreaker.canvas function
                    else if (headbreaker.canvas) {
                        console.log('Using headbreaker.canvas function');
                        canvas = headbreaker.canvas(container, 800, 600);
                    }
                    // Pattern 3: direct function call
                    else if (typeof headbreaker === 'function') {
                        console.log('Using headbreaker as direct function');
                        canvas = headbreaker(container, 800, 600);
                    }
                    
                    console.log('Canvas created:', canvas);

                    if (canvas) {
                        // Try different puzzle creation patterns
                        if (headbreaker.Puzzle) {
                            console.log('Creating puzzle with headbreaker.Puzzle constructor');
                            puzzle = new headbreaker.Puzzle(canvas, {
                                horizontalPiecesCount: horizontalPieces,
                                verticalPiecesCount: verticalPieces
                            });
                        } else if (canvas.puzzle) {
                            console.log('Creating puzzle with canvas.puzzle method');
                            puzzle = canvas.puzzle({
                                horizontalPiecesCount: horizontalPieces,
                                verticalPiecesCount: verticalPieces,
                                image: currentImageUrl
                            });
                        }

                        console.log('Puzzle created:', puzzle);

                        if (puzzle) {
                            console.log('Calling puzzle methods...');
                            if (puzzle.autogenerate) puzzle.autogenerate();
                            if (puzzle.shuffle) puzzle.shuffle(0.8);
                            if (puzzle.draw) puzzle.draw();
                            
                            console.log('Puzzle created successfully with ' + (horizontalPieces * verticalPieces) + ' pieces!');
                        } else {
                            console.error('Failed to create puzzle object');
                            container.innerHTML = '<p>Error: Failed to create puzzle object</p>';
                        }
                    } else {
                        console.error('Failed to create canvas object');
                        container.innerHTML = '<p>Error: Failed to create canvas object</p>';
                    }
                } else {
                    console.error('Headbreaker library not found');
                    container.innerHTML = '<p>Error: Headbreaker library not loaded</p>';
                }
            } catch (error) {
                console.error('Error creating puzzle:', error);
                console.error('Error details:', error.message, error.stack);
                container.innerHTML = '<p>Error: ' + error.message + '</p>';
            }
        }
        
        function shufflePuzzle() {
            if (puzzle) {
                puzzle.shuffle(0.8);
                puzzle.draw();
            }
        }
        
        function solvePuzzle() {
            if (puzzle) {
                puzzle.solve();
                puzzle.draw();
            }
        }
        
        // Auto-create puzzle on page load
        window.onload = createPuzzle;
    </script>
</body>
</html>`;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/javascript': ['.js'],
      'text/css': ['.css'],
      'text/html': ['.html']
    }
  });

  return (
    <div className="w-full h-screen p-8 bg-background">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Headbreaker Library Integration Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <File className="h-12 w-12 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg">Drop the headbreaker files here...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">Drag & drop headbreaker library files</p>
                  <p className="text-sm text-muted-foreground">
                    Upload .js, .css, and .html files from the headbreaker library
                  </p>
                </div>
              )}
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Uploaded Files:</h3>
              <div className="grid gap-2">
                {uploadedFiles.map((file, index) => {
                  const validation = file.name.endsWith('.js') ? validateJavaScriptFile(file.content) : { isValid: true, errors: [] };
                  return (
                    <div key={index} className="border rounded">
                      <div className="flex items-center gap-2 p-2">
                        <File className="h-4 w-4" />
                        <span className="flex-1">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {file.content.length} chars
                        </span>
                        {file.saved && <Check className="h-4 w-4 text-green-600" />}
                        {!validation.isValid && <span className="text-xs text-red-500">❌ Issues</span>}
                      </div>
                      {!validation.isValid && (
                        <div className="px-2 pb-2 text-xs text-red-600">
                          Issues: {validation.errors.join(', ')}
                        </div>
                      )}
                      <details className="px-2 pb-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer">Preview content</summary>
                        <pre className="text-xs bg-muted p-2 mt-1 rounded max-h-32 overflow-y-auto">
                          {file.content.substring(0, 500)}
                          {file.content.length > 500 && '...\n[truncated]'}
                        </pre>
                      </details>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={saveFilesToProject}
                  disabled={isProcessing}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? 'Processing...' : 'Save to Project'}
                </Button>
                
                {uploadedFiles.some(f => f.saved) && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const htmlContent = generateTestHTML();
                      const blob = new Blob([htmlContent], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      window.open(url, '_blank');
                    }}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Test Page
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Instructions:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Upload all headbreaker library files (.js, .css)</li>
              <li>Click "Save to Project" to integrate them</li>
              <li>Click "Open Test Page" to test the puzzle</li>
              <li>Check browser console for any errors</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}