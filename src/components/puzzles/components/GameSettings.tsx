
import React from 'react';
import { Button } from '@/components/ui/button';
import { DifficultyLevel, GameMode, PieceShape, VisualTheme } from '../types/puzzle-types';
import { 
  Popover, 
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface GameSettingsProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  difficulty: DifficultyLevel;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  pieceShape: PieceShape;
  setPieceShape: (shape: PieceShape) => void;
  visualTheme: VisualTheme;
  setVisualTheme: (theme: VisualTheme) => void;
  rotationEnabled: boolean;
  setRotationEnabled: (enabled: boolean) => void;
  timeLimit: number;
  setTimeLimit: (limit: number) => void;
  isMobile?: boolean;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  gameMode,
  setGameMode,
  difficulty,
  setDifficulty,
  pieceShape,
  setPieceShape,
  visualTheme,
  setVisualTheme,
  rotationEnabled,
  setRotationEnabled,
  timeLimit,
  setTimeLimit,
  isMobile = false
}) => {
  const formatTimeLimit = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 ${isMobile ? 'px-3' : ''}`}
        >
          <Settings className="w-4 h-4" />
          <span>{isMobile ? '' : 'Game Settings'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={`${isMobile ? 'w-[280px]' : 'w-[350px]'} p-4`}
        align="end"
      >
        <h3 className="font-medium text-lg mb-4">Game Settings</h3>
        
        <Tabs defaultValue="mode">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="mode" className="flex-1">Game Mode</TabsTrigger>
            <TabsTrigger value="visuals" className="flex-1">Visuals</TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mode" className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Game Mode</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm"
                  variant={gameMode === 'classic' ? 'default' : 'outline'}
                  onClick={() => setGameMode('classic')}
                >
                  Classic
                </Button>
                <Button 
                  size="sm"
                  variant={gameMode === 'timed' ? 'default' : 'outline'}
                  onClick={() => setGameMode('timed')}
                >
                  Timed
                </Button>
                <Button 
                  size="sm"
                  variant={gameMode === 'challenge' ? 'default' : 'outline'}
                  onClick={() => setGameMode('challenge')}
                >
                  Challenge
                </Button>
              </div>
              
              {gameMode === 'timed' && (
                <div className="pt-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Time Limit: {formatTimeLimit(timeLimit)}</span>
                  </div>
                  <Slider
                    defaultValue={[timeLimit]}
                    max={900}
                    min={60}
                    step={30}
                    onValueChange={(vals) => setTimeLimit(vals[0])}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Difficulty</h4>
              <div className="flex flex-wrap gap-2">
                {(['3x3', '4x4', '5x5'] as DifficultyLevel[]).map((diff) => (
                  <Button
                    key={diff}
                    size="sm"
                    variant={difficulty === diff ? 'default' : 'outline'}
                    onClick={() => setDifficulty(diff)}
                  >
                    {diff}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="visuals" className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Piece Shape</h4>
              <div className="flex flex-wrap gap-2">
                {(['standard', 'rounded', 'puzzle'] as PieceShape[]).map((shape) => (
                  <Button
                    key={shape}
                    size="sm"
                    variant={pieceShape === shape ? 'default' : 'outline'}
                    onClick={() => setPieceShape(shape)}
                  >
                    {shape.charAt(0).toUpperCase() + shape.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Visual Theme</h4>
              <div className="flex flex-wrap gap-2">
                {(['light', 'dark', 'colorful'] as VisualTheme[]).map((theme) => (
                  <Button
                    key={theme}
                    size="sm"
                    variant={visualTheme === theme ? 'default' : 'outline'}
                    onClick={() => setVisualTheme(theme)}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="rotation"
                  checked={rotationEnabled}
                  onCheckedChange={setRotationEnabled}
                />
                <Label htmlFor="rotation" className="cursor-pointer">
                  Enable Piece Rotation
                </Label>
              </div>
              
              {rotationEnabled && (
                <p className="text-sm text-muted-foreground">
                  Click on pieces to rotate them.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default GameSettings;
