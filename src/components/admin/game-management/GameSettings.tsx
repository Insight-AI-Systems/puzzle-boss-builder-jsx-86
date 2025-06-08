
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw, Settings2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface DifficultySettings {
  easy: {
    timeLimit: number;
    pieces: number;
    hints: number;
  };
  medium: {
    timeLimit: number;
    pieces: number;
    hints: number;
  };
  hard: {
    timeLimit: number;
    pieces: number;
    hints: number;
  };
}

interface GameDifficultyConfig {
  id: string;
  name: string;
  settings: DifficultySettings;
  adaptiveDifficulty: boolean;
  performanceMetrics: boolean;
}

export function GameSettings() {
  const { toast } = useToast();
  const [selectedGame, setSelectedGame] = useState("memory");
  
  const [gameConfigs, setGameConfigs] = useState<Record<string, GameDifficultyConfig>>({
    memory: {
      id: 'memory',
      name: 'Memory Game',
      settings: {
        easy: { timeLimit: 300, pieces: 8, hints: 3 },
        medium: { timeLimit: 240, pieces: 16, hints: 2 },
        hard: { timeLimit: 180, pieces: 24, hints: 1 }
      },
      adaptiveDifficulty: true,
      performanceMetrics: true
    },
    wordsearch: {
      id: 'wordsearch',
      name: 'Word Search',
      settings: {
        easy: { timeLimit: 480, pieces: 10, hints: 5 },
        medium: { timeLimit: 360, pieces: 15, hints: 3 },
        hard: { timeLimit: 240, pieces: 20, hints: 1 }
      },
      adaptiveDifficulty: false,
      performanceMetrics: true
    },
    sudoku: {
      id: 'sudoku',
      name: 'Sudoku',
      settings: {
        easy: { timeLimit: 900, pieces: 35, hints: 8 },
        medium: { timeLimit: 720, pieces: 45, hints: 5 },
        hard: { timeLimit: 600, pieces: 55, hints: 2 }
      },
      adaptiveDifficulty: true,
      performanceMetrics: true
    }
  });

  const currentConfig = gameConfigs[selectedGame];

  const handleDifficultyChange = (
    difficulty: keyof DifficultySettings,
    setting: string,
    value: number
  ) => {
    setGameConfigs(prev => ({
      ...prev,
      [selectedGame]: {
        ...prev[selectedGame],
        settings: {
          ...prev[selectedGame].settings,
          [difficulty]: {
            ...prev[selectedGame].settings[difficulty],
            [setting]: value
          }
        }
      }
    }));
  };

  const handleToggleFeature = (feature: string, enabled: boolean) => {
    setGameConfigs(prev => ({
      ...prev,
      [selectedGame]: {
        ...prev[selectedGame],
        [feature]: enabled
      }
    }));
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: `${currentConfig.name} settings have been updated successfully`
    });
  };

  const handleResetToDefaults = () => {
    // Reset to default values
    const defaultSettings = {
      easy: { timeLimit: 300, pieces: 8, hints: 3 },
      medium: { timeLimit: 240, pieces: 16, hints: 2 },
      hard: { timeLimit: 180, pieces: 24, hints: 1 }
    };

    setGameConfigs(prev => ({
      ...prev,
      [selectedGame]: {
        ...prev[selectedGame],
        settings: defaultSettings
      }
    }));

    toast({
      title: "Settings Reset",
      description: "Difficulty settings have been reset to defaults"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Game Difficulty Modifications
          </CardTitle>
          <CardDescription>
            Configure difficulty settings and performance parameters for each game
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <Label htmlFor="game-select">Select Game</Label>
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger id="game-select" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="memory">Memory Game</SelectItem>
                  <SelectItem value="wordsearch">Word Search</SelectItem>
                  <SelectItem value="sudoku">Sudoku</SelectItem>
                  <SelectItem value="trivia">Trivia Challenge</SelectItem>
                  <SelectItem value="blocks">Block Puzzle Pro</SelectItem>
                  <SelectItem value="crossword">Daily Crossword</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentConfig && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold">{currentConfig.name}</h3>
                  <Badge variant="outline">Active</Badge>
                </div>

                <Tabs defaultValue="easy" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="easy">Easy</TabsTrigger>
                    <TabsTrigger value="medium">Medium</TabsTrigger>
                    <TabsTrigger value="hard">Hard</TabsTrigger>
                  </TabsList>

                  {Object.entries(currentConfig.settings).map(([difficulty, settings]) => (
                    <TabsContent key={difficulty} value={difficulty} className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="capitalize">{difficulty} Difficulty</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                              <Label>Time Limit (seconds)</Label>
                              <div className="space-y-2">
                                <Slider
                                  value={[settings.timeLimit]}
                                  onValueChange={([value]) => 
                                    handleDifficultyChange(difficulty as keyof DifficultySettings, 'timeLimit', value)
                                  }
                                  min={60}
                                  max={1800}
                                  step={30}
                                  className="w-full"
                                />
                                <div className="flex justify-between text-sm text-gray-600">
                                  <span>1m</span>
                                  <span className="font-medium">{Math.floor(settings.timeLimit / 60)}m {settings.timeLimit % 60}s</span>
                                  <span>30m</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <Label>Pieces/Items</Label>
                              <div className="space-y-2">
                                <Slider
                                  value={[settings.pieces]}
                                  onValueChange={([value]) => 
                                    handleDifficultyChange(difficulty as keyof DifficultySettings, 'pieces', value)
                                  }
                                  min={4}
                                  max={60}
                                  step={1}
                                  className="w-full"
                                />
                                <div className="flex justify-between text-sm text-gray-600">
                                  <span>4</span>
                                  <span className="font-medium">{settings.pieces}</span>
                                  <span>60</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <Label>Available Hints</Label>
                              <div className="space-y-2">
                                <Slider
                                  value={[settings.hints]}
                                  onValueChange={([value]) => 
                                    handleDifficultyChange(difficulty as keyof DifficultySettings, 'hints', value)
                                  }
                                  min={0}
                                  max={10}
                                  step={1}
                                  className="w-full"
                                />
                                <div className="flex justify-between text-sm text-gray-600">
                                  <span>0</span>
                                  <span className="font-medium">{settings.hints}</span>
                                  <span>10</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>

                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Adaptive Difficulty</Label>
                        <p className="text-sm text-gray-600">
                          Automatically adjust difficulty based on player performance
                        </p>
                      </div>
                      <Switch
                        checked={currentConfig.adaptiveDifficulty}
                        onCheckedChange={(checked) => handleToggleFeature('adaptiveDifficulty', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Performance Metrics</Label>
                        <p className="text-sm text-gray-600">
                          Track detailed performance analytics
                        </p>
                      </div>
                      <Switch
                        checked={currentConfig.performanceMetrics}
                        onCheckedChange={(checked) => handleToggleFeature('performanceMetrics', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                  
                  <Button variant="outline" onClick={handleResetToDefaults}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
