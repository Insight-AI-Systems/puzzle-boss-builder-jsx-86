
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { IssueType, mapDbStatusToFrontend, mapFrontendStatusToDb } from "@/types/issueTypes";
import { knownIssues as fallbackIssues } from "@/data/knownIssues";
import { supabase } from "@/integrations/supabase/client";

// Types
type DbIssue = {
  id: string;
  title: string;
  description: string;
  status: 'wip' | 'completed' | 'deferred';
  category: string;
  workaround?: string;
  created_by?: string;
  modified_by?: string;
  created_at: string;
  updated_at: string;
};

// Utility function to map database issues to frontend format
const mapDbIssueToFrontend = (item: DbIssue): IssueType => ({
  id: item.id,
  title: item.title,
  description: item.description,
  status: mapDbStatusToFrontend(item.status),
  category: mapDatabaseCategory(item.category),
  workaround: item.workaround,
  created_by: item.created_by,
  modified_by: item.modified_by,
  created_at: item.created_at,
  updated_at: item.updated_at
});

// Utility function to map database categories
const mapDatabaseCategory = (category: string): IssueType['category'] => {
  if (['bug', 'performance', 'security', 'ui', 'feature'].includes(category)) {
    return category as IssueType['category'];
  }
  return 'bug';
};

export const useKnownIssues = () => {
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch issues from database
  const fetchIssues = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });
          
      if (error) {
        console.error("Error fetching issues:", error);
        setIssues(fallbackIssues);
        toast({
          title: "Failed to load issues from database",
          description: "Using local data instead. Please try refreshing.",
          variant: "destructive",
        });
        return;
      }
      
      const mappedIssues = (data as DbIssue[]).map(mapDbIssueToFrontend);
      
      setIssues(mappedIssues.length > 0 ? mappedIssues : fallbackIssues);
    } catch (err) {
      console.error("Exception fetching issues:", err);
      setIssues(fallbackIssues);
      toast({
        title: "Failed to load issues",
        description: "Using cached data instead. Please try refreshing.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update an existing issue
  const updateIssue = async (updatedIssue: IssueType): Promise<boolean> => {
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

      handleIssueUpdate(updatedIssue);
      
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
  };

  // Add a new issue
  const addIssue = async (newIssue: IssueType): Promise<boolean> => {
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

      await fetchIssues();
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
  };

  // Update local state when an issue changes
  const handleIssueUpdate = (updatedIssue: IssueType) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === updatedIssue.id ? updatedIssue : issue
      )
    );
  };

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return {
    issues,
    isLoading,
    handleIssueUpdate,
    updateIssue,
    addIssue,
    fetchIssues
  };
};
