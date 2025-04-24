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
    fetchIssues();
  }, []);

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
        status: mapStatus(item.status),
        severity: item.severity || "medium",
        category: item.category || "bug",
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

  const mapStatus = (status: string): IssueType['status'] => {
    switch (status) {
      case 'wip':
        return 'in-progress';
      case 'completed':
        return 'resolved';
      default:
        return 'open';
    }
  };

  const handleIssueUpdate = (updatedIssue: IssueType) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === updatedIssue.id ? updatedIssue : issue
      )
    );
  };

  const authComparisonIssue: IssueType = {
    id: "AUTH-EVAL",
    title: "Authentication Provider Evaluation",
    description: "Compare Supabase Auth vs Clerk for our authentication needs.",
    status: "in-progress",
    severity: "high",
    category: "security",
    workaround: "Continue using Supabase Auth while evaluation is in progress"
  };
  
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
      <IssuesList issues={allIssues} onUpdate={handleIssueUpdate} />
    </PageLayout>
  );
}
