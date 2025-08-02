import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, Check, ExternalLink, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedFile {
  name: string;
  content: string;
  saved: boolean;
}

export function CodeCanyonJigsawIntegration() {
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
        
        console.log('📁 CodeCanyon game file ready:', file.name);
      };
      
      reader.readAsText(file);
    });
  }, []);

  const saveFilesToProject = async () => {
    setIsProcessing(true);
    
    try {
      // Mark files as ready for testing
      setUploadedFiles(prev => 
        prev.map(f => ({ ...f, saved: true }))
      );

      toast.success('CodeCanyon jigsaw puzzle files ready for testing!');
      
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Error processing files. Please try again.');
    }
    
    setIsProcessing(false);
  };

  const validateJavaScriptFile = (content: string): { isValid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    // Check for CodeCanyon jigsaw game files
    const gameIndicators = [
      'cgame', 'cpiece', 'ctoggle', 'cmain', 'createjs', 'easeljs',
      'jigsaw', 'puzzle', 'canvas', 'stage', 'cinterface', 'howl'
    ];
    
    const hasGameCode = gameIndicators.some(indicator => 
      content.toLowerCase().includes(indicator.toLowerCase())
    );
    
    if (!hasGameCode && content.length > 1000) {
      issues.push("File doesn't appear to contain jigsaw game code");
    }
    
    // Basic syntax validation
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    
    if (openBraces !== closeBraces) {
      issues.push("Mismatched braces detected");
    }
    
    if (openParens !== closeParens) {
      issues.push("Mismatched parentheses detected");
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  };

  const generateTestHTML = () => {
    const jsFiles = uploadedFiles.filter(f => f.name.endsWith('.js'));
    const cssFiles = uploadedFiles.filter(f => f.name.endsWith('.css'));
    const htmlFiles = uploadedFiles.filter(f => f.name.endsWith('.html'));
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeCanyon Jigsaw Puzzle Test</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: #f0f0f0;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 20px; 
            border-radius: 8px;
        }
        .test-section { 
            margin: 20px 0; 
            padding: 15px; 
            border: 1px solid #ddd; 
            border-radius: 5px;
        }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        .warning { color: #ffc107; }
        button { 
            background: #007bff; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            margin: 5px; 
            border-radius: 3px; 
            cursor: pointer;
        }
        button:hover { background: #0056b3; }
        #game-container { 
            border: 2px solid #007bff; 
            min-height: 400px; 
            margin: 20px 0; 
            position: relative;
            background: #222;
        }
        .log { 
            background: #f8f9fa; 
            border: 1px solid #dee2e6; 
            padding: 10px; 
            margin: 10px 0; 
            border-radius: 3px; 
            font-family: monospace; 
            white-space: pre-wrap;
            max-height: 200px;
            overflow-y: auto;
        }
        .file-info {
            background: #e9ecef;
            padding: 10px;
            margin: 5px 0;
            border-radius: 3px;
        }
        canvas {
            display: block;
            margin: 0 auto;
        }
    </style>
    ${cssFiles.map(file => `<style>${file.content}</style>`).join('\n    ')}
</head>
<body>
    <div class="container">
        <h1>🧩 CodeCanyon Jigsaw Puzzle Test</h1>
        
        <div class="test-section">
            <h2>📁 Loaded Files</h2>
            ${uploadedFiles.map(file => `
            <div class="file-info">
                <strong>${file.name}</strong> (${file.content.length} chars)
            </div>`).join('')}
        </div>

        <div class="test-section">
            <h2>🧪 Game Tests</h2>
            <button onclick="testBasicJS()">🧪 Test Basic JS</button>
            <button onclick="checkGameLibraries()">🔍 Check Game Libraries</button>
            <button onclick="initializeGame()">🎮 Initialize Game</button>
            <button onclick="testCreateJS()">🎨 Test CreateJS</button>
            <button onclick="clearLogs()">🧹 Clear Logs</button>
            <div id="test-results" class="log"></div>
        </div>

        <div class="test-section">
            <h2>🎮 Game Container</h2>
            <div id="game-container">
                <canvas id="canvas" width="800" height="600"></canvas>
            </div>
        </div>
    </div>

    <!-- Include uploaded JavaScript files in proper order -->
    ${jsFiles.map(file => `
    <!-- ${file.name} -->
    <script>
    try {
      console.log('Loading ${file.name}...');
      ${file.content}
      console.log('✅ ${file.name} loaded successfully');
    } catch (error) {
      console.error('❌ Error loading ${file.name}:', error);
      document.getElementById('test-results').innerHTML += '[ERROR] ${file.name}: ' + error.message + '\\n';
    }
    </script>`).join('\n    ')}

    <script>
        function log(message, type = 'info') {
            const results = document.getElementById('test-results');
            const timestamp = new Date().toLocaleTimeString();
            const className = type === 'error' ? 'error' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : '';
            results.innerHTML += \`[\${timestamp}] <span class="\${className}">\${message}</span>\n\`;
            results.scrollTop = results.scrollHeight;
            console.log(\`[JigsawTest] \${message}\`);
        }

        function clearLogs() {
            document.getElementById('test-results').innerHTML = '';
        }

        function testBasicJS() {
            log('Testing basic JavaScript functionality...', 'info');
            try {
                const testVar = 'Hello World';
                const testArray = [1, 2, 3];
                const testObj = { name: 'test', value: 42 };
                log('✅ Basic JavaScript works: ' + testVar, 'success');
                log('✅ Arrays work: ' + JSON.stringify(testArray), 'success');
                log('✅ Objects work: ' + JSON.stringify(testObj), 'success');
                return true;
            } catch (error) {
                log('❌ Basic JavaScript failed: ' + error.message, 'error');
                return false;
            }
        }

        function checkGameLibraries() {
            log('Checking game libraries...', 'info');
            
            // Check for CreateJS/EaselJS
            if (typeof createjs !== 'undefined') {
                log('✅ CreateJS found', 'success');
                if (createjs.Stage) log('✅ CreateJS Stage available', 'success');
                if (createjs.Bitmap) log('✅ CreateJS Bitmap available', 'success');
                if (createjs.Shape) log('✅ CreateJS Shape available', 'success');
            } else {
                log('❌ CreateJS not found', 'error');
            }

            // Check for EaselJS specifically
            if (typeof easeljs !== 'undefined') {
                log('✅ EaselJS found', 'success');
            }

            // Check for game classes
            const gameClasses = ['CGame', 'CPiece', 'CMain', 'CInterface', 'CToggle'];
            gameClasses.forEach(className => {
                if (typeof window[className] !== 'undefined') {
                    log(\`✅ \${className} class found\`, 'success');
                } else {
                    log(\`❌ \${className} class not found\`, 'warning');
                }
            });

            // Check for Howler (audio)
            if (typeof Howl !== 'undefined') {
                log('✅ Howler.js audio library found', 'success');
            } else {
                log('❌ Howler.js not found', 'warning');
            }

            // List all available C* classes
            const cClasses = Object.keys(window).filter(k => k.startsWith('C') && typeof window[k] === 'function');
            if (cClasses.length > 0) {
                log('Available C* classes: ' + cClasses.join(', '), 'info');
            }
        }

        function testCreateJS() {
            log('Testing CreateJS functionality...', 'info');
            
            if (typeof createjs === 'undefined') {
                log('❌ Cannot test - CreateJS not available', 'error');
                return false;
            }

            try {
                const canvas = document.getElementById('canvas');
                const stage = new createjs.Stage(canvas);
                
                // Test basic shape creation
                const circle = new createjs.Shape();
                circle.graphics.beginFill('#ff0000').drawCircle(0, 0, 50);
                circle.x = 100;
                circle.y = 100;
                stage.addChild(circle);
                
                stage.update();
                log('✅ CreateJS test successful - red circle drawn', 'success');
                return true;
            } catch (error) {
                log('❌ CreateJS test failed: ' + error.message, 'error');
                return false;
            }
        }

        function initializeGame() {
            log('Attempting to initialize CodeCanyon jigsaw game...', 'info');
            
            try {
                const container = document.getElementById('game-container');
                const canvas = document.getElementById('canvas');
                
                if (typeof CGame !== 'undefined') {
                    log('✅ CGame class found, attempting initialization...', 'info');
                    
                    // Try to create game instance
                    const game = new CGame();
                    log('✅ Game instance created successfully!', 'success');
                    
                    // Try to initialize if method exists
                    if (typeof game.init === 'function') {
                        game.init();
                        log('✅ Game initialized!', 'success');
                    } else if (typeof game.start === 'function') {
                        game.start();
                        log('✅ Game started!', 'success');
                    }
                    
                } else if (typeof CMain !== 'undefined') {
                    log('✅ CMain class found, attempting initialization...', 'info');
                    const main = new CMain();
                    log('✅ Main game object created!', 'success');
                    
                    if (typeof main.init === 'function') {
                        main.init();
                        log('✅ Main initialized!', 'success');
                    }
                    
                } else {
                    log('❌ No game initialization class found', 'error');
                    const availableClasses = Object.keys(window).filter(k => k.startsWith('C') && typeof window[k] === 'function');
                    log('Available C* classes: ' + availableClasses.join(', '), 'info');
                }
                
            } catch (error) {
                log('❌ Game initialization failed: ' + error.message, 'error');
                console.error('Full error:', error);
            }
        }

        // Auto-run initial tests
        window.addEventListener('load', function() {
            log('🚀 Page loaded, running initial tests...', 'info');
            setTimeout(() => {
                testBasicJS();
                checkGameLibraries();
            }, 500);
        });
    </script>
</body>
</html>`;
  };

  const openTestPage = () => {
    try {
      const htmlContent = generateTestHTML();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const popup = window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
      
      if (!popup) {
        toast.error('Popup blocked! Please allow popups and try again, or download the test file instead.');
        return;
      }
      
      toast.success('Test page opened! Check the new window for game testing.');
      
      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      
    } catch (error) {
      console.error('Error opening test page:', error);
      toast.error('Failed to open test page. Check console for details.');
    }
  };

  const downloadTestPage = () => {
    try {
      const htmlContent = generateTestHTML();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'codecanyon-jigsaw-test.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
      toast.success('Test page downloaded! Open the HTML file in your browser.');
      
    } catch (error) {
      console.error('Error downloading test page:', error);
      toast.error('Failed to download test page.');
    }
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
            CodeCanyon Jigsaw Puzzle Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">CodeCanyon Jigsaw Puzzle Integration</h2>
            <p className="text-muted-foreground mb-6">
              Upload your CodeCanyon jigsaw puzzle game files to test and integrate them
            </p>
          </div>

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
                <p className="text-lg">Drop the CodeCanyon game files here...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">Drag & drop CodeCanyon jigsaw puzzle files</p>
                  <p className="text-sm text-muted-foreground">
                    Upload .js, .css, and .html files from your CodeCanyon game
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
                  const validation = file.name.endsWith('.js') ? validateJavaScriptFile(file.content) : { isValid: true, issues: [] };
                  return (
                    <div key={index} className="border rounded">
                      <div className="flex items-center gap-2 p-2">
                        <File className="h-4 w-4" />
                        <span className="flex-1">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {file.content.length} chars
                        </span>
                        {file.saved && <Check className="h-4 w-4 text-green-600" />}
                      </div>
                      {validation.issues.length > 0 && (
                        <div className="px-4 pb-2">
                          <div className="flex items-center gap-1 text-amber-600 text-sm">
                            <AlertTriangle className="h-3 w-3" />
                            Issues: {validation.issues.join(', ')}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground bg-muted p-2 rounded max-h-20 overflow-hidden">
                            Preview content: {file.content.substring(0, 100)}...
                          </div>
                        </div>
                      )}
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
                  <Check className="h-4 w-4" />
                  {isProcessing ? 'Processing...' : 'Save to Project'}
                </Button>
                
                <Button 
                  onClick={openTestPage}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Test Page
                </Button>
                
                <Button 
                  onClick={downloadTestPage}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Download Test Page
                </Button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>You've already uploaded your CodeCanyon jigsaw puzzle game files</li>
              <li>Click "Save to Project" to mark files as ready for integration</li>
              <li>Click "Open Test Page" to test the game in a new window</li>
              <li>Use the test page to verify the game initializes correctly</li>
              <li>Check for any missing dependencies or initialization issues</li>
              <li>If popup is blocked, use "Download Test Page" instead</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}