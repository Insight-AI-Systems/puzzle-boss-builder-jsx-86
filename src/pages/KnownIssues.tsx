import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageLayout from "@/components/layouts/PageLayout";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueType } from "@/types/issueTypes";

const knownIssues: IssueType[] = [
  {
    id: "PUZZLE-01",
    title: "Puzzle Piece Touch Controls",
    description: "Mobile touch controls for puzzle pieces need improvement for better accuracy and responsiveness.",
    status: "in-progress",
    severity: "high",
    category: "ui",
    workaround: "Use desktop browser for best puzzle gameplay experience"
  },
  {
    id: "AUTH-01",
    title: "Session Management Edge Cases",
    description: "Authentication flow has edge cases that need handling, particularly around session management.",
    status: "open",
    severity: "medium",
    category: "security"
  },
  {
    id: "PERF-01",
    title: "Data Loading Optimization",
    description: "Multiple components fetch the same data without proper caching mechanisms.",
    status: "open",
    severity: "medium",
    category: "performance"
  },
  {
    id: "SEC-01",
    title: "Admin Access Control",
    description: "System relies on email checking rather than proper role-based security.",
    status: "open",
    severity: "critical",
    category: "security"
  },
  {
    id: "MOBILE-01",
    title: "Incomplete Mobile Responsiveness",
    description: "Some components lack proper mobile responsive design.",
    status: "in-progress",
    severity: "high",
    category: "ui"
  }
];

export default function KnownIssues() {
  return (
    <PageLayout 
      title="Known Issues" 
      subtitle="Current list of known issues and their status"
      className="max-w-4xl mx-auto"
    >
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>About This Page</AlertTitle>
        <AlertDescription>
          This page tracks known issues in the Puzzle Boss platform. Issues are categorized by severity and status,
          and are actively monitored and updated by our development team.
        </AlertDescription>
      </Alert>

      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="space-y-4">
          {knownIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </ScrollArea>
    </PageLayout>
  );
}
