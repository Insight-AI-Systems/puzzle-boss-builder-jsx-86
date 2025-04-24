
import PageLayout from "@/components/layouts/PageLayout";
import { IssuesHeader } from "@/components/issues/IssuesHeader";
import { IssuesList } from "@/components/issues/IssuesList";
import { knownIssues } from "@/data/knownIssues";

export default function KnownIssues() {
  return (
    <PageLayout 
      title="Known Issues" 
      subtitle="Current list of known issues and their status"
      className="max-w-4xl mx-auto"
    >
      <IssuesHeader />
      <IssuesList issues={knownIssues} />
    </PageLayout>
  );
}
