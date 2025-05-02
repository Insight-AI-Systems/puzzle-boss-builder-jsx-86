
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SEOAnalytics: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">SEO Performance</h3>
        <Select defaultValue="30days">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="year">This year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">14,283</div>
              <div className="text-sm text-muted-foreground mt-1">Organic Traffic</div>
              <div className="text-xs text-green-600 mt-1">+18% from last month</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">243</div>
              <div className="text-sm text-muted-foreground mt-1">Keywords Ranking</div>
              <div className="text-xs text-green-600 mt-1">+32 from last month</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">3.8%</div>
              <div className="text-sm text-muted-foreground mt-1">Conversion Rate</div>
              <div className="text-xs text-green-600 mt-1">+0.5% from last month</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Top Performing Keywords</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-left text-muted-foreground border-b">
                  <th className="pb-2 font-medium">Keyword</th>
                  <th className="pb-2 font-medium">Position</th>
                  <th className="pb-2 font-medium">Traffic</th>
                  <th className="pb-2 font-medium">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="text-sm">
                  <td className="py-2">online puzzles</td>
                  <td className="py-2">3</td>
                  <td className="py-2">2,457</td>
                  <td className="py-2 text-green-600">▲ 1</td>
                </tr>
                <tr className="text-sm">
                  <td className="py-2">puzzle games with prizes</td>
                  <td className="py-2">1</td>
                  <td className="py-2">1,832</td>
                  <td className="py-2 text-green-600">▲ 2</td>
                </tr>
                <tr className="text-sm">
                  <td className="py-2">puzzle rewards</td>
                  <td className="py-2">4</td>
                  <td className="py-2">1,254</td>
                  <td className="py-2 text-gray-500">-</td>
                </tr>
                <tr className="text-sm">
                  <td className="py-2">jigsaw puzzles online</td>
                  <td className="py-2">8</td>
                  <td className="py-2">943</td>
                  <td className="py-2 text-red-600">▼ 2</td>
                </tr>
                <tr className="text-sm">
                  <td className="py-2">puzzle competitions</td>
                  <td className="py-2">5</td>
                  <td className="py-2">867</td>
                  <td className="py-2 text-green-600">▲ 3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Page Speed Insights</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Mobile Performance</div>
                <div className="font-medium">72/100</div>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-yellow-500" style={{ width: "72%" }}></div>
              </div>
              <div className="mt-1 text-xs text-yellow-600">Needs Improvement</div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Desktop Performance</div>
                <div className="font-medium">86/100</div>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-green-500" style={{ width: "86%" }}></div>
              </div>
              <div className="mt-1 text-xs text-green-600">Good</div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Largest Contentful Paint</div>
                <div className="font-medium">2.8s</div>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-green-500" style={{ width: "75%" }}></div>
              </div>
              <div className="mt-1 text-xs text-green-600">Good</div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>First Input Delay</div>
                <div className="font-medium">65ms</div>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-green-500" style={{ width: "90%" }}></div>
              </div>
              <div className="mt-1 text-xs text-green-600">Good</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
