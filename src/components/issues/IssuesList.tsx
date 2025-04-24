
import { ScrollArea } from "@/components/ui/scroll-area";
import { IssueType } from "@/types/issueTypes";
import { IssueCard } from "./IssueCard";

interface IssuesListProps {
  issues: IssueType[];
}

export function IssuesList({ issues }: IssuesListProps) {
  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-4">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </ScrollArea>
  );
}
