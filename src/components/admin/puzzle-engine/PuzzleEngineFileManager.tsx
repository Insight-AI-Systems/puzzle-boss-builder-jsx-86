import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Upload, Trash2, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

interface PuzzleFile {
  id: string;
  filename: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const PuzzleEngineFileManager: React.FC = () => {
  const [files, setFiles] = useState<PuzzleFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [bulkFiles, setBulkFiles] = useState('');
  const { toast } = useToast();

  // Load existing files
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-puzzle-files', {
        method: 'GET'
      });

      if (error) {
        throw new Error(error.message || 'Failed to load files');
      }

      setFiles(data.files || []);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "Failed to load puzzle engine files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadSingleFile = async () => {
    if (!newFileName.trim() || !newFileContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide both filename and content",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-puzzle-files', {
        method: 'POST',
        body: {
          filename: newFileName,
          content: newFileContent
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to upload file');
      }

      toast({
        title: "Success",
        description: `File ${newFileName} uploaded successfully`
      });

      setNewFileName('');
      setNewFileContent('');
      loadFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const parseBulkFiles = (content: string): { filename: string; content: string }[] => {
    const files: { filename: string; content: string }[] = [];
    const sections = content.split('---').map(s => s.trim()).filter(s => s);
    
    if (sections.length === 0) {
      throw new Error('No files found. Please use the format: filename.js\\ncontent\\n---\\nnext-file.js\\ncontent');
    }
    
    sections.forEach((section, index) => {
      const lines = section.split('\n');
      if (lines.length < 2) {
        throw new Error(`Section ${index + 1}: Each file must have a filename on the first line followed by content. Use format: filename.js\\ncontent`);
      }
      
      const filename = lines[0].trim();
      const fileContent = lines.slice(1).join('\n').trim();
      
      // Validate filename
      if (!filename || filename.startsWith('/*') || filename.startsWith('//') || filename.includes('{') || filename.includes('}')) {
        throw new Error(`Section ${index + 1}: Invalid filename "${filename}". First line must be a valid filename (e.g., "myfile.js"), not code content.`);
      }
      
      // Validate content
      if (!fileContent) {
        throw new Error(`Section ${index + 1}: File "${filename}" has no content.`);
      }
      
      files.push({ filename, content: fileContent });
    });
    
    return files;
  };

  const uploadBulkFiles = async () => {
    if (!bulkFiles.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide bulk file data",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const filesToUpload = parseBulkFiles(bulkFiles);

      const { data, error } = await supabase.functions.invoke('admin-puzzle-files', {
        method: 'POST',
        body: {
          files: filesToUpload,
          bulk: true
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to upload bulk files');
      }

      toast({
        title: "Success",
        description: `${filesToUpload.length} files uploaded successfully`
      });

      setBulkFiles('');
      loadFiles();
    } catch (error) {
      console.error('Error uploading bulk files:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload bulk files",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

    try {
      const { data, error } = await supabase.functions.invoke('admin-puzzle-files', {
        method: 'DELETE',
        body: { fileId }
      });

      if (error) {
        throw new Error(error.message || 'Failed to delete file');
      }

      toast({
        title: "Success",
        description: `File ${filename} deleted successfully`
      });

      loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-puzzle-gray border-puzzle-border">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Puzzle Engine File Manager
          </CardTitle>
          <p className="text-puzzle-white/70">
            Upload and manage JavaScript files for the puzzle engine. Files will be served at 
            <code className="text-puzzle-aqua"> /api/puzzle-engine/files/:filename</code>
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bulk" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-puzzle-black">
              <TabsTrigger value="bulk" className="text-puzzle-white">Bulk Upload</TabsTrigger>
              <TabsTrigger value="single" className="text-puzzle-white">Single File</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bulk" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-puzzle-white">
                  Bulk File Upload (Format: filename.js on first line, then content, separate files with "---")
                </Label>
                <Textarea
                  value={bulkFiles}
                  onChange={(e) => setBulkFiles(e.target.value)}
                  placeholder={`createjs-tweenjs.js
/*!
* TweenJS
* Visit http://createjs.com/ for documentation, updates and examples.
*/

// Your JavaScript content here...

---

puzzle-engine.js
class PuzzleEngine {
  constructor() {
    // Engine code here
  }
}

---

piece-detection.js
// Piece detection algorithms
function detectPieces() {
  // detection logic
}`}
                  className="bg-puzzle-black border-puzzle-border text-puzzle-white min-h-[300px] font-mono text-sm"
                />
              </div>
              <Button 
                onClick={uploadBulkFiles} 
                disabled={uploading}
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                Upload Bulk Files
              </Button>
            </TabsContent>
            
            <TabsContent value="single" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filename" className="text-puzzle-white">Filename</Label>
                  <Input
                    id="filename"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="puzzle-core.js"
                    className="bg-puzzle-black border-puzzle-border text-puzzle-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="text-puzzle-white">File Content</Label>
                <Textarea
                  id="content"
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="// JavaScript content here..."
                  className="bg-puzzle-black border-puzzle-border text-puzzle-white min-h-[200px] font-mono text-sm"
                />
              </div>
              
              <Button 
                onClick={uploadSingleFile} 
                disabled={uploading}
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                Upload File
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* File List */}
      <Card className="bg-puzzle-gray border-puzzle-border">
        <CardHeader>
          <CardTitle className="text-puzzle-white">Uploaded Files ({files.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {files.length === 0 ? (
              <p className="text-puzzle-white/70 text-center py-8">No files uploaded yet</p>
            ) : (
              files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-puzzle-black rounded border border-puzzle-border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-puzzle-aqua" />
                    <div>
                      <p className="text-puzzle-white font-medium">{file.filename}</p>
                      <p className="text-puzzle-white/50 text-sm">
                        Updated: {new Date(file.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/api/puzzle-engine/files/${file.filename}`, '_blank')}
                      className="border-puzzle-border text-puzzle-white hover:bg-puzzle-gray"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteFile(file.id, file.filename)}
                      className="border-red-500 text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};