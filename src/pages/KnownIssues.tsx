
import PageLayout from "@/components/layouts/PageLayout";
import { IssuesHeader } from "@/components/issues/IssuesHeader";
import { IssuesList } from "@/components/issues/IssuesList";
import { useKnownIssues } from "@/hooks/useKnownIssues";
import { getAuthComparisonIssue } from "@/components/issues/AuthComparisonIssue";

export default function KnownIssues() {
  const { issues, isLoading, updateIssue } = useKnownIssues();
  
  const allIssues = [
    ...issues,
    // Only add if it doesn't already exist
    ...(!issues.some(i => i.id === "AUTH-EVAL") ? [getAuthComparisonIssue()] : [])
  ];

  return (
    <PageLayout 
      title="Known Issues & Project Tasks" 
      subtitle="Current list of issues, tasks and their status - our main workflow guide"
      className="max-w-4xl mx-auto"
    >
      <IssuesHeader />
      <IssuesList 
        issues={allIssues} 
        onUpdate={updateIssue} 
        isLoading={isLoading} 
      />
    </PageLayout>
  );
}
