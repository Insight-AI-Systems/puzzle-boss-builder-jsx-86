
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onUpload: (files: File[]) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, disabled }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': []
    },
    disabled
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-puzzle-aqua bg-puzzle-aqua/10' : 'border-gray-300 hover:border-puzzle-aqua'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-lg font-semibold">Drag & drop images here</h3>
      <p className="text-sm text-muted-foreground mt-1">or click to select files</p>
      <Button 
        variant="outline" 
        className="mt-4"
        type="button"
        disabled={disabled}
      >
        Select Files
      </Button>
    </div>
  );
}

export default ImageUpload;
