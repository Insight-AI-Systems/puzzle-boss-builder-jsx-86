
export interface IssueType {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  severity: "low" | "medium" | "high" | "critical";
  category: "bug" | "performance" | "security" | "ui" | "feature";
  workaround?: string;
}

