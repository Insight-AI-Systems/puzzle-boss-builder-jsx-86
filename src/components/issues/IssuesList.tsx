
import { ScrollArea } from "@/components/ui/scroll-area";
import { IssueType } from "@/types/issueTypes";
import { IssueCard } from "./IssueCard";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

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
  
  // Calculate counts for each category
  const activeCount = issues.filter(issue => issue.status !== "resolved").length;
  const resolvedCount = issues.filter(issue => issue.status === "resolved").length;
  
  // Calculate counts by category
  const categoryCounts = {
    bug: issues.filter(issue => issue.category === "bug").length,
    performance: issues.filter(issue => issue.category === "performance").length,
    security: issues.filter(issue => issue.category === "security").length,
    ui: issues.filter(issue => issue.category === "ui").length,
    feature: issues.filter(issue => issue.category === "feature").length,
  };
  
  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Total Issues</span>
              <span className="text-2xl font-bold">{issues.length}</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Active</span>
              <span className="text-2xl font-bold text-amber-500">{activeCount}</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Resolved</span>
              <span className="text-2xl font-bold text-green-500">{resolvedCount}</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        {Object.entries(categoryCounts).map(([category, count]) => (
          <div key={category} className="text-center p-2 bg-muted rounded-md">
            <div className="font-medium capitalize">{category}</div>
            <div className="text-xl font-bold">{count}</div>
          </div>
        ))}
      </div>

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
