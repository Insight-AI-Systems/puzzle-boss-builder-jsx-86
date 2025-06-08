
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

const MemoryGamePage: React.FC = () => {
  return (
    <PageLayout title="Memory Master">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Brain className="h-6 w-6 text-puzzle-aqua" />
              Memory Master
            </CardTitle>
            <CardDescription>
              Test your memory with matching pairs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-puzzle-aqua mx-auto mb-4" />
              <h3 className="text-puzzle-white text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-puzzle-white/60">
                The Memory game is currently in development. Check back soon!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default MemoryGamePage;
