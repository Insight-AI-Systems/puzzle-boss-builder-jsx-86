
import PageLayout from "@/components/layouts/PageLayout";
import { IssuesHeader } from "@/components/issues/IssuesHeader";
import { IssuesList } from "@/components/issues/IssuesList";
import { useKnownIssues } from "@/hooks/issues";
import { getAuthComparisonIssue } from "@/components/issues/AuthComparisonIssue";
import { knownIssues as localIssues } from "@/data/knownIssues";
import { IssueType } from "@/types/issueTypes";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function KnownIssues() {
  const { issues: dbIssues, isLoading: isDbLoading, updateIssue, addIssue, fetchIssues } = useKnownIssues();
  const [allIssues, setAllIssues] = useState<IssueType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isDbLoading) {
      const combinedIssues: IssueType[] = JSON.parse(JSON.stringify(dbIssues || []));
      
      localIssues.forEach(localIssue => {
        if (!combinedIssues.some(issue => issue.id === localIssue.id)) {
          combinedIssues.push({...localIssue});
        }
      });
      
      const authComparisonIssue = getAuthComparisonIssue();
      if (!combinedIssues.some(issue => issue.id === authComparisonIssue.id)) {
        combinedIssues.push({...authComparisonIssue});
      }
      
      console.log("Combined issues count:", combinedIssues.length);
      console.log("Issues from DB:", dbIssues ? dbIssues.length : 0);
      console.log("Local issues:", localIssues.length);
      
      setAllIssues(combinedIssues);
      setIsLoading(false);
      
      if (combinedIssues.length < 5) {
        toast({
          title: "Limited issues displayed",
          description: `Only ${combinedIssues.length} issues found. This may indicate a data loading issue.`,
          variant: "destructive",
        });
      }
    }
  }, [dbIssues, isDbLoading, toast]);

  const handleUpdateIssue = async (updatedIssue: IssueType) => {
    if (updatedIssue.id === "AUTH-EVAL") {
      setAllIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === updatedIssue.id ? updatedIssue : issue
        )
      );
      return true;
    }
    
    const success = await updateIssue(updatedIssue);
    
    if (success) {
      setAllIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === updatedIssue.id ? updatedIssue : issue
        )
      );
    }
    
    return success;
  };

  const handleAddIssue = async (newIssue: IssueType) => {
    try {
      console.log("Adding new issue:", newIssue);
      
      const success = await addIssue(newIssue);
      
      if (success) {
        toast({
          title: "Issue Added",
          description: `Successfully added issue: ${newIssue.title}`,
        });
        
        // Refresh the issues list
        await fetchIssues();
        return true;
      }
      
      toast({
        title: "Failed to Add Issue",
        description: "There was a problem adding the new issue.",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      console.error("Error in handleAddIssue:", error);
      toast({
        title: "Error Adding Issue",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    }
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
