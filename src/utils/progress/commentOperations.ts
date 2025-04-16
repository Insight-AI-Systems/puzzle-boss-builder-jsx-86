
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const addCommentToItem = async (content: string, itemId: string) => {
  try {
    const { data, error } = await supabase
      .from('progress_comments')
      .insert({ 
        content, 
        progress_item_id: itemId 
      })
      .select();

    if (error) {
      console.error('Error adding comment:', error);
      toast({
        variant: "destructive",
        title: "Error adding comment",
        description: error.message,
      });
      return false;
    }

    console.log('Comment added successfully:', data);
    return true;
  } catch (error) {
    console.error('Unexpected error adding comment:', error);
    toast({
      variant: "destructive",
      title: "Error adding comment",
      description: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    return false;
  }
};
