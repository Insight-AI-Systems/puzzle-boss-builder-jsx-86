
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const MarketingAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marketing Analytics</CardTitle>
          <CardDescription>Analyze and optimize your marketing performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="conversions">Conversions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="flex items-center justify-between">
                <Select defaultValue="30days">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="year">This year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">Export Data</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold">52,439</div>
                      <div className="text-sm text-muted-foreground mt-1">Total Website Visitors</div>
                      <div className="text-xs text-green-600 mt-1">+24% from last month</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold">4.2%</div>
                      <div className="text-sm text-muted-foreground mt-1">Conversion Rate</div>
                      <div className="text-xs text-green-600 mt-1">+0.8% from last month</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold">$3.24</div>
                      <div className="text-sm text-muted-foreground mt-1">Customer Acquisition Cost</div>
                      <div className="text-xs text-green-600 mt-1">-$0.45 from last month</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Traffic Channels</CardTitle>
                  <CardDescription>Performance by traffic source</CardDescription>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div>Organic Search</div>
                        <div className="font-medium">42%</div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: "42%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div>Direct</div>
                        <div className="font-medium">28%</div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: "28%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div>Social Media</div>
                        <div className="font-medium">15%</div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-purple-500" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div>Referral</div>
                        <div className="font-medium">10%</div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div>Paid Search</div>
                        <div className="font-medium">5%</div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-red-500" style={{ width: "5%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Top Landing Pages</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm py-2 border-b">
                        <div>/puzzles</div>
                        <div className="font-medium">12,458 visits</div>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-b">
                        <div>/prizes-won</div>
                        <div className="font-medium">8,327 visits</div>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-b">
                        <div>/how-it-works</div>
                        <div className="font-medium">6,912 visits</div>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-b">
                        <div>/about</div>
                        <div className="font-medium">4,583 visits</div>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <div>/contact</div>
                        <div className="font-medium">3,271 visits</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Device Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm py-2 border-b">
                        <div>Mobile</div>
                        <div className="font-medium">68% (35,658 sessions)</div>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-b">
                        <div>Desktop</div>
                        <div className="font-medium">24% (12,585 sessions)</div>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-b">
                        <div>Tablet</div>
                        <div className="font-medium">7% (3,671 sessions)</div>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <div>Other</div>
                        <div className="font-medium">1% (525 sessions)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="campaigns">
              <p className="text-center py-8">Campaigns analytics implementation in progress</p>
            </TabsContent>

            <TabsContent value="channels">
              <p className="text-center py-8">Channels analytics implementation in progress</p>
            </TabsContent>

            <TabsContent value="conversions">
              <p className="text-center py-8">Conversion analytics implementation in progress</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
