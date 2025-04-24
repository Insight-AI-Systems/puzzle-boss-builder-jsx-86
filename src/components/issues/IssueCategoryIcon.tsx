
import { Bug, Code, AlertTriangle, Smartphone, ServerCrash } from "lucide-react";
import { IssueType } from "@/types/issueTypes";

interface IssueCategoryIconProps {
  category: IssueType["category"];
}

export function IssueCategoryIcon({ category }: IssueCategoryIconProps) {
  switch (category) {
    case "bug":
      return <Bug className="h-4 w-4" />;
    case "performance":
      return <ServerCrash className="h-4 w-4" />;
    case "security":
      return <AlertTriangle className="h-4 w-4" />;
    case "ui":
      return <Smartphone className="h-4 w-4" />;
    case "feature":
      return <Code className="h-4 w-4" />;
  }
}

