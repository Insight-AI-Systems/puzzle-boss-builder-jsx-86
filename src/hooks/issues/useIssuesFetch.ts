
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { IssueType } from "@/types/issueTypes";
import { knownIssues as fallbackIssues } from "@/data/knownIssues";
import { supabase } from "@/integrations/supabase/client";

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

const mapDatabaseCategory = (category: string): IssueType['category'] => {
  if (['bug', 'performance', 'security', 'ui', 'feature'].includes(category)) {
    return category as IssueType['category'];
  }
  return 'bug';
};

const mapDbStatusToFrontend = (status: DbIssue['status']): IssueType['status'] => {
  switch (status) {
    case 'wip': return 'in-progress';
    case 'completed': return 'resolved';
    case 'deferred': return 'deferred';
    default: return 'open';
  }
};

export const useIssuesFetch = () => {
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  return {
    issues,
    isLoading,
    fetchIssues,
    setIssues
  };
};
