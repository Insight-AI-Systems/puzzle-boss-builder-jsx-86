
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const recentActivity = [
  { id: 1, action: 'Completed puzzle', name: 'Ocean Treasures', date: '2 hours ago', reward: '+5 credits' },
  { id: 2, action: 'Friend joined', name: 'User184290', date: '1 day ago', reward: '+10 credits' },
  { id: 3, action: 'Subscription renewed', name: 'Premium Plan', date: '5 days ago', reward: '' },
  { id: 4, action: 'Won competition', name: 'Weekly Challenge', date: '1 week ago', reward: 'Prize Pending' },
];

export const RecentActivity = () => {
  return (
    <Card className="border-puzzle-aqua/30 bg-puzzle-black/50">
      <CardHeader>
        <CardTitle className="text-puzzle-white">Recent Activity</CardTitle>
        <CardDescription>Your puzzle solving and membership activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div 
              key={activity.id} 
              className="flex justify-between items-center p-3 border-b border-puzzle-aqua/10 last:border-0"
            >
              <div className="flex flex-col">
                <span className="text-puzzle-white font-medium">{activity.action}</span>
                <span className="text-sm text-puzzle-white/70">{activity.name}</span>
                <span className="text-xs text-puzzle-white/50">{activity.date}</span>
              </div>
              {activity.reward && (
                <span className="text-puzzle-gold font-medium">{activity.reward}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full border-puzzle-aqua/50 hover:bg-puzzle-aqua/10">
          View All Activity
        </Button>
      </CardFooter>
    </Card>
  );
};
