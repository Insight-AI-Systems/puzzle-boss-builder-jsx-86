
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layouts/PageLayout";
import { IssuesHeader } from "@/components/issues/IssuesHeader";
import { IssuesList } from "@/components/issues/IssuesList";
import { IssueType } from "@/types/issueTypes";
import { knownIssues as fallbackIssues } from "@/data/knownIssues";
import { supabase } from "@/integrations/supabase/client";

export default function KnownIssues() {
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchIssues() {
      try {
        setIsLoading(true);
        
        // Attempt to fetch issues from Supabase
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching issues:", error);
          // Fall back to static data if the fetch fails
          setIssues(fallbackIssues);
          return;
        }
        
        // Map the database structure to match our IssueType
        const mappedIssues: IssueType[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          status: item.status,
          severity: item.severity || "medium",
          category: item.category || "bug",
          workaround: item.workaround
        }));
        
        setIssues(mappedIssues.length > 0 ? mappedIssues : fallbackIssues);
      } catch (err) {
        console.error("Exception fetching issues:", err);
        // Fall back to static data if an exception occurs
        setIssues(fallbackIssues);
        
        toast({
          title: "Failed to load issues",
          description: "Using cached data instead. Please try refreshing.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchIssues();
  }, [toast]);

  // Add a special issue specifically about the auth comparison
  const authComparisonIssue: IssueType = {
    id: "AUTH-EVAL",
    title: "Authentication Provider Evaluation",
    description: "Compare Supabase Auth vs Clerk for our authentication needs.",
    status: "in-progress",
    severity: "high",
    category: "security",
    workaround: "Continue using Supabase Auth while evaluation is in progress"
  };
  
  // Add the new issue to either the fetched list or the fallback list
  const allIssues = [
    ...issues,
    // Only add if it doesn't already exist
    ...(!issues.some(i => i.id === "AUTH-EVAL") ? [authComparisonIssue] : [])
  ];

  return (
    <PageLayout 
      title="Known Issues & Project Tasks" 
      subtitle="Current list of issues, tasks and their status - our main workflow guide"
      className="max-w-4xl mx-auto"
    >
      <IssuesHeader />
      <IssuesList issues={allIssues} />
    </PageLayout>
  );
}
