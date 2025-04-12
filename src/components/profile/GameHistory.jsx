
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Clock, Medal, Award, TrendingUp, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

/**
 * Component that displays the user's game history and statistics
 */
const GameHistory = ({ user, profile }) => {
  const [activeTab, setActiveTab] = useState("recent");
  
  // Placeholder data - would be fetched from backend in a real implementation
  const recentGames = [];
  const personalRecords = [];
  const achievements = [];
  const incompleteGames = [];
  
  const renderEmptyState = (title, icon) => (
    <div className="py-8 text-center">
      {React.createElement(icon, { className: "h-12 w-12 text-puzzle-aqua/40 mx-auto mb-3" })}
      <p className="text-muted-foreground">{title}</p>
      <Button className="mt-4 bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/80">
        Play Your First Puzzle
      </Button>
    </div>
  );
  
  return (
    <Card className="bg-puzzle-black border-puzzle-aqua/30">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center">
          <Clock className="mr-2 h-5 w-5 text-puzzle-aqua" />
          Game History
        </CardTitle>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 bg-puzzle-black border border-puzzle-aqua/30">
            <TabsTrigger value="recent" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
              Recent
            </TabsTrigger>
            <TabsTrigger value="records" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
              Records
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="incomplete" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
              Incomplete
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="recent" className="mt-0">
          {recentGames.length > 0 ? (
            <div className="space-y-4">
              {recentGames.map((game, index) => (
                <div key={index} className="flex justify-between items-center p-3 border border-puzzle-aqua/20 rounded-md">
                  <div>Game data would appear here</div>
                </div>
              ))}
            </div>
          ) : renderEmptyState("No recent games found", Clock)}
        </TabsContent>
        
        <TabsContent value="records" className="mt-0">
          {personalRecords.length > 0 ? (
            <div className="space-y-4">
              {personalRecords.map((record, index) => (
                <div key={index} className="flex justify-between items-center p-3 border border-puzzle-aqua/20 rounded-md">
                  <div>Records data would appear here</div>
                </div>
              ))}
            </div>
          ) : renderEmptyState("No personal records yet", Medal)}
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-0">
          {achievements.length > 0 ? (
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex justify-between items-center p-3 border border-puzzle-aqua/20 rounded-md">
                  <div>Achievement data would appear here</div>
                </div>
              ))}
            </div>
          ) : renderEmptyState("No achievements earned yet", Award)}
        </TabsContent>
        
        <TabsContent value="incomplete" className="mt-0">
          {incompleteGames.length > 0 ? (
            <div className="space-y-4">
              {incompleteGames.map((game, index) => (
                <div key={index} className="flex justify-between items-center p-3 border border-puzzle-aqua/20 rounded-md">
                  <div>Incomplete game data would appear here</div>
                </div>
              ))}
            </div>
          ) : renderEmptyState("No incomplete puzzles", PlayCircle)}
        </TabsContent>
        
        <div className="mt-6 pt-4 border-t border-puzzle-aqua/20">
          <h3 className="text-sm font-semibold mb-3 flex items-center text-puzzle-white">
            <TrendingUp className="h-4 w-4 text-puzzle-gold mr-2" />
            Your Progress
          </h3>
          
          <div className="h-40 bg-puzzle-black/50 rounded p-4 border border-puzzle-aqua/20 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Progress tracking and visualizations will appear here as you complete puzzles
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameHistory;
