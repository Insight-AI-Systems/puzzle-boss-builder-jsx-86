
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, ArrowRight } from "lucide-react";
import { ProgressItem } from '@/types/progressTypes';
import { Badge } from '@/components/ui/badge';

interface TaskSelectorProps {
  items: ProgressItem[];
}

export const TaskSelector: React.FC<TaskSelectorProps> = ({ items }) => {
  const pendingTasks = items.filter(item => item.status === 'pending');

  const copyToPrompt = (task: ProgressItem) => {
    const promptText = `Please help me implement this task:\n\nTitle: ${task.title}\n${task.description ? `Description: ${task.description}\n` : ''}Priority: ${task.priority}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(promptText).then(() => {
      // Create a temporary textarea to simulate pasting into the chat
      const textarea = document.createElement('textarea');
      textarea.value = promptText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      // Focus the chat input (this assumes the chat input has a specific class or id)
      const chatInput = document.querySelector('.chat-input') as HTMLTextAreaElement;
      if (chatInput) {
        chatInput.focus();
        // Simulate paste event
        document.execCommand('paste');
      }
    });
  };

  return (
    <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Clipboard className="h-5 w-5" />
          Select Task for Development
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingTasks.length === 0 ? (
            <p className="text-puzzle-white/70">No pending tasks available.</p>
          ) : (
            pendingTasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-4 rounded-lg border border-puzzle-aqua/20 bg-puzzle-black/30 hover:bg-puzzle-aqua/5 transition-colors"
              >
                <div className="space-y-1">
                  <h3 className="font-medium text-puzzle-white">{task.title}</h3>
                  <Badge className={
                    task.priority === 'high' ? 'bg-red-600' :
                    task.priority === 'medium' ? 'bg-amber-600' : 'bg-blue-600'
                  }>
                    {task.priority}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
                  onClick={() => copyToPrompt(task)}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Send to Prompt
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
