import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageLibrarySelector } from '@/components/admin/puzzle-manager/ImageLibrarySelector';
import { BasicJigsawPuzzle } from '@/components/games/jigsaw/BasicJigsawPuzzle';
import { Puzzle, Play, Image, Grid3x3, Grid2x2, Grid } from 'lucide-react';

interface GameOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route?: string;
  isJigsaw?: boolean;
  pieces?: number[];
}

const games: GameOption[] = [
  {
    id: 'jigsaw',
    name: 'Jigsaw Puzzles',
    description: 'Create and solve beautiful jigsaw puzzles with your own images',
    icon: <Puzzle className="h-8 w-8" />,
    isJigsaw: true,
    pieces: [20, 100, 500]
  },
  {
    id: 'memory',
    name: 'Memory Master',
    description: 'Test your memory skills with classic card matching',
    icon: <Grid2x2 className="h-8 w-8" />,
    route: '/games/memory'
  },
  {
    id: 'word-search',
    name: 'Word Search Arena',
    description: 'Find hidden words in challenging puzzles',
    icon: <Grid className="h-8 w-8" />,
    route: '/games/word-search'
  },
  {
    id: 'sudoku',
    name: 'Speed Sudoku',
    description: 'Solve number puzzles at lightning speed',
    icon: <Grid3x3 className="h-8 w-8" />,
    route: '/games/sudoku'
  }
];

export default function GamesDashboard() {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedPieces, setSelectedPieces] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGameSelect = (game: GameOption) => {
    if (game.route) {
      navigate(game.route);
    } else if (game.isJigsaw) {
      setSelectedGame(game.id);
    }
  };

  const handleImageSelect = (image: any) => {
    setSelectedImage(image);
  };

  const handleStartGame = () => {
    if (selectedImage) {
      setIsPlaying(true);
    }
  };

  const handleGameComplete = () => {
    setIsPlaying(false);
    console.log('🎉 Game completed!');
  };

  const handleBackToSelection = () => {
    setIsPlaying(false);
    setSelectedGame(null);
    setSelectedImage(null);
  };

  if (isPlaying && selectedImage) {
    return (
      <div className="w-full h-screen bg-gray-100">
        <BasicJigsawPuzzle
          imageUrl={selectedImage.metadata?.imageUrl || selectedImage.original_image_url || selectedImage.image_url}
          pieceCount={selectedPieces}
        />
      </div>
    );
  }

  if (selectedGame === 'jigsaw') {
    return (
      <PageLayout 
        title="Setup Jigsaw Puzzle" 
        subtitle="Choose your image and difficulty level"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <Button onClick={() => setSelectedGame(null)} variant="outline">
            Back to Games
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Select Image
                </CardTitle>
                <CardDescription>
                  Choose an image from the library or upload your own
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedImage ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={selectedImage.metadata?.imageUrl || selectedImage.original_image_url || selectedImage.image_url}
                        alt={selectedImage.name || 'Selected image'}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        onClick={() => setSelectedImage(null)}
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        Change
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedImage.name || 'Custom Image'}
                    </p>
                  </div>
                ) : (
                  <ImageLibrarySelector onImageSelect={handleImageSelect}>
                    <Button variant="outline" className="w-full h-32">
                      <div className="flex flex-col items-center gap-2">
                        <Image className="h-8 w-8" />
                        <span>Choose Image</span>
                      </div>
                    </Button>
                  </ImageLibrarySelector>
                )}
              </CardContent>
            </Card>

            {/* Difficulty Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Puzzle className="h-5 w-5" />
                  Difficulty Level
                </CardTitle>
                <CardDescription>
                  Choose the number of puzzle pieces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[20, 100, 500].map((pieces) => (
                    <Button
                      key={pieces}
                      onClick={() => setSelectedPieces(pieces)}
                      variant={selectedPieces === pieces ? "default" : "outline"}
                      className="w-full justify-between"
                    >
                      <span>{pieces} pieces</span>
                      <Badge variant="secondary">
                        {pieces === 20 ? 'Easy' : pieces === 100 ? 'Medium' : 'Hard'}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Start Game Button */}
          <div className="text-center">
            <Button
              onClick={handleStartGame}
              disabled={!selectedImage}
              size="lg"
              className="px-8"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Puzzle
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Games Dashboard" 
      subtitle="Choose a game to play or create your own puzzle"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card
              key={game.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleGameSelect(game)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {game.icon}
                    <CardTitle className="text-lg">{game.name}</CardTitle>
                  </div>
                  {game.isJigsaw && (
                    <Badge variant="outline">Custom Images</Badge>
                  )}
                </div>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Play Now
                </Button>
                {game.pieces && (
                  <div className="flex gap-1 mt-3">
                    {game.pieces.map((count) => (
                      <Badge key={count} variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}