
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
  status: 'wip' | 'completed';
  severity?: 'low' | 'medium' | 'high' | 'critical';
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
        setIssues(fallbackIssues);
        return;
      }
      
      // Map database status to our issue type status
      const mappedIssues: IssueType[] = (data as DbIssue[]).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: mapDbStatusToFrontend(item.status),
        severity: item.severity || "medium",
        category: mapDatabaseCategory(item.category),
        workaround: item.workaround,
        created_by: item.created_by,
        modified_by: item.modified_by,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
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
  };

  const updateIssue = async (updatedIssue: IssueType): Promise<boolean> => {
    try {
      // Map frontend status to database status
      const dbStatus = mapFrontendStatusToDb(updatedIssue.status);
      
      // Update in the database
      const { error } = await supabase
        .from('issues')
        .update({
          title: updatedIssue.title,
          description: updatedIssue.description,
          status: dbStatus,
          severity: updatedIssue.severity,
          category: updatedIssue.category,
          workaround: updatedIssue.workaround,
          modified_by: updatedIssue.modified_by,
          updated_at: updatedIssue.updated_at
        })
        .eq('id', updatedIssue.id);

      if (error) {
        console.error("Error updating issue in database:", error);
        toast({
          title: "Update Failed",
          description: "Could not update the issue in the database.",
          variant: "destructive",
        });
        return false;
      }

      // Update in local state
      handleIssueUpdate(updatedIssue);
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
    updateIssue
  };
};

const mapDatabaseCategory = (category: string): IssueType['category'] => {
  if (['bug', 'performance', 'security', 'ui', 'feature'].includes(category)) {
    return category as IssueType['category'];
  }
  return 'bug';
};
