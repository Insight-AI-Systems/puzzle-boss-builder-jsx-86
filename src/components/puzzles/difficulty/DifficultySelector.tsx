import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Grid3X3, DollarSign } from 'lucide-react';

interface DifficultyLevel {
  id: string;
  name: string;
  pieces: number;
  gridSize: string;
  timeEstimate: string;
  price: number;
  description: string;
}

interface DifficultySelectorProps {
  difficulties: DifficultyLevel[];
  selectedDifficulty: string;
  onSelect: (difficultyId: string) => void;
  showPricing?: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulties,
  selectedDifficulty,
  onSelect,
  showPricing = true
}) => {
  const getDifficultyColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'easy': return 'bg-green-400/20 text-green-400 border-green-400/30';
      case 'medium': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'hard': return 'bg-red-400/20 text-red-400 border-red-400/30';
      case 'expert': return 'bg-purple-400/20 text-purple-400 border-purple-400/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Grid3X3 className="h-5 w-5 text-puzzle-aqua" />
          Choose Difficulty
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedDifficulty} onValueChange={onSelect}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {difficulties.map((difficulty) => (
              <div key={difficulty.id} className="relative">
                <Label
                  htmlFor={difficulty.id}
                  className={`cursor-pointer block p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedDifficulty === difficulty.id
                      ? 'border-puzzle-aqua bg-puzzle-aqua/10'
                      : 'border-muted hover:border-puzzle-aqua/50 hover:bg-muted/20'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(difficulty.name)}>
                        {difficulty.name}
                      </Badge>
                      <RadioGroupItem
                        value={difficulty.id}
                        id={difficulty.id}
                        className="border-puzzle-aqua"
                      />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-puzzle-white">
                        {difficulty.pieces} Pieces
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {difficulty.gridSize}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{difficulty.timeEstimate}</span>
                      </div>
                      
                      {showPricing && (
                        <div className="flex items-center gap-1 text-xs text-puzzle-gold">
                          <DollarSign className="h-3 w-3" />
                          <span>{difficulty.price}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {difficulty.description}
                    </p>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};