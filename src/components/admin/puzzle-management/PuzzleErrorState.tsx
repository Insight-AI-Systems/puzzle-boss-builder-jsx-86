
import { AlertCircle, Puzzle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const PuzzleErrorState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Puzzle className="h-5 w-5 mr-2" />
          Puzzle Management
        </CardTitle>
        <CardDescription>Set up required before managing puzzles</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Database Configuration Required</AlertTitle>
          <AlertDescription>
            The puzzles table does not exist in the database yet. Please check that the database is properly configured.
          </AlertDescription>
        </Alert>
        <p className="text-muted-foreground mb-4">
          Contact your system administrator to set up the necessary database tables for puzzle management.
        </p>
      </CardContent>
    </Card>
  );
};
