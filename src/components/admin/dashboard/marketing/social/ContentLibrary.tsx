
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Search, Image, Video, FileText, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

export const ContentLibrary: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Content Library</h3>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Content
        </Button>
      </div>
      
      <div className="flex gap-3">
        <Input 
          placeholder="Search content..."
          className="max-w-sm"
        />
        <Button variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      
      <Tabs defaultValue="images" className="w-full">
        <TabsList>
          <TabsTrigger value="images">
            <Image className="h-4 w-4 mr-2" />
            Images
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="captions">
            <FileText className="h-4 w-4 mr-2" />
            Captions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="aspect-square bg-gray-100 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  <Image className="h-6 w-6 text-gray-400 z-10" />
                </div>
                <CardContent className="p-3">
                  <div className="text-sm font-medium truncate">Image {item}.jpg</div>
                  <div className="text-xs text-muted-foreground">May {item}, 2025</div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="overflow-hidden border-dashed">
              <div className="aspect-square flex flex-col items-center justify-center p-4">
                <Plus className="h-10 w-10 text-gray-400 mb-2" />
                <div className="text-sm text-center text-muted-foreground">Upload New Image</div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="videos" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  <Video className="h-6 w-6 text-gray-400 z-10" />
                </div>
                <CardContent className="p-3">
                  <div className="text-sm font-medium truncate">Video {item}.mp4</div>
                  <div className="text-xs text-muted-foreground">May {item}, 2025</div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="overflow-hidden border-dashed">
              <div className="aspect-video flex flex-col items-center justify-center p-4">
                <Plus className="h-10 w-10 text-gray-400 mb-2" />
                <div className="text-sm text-center text-muted-foreground">Upload New Video</div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="captions" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">Caption Template #{item}</div>
                    <div className="text-xs text-muted-foreground">May {item}, 2025</div>
                  </div>
                  <p className="text-sm">
                    {item === 1 && "Check out our newest puzzle collection! Perfect for family game nights and weekend challenges. #PuzzleBoss #PuzzleFun"}
                    {item === 2 && "Stuck at home? Our puzzles are the perfect way to keep your mind engaged and have fun at the same time! #StayHomeAndPuzzle"}
                    {item === 3 && "Did you know puzzles help improve memory and cognitive function? Plus, they're super fun! Win-win with Puzzle Boss."}
                    {item === 4 && "Weekend vibes = coffee, comfy clothes, and a brand new puzzle from Puzzle Boss! What's on your weekend agenda?"}
                  </p>
                </CardContent>
              </Card>
            ))}
            
            <Card className="overflow-hidden border-dashed">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <Plus className="h-10 w-10 text-gray-400 mb-2" />
                <div className="text-sm text-center text-muted-foreground">Create New Caption Template</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
