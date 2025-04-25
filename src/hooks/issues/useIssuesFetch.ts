
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { IssueType } from "@/types/issueTypes";
import { knownIssues as fallbackIssues } from "@/data/knownIssues";
import { supabase } from "@/integrations/supabase/client";
import { mapDbIssueToFrontend } from "@/utils/issues/mappings";

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
      
      const mappedIssues = data.map(mapDbIssueToFrontend);
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
