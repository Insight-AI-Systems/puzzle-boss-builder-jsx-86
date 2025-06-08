
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Play, Pause } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface GameConfig {
  id: string;
  name: string;
  enabled: boolean;
  entryFee: number;
  prizePool: number;
  maxPlayers: number;
  status: 'active' | 'maintenance' | 'disabled';
}

export function GameControlPanel() {
  const { toast } = useToast();
  const [editingGame, setEditingGame] = useState<string | null>(null);
  const [games, setGames] = useState<GameConfig[]>([
    {
      id: '1',
      name: 'Memory Game',
      enabled: true,
      entryFee: 1.99,
      prizePool: 50.00,
      maxPlayers: 100,
      status: 'active'
    },
    {
      id: '2',
      name: 'Word Search',
      enabled: true,
      entryFee: 2.49,
      prizePool: 75.00,
      maxPlayers: 150,
      status: 'active'
    },
    {
      id: '3',
      name: 'Sudoku',
      enabled: false,
      entryFee: 1.49,
      prizePool: 30.00,
      maxPlayers: 50,
      status: 'maintenance'
    },
    {
      id: '4',
      name: 'Trivia Challenge',
      enabled: true,
      entryFee: 3.99,
      prizePool: 100.00,
      maxPlayers: 200,
      status: 'active'
    },
    {
      id: '5',
      name: 'Block Puzzle Pro',
      enabled: true,
      entryFee: 2.99,
      prizePool: 80.00,
      maxPlayers: 120,
      status: 'active'
    },
    {
      id: '6',
      name: 'Daily Crossword',
      enabled: true,
      entryFee: 1.99,
      prizePool: 60.00,
      maxPlayers: 80,
      status: 'active'
    }
  ]);

  const handleToggleGame = (gameId: string) => {
    setGames(prev => prev.map(game => 
      game.id === gameId 
        ? { 
            ...game, 
            enabled: !game.enabled,
            status: !game.enabled ? 'active' : 'disabled'
          }
        : game
    ));
    
    const game = games.find(g => g.id === gameId);
    toast({
      title: `Game ${game?.enabled ? 'Disabled' : 'Enabled'}`,
      description: `${game?.name} has been ${game?.enabled ? 'disabled' : 'enabled'}`
    });
  };

  const handleSaveGame = (gameId: string, updates: Partial<GameConfig>) => {
    setGames(prev => prev.map(game => 
      game.id === gameId ? { ...game, ...updates } : game
    ));
    setEditingGame(null);
    
    toast({
      title: "Game Updated",
      description: "Game settings have been saved successfully"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'disabled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Game Control Panel</CardTitle>
          <CardDescription>
            Enable/disable games and adjust their settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {games.map((game) => (
              <GameControlRow
                key={game.id}
                game={game}
                isEditing={editingGame === game.id}
                onEdit={() => setEditingGame(game.id)}
                onCancel={() => setEditingGame(null)}
                onSave={(updates) => handleSaveGame(game.id, updates)}
                onToggle={() => handleToggleGame(game.id)}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface GameControlRowProps {
  game: GameConfig;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (updates: Partial<GameConfig>) => void;
  onToggle: () => void;
  getStatusColor: (status: string) => string;
}

function GameControlRow({ 
  game, 
  isEditing, 
  onEdit, 
  onCancel, 
  onSave, 
  onToggle, 
  getStatusColor 
}: GameControlRowProps) {
  const [formData, setFormData] = useState({
    entryFee: game.entryFee,
    prizePool: game.prizePool,
    maxPlayers: game.maxPlayers
  });

  const handleSave = () => {
    onSave(formData);
  };

  if (isEditing) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg">{game.name}</h3>
            <Badge className={`${getStatusColor(game.status)} text-white`}>
              {game.status}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`entry-fee-${game.id}`}>Entry Fee ($)</Label>
            <Input
              id={`entry-fee-${game.id}`}
              type="number"
              step="0.01"
              value={formData.entryFee}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                entryFee: parseFloat(e.target.value) || 0 
              }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`prize-pool-${game.id}`}>Prize Pool ($)</Label>
            <Input
              id={`prize-pool-${game.id}`}
              type="number"
              step="0.01"
              value={formData.prizePool}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                prizePool: parseFloat(e.target.value) || 0 
              }))}
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" onClick={onCancel} size="sm">
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h3 className="font-semibold text-lg">{game.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`${getStatusColor(game.status)} text-white`}>
              {game.status}
            </Badge>
            <span className="text-sm text-gray-600">
              Entry: ${game.entryFee} | Prize: ${game.prizePool}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Label htmlFor={`toggle-${game.id}`}>Enabled</Label>
          <Switch
            id={`toggle-${game.id}`}
            checked={game.enabled}
            onCheckedChange={onToggle}
          />
        </div>
        
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        
        <Button 
          variant={game.enabled ? "secondary" : "default"} 
          size="sm"
          onClick={onToggle}
        >
          {game.enabled ? (
            <>
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Start
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
