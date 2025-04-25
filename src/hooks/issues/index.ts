
import { useCallback } from "react";
import { IssueType } from "@/types/issueTypes";
import { useIssuesFetch } from "./useIssuesFetch";
import { useIssuesUpdate } from "./useIssuesUpdate";
import { useIssuesAdd } from "./useIssuesAdd";

export const useKnownIssues = () => {
  const { issues, isLoading, fetchIssues, setIssues } = useIssuesFetch();
  
  const handleIssueUpdate = useCallback((updatedIssue: IssueType) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === updatedIssue.id ? updatedIssue : issue
      )
    );
  }, [setIssues]);

  const { updateIssue } = useIssuesUpdate(handleIssueUpdate);
  const { addIssue } = useIssuesAdd(fetchIssues);

  return {
    issues,
    isLoading,
    updateIssue,
    addIssue,
    fetchIssues
  };
};

export type { IssueType };
