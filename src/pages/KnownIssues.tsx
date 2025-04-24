
import PageLayout from "@/components/layouts/PageLayout";
import { IssuesHeader } from "@/components/issues/IssuesHeader";
import { IssuesList } from "@/components/issues/IssuesList";
import { useKnownIssues } from "@/hooks/useKnownIssues";
import { getAuthComparisonIssue } from "@/components/issues/AuthComparisonIssue";
import { knownIssues as localIssues } from "@/data/knownIssues";
import { IssueType } from "@/types/issueTypes";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function KnownIssues() {
  const { issues: dbIssues, isLoading: isDbLoading, updateIssue } = useKnownIssues();
  const [allIssues, setAllIssues] = useState<IssueType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isDbLoading) {
      // Combine database issues with local issues that don't exist in the database
      // and the special auth comparison issue
      const combinedIssues: IssueType[] = [...dbIssues];
      
      // Add local issues that don't exist in the database
      localIssues.forEach(localIssue => {
        if (!combinedIssues.some(issue => issue.id === localIssue.id)) {
          combinedIssues.push(localIssue);
        }
      });
      
      // Add auth comparison issue if it doesn't exist
      if (!combinedIssues.some(issue => issue.id === "AUTH-EVAL")) {
        combinedIssues.push(getAuthComparisonIssue());
      }
      
      console.log("Combined issues count:", combinedIssues.length);
      setAllIssues(combinedIssues);
      setIsLoading(false);
      
      // Show toast if too few issues are displayed
      if (combinedIssues.length < 5) {
        toast({
          title: "Limited issues displayed",
          description: `Only ${combinedIssues.length} issues found. This may indicate a data loading issue.`,
          variant: "default",
        });
      }
    }
  }, [dbIssues, isDbLoading, toast]);

  // Handle updates including special non-database issues
  const handleUpdateIssue = async (updatedIssue: IssueType) => {
    // Check if this is a special non-database issue
    const isSpecialLocalIssue = typeof updatedIssue.id === 'string' && 
      !updatedIssue.id.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i);
    
    if (isSpecialLocalIssue) {
      // For special issues like AUTH-EVAL, just update the local state
      setAllIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === updatedIssue.id ? updatedIssue : issue
        )
      );
      return true;
    }
    
    // For regular database issues, use the normal update mechanism
    return updateIssue(updatedIssue);
  };

  return (
    <PageLayout 
      title="Known Issues & Project Tasks" 
      subtitle="Current list of issues, tasks and their status - our main workflow guide"
      className="max-w-4xl mx-auto"
    >
      <IssuesHeader />
      <IssuesList 
        issues={allIssues} 
        onUpdate={handleUpdateIssue} 
        isLoading={isLoading} 
      />
    </PageLayout>
  );
}
