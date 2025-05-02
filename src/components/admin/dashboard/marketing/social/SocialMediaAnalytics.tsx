
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SocialMediaAnalytics: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Social Media Performance</h3>
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">Instagram</div>
              <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded">+5.2%</div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <div>Followers</div>
                <div>12.4K</div>
              </div>
              <div className="flex justify-between text-sm">
                <div>Engagement</div>
                <div>4.2%</div>
              </div>
              <div className="flex justify-between text-sm">
                <div>Impressions</div>
                <div>45.8K</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">Facebook</div>
              <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded">+3.8%</div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <div>Page Likes</div>
                <div>8.2K</div>
              </div>
              <div className="flex justify-between text-sm">
                <div>Engagement</div>
                <div>2.1%</div>
              </div>
              <div className="flex justify-between text-sm">
                <div>Reach</div>
                <div>32.6K</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">Twitter</div>
              <div className="text-xs bg-red-100 text-red-800 p-1 rounded">-1.2%</div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <div>Followers</div>
                <div>5.7K</div>
              </div>
              <div className="flex justify-between text-sm">
                <div>Engagement</div>
                <div>1.8%</div>
              </div>
              <div className="flex justify-between text-sm">
                <div>Impressions</div>
                <div>28.3K</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">YouTube</div>
              <div className="text-xs bg-green-100 text-green-800 p-1 rounded">+12.5%</div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <div>Subscribers</div>
                <div>4.2K</div>
              </div>
              <div className="flex justify-between text-sm">
                <div>Watch time</div>
                <div>124.3K min</div>
              </div>
              <div className="flex justify-between text-sm">
                <div>Views</div>
                <div>38.7K</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Performance by Post Type</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Images</div>
                <div>4.8% engagement</div>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: "85%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Videos</div>
                <div>6.2% engagement</div>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-green-500" style={{ width: "92%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Carousels</div>
                <div>5.1% engagement</div>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-purple-500" style={{ width: "88%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Text posts</div>
                <div>2.4% engagement</div>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-yellow-500" style={{ width: "45%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Links</div>
                <div>1.8% engagement</div>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-red-500" style={{ width: "32%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
