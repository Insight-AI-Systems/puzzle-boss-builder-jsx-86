import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File } from 'lucide-react';

export function FileUploadTool() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      console.log('📁 Uploaded file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const reader = new FileReader();
      
      reader.onload = () => {
        console.log('📄 File content preview (first 1000 chars):');
        console.log(typeof reader.result === 'string' ? reader.result.substring(0, 1000) : 'Binary file');
        
        // For text files, show full content
        if (file.type.includes('text') || file.name.endsWith('.js') || file.name.endsWith('.html')) {
          console.log('📄 Full file content:');
          console.log(reader.result);
        }
      };
      
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.js', '.html', '.css'],
      'application/javascript': ['.js'],
      'text/html': ['.html'],
      'application/zip': ['.zip']
    }
  });

  return (
    <div className="w-full h-screen p-8 bg-gray-50">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Headbreaker Library Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <File className="h-12 w-12 text-gray-400" />
              {isDragActive ? (
                <p className="text-lg">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">Drag & drop headbreaker files here</p>
                  <p className="text-sm text-gray-500">
                    Upload the headbreaker library files, examples, or ZIP archive
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium mb-2">Files will be logged to console:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Open browser dev tools (F12)</li>
              <li>Check the Console tab</li>
              <li>Upload files to see their content</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}