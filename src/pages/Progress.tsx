
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-game text-puzzle-aqua mb-8">Loading progress...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puzzle-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-game text-puzzle-aqua mb-8">Project Progress Tracker</h1>
        
        {items?.map((item) => (
          <Card key={item.id} className="bg-puzzle-black/50 border-puzzle-aqua/20">
            <CardHeader>
              <CardTitle className="text-puzzle-white flex items-center justify-between">
                <span>{item.title}</span>
                <span className="text-sm font-normal">
                  {item.status === 'completed' ? '✅' : '⏳'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-game text-puzzle-gold">Status</h3>
                <p className="text-puzzle-white/80">
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  {item.priority !== 'medium' && ` (${item.priority} priority)`}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-game text-puzzle-gold">Comments</h3>
                <div className="space-y-4">
                  {item.progress_comments?.length > 0 ? (
                    item.progress_comments.map((comment) => (
                      <div key={comment.id} className="bg-puzzle-black/30 p-4 rounded-lg border border-puzzle-aqua/10">
                        <p className="text-puzzle-white/80">{comment.content}</p>
                        <p className="text-sm text-puzzle-white/40 mt-2">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-puzzle-black/30 p-4 rounded-lg border border-puzzle-aqua/10">
                      <p className="text-sm text-puzzle-white/60">No comments yet</p>
                    </div>
                  )}
                  
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Progress;
