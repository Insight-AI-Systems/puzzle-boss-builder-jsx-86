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

  const generateTestHTML = () => {
    const jsFiles = uploadedFiles.filter(f => f.name.endsWith('.js'));
    const cssFiles = uploadedFiles.filter(f => f.name.endsWith('.css'));
    
    const cssContent = cssFiles.map(f => 
      `<style>\n${f.content}\n</style>`
    ).join('\n    ');
    
    const jsContent = jsFiles.map(f => 
      `<script>\n${f.content}\n</script>`
    ).join('\n    ');
    
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
        .controls { margin: 10px 0; }
        button { margin: 5px; padding: 10px 15px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Headbreaker Puzzle Test</h1>
    <div class="controls">
        <button onclick="createPuzzle()">Create Puzzle</button>
        <button onclick="shufflePuzzle()">Shuffle</button>
        <button onclick="solvePuzzle()">Solve</button>
    </div>
    <div id="puzzle-container"></div>
    
    ${jsContent}
    
    <script>
        let puzzle;
        let canvas;
        
        function createPuzzle() {
            const container = document.getElementById('puzzle-container');
            container.innerHTML = '';
            
            try {
                if (typeof headbreaker !== 'undefined') {
                    canvas = new headbreaker.Canvas(container, {
                        width: 800,
                        height: 600,
                        imageUrl: 'https://picsum.photos/800/600',
                        pieceSize: 100,
                        proximity: 20,
                        borderFill: 10,
                        strokeWidth: 2,
                        lineSoftness: 0.18
                    });

                    puzzle = new headbreaker.Puzzle(canvas, {
                        horizontalPiecesCount: 4,
                        verticalPiecesCount: 3
                    });

                    puzzle.autogenerate();
                    puzzle.shuffle(0.8);
                    puzzle.draw();
                    
                    console.log('Puzzle created successfully!');
                } else {
                    console.error('Headbreaker library not found');
                    container.innerHTML = '<p>Error: Headbreaker library not loaded</p>';
                }
            } catch (error) {
                console.error('Error creating puzzle:', error);
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
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <File className="h-4 w-4" />
                    <span className="flex-1">{file.name}</span>
                    {file.saved && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                ))}
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