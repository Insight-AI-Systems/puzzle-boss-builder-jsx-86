
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProgressItem } from '@/hooks/useProgressItems';

interface ProgressSummaryProps {
  items: ProgressItem[];
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({ items }) => {
  // Calculate total items and items by status
  const totalItems = items.length;
  const completedItems = items.filter(item => item.status === 'completed').length;
  const inProgressItems = items.filter(item => item.status === 'in_progress').length;
  const pendingItems = items.filter(item => item.status === 'pending').length;
  
  // Calculate completion percentage
  const completionPercentage = totalItems > 0 
    ? Math.round((completedItems / totalItems) * 100) 
    : 0;
  
  // Calculate items by priority
  const highPriorityItems = items.filter(item => item.priority === 'high').length;
  const mediumPriorityItems = items.filter(item => item.priority === 'medium').length;
  const lowPriorityItems = items.filter(item => item.priority === 'low').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-puzzle-aqua">{completionPercentage}%</h3>
              <p className="text-puzzle-white">Project Completion</p>
              <Progress 
                className="mt-2 bg-puzzle-black border border-puzzle-aqua/30" 
                value={completionPercentage} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <h3 className="text-2xl font-bold text-green-500">{completedItems}</h3>
                  <p className="text-puzzle-white text-sm">Completed</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-500">{inProgressItems}</h3>
                  <p className="text-puzzle-white text-sm">In Progress</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-yellow-500">{pendingItems}</h3>
                  <p className="text-puzzle-white text-sm">Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <h3 className="text-2xl font-bold text-red-500">{highPriorityItems}</h3>
                  <p className="text-puzzle-white text-sm">High Priority</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-yellow-500">{mediumPriorityItems}</h3>
                  <p className="text-puzzle-white text-sm">Medium</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-500">{lowPriorityItems}</h3>
                  <p className="text-puzzle-white text-sm">Low</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
