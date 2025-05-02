
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDaysIcon, PencilIcon, ClockIcon, ListTodo, BarChartBig } from "lucide-react";

export const ContentCalendar: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Calendar</CardTitle>
          <CardDescription>Plan and organize your content strategy</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="calendar">
                <CalendarDaysIcon className="h-4 w-4 mr-2" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="planner">
                <PencilIcon className="h-4 w-4 mr-2" />
                Content Planner
              </TabsTrigger>
              <TabsTrigger value="workflow">
                <ListTodo className="h-4 w-4 mr-2" />
                Workflow
              </TabsTrigger>
              <TabsTrigger value="performance">
                <BarChartBig className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">May 2025</h3>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                  <Button size="sm">+ New Content</Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-7 text-center">
                    <div className="p-2 border-b font-medium">Sun</div>
                    <div className="p-2 border-b font-medium">Mon</div>
                    <div className="p-2 border-b font-medium">Tue</div>
                    <div className="p-2 border-b font-medium">Wed</div>
                    <div className="p-2 border-b font-medium">Thu</div>
                    <div className="p-2 border-b font-medium">Fri</div>
                    <div className="p-2 border-b font-medium">Sat</div>
                    
                    {/* First row */}
                    <div className="h-24 p-1 border-r border-b bg-gray-50 text-gray-400">28</div>
                    <div className="h-24 p-1 border-r border-b bg-gray-50 text-gray-400">29</div>
                    <div className="h-24 p-1 border-r border-b bg-gray-50 text-gray-400">30</div>
                    <div className="h-24 p-1 border-r border-b bg-gray-50 text-gray-400">1</div>
                    <div className="h-24 p-1 border-r border-b">
                      <div className="text-left">2</div>
                      <div className="mt-1 text-xs bg-blue-100 text-blue-700 p-1 rounded">Blog Post: Tips & Tricks</div>
                    </div>
                    <div className="h-24 p-1 border-r border-b">3</div>
                    <div className="h-24 p-1 border-b">4</div>
                    
                    {/* Second row */}
                    <div className="h-24 p-1 border-r border-b">5</div>
                    <div className="h-24 p-1 border-r border-b">6</div>
                    <div className="h-24 p-1 border-r border-b">7</div>
                    <div className="h-24 p-1 border-r border-b">8</div>
                    <div className="h-24 p-1 border-r border-b">9</div>
                    <div className="h-24 p-1 border-r border-b">
                      <div className="text-left">10</div>
                      <div className="mt-1 text-xs bg-green-100 text-green-700 p-1 rounded">Newsletter</div>
                    </div>
                    <div className="h-24 p-1 border-b">11</div>
                    
                    {/* Third row */}
                    <div className="h-24 p-1 border-r border-b">12</div>
                    <div className="h-24 p-1 border-r border-b">13</div>
                    <div className="h-24 p-1 border-r border-b">
                      <div className="text-left">14</div>
                      <div className="mt-1 text-xs bg-purple-100 text-purple-700 p-1 rounded">Product Launch</div>
                    </div>
                    <div className="h-24 p-1 border-r border-b">15</div>
                    <div className="h-24 p-1 border-r border-b">16</div>
                    <div className="h-24 p-1 border-r border-b">17</div>
                    <div className="h-24 p-1 border-b">18</div>
                    
                    {/* Fourth row */}
                    <div className="h-24 p-1 border-r border-b">19</div>
                    <div className="h-24 p-1 border-r border-b">20</div>
                    <div className="h-24 p-1 border-r border-b">21</div>
                    <div className="h-24 p-1 border-r border-b">22</div>
                    <div className="h-24 p-1 border-r border-b">
                      <div className="text-left">23</div>
                      <div className="mt-1 text-xs bg-yellow-100 text-yellow-700 p-1 rounded">SEO Update</div>
                    </div>
                    <div className="h-24 p-1 border-r border-b">24</div>
                    <div className="h-24 p-1 border-b">25</div>
                    
                    {/* Fifth row */}
                    <div className="h-24 p-1 border-r">26</div>
                    <div className="h-24 p-1 border-r">
                      <div className="text-left">27</div>
                      <div className="mt-1 text-xs bg-green-100 text-green-700 p-1 rounded">Newsletter</div>
                    </div>
                    <div className="h-24 p-1 border-r">28</div>
                    <div className="h-24 p-1 border-r">29</div>
                    <div className="h-24 p-1 border-r">
                      <div className="text-left">30</div>
                      <div className="mt-1 text-xs bg-blue-100 text-blue-700 p-1 rounded">Blog Post</div>
                    </div>
                    <div className="h-24 p-1 border-r">31</div>
                    <div className="h-24 p-1">1</div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-500">
                      <PencilIcon className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-2xl font-bold">8</div>
                      <div className="text-xs text-muted-foreground">Blog Posts</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-500">
                      <ClockIcon className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-2xl font-bold">2</div>
                      <div className="text-xs text-muted-foreground">Newsletters</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-500">
                      <BarChartBig className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-xs text-muted-foreground">Campaigns</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-500">
                      <ListTodo className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-xs text-muted-foreground">In Progress</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="planner">
              <p className="text-center py-8">Content planner implementation in progress</p>
            </TabsContent>

            <TabsContent value="workflow">
              <p className="text-center py-8">Workflow implementation in progress</p>
            </TabsContent>

            <TabsContent value="performance">
              <p className="text-center py-8">Performance metrics implementation in progress</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
