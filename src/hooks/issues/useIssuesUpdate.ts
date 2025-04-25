
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { IssueType, mapFrontendStatusToDb } from "@/types/issueTypes";
import { supabase } from "@/integrations/supabase/client";

export const useIssuesUpdate = (onIssueUpdate: (issue: IssueType) => void) => {
  const { toast } = useToast();

  const updateIssue = useCallback(async (updatedIssue: IssueType): Promise<boolean> => {
    try {
      const dbStatus = mapFrontendStatusToDb(updatedIssue.status);
      
      const updateData = {
        title: updatedIssue.title,
        description: updatedIssue.description,
        status: dbStatus,
        category: updatedIssue.category,
        workaround: updatedIssue.workaround || null,
        modified_by: updatedIssue.modified_by || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('issues')
        .update(updateData)
        .eq('id', updatedIssue.id);

      if (error) {
        console.error("Error updating issue:", error);
        toast({
          title: "Update Failed",
          description: `Could not update the issue: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }

      onIssueUpdate(updatedIssue);
      
      toast({
        title: "Issue Updated",
        description: `Successfully changed status to ${updatedIssue.status}.`,
      });
      
      return true;
    } catch (err) {
      console.error("Error updating issue:", err);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred while updating.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, onIssueUpdate]);

  return { updateIssue };
};
