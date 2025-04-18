
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle } from 'lucide-react';

export default function KnownIssues() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-game text-puzzle-aqua mb-8">Known Issues</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-puzzle-aqua" />
              <span>Current Limitations</span>
            </CardTitle>
            <CardDescription>
              We are actively working on resolving these issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Mobile Experience</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Mobile responsiveness improvements in progress</li>
                <li>Touch controls for puzzles being optimized</li>
                <li>Mobile performance enhancements planned</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Browser Compatibility</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Best experience in Chrome/Firefox</li>
                <li>Safari: minor visual differences may occur</li>
                <li>Internet Explorer: not supported</li>
                <li>Older browsers: limited functionality</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Performance</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Large puzzles may require more system resources</li>
                <li>Performance optimizations ongoing</li>
                <li>Memory usage improvements in development</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
