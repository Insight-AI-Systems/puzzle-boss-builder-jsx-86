
import { IssueType } from "@/types/issueTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IssueBadges } from "./IssueBadges";
import { IssueCategoryIcon } from "./IssueCategoryIcon";

interface IssueCardProps {
  issue: IssueType;
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground font-mono text-sm">
              {issue.id}
            </span>
            <IssueCategoryIcon category={issue.category} />
          </div>
          <IssueBadges status={issue.status} severity={issue.severity} />
        </div>
        <CardTitle className="text-lg mt-2">{issue.title}</CardTitle>
        <CardDescription className="text-sm">
          {issue.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {issue.workaround && (
          <>
            <Separator className="my-2" />
            <div className="text-sm">
              <span className="font-semibold">Workaround: </span>
              {issue.workaround}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

