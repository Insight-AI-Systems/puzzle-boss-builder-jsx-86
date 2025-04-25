
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { IssueType, mapFrontendStatusToDb } from "@/types/issueTypes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useIssuesAdd = (onIssueAdded: () => Promise<void>) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const addIssue = useCallback(async (newIssue: IssueType): Promise<boolean> => {
    try {
      console.log("Adding new issue:", newIssue);
      
      // Check if user is logged in, which is required for the created_by field
      if (!user) {
        console.error("Error adding issue: User not authenticated");
        toast({
          title: "Add Failed",
          description: "You must be logged in to add an issue.",
          variant: "destructive",
        });
        return false;
      }

      const dbStatus = mapFrontendStatusToDb(newIssue.status);
      
      const insertData = {
        id: newIssue.id,
        title: newIssue.title,
        description: newIssue.description,
        status: dbStatus,
        category: newIssue.category,
        workaround: newIssue.workaround || null,
        created_by: user.id, // Always use the current user's ID
        modified_by: user.id, // Also set the modified_by field
        created_at: newIssue.created_at || new Date().toISOString(),
        updated_at: newIssue.updated_at || new Date().toISOString()
      };

      console.log("Insert data prepared:", insertData);

      const { error } = await supabase
        .from('issues')
        .insert(insertData);

      if (error) {
        console.error("Error adding issue:", error);
        toast({
          title: "Add Failed",
          description: `Could not add the issue: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }

      console.log("Issue successfully added to database");
      
      // Call the callback to refresh the issues list
      await onIssueAdded();
      
      // Show success toast here in the hook to ensure it's always shown
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
  }, [toast, onIssueAdded, user]);

  return { addIssue };
};
