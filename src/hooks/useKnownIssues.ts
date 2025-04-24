
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { IssueType, mapDbStatusToFrontend, mapFrontendStatusToDb } from "@/types/issueTypes";
import { knownIssues as fallbackIssues } from "@/data/knownIssues";
import { supabase } from "@/integrations/supabase/client";

// Define a type for the database issue structure
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

export const useKnownIssues = () => {
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });
          
      if (error) {
        console.error("Error fetching issues:", error);
        // If database fetch fails, use the fallback issues
        setIssues(fallbackIssues);
        toast({
          title: "Failed to load issues from database",
          description: "Using local data instead. Please try refreshing.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Database results:", data);
      
      // Map database status to our issue type status
      const mappedIssues: IssueType[] = (data as DbIssue[]).map(item => ({
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
      }));
      
      // If no issues were returned from database, use the fallback issues
      if (mappedIssues.length === 0) {
        console.log("No issues found in database, using fallback issues");
        setIssues(fallbackIssues);
      } else {
        setIssues(mappedIssues);
      }
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
  };

  const updateIssue = async (updatedIssue: IssueType): Promise<boolean> => {
    try {
      console.log("Updating issue in database:", updatedIssue);
      
      // Map frontend status to database status
      const dbStatus = mapFrontendStatusToDb(updatedIssue.status);
      
      console.log("Mapped status for database:", dbStatus);

      // Only include fields that exist in the database
      const updateData = {
        title: updatedIssue.title,
        description: updatedIssue.description,
        status: dbStatus,
        category: updatedIssue.category,
        workaround: updatedIssue.workaround || null,
        modified_by: updatedIssue.modified_by || null,
        updated_at: new Date().toISOString()
      };
      
      console.log("Sending update data to database:", updateData);
      
      // Update in the database
      const { error } = await supabase
        .from('issues')
        .update(updateData)
        .eq('id', updatedIssue.id);

      if (error) {
        console.error("Error updating issue in database:", error);
        toast({
          title: "Update Failed",
          description: `Could not update the issue in the database: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }

      // Update in local state
      handleIssueUpdate(updatedIssue);
      
      toast({
        title: "Issue Updated",
        description: `Successfully changed status to ${updatedIssue.status}.`,
      });
      
      return true;
    } catch (err) {
      console.error("Exception updating issue:", err);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred while updating the issue.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleIssueUpdate = (updatedIssue: IssueType) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === updatedIssue.id ? updatedIssue : issue
      )
    );
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return {
    issues,
    isLoading,
    handleIssueUpdate,
    updateIssue,
    fetchIssues
  };
};

const mapDatabaseCategory = (category: string): IssueType['category'] => {
  if (['bug', 'performance', 'security', 'ui', 'feature'].includes(category)) {
    return category as IssueType['category'];
  }
  return 'bug';
};
