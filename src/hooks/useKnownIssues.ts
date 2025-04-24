
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { IssueType } from "@/types/issueTypes";
import { knownIssues as fallbackIssues } from "@/data/knownIssues";
import { supabase } from "@/integrations/supabase/client";

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
      const mappedIssues: IssueType[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: mapDatabaseStatus(item.status),
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
    handleIssueUpdate
  };
};

const mapDatabaseStatus = (status: string): IssueType['status'] => {
  switch (status) {
    case 'wip':
      return 'in-progress';
    case 'completed':
      return 'resolved';
    default:
      return 'open';
  }
};

const mapDatabaseCategory = (category: string): IssueType['category'] => {
  if (['bug', 'performance', 'security', 'ui', 'feature'].includes(category)) {
    return category as IssueType['category'];
  }
  return 'bug';
};
