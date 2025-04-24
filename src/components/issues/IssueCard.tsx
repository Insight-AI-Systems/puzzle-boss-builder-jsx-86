import { IssueType } from "@/types/issueTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IssueBadges } from "./IssueBadges";
import { IssueCategoryIcon } from "./IssueCategoryIcon";
import { IssueEditDialog } from "./IssueEditDialog";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

interface IssueCardProps {
  issue: IssueType;
  onUpdate: (updatedIssue: IssueType) => Promise<boolean>;
}

export function IssueCard({ issue, onUpdate }: IssueCardProps) {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('admin') || hasRole('super_admin');

  const renderAuthComparisonContent = () => {
    if (issue.id !== "AUTH-EVAL") return null;
    
    return (
      <>
        <Separator className="my-3" />
        <div className="text-sm space-y-3">
          <h4 className="font-semibold">Supabase Auth vs Clerk Comparison:</h4>
          
          <div>
            <h5 className="font-medium text-puzzle-aqua">Supabase Auth Pros:</h5>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Already integrated into our application</li>
              <li>Unified backend (auth, database, storage in one platform)</li>
              <li>Lower cost for basic auth needs</li>
              <li>Built-in Row Level Security with auth integration</li>
              <li>Self-hostable option available if needed</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-puzzle-aqua">Supabase Auth Cons:</h5>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>More limited user management features</li>
              <li>Fewer built-in authentication flows</li>
              <li>Less robust multi-factor authentication</li>
              <li>Limited organization/team management features</li>
              <li>Session management requires more custom code</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-puzzle-gold">Clerk Pros:</h5>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>More comprehensive user management</li>
              <li>Superior multi-factor authentication options</li>
              <li>Built-in organization/team management</li>
              <li>More pre-built UI components</li>
              <li>Advanced session management with device tracking</li>
              <li>Better fraud detection and prevention</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-puzzle-gold">Clerk Cons:</h5>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Additional integration effort required</li>
              <li>Higher cost for advanced features</li>
              <li>Separate service from our database (Supabase)</li>
              <li>Would require refactoring auth-related code</li>
              <li>Requires mapping users to Supabase for row-level security</li>
            </ul>
          </div>
          
          <div className="bg-muted p-3 rounded-md mt-4">
            <h5 className="font-medium">Recommendation:</h5>
            <p className="mt-1">
              Given our current integration with Supabase and the scope of the project, 
              staying with Supabase Auth is recommended for now. However, if we anticipate 
              needing advanced team/organization features, sophisticated multi-tenancy, 
              or enterprise-level auth requirements, planning a migration to Clerk would 
              be justified despite the refactoring effort.
            </p>
          </div>
        </div>
      </>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };

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
          <div className="flex items-center space-x-2">
            <IssueBadges status={issue.status} category={issue.category} />
            {isAdmin && (
              <IssueEditDialog issue={issue} onUpdate={onUpdate} />
            )}
          </div>
        </div>
        <CardTitle className="text-lg mt-2">{issue.title}</CardTitle>
        <CardDescription className="text-sm">
          {issue.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderAuthComparisonContent()}
        
        {issue.workaround && (
          <>
            <Separator className="my-2" />
            <div className="text-sm">
              <span className="font-semibold">Workaround: </span>
              {issue.workaround}
            </div>
          </>
        )}

        <Separator className="my-2" />
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Created: {formatDate(issue.created_at)}</div>
          {issue.updated_at !== issue.created_at && (
            <div>Last Updated: {formatDate(issue.updated_at)}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
