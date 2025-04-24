
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function IssuesHeader() {
  return (
    <Alert className="mb-6">
      <Info className="h-4 w-4" />
      <AlertTitle>About This Page</AlertTitle>
      <AlertDescription>
        This page tracks known issues in the Puzzle Boss platform. Issues are categorized by severity and status,
        and are actively monitored and updated by our development team.
      </AlertDescription>
    </Alert>
  );
}
