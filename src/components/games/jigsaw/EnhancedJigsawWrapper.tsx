import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FixedHeadbreaker } from './FixedHeadbreaker';
import { KonvaJigsawGame } from './KonvaJigsawGame';
import { MinimalJigsawGame } from './MinimalJigsawGame';

interface EnhancedJigsawWrapperProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  onComplete?: (stats: any) => void;
}

export function EnhancedJigsawWrapper({
  difficulty = 'medium',
  imageUrl,
  onComplete
}: EnhancedJigsawWrapperProps) {
  const [renderEngine, setRenderEngine] = useState<'headbreaker' | 'konva' | 'minimal'>('konva');
  const [gameKey, setGameKey] = useState(0);

  const handleComplete = (stats: any) => {
    console.log('Puzzle completed with stats:', stats);
    if (onComplete) {
      onComplete(stats);
    }
  };

  const resetGame = () => {
    setGameKey(prev => prev + 1);
  };

  return (
    <div className="w-full space-y-4">
      {/* Engine Selection */}
      <Card className="p-4">
        <Tabs value={renderEngine} onValueChange={(value: any) => setRenderEngine(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="konva">
              Konva Engine (Enhanced)
            </TabsTrigger>
            <TabsTrigger value="headbreaker">
              Headbreaker Engine
            </TabsTrigger>
            <TabsTrigger value="minimal">
              Minimal Engine
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="konva" className="mt-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Konva Rendering Engine</h3>
              <p className="text-sm text-muted-foreground">
                High-performance canvas rendering with smooth animations and advanced piece interactions.
                Best for modern browsers with good graphics support.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="headbreaker" className="mt-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Headbreaker Engine</h3>
              <p className="text-sm text-muted-foreground">
                Specialized jigsaw puzzle engine with realistic piece shapes and automatic connection detection.
                Provides authentic puzzle-solving experience.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="minimal" className="mt-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Minimal Engine</h3>
              <p className="text-sm text-muted-foreground">
                Lightweight implementation for basic puzzle functionality.
                Best for low-resource devices or quick games.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Game Rendering */}
      <div key={gameKey}>
        {renderEngine === 'konva' && (
          <KonvaJigsawGame
            difficulty={difficulty}
            imageUrl={imageUrl}
            onComplete={handleComplete}
            isActive={true}
          />
        )}
        
        {renderEngine === 'headbreaker' && (
          <FixedHeadbreaker
            difficulty={difficulty}
            imageUrl={imageUrl}
            onComplete={handleComplete}
          />
        )}
        
        {renderEngine === 'minimal' && (
          <MinimalJigsawGame
            difficulty={difficulty}
            imageUrl={imageUrl}
            onComplete={handleComplete}
            isActive={true}
          />
        )}
      </div>

      {/* Global Controls */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Current Engine: <span className="font-semibold">{renderEngine}</span>
          </div>
          <Button variant="outline" onClick={resetGame}>
            New Game
          </Button>
        </div>
      </Card>
    </div>
  );
}