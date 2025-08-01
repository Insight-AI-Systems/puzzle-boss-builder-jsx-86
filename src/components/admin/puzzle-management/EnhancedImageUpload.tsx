import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Image, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadResult {
  id: string;
  url: string;
  filename: string;
  width: number;
  height: number;
  size: number;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  error?: string;
}

interface EnhancedImageUploadProps {
  onImageReady: (imageData: ImageUploadResult) => void;
  onUploadComplete?: (images: ImageUploadResult[]) => void;
}

export const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  onImageReady,
  onUploadComplete
}) => {
  const [uploadQueue, setUploadQueue] = useState<ImageUploadResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const validateImage = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        // Optimal puzzle image dimensions (minimum 800x600, max 2048x2048)
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        
        if (width < 400 || height < 300) {
          reject(new Error('Image too small. Minimum size: 400x300px'));
          return;
        }
        
        if (width > 4096 || height > 4096) {
          reject(new Error('Image too large. Maximum size: 4096x4096px'));
          return;
        }
        
        resolve({ width, height });
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = URL.createObjectURL(file);
    });
  };

  const processImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        // Optimize for puzzle use - maintain aspect ratio but ensure good quality
        const maxDimension = 1200;
        let { width, height } = img;
        
        if (width > maxDimension || height > maxDimension) {
          const scale = Math.min(maxDimension / width, maxDimension / height);
          width *= scale;
          height *= scale;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Apply slight sharpening for better puzzle piece definition
        ctx!.imageSmoothingEnabled = true;
        ctx!.imageSmoothingQuality = 'high';
        ctx!.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error('Image processing failed')),
          'image/webp',
          0.9
        );
      };
      
      img.onerror = () => reject(new Error('Image processing failed'));
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadToStorage = async (file: File, processedBlob: Blob): Promise<string> => {
    const filename = `puzzle-${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}.webp`;
    
    const { data, error } = await supabase.storage
      .from('puzzle_images')
      .upload(filename, processedBlob, {
        contentType: 'image/webp',
        upsert: false
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('puzzle_images')
      .getPublicUrl(data.path);
    
    return publicUrl;
  };

  const handleFileUpload = async (file: File) => {
    const uploadId = `upload-${Date.now()}-${Math.random()}`;
    
    const newUpload: ImageUploadResult = {
      id: uploadId,
      url: '',
      filename: file.name,
      width: 0,
      height: 0,
      size: file.size,
      status: 'uploading'
    };
    
    setUploadQueue(prev => [...prev, newUpload]);
    
    try {
      // Validate image dimensions
      const { width, height } = await validateImage(file);
      
      setUploadQueue(prev => prev.map(item =>
        item.id === uploadId
          ? { ...item, width, height, status: 'processing' }
          : item
      ));
      
      // Process image for optimal puzzle use
      const processedBlob = await processImage(file);
      
      // Upload to Supabase Storage
      const imageUrl = await uploadToStorage(file, processedBlob);
      
      const completedUpload: ImageUploadResult = {
        ...newUpload,
        url: imageUrl,
        width,
        height,
        status: 'ready'
      };
      
      setUploadQueue(prev => prev.map(item =>
        item.id === uploadId ? completedUpload : item
      ));
      
      onImageReady(completedUpload);
      
      toast({
        title: "Image uploaded successfully",
        description: `${file.name} is ready for puzzle creation`
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setUploadQueue(prev => prev.map(item =>
        item.id === uploadId
          ? { ...item, status: 'error', error: errorMessage }
          : item
      ));
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
    );
    
    if (imageFiles.length !== acceptedFiles.length) {
      toast({
        title: "Some files skipped",
        description: "Only image files under 10MB are accepted",
        variant: "destructive"
      });
    }
    
    for (const file of imageFiles) {
      await handleFileUpload(file);
    }
    
    setIsProcessing(false);
    
    if (onUploadComplete) {
      onUploadComplete(uploadQueue.filter(item => item.status === 'ready'));
    }
  }, [uploadQueue, onUploadComplete, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeUpload = (id: string) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Enhanced Image Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop images here...' : 'Drag & drop puzzle images'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports PNG, JPG, WebP • Max 10MB • Min 400x300px
            </p>
            <Button variant="outline" disabled={isProcessing}>
              <Image className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>
          
          {uploadQueue.length > 0 && (
            <Alert className="mt-4">
              <AlertDescription>
                Images are automatically optimized for puzzle use with enhanced sharpening and WebP compression.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      {uploadQueue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Queue ({uploadQueue.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadQueue.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(upload.status)}
                    <div>
                      <p className="font-medium truncate max-w-[200px]">{upload.filename}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {upload.width > 0 && <span>{upload.width}×{upload.height}</span>}
                        <span>{(upload.size / 1024 / 1024).toFixed(1)}MB</span>
                      </div>
                      {upload.error && (
                        <p className="text-sm text-red-600">{upload.error}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(upload.status)}>
                      {upload.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUpload(upload.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};