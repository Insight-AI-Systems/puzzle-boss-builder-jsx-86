
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, MessageSquare, AlertCircle } from "lucide-react";

export const BrandMonitoring: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand Monitoring</CardTitle>
          <CardDescription>Track and manage your brand mentions across the web</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mentions" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="mentions">
                <MessageSquare className="h-4 w-4 mr-2" />
                Brand Mentions
              </TabsTrigger>
              <TabsTrigger value="trends">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="alerts">
                <AlertCircle className="h-4 w-4 mr-2" />
                Alerts
              </TabsTrigger>
              <TabsTrigger value="settings">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mentions" className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Search mentions..."
                  className="max-w-sm"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Brand Mentions</CardTitle>
                  <CardDescription>Recent mentions of your brand across the web</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Twitter</div>
                          <div className="text-sm text-muted-foreground">May 1, 2025</div>
                        </div>
                        <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                          Positive
                        </div>
                      </div>
                      <p className="mt-2 text-sm">
                        "Just completed another puzzle from @PuzzleBoss and wow, the quality is amazing! Definitely going to order more."
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span>by @puzzlelover223 • 2.4k impressions</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Reply</Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Reddit</div>
                          <div className="text-sm text-muted-foreground">April 29, 2025</div>
                        </div>
                        <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          Very Positive
                        </div>
                      </div>
                      <p className="mt-2 text-sm">
                        "I've tried many puzzle brands but Puzzle Boss has to be the best so far. The prize system is genius and keeps me coming back for more!"
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span>by u/puzzlemaster42 • 156 upvotes</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Reply</Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Product Review Blog</div>
                          <div className="text-sm text-muted-foreground">April 27, 2025</div>
                        </div>
                        <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                          Neutral
                        </div>
                      </div>
                      <p className="mt-2 text-sm">
                        "Puzzle Boss offers an interesting take on the traditional puzzle experience with their rewards system. While the puzzles themselves are good quality, shipping times could be improved."
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span>by PuzzleReviewer.com • 1.2k reads</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Contact</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-sm text-muted-foreground">Total Mentions</div>
                    <div className="text-xs text-green-600 mt-1">+12% from last month</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">78%</div>
                    <div className="text-sm text-muted-foreground">Positive Sentiment</div>
                    <div className="text-xs text-green-600 mt-1">+5% from last month</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">3.2k</div>
                    <div className="text-sm text-muted-foreground">Total Reach</div>
                    <div className="text-xs text-green-600 mt-1">+18% from last month</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <p className="text-center py-8">Trends analysis implementation in progress</p>
            </TabsContent>

            <TabsContent value="alerts">
              <p className="text-center py-8">Alerts management implementation in progress</p>
            </TabsContent>

            <TabsContent value="settings">
              <p className="text-center py-8">Settings configuration implementation in progress</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
