
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const updateItemStatus = async (itemId: string, status: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to update task status",
      });
      return false;
    }

    const { error } = await supabase
      .from('progress_items')
      .update({ 
        status, 
        updated_at: new Date().toISOString(),
        last_edited_by: user.id 
      })
      .eq('id', itemId);

    if (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: error.message,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating status:', error);
    toast({
      variant: "destructive",
      title: "Error updating status",
      description: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    return false;
  }
};

export const updateItemPriority = async (itemId: string, priority: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to update task priority",
      });
      return false;
    }

    const { error } = await supabase
      .from('progress_items')
      .update({ 
        priority, 
        updated_at: new Date().toISOString(),
        last_edited_by: user.id 
      })
      .eq('id', itemId);

    if (error) {
      console.error('Error updating priority:', error);
      toast({
        variant: "destructive",
        title: "Error updating priority",
        description: error.message,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating priority:', error);
    toast({
      variant: "destructive",
      title: "Error updating priority",
      description: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    return false;
  }
};

