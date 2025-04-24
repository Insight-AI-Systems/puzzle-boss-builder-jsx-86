
import { ScrollArea } from "@/components/ui/scroll-area";
import { IssueType } from "@/types/issueTypes";
import { IssueCard } from "./IssueCard";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IssuesListProps {
  issues: IssueType[];
  onUpdate: (updatedIssue: IssueType) => Promise<boolean>;
  isLoading?: boolean;
}

type SortOption = "newest" | "oldest" | "status" | "category";

export function IssuesList({ issues, onUpdate, isLoading = false }: IssuesListProps) {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("active");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  
  const filteredIssues = issues.filter(issue => {
    if (filter === "all") return true;
    if (filter === "active") return issue.status !== "resolved";
    if (filter === "resolved") return issue.status === "resolved";
    return true;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
      case "oldest":
        return new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime();
      case "status":
        return (a.status || "").localeCompare(b.status || "");
      case "category":
        return (a.category || "").localeCompare(b.category || "");
      default:
        return 0;
    }
  });
  
  const activeCount = issues.filter(issue => issue.status !== "resolved").length;
  const resolvedCount = issues.filter(issue => issue.status === "resolved").length;
  
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

      <div className="flex items-center justify-between">
        <Tabs defaultValue="active" onValueChange={(value) => setFilter(value as any)}>
          <TabsList className="grid grid-cols-3">
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

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="status">By Status</SelectItem>
            <SelectItem value="category">By Category</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Fixed height and overflow handling to ensure scrolling works properly */}
      <div className="h-[600px] border rounded-md">
        <ScrollArea className="h-full w-full p-4">
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading issues...
              </div>
            ) : sortedIssues.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No issues found in this category.
              </div>
            ) : (
              <>
                <div className="text-muted-foreground text-sm mb-4">
                  Found {sortedIssues.length} {filter === "all" ? "total" : filter} issues
                </div>
                {sortedIssues.map((issue) => (
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
