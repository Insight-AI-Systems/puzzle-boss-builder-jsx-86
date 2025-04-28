import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import ReactJigsawPuzzleEngine from './engines/ReactJigsawPuzzleEngine';
import CustomPuzzleEngine from './engines/CustomPuzzleEngine';
import SVGJigsawPuzzle from './engines/SVGJigsawPuzzle';

// Sample images for testing
const TEST_IMAGES = [
  '/images/puzzle-test-1.jpg',
  '/images/puzzle-test-2.jpg',
  '/images/puzzle-test-3.jpg',
  'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
  'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1'
];

const PuzzleEnginePlayground = () => {
  const [selectedEngine, setSelectedEngine] = useState('custom');
  const [selectedImage, setSelectedImage] = useState(TEST_IMAGES[0]);
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [showNumbers, setShowNumbers] = useState(true);

  const form = useForm<{ showNumbers: boolean }>({
    defaultValues: {
      showNumbers: true,
    },
  });

  const handleDifficultyChange = (newRows: number, newColumns: number) => {
    setRows(newRows);
    setColumns(newColumns);
  };

  const handleImageSelect = (img: string) => {
    setSelectedImage(img);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Puzzle Engine Playground</h1>
        <p className="text-muted-foreground">
          Test different puzzle engines with various configurations.
        </p>

        {/* Engine selection */}
        <div className="flex flex-wrap gap-4">
          <Card className={`cursor-pointer transition-all ${selectedEngine === 'legacy' ? 'ring-2 ring-puzzle-aqua' : 'opacity-70'}`}
            onClick={() => setSelectedEngine('legacy')}>
            <CardHeader>
              <CardTitle>Legacy Jigsaw Puzzle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">The original jigsaw puzzle.</p>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer transition-all ${selectedEngine === 'custom' ? 'ring-2 ring-puzzle-aqua' : 'opacity-70'}`}
            onClick={() => setSelectedEngine('custom')}>
            <CardHeader>
              <CardTitle>Puzzle Boss Jigsaw Puzzle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Custom implementation with advanced features.</p>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer transition-all ${selectedEngine === 'svg-jigsaw' ? 'ring-2 ring-puzzle-aqua' : 'opacity-70'}`}
            onClick={() => setSelectedEngine('svg-jigsaw')}>
            <CardHeader>
              <CardTitle>SVG Jigsaw Puzzle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">SVG-based jigsaw with realistic piece shapes.</p>
            </CardContent>
          </Card>
        </div>

        {/* Configuration options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Difficulty</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={cn(
                  "border rounded-md p-2 text-sm transition-colors hover:bg-secondary hover:text-secondary-foreground",
                  rows === 3 && columns === 3 ? "bg-muted" : "bg-background"
                )}
                onClick={() => handleDifficultyChange(3, 3)}
              >
                Easy (3x3)
              </button>
              <button
                className={cn(
                  "border rounded-md p-2 text-sm transition-colors hover:bg-secondary hover:text-secondary-foreground",
                  rows === 4 && columns === 4 ? "bg-muted" : "bg-background"
                )}
                onClick={() => handleDifficultyChange(4, 4)}
              >
                Medium (4x4)
              </button>
              <button
                className={cn(
                  "border rounded-md p-2 text-sm transition-colors hover:bg-secondary hover:text-secondary-foreground",
                  rows === 5 && columns === 5 ? "bg-muted" : "bg-background"
                )}
                onClick={() => handleDifficultyChange(5, 5)}
              >
                Hard (5x5)
              </button>
              <button
                className={cn(
                  "border rounded-md p-2 text-sm transition-colors hover:bg-secondary hover:text-secondary-foreground",
                  rows === 6 && columns === 6 ? "bg-muted" : "bg-background"
                )}
                onClick={() => handleDifficultyChange(6, 6)}
              >
                Expert (6x6)
              </button>
            </div>

            <FormField
              control={form.control}
              name="showNumbers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Show Numbers</FormLabel>
                    <FormDescription>Display numbers on puzzle pieces</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Puzzle Image</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {TEST_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  className={`cursor-pointer rounded-md overflow-hidden border-2 aspect-square ${selectedImage === img ? 'border-puzzle-aqua' : 'border-transparent'}`}
                  onClick={() => handleImageSelect(img)}
                >
                  <img 
                    src={img} 
                    alt={`Test image ${idx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />
      
      {/* Puzzle Engine Render */}
      <div className="py-4">
        <h2 className="text-2xl font-bold mb-6">
          {selectedEngine === 'legacy' && 'Legacy Jigsaw Puzzle'}
          {selectedEngine === 'custom' && 'Puzzle Boss Jigsaw Puzzle'}
          {selectedEngine === 'svg-jigsaw' && 'SVG Jigsaw Puzzle'}
        </h2>
        
        {selectedEngine === 'legacy' && (
          <ReactJigsawPuzzleEngine 
            imageUrl={selectedImage} 
            rows={rows} 
            columns={columns} 
          />
        )}
        
        {selectedEngine === 'custom' && (
          <CustomPuzzleEngine 
            imageUrl={selectedImage} 
            rows={rows} 
            columns={columns} 
            showNumbers={form.watch("showNumbers")}
          />
        )}

        {selectedEngine === 'svg-jigsaw' && (
          <SVGJigsawPuzzle
            imageUrl={selectedImage} 
            rows={rows} 
            columns={columns} 
            showNumbers={form.watch("showNumbers")}
          />
        )}
      </div>
    </div>
  );
};

export default PuzzleEnginePlayground;
