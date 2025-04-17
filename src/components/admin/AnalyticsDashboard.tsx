
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, BarChart2, LineChart, PieChart, 
  TrendingUp, TrendingDown, DollarSign, Users, Play
} from "lucide-react";

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Performance metrics and user engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">
                <BarChart2 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="revenue">
                <DollarSign className="h-4 w-4 mr-2" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="puzzles">
                <Play className="h-4 w-4 mr-2" />
                Puzzles
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-puzzle-aqua">1,248</p>
                      <span className="ml-2 flex items-center text-sm text-green-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        12%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">vs. last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">New Signups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-puzzle-aqua">286</p>
                      <span className="ml-2 flex items-center text-sm text-green-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        18%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">vs. last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Puzzles Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-puzzle-aqua">8,392</p>
                      <span className="ml-2 flex items-center text-sm text-green-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        24%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">vs. last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold text-puzzle-aqua">$34,219</p>
                      <span className="ml-2 flex items-center text-sm text-red-500">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        8%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">vs. last month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Category</CardTitle>
                    <CardDescription>Top 5 categories by revenue</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart className="h-10 w-10 mx-auto mb-2 opacity-25" />
                      <p>Chart data will be populated here</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>User Activity</CardTitle>
                    <CardDescription>Daily active users over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <LineChart className="h-10 w-10 mx-auto mb-2 opacity-25" />
                      <p>Chart data will be populated here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-puzzle-aqua">15,482</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Active Players</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-puzzle-aqua">8,249</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-puzzle-aqua">23.4%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Retention Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-puzzle-aqua">76.8%</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                  <CardDescription>User distribution by country and age</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="h-10 w-10 mx-auto mb-2 opacity-25" />
                    <p>Chart data will be populated here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-puzzle-aqua">$128,495</p>
                    <p className="text-sm text-muted-foreground">Year to date</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Avg. Revenue Per User</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-puzzle-aqua">$8.29</p>
                    <p className="text-sm text-muted-foreground">Year to date</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Credit Purchases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-puzzle-aqua">42,183</p>
                    <p className="text-sm text-muted-foreground">Year to date</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>By category and credit package</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="h-10 w-10 mx-auto mb-2 opacity-25" />
                    <p>Chart data will be populated here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="puzzles" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Active Puzzles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-puzzle-aqua">24</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Avg. Completion Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-puzzle-aqua">7:42</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-puzzle-aqua">68.3%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Prize Redemption</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-puzzle-aqua">92.7%</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Most Popular Puzzles</CardTitle>
                    <CardDescription>By number of completions</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart className="h-10 w-10 mx-auto mb-2 opacity-25" />
                      <p>Chart data will be populated here</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Puzzle Difficulty Analysis</CardTitle>
                    <CardDescription>Correlation between difficulty and engagement</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <LineChart className="h-10 w-10 mx-auto mb-2 opacity-25" />
                      <p>Chart data will be populated here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
