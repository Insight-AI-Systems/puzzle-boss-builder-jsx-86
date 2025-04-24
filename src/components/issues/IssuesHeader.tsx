
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, FileCheck } from "lucide-react";
import { AddIssueDialog } from "./AddIssueDialog";
import { useAuth } from "@/contexts/AuthContext";
import { IssueType } from "@/types/issueTypes";

interface IssuesHeaderProps {
  onAddIssue: (newIssue: IssueType) => Promise<boolean>;
}

export function IssuesHeader({ onAddIssue }: IssuesHeaderProps) {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('admin') || hasRole('super_admin');

  return (
    <div className="mb-6 space-y-4">
      <div className="flex justify-between items-center">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Project Workflow Guide</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              This page tracks known issues, tasks, and progress for the Puzzle Boss platform. 
              Items are categorized by severity and status, and are actively maintained as our primary workflow reference.
            </p>
            <div className="flex items-center gap-2 text-sm mt-2">
              <FileCheck className="h-4 w-4" />
              <span>
                When issues are resolved, they'll be moved to the "Resolved" tab rather than removed,
                creating a record of our progress.
              </span>
            </div>
          </AlertDescription>
        </Alert>
        {isAdmin && (
          <div className="flex-shrink-0 ml-4">
            <AddIssueDialog onAdd={onAddIssue} />
          </div>
        )}
      </div>
    </div>
  );
}
