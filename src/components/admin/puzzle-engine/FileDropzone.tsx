import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DroppedFile {
  filename: string;
  content: string;
  size: number;
}

interface FileDropzoneProps {
  onFilesReady: (files: DroppedFile[]) => void;
  disabled?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFilesReady, disabled }) => {
  const [droppedFiles, setDroppedFiles] = useState<DroppedFile[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const processedFiles: DroppedFile[] = [];

    for (const file of acceptedFiles) {
      try {
        const content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
          reader.readAsText(file);
        });

        processedFiles.push({
          filename: file.name,
          content: content.trim(),
          size: file.size
        });
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
      }
    }

    setDroppedFiles(processedFiles);
    onFilesReady(processedFiles);
  }, [onFilesReady]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/javascript': ['.js', '.mjs'],
      'application/javascript': ['.js', '.mjs'],
      'text/typescript': ['.ts'],
      'application/typescript': ['.ts'],
      'text/jsx': ['.jsx'],
      'text/tsx': ['.tsx'],
      'text/plain': ['.js', '.ts', '.jsx', '.tsx', '.mjs']
    },
    disabled,
    multiple: true
  });

  const removeFile = (index: number) => {
    const updatedFiles = droppedFiles.filter((_, i) => i !== index);
    setDroppedFiles(updatedFiles);
    onFilesReady(updatedFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-puzzle-aqua bg-puzzle-aqua/10' 
            : 'border-puzzle-border hover:border-puzzle-aqua bg-puzzle-black/50'
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-puzzle-aqua mb-4" />
        <h3 className="text-lg font-semibold text-puzzle-white mb-2">
          {isDragActive ? 'Drop JavaScript files here' : 'Drag & drop JavaScript files'}
        </h3>
        <p className="text-puzzle-gray mb-4">
          Supports .js, .ts, .jsx, .tsx, .mjs files
        </p>
        <Button 
          variant="outline" 
          className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black"
          type="button"
          disabled={disabled}
        >
          Or click to browse files
        </Button>
      </div>

      {droppedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-puzzle-white font-medium">Ready to upload ({droppedFiles.length} files):</h4>
          {droppedFiles.map((file, index) => (
            <Card key={index} className="p-3 bg-puzzle-black border-puzzle-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <File className="h-4 w-4 text-puzzle-aqua" />
                  <div>
                    <p className="text-puzzle-white font-medium">{file.filename}</p>
                    <p className="text-puzzle-gray text-sm">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-puzzle-red hover:bg-puzzle-red/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDropzone;