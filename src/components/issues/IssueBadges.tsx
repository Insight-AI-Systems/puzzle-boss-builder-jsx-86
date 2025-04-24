
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IssueType } from "@/types/issueTypes";

interface IssueBadgesProps {
  status: IssueType["status"];
  severity: IssueType["severity"];
}

const getSeverityColor = (severity: IssueType["severity"]) => {
  switch (severity) {
    case "critical":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    case "high":
      return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "low":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
  }
};

const getStatusColor = (status: IssueType["status"]) => {
  switch (status) {
    case "open":
      return "bg-red-500/10 text-red-500";
    case "in-progress":
      return "bg-blue-500/10 text-blue-500";
    case "resolved":
      return "bg-green-500/10 text-green-500";
  }
};

export function IssueBadges({ status, severity }: IssueBadgesProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={getStatusColor(status)}>
        {status === "resolved" && <Check className="mr-1 h-3 w-3" />}
        {status}
      </Badge>
      <Badge variant="outline" className={getSeverityColor(severity)}>
        {severity}
      </Badge>
    </div>
  );
}

