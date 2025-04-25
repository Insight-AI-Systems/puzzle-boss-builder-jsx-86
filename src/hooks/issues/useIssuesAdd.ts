
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { IssueType, mapFrontendStatusToDb } from "@/types/issueTypes";
import { supabase } from "@/integrations/supabase/client";

export const useIssuesAdd = (onIssueAdded: () => Promise<void>) => {
  const { toast } = useToast();

  const addIssue = useCallback(async (newIssue: IssueType): Promise<boolean> => {
    try {
      const dbStatus = mapFrontendStatusToDb(newIssue.status);
      
      const insertData = {
        id: newIssue.id,
        title: newIssue.title,
        description: newIssue.description,
        status: dbStatus,
        category: newIssue.category,
        workaround: newIssue.workaround || null,
        created_by: newIssue.created_by || null,
        modified_by: newIssue.modified_by || null,
        created_at: newIssue.created_at || new Date().toISOString(),
        updated_at: newIssue.updated_at || new Date().toISOString()
      };

      const { error } = await supabase
        .from('issues')
        .insert(insertData)
        .select();

      if (error) {
        console.error("Error adding issue:", error);
        toast({
          title: "Add Failed",
          description: `Could not add the issue: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }

      await onIssueAdded();
      
      toast({
        title: "Issue Added",
        description: `Successfully added issue: ${newIssue.title}`,
      });
      
      return true;
    } catch (err) {
      console.error("Error adding issue:", err);
      toast({
        title: "Add Failed",
        description: "An unexpected error occurred while adding the issue.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, onIssueAdded]);

  return { addIssue };
};
