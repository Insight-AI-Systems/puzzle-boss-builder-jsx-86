
import { IssueType } from "@/types/issueTypes";

export const getAuthComparisonIssue = (): IssueType => ({
  id: "AUTH-EVAL",
  title: "Authentication Provider Evaluation",
  description: "Compare Supabase Auth vs Clerk for our authentication needs.",
  status: "in-progress",
  category: "security",
  workaround: "Continue using Supabase Auth while evaluation is in progress"
});
