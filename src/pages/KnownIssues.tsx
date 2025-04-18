
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function KnownIssues() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-game text-puzzle-aqua mb-8">Known Issues</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Limitations</CardTitle>
            <CardDescription>
              We are actively working on resolving these issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Mobile responsiveness improvements in progress</li>
              <li>Limited browser compatibility - best experience in Chrome/Firefox</li>
              <li>Performance optimizations ongoing</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
