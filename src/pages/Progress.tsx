import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import { AddProgressItemDialog } from "@/components/AddProgressItemDialog";

const Progress = () => {
  const { data: items, isLoading } = useQuery({
    queryKey: ['progress-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress_items')
        .select(`
          *,
          progress_comments (
            *
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching progress items",
          description: error.message,
        });
        return [];
      }

      return data || [];
    },
  });

  const handleAddComment = async (content: string, itemId: string) => {
    const { error } = await supabase
      .from('progress_comments')
      .insert({ content, progress_item_id: itemId });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error adding comment",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Comment added",
      description: "Your comment has been added successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-game text-puzzle-aqua mb-8">Loading progress...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puzzle-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-game text-puzzle-aqua">Project Progress Tracker</h1>
          <AddProgressItemDialog />
        </div>
        
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
          <CardHeader>
            <CardTitle className="text-puzzle-white">Current Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-puzzle-aqua/20">
                  <TableHead className="text-puzzle-aqua">Task</TableHead>
                  <TableHead className="text-puzzle-aqua">Status</TableHead>
                  <TableHead className="text-puzzle-aqua">Priority</TableHead>
                  <TableHead className="text-puzzle-aqua">Last Updated</TableHead>
                  <TableHead className="text-puzzle-aqua">Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <React.Fragment key={item.id}>
                    <TableRow className="border-puzzle-aqua/20">
                      <TableCell className="text-puzzle-white font-medium">{item.title}</TableCell>
                      <TableCell className="text-puzzle-white">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${item.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                          {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-puzzle-white">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${item.priority === 'high' ? 'bg-red-100 text-red-800' : 
                          item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}>
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-puzzle-white">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-puzzle-aqua" />
                          {new Date(item.updated_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-puzzle-white">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-puzzle-aqua" />
                          {item.progress_comments?.length || 0}
                        </div>
                      </TableCell>
                    </TableRow>
                    {item.progress_comments && item.progress_comments.length > 0 && (
                      <TableRow className="bg-puzzle-black/30">
                        <TableCell colSpan={5} className="p-4">
                          <div className="space-y-4">
                            {item.progress_comments.map((comment) => (
                              <div key={comment.id} className="bg-puzzle-black/30 p-4 rounded-lg border border-puzzle-aqua/10">
                                <p className="text-puzzle-white/80">{comment.content}</p>
                                <div className="flex items-center gap-2 mt-2 text-sm text-puzzle-white/40">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                            <div className="space-y-2">
                              <Textarea 
                                placeholder="Add your comment or suggestion..."
                                className="bg-puzzle-black/30 border-puzzle-aqua/20 text-puzzle-white"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    const content = (e.target as HTMLTextAreaElement).value.trim();
                                    if (content) {
                                      handleAddComment(content, item.id);
                                      (e.target as HTMLTextAreaElement).value = '';
                                    }
                                  }
                                }}
                              />
                              <Button 
                                onClick={() => {
                                  const textarea = (document.activeElement as HTMLTextAreaElement);
                                  const content = textarea?.value?.trim();
                                  if (content) {
                                    handleAddComment(content, item.id);
                                    textarea.value = '';
                                  }
                                }}
                                className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90"
                              >
                                Add Comment
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
