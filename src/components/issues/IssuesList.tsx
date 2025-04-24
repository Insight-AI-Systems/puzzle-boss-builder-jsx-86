
import { ScrollArea } from "@/components/ui/scroll-area";
import { IssueType } from "@/types/issueTypes";
import { IssueCard } from "./IssueCard";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface IssuesListProps {
  issues: IssueType[];
  onUpdate: (updatedIssue: IssueType) => Promise<boolean>;
  isLoading?: boolean;
}

export function IssuesList({ issues, onUpdate, isLoading = false }: IssuesListProps) {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("active");
  
  const filteredIssues = issues.filter(issue => {
    if (filter === "all") return true;
    if (filter === "active") return issue.status !== "resolved";
    if (filter === "resolved") return issue.status === "resolved";
    return true;
  });
  
  const activeCount = issues.filter(issue => issue.status !== "resolved").length;
  const resolvedCount = issues.filter(issue => issue.status === "resolved").length;
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="active" onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="active">
            Active ({activeCount})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({resolvedCount})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({issues.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Fixed height and overflow handling to ensure scrolling works properly */}
      <div className="h-[600px] border rounded-md">
        <ScrollArea className="h-full w-full p-4">
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading issues...
              </div>
            ) : filteredIssues.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No issues found in this category.
              </div>
            ) : (
              <>
                <div className="text-muted-foreground text-sm mb-4">
                  Found {filteredIssues.length} {filter === "all" ? "total" : filter} issues
                </div>
                {filteredIssues.map((issue) => (
                  <IssueCard 
                    key={issue.id} 
                    issue={issue} 
                    onUpdate={onUpdate}
                  />
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
