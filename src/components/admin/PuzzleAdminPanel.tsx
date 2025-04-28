
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PuzzleSettingsForm } from './PuzzleSettingsForm';
import { PuzzlePreview } from './PuzzlePreview';
import { PuzzleAssetManager } from './PuzzleAssetManager';
import { PieceStyleManager } from './PieceStyleManager';

// Types for our puzzle configuration
export interface PuzzleConfig {
  imageUrl: string;
  difficulty: {
    value: string;
    rows: number;
    columns: number;
  };
  pieceStyle: string;
  customPieceSvg?: string;
}

const DEFAULT_CONFIG: PuzzleConfig = {
  imageUrl: "https://images.unsplash.com/photo-1620677368158-1949bf7e6241?w=500&h=500&fit=crop",
  difficulty: {
    value: "medium",
    rows: 4,
    columns: 4
  },
  pieceStyle: "classic"
};

export const PuzzleAdminPanel = () => {
  const [config, setConfig] = useState<PuzzleConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState("settings");
  const { toast } = useToast();

  useEffect(() => {
    // Load saved config from localStorage if available
    const savedConfig = localStorage.getItem('admin-puzzle-config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error('Failed to parse saved config', e);
      }
    }
  }, []);

  const handleConfigChange = (newConfig: Partial<PuzzleConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      // Save to localStorage
      localStorage.setItem('admin-puzzle-config', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSave = () => {
    // In a real app, this would send data to an API
    localStorage.setItem('admin-puzzle-config', JSON.stringify(config));
    toast({
      title: 'Settings saved',
      description: 'Puzzle configuration has been saved successfully',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column: Settings and controls */}
      <div className="lg:col-span-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="settings">Puzzle Settings</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="pieces">Piece Styles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4">
            <PuzzleSettingsForm 
              config={config} 
              onConfigChange={handleConfigChange} 
            />
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4">
            <PuzzleAssetManager 
              currentImage={config.imageUrl} 
              onSelectImage={(imageUrl) => handleConfigChange({ imageUrl })} 
            />
          </TabsContent>
          
          <TabsContent value="pieces" className="space-y-4">
            <PieceStyleManager 
              currentStyle={config.pieceStyle}
              customSvg={config.customPieceSvg} 
              onSelectStyle={(pieceStyle) => handleConfigChange({ pieceStyle })}
              onCustomSvgChange={(customPieceSvg) => handleConfigChange({ customPieceSvg })} 
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </div>

      {/* Right column: Preview */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Live Preview</h3>
            <PuzzlePreview config={config} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
