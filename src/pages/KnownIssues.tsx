
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
      const authComparisonIssue = getAuthComparisonIssue();
      if (!combinedIssues.some(issue => issue.id === authComparisonIssue.id)) {
        combinedIssues.push(authComparisonIssue);
      }
      
      console.log("Combined issues count:", combinedIssues.length);
      console.log("Issues from DB:", dbIssues.length);
      console.log("Local issues:", localIssues.length);
      
      setAllIssues(combinedIssues);
      setIsLoading(false);
      
      // Show toast if too few issues are displayed
      if (combinedIssues.length < 5) {
        toast({
          title: "Limited issues displayed",
          description: `Only ${combinedIssues.length} issues found. This may indicate a data loading issue.`,
          variant: "destructive",
        });
      }
    }
  }, [dbIssues, isDbLoading, toast]);

  // Handle updates including special non-database issues
  const handleUpdateIssue = async (updatedIssue: IssueType) => {
    // Specifically check for AUTH-EVAL, not any non-UUID string
    if (updatedIssue.id === "AUTH-EVAL") {
      setAllIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === updatedIssue.id ? updatedIssue : issue
        )
      );
      return true;
    }
    
    // For all other issues, use the normal update mechanism
    const success = await updateIssue(updatedIssue);
    
    if (success) {
      // Update in local state as well to ensure UI is updated
      setAllIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === updatedIssue.id ? updatedIssue : issue
        )
      );
    }
    
    return success;
  };

  // Handle adding new issues
  const handleAddIssue = async (newIssue: IssueType) => {
    // For database issues
    const success = await updateIssue(newIssue);
    
    if (success) {
      setAllIssues(prevIssues => [...prevIssues, newIssue]);
      return true;
    }
    return false;
  };

  return (
    <PageLayout 
      title="Known Issues & Project Tasks" 
      subtitle="Current list of issues, tasks and their status - our main workflow guide"
      className="max-w-4xl mx-auto"
    >
      <IssuesHeader onAddIssue={handleAddIssue} />
      <IssuesList 
        issues={allIssues} 
        onUpdate={handleUpdateIssue} 
        isLoading={isLoading} 
      />
    </PageLayout>
  );
}
