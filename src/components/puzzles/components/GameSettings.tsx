
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Clock,
  RotateCcw,
  Puzzle,
  Palette,
  HelpCircle,
  Sliders,
  X
} from 'lucide-react';
import { GameMode, PieceShape, VisualTheme, MODE_DESCRIPTIONS, THEME_DESCRIPTIONS, DifficultyLevel, difficultyConfig } from '../types/puzzle-types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

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
  isMobile: boolean;
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
  isMobile
}) => {
  const [open, setOpen] = React.useState(false);
  
  const handleSaveSettings = () => {
    // If game mode is challenge, force rotation enabled
    if (gameMode === 'challenge' && !rotationEnabled) {
      setRotationEnabled(true);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Game Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={`${isMobile ? 'w-[95vw] max-w-md' : 'max-w-2xl'} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>Game Settings</DialogTitle>
          <DialogDescription>
            Customize your puzzle experience
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="modes">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modes" className="flex items-center gap-1">
              <Puzzle className="h-4 w-4" />
              <span className={isMobile ? 'hidden' : ''}>Modes</span>
            </TabsTrigger>
            <TabsTrigger value="difficulty" className="flex items-center gap-1">
              <Sliders className="h-4 w-4" />
              <span className={isMobile ? 'hidden' : ''}>Difficulty</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              <span className={isMobile ? 'hidden' : ''}>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              <span className={isMobile ? 'hidden' : ''}>Help</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="modes" className="space-y-4 py-4">
            <h3 className="text-lg font-semibold">Game Modes</h3>
            <RadioGroup value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="classic" id="classic" />
                <Label htmlFor="classic" className="flex items-center gap-2">
                  <Puzzle className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Classic Mode</div>
                    <div className="text-sm text-muted-foreground">{MODE_DESCRIPTIONS.classic}</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="timed" id="timed" />
                <Label htmlFor="timed" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Timed Mode</div>
                    <div className="text-sm text-muted-foreground">{MODE_DESCRIPTIONS.timed}</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="challenge" id="challenge" />
                <Label htmlFor="challenge" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Challenge Mode</div>
                    <div className="text-sm text-muted-foreground">{MODE_DESCRIPTIONS.challenge}</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
            
            {gameMode === 'timed' && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="time-limit">Time Limit (seconds): {timeLimit}</Label>
                <Slider
                  id="time-limit"
                  min={30}
                  max={600}
                  step={30}
                  value={[timeLimit]}
                  onValueChange={(values) => setTimeLimit(values[0])}
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="rotate-pieces" 
                checked={rotationEnabled || gameMode === 'challenge'} 
                onCheckedChange={setRotationEnabled}
                disabled={gameMode === 'challenge'}
              />
              <Label htmlFor="rotate-pieces" className="flex items-center gap-2">
                <div>
                  <div className="font-medium">Piece Rotation</div>
                  <div className="text-sm text-muted-foreground">
                    {gameMode === 'challenge' ? 'Always enabled in Challenge Mode' : 'Allow pieces to be rotated'}
                  </div>
                </div>
              </Label>
            </div>
          </TabsContent>
          
          <TabsContent value="difficulty" className="space-y-4 py-4">
            <h3 className="text-lg font-semibold">Puzzle Difficulty</h3>
            <RadioGroup 
              value={difficulty} 
              onValueChange={(value) => setDifficulty(value as DifficultyLevel)} 
              className="space-y-2"
            >
              {(Object.keys(difficultyConfig) as DifficultyLevel[]).map((diff) => (
                <div key={diff} className="flex items-center space-x-2">
                  <RadioGroupItem value={diff} id={diff} />
                  <Label htmlFor={diff}>
                    <div className="font-medium">{difficultyConfig[diff].label}</div>
                    <div className="text-sm text-muted-foreground">
                      {difficultyConfig[diff].gridSize}×{difficultyConfig[diff].gridSize} grid 
                      ({difficultyConfig[diff].gridSize * difficultyConfig[diff].gridSize} pieces)
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="piece-shape" 
                checked={pieceShape === 'irregular'} 
                onCheckedChange={(checked) => setPieceShape(checked ? 'irregular' : 'standard')}
              />
              <Label htmlFor="piece-shape">
                <div className="font-medium">Irregular Piece Shapes</div>
                <div className="text-sm text-muted-foreground">
                  Use more complex and interesting piece shapes
                </div>
              </Label>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 py-4">
            <h3 className="text-lg font-semibold">Visual Theme</h3>
            <RadioGroup 
              value={visualTheme} 
              onValueChange={(value) => setVisualTheme(value as VisualTheme)} 
              className="space-y-2"
            >
              {(['light', 'dark', 'colorful'] as VisualTheme[]).map((theme) => (
                <div key={theme} className="flex items-center space-x-2">
                  <RadioGroupItem value={theme} id={theme} />
                  <Label htmlFor={theme}>
                    <div className="font-medium capitalize">{theme} Theme</div>
                    <div className="text-sm text-muted-foreground">
                      {THEME_DESCRIPTIONS[theme]}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
          
          <TabsContent value="help" className="space-y-4 py-4">
            <h3 className="text-lg font-semibold">How to Play</h3>
            <div className="space-y-2 text-sm">
              <h4 className="font-medium">Classic Mode</h4>
              <p>Drag and drop puzzle pieces to complete the image. Pieces will snap into place when correctly positioned.</p>
              
              <h4 className="font-medium mt-3">Timed Mode</h4>
              <p>Complete the puzzle before time runs out. The clock is ticking!</p>
              
              <h4 className="font-medium mt-3">Challenge Mode</h4>
              <p>Pieces may be rotated. Click or tap a piece to rotate it clockwise. Make sure each piece has the correct orientation.</p>
              
              <h4 className="font-medium mt-3">Controls</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Drag pieces with mouse or touch</li>
                <li>Click/tap to rotate (when rotation is enabled)</li>
                <li>Use directional controls on mobile</li>
                <li>Save your progress to continue later</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSaveSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameSettings;
