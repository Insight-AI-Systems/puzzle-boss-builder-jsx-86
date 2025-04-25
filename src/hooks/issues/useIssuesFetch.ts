
import { useState, useCallback, useEffect } from "react";
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
      
      // If no issues returned from the database, use fallback issues
      if (!data || data.length === 0) {
        console.log("No issues found in database, using fallback issues");
        setIssues(fallbackIssues);
        return;
      }
      
      const mappedIssues = data.map(mapDbIssueToFrontend);
      console.log("Fetched issues:", data.length, "Mapped issues:", mappedIssues.length);
      setIssues(mappedIssues);
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

  // Automatically fetch issues when the component mounts
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return {
    issues,
    isLoading,
    fetchIssues,
    setIssues
  };
};
