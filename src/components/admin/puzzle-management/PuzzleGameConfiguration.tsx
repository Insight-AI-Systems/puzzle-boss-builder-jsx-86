import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings,
  Gamepad2,
  Image,
  Code,
  Play,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GameEngineFile {
  id: string;
  filename: string;
  content: string;
  size: number;
  lastModified: string;
  type: 'core' | 'plugin' | 'asset';
}

interface PuzzleConfiguration {
  engineFiles: GameEngineFile[];
  selectedImage: string;
  difficulty: 'easy' | 'medium' | 'hard';
  pieceCount: number;
  enableHints: boolean;
  enableTimer: boolean;
  enableSound: boolean;
  timeLimit?: number;
  theme: string;
  customSettings: Record<string, any>;
}

export const PuzzleGameConfiguration: React.FC = () => {
  const [config, setConfig] = useState<PuzzleConfiguration>({
    engineFiles: [],
    selectedImage: '',
    difficulty: 'medium',
    pieceCount: 100,
    enableHints: true,
    enableTimer: true,
    enableSound: true,
    theme: 'default',
    customSettings: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [gameEngineStatus, setGameEngineStatus] = useState<'ready' | 'loading' | 'error'>('loading');
  const { toast } = useToast();

  useEffect(() => {
    loadGameEngineFiles();
  }, []);

  const loadGameEngineFiles = async () => {
    try {
      setIsLoading(true);
      
      // Fetch uploaded game engine files from site_content table
      const { data: contentData, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_id', 'puzzle-engine')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const engineFiles: GameEngineFile[] = (contentData || []).map(item => ({
        id: item.id,
        filename: item.page_id, // Using page_id as filename
        content: item.content || '',
        size: new Blob([item.content || '']).size,
        lastModified: item.created_at || '',
        type: item.page_id.includes('core') ? 'core' : 
              item.page_id.includes('plugin') ? 'plugin' : 'asset'
      }));

      setConfig(prev => ({
        ...prev,
        engineFiles
      }));

      setGameEngineStatus(engineFiles.length > 0 ? 'ready' : 'error');
      
      if (engineFiles.length === 0) {
        toast({
          title: "No game engine files found",
          description: "Upload game engine files in the File Manager first",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Error loading game engine files:', error);
      setGameEngineStatus('error');
      toast({
        title: "Failed to load game engine",
        description: "Error accessing uploaded game files",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = (key: keyof PuzzleConfiguration, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard') => {
    const pieceCounts = {
      easy: 20,
      medium: 100,
      hard: 500
    };
    
    setConfig(prev => ({
      ...prev,
      difficulty,
      pieceCount: pieceCounts[difficulty]
    }));
  };

  const generateGameSession = async () => {
    if (!config.selectedImage) {
      toast({
        title: "Image required",
        description: "Please select an image for the puzzle",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate a game session configuration
      const sessionConfig = {
        image: config.selectedImage,
        difficulty: config.difficulty,
        pieces: config.pieceCount,
        settings: {
          hints: config.enableHints,
          timer: config.enableTimer,
          sound: config.enableSound,
          timeLimit: config.timeLimit,
          theme: config.theme,
          ...config.customSettings
        },
        engineFiles: config.engineFiles.map(f => ({
          name: f.filename,
          type: f.type
        }))
      };

      // In a real implementation, this would create a new puzzle session
      console.log('Generated session config:', sessionConfig);
      
      toast({
        title: "Game session configured",
        description: "Puzzle configuration is ready for deployment",
      });

    } catch (error) {
      console.error('Error generating game session:', error);
      toast({
        title: "Configuration failed",
        description: "Unable to generate game session",
        variant: "destructive"
      });
    }
  };

  const exportConfiguration = () => {
    const configData = JSON.stringify(config, null, 2);
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `puzzle-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'core': return '🔧';
      case 'plugin': return '🔌';
      case 'asset': return '📁';
      default: return '📄';
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ready: 'bg-green-100 text-green-800',
      loading: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.loading}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading game configuration...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Gamepad2 className="h-5 w-5 mr-2" />
              Puzzle Game Configuration
            </CardTitle>
            <div className="flex items-center space-x-2">
              {getStatusBadge(gameEngineStatus)}
              <span className="text-sm text-muted-foreground">
                Engine Status
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="engine" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="engine">
                <Code className="h-4 w-4 mr-2" />
                Engine
              </TabsTrigger>
              <TabsTrigger value="puzzle">
                <Image className="h-4 w-4 mr-2" />
                Puzzle
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="deploy">
                <Play className="h-4 w-4 mr-2" />
                Deploy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="engine" className="space-y-4">
              <Alert>
                <AlertDescription>
                  Game engine files loaded from the File Manager. Make sure all required files are uploaded.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Loaded Game Engine Files ({config.engineFiles.length})</Label>
                  <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                    {config.engineFiles.map((file) => (
                      <div key={file.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getFileTypeIcon(file.type)}</span>
                          <div>
                            <p className="font-medium">{file.filename}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB • {file.type}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{file.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                {config.engineFiles.length === 0 && (
                  <Alert>
                    <AlertDescription>
                      No game engine files found. Go to the File Manager to upload puzzle game files.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="puzzle" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-select">Puzzle Image</Label>
                  <Select
                    value={config.selectedImage}
                    onValueChange={(value) => handleConfigChange('selectedImage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select puzzle image" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mountain">Mountain Landscape</SelectItem>
                      <SelectItem value="ocean">Ocean Sunset</SelectItem>
                      <SelectItem value="city">City Lights</SelectItem>
                      <SelectItem value="forest">Forest Path</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={config.difficulty}
                    onValueChange={handleDifficultyChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy (20 pieces)</SelectItem>
                      <SelectItem value="medium">Medium (100 pieces)</SelectItem>
                      <SelectItem value="hard">Hard (500 pieces)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="piece-count">Piece Count</Label>
                  <Input
                    id="piece-count"
                    type="number"
                    value={config.pieceCount}
                    onChange={(e) => handleConfigChange('pieceCount', parseInt(e.target.value))}
                    min="4"
                    max="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={config.theme}
                    onValueChange={(value) => handleConfigChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Game Features</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hints">Enable Hints</Label>
                    <input
                      id="hints"
                      type="checkbox"
                      checked={config.enableHints}
                      onChange={(e) => handleConfigChange('enableHints', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="timer">Enable Timer</Label>
                    <input
                      id="timer"
                      type="checkbox"
                      checked={config.enableTimer}
                      onChange={(e) => handleConfigChange('enableTimer', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound">Enable Sound</Label>
                    <input
                      id="sound"
                      type="checkbox"
                      checked={config.enableSound}
                      onChange={(e) => handleConfigChange('enableSound', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Time Settings</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                    <Input
                      id="time-limit"
                      type="number"
                      value={config.timeLimit || ''}
                      onChange={(e) => handleConfigChange('timeLimit', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="No limit"
                      min="1"
                      max="180"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deploy" className="space-y-4">
              <Alert>
                <AlertDescription>
                  Review your configuration and deploy the puzzle game session.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Configuration Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Image:</span>
                      <span>{config.selectedImage || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <span>{config.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pieces:</span>
                      <span>{config.pieceCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engine Files:</span>
                      <span>{config.engineFiles.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Features:</span>
                      <span>
                        {[
                          config.enableHints && 'Hints',
                          config.enableTimer && 'Timer',
                          config.enableSound && 'Sound'
                        ].filter(Boolean).join(', ') || 'None'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Button
                    onClick={generateGameSession}
                    className="w-full"
                    disabled={!config.selectedImage || config.engineFiles.length === 0}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Deploy Game Session
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={exportConfiguration}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Configuration
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={loadGameEngineFiles}
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload Engine Files
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};