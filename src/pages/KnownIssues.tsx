
import { AlertTriangle, Bug, Check, Code, Info, ServerCrash, Smartphone } from "lucide-react";
import PageLayout from "@/components/layouts/PageLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IssueType {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  severity: "low" | "medium" | "high" | "critical";
  category: "bug" | "performance" | "security" | "ui" | "feature";
  workaround?: string;
}

const knownIssues: IssueType[] = [
  {
    id: "PUZZLE-01",
    title: "Puzzle Piece Touch Controls",
    description: "Mobile touch controls for puzzle pieces need improvement for better accuracy and responsiveness.",
    status: "in-progress",
    severity: "high",
    category: "ui",
    workaround: "Use desktop browser for best puzzle gameplay experience"
  },
  {
    id: "AUTH-01",
    title: "Session Management Edge Cases",
    description: "Authentication flow has edge cases that need handling, particularly around session management.",
    status: "open",
    severity: "medium",
    category: "security"
  },
  {
    id: "PERF-01",
    title: "Data Loading Optimization",
    description: "Multiple components fetch the same data without proper caching mechanisms.",
    status: "open",
    severity: "medium",
    category: "performance"
  },
  {
    id: "SEC-01",
    title: "Admin Access Control",
    description: "System relies on email checking rather than proper role-based security.",
    status: "open",
    severity: "critical",
    category: "security"
  },
  {
    id: "MOBILE-01",
    title: "Incomplete Mobile Responsiveness",
    description: "Some components lack proper mobile responsive design.",
    status: "in-progress",
    severity: "high",
    category: "ui"
  }
];

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

const getCategoryIcon = (category: IssueType["category"]) => {
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
};

export default function KnownIssues() {
  return (
    <PageLayout 
      title="Known Issues" 
      subtitle="Current list of known issues and their status"
      className="max-w-4xl mx-auto"
    >
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>About This Page</AlertTitle>
        <AlertDescription>
          This page tracks known issues in the Puzzle Boss platform. Issues are categorized by severity and status,
          and are actively monitored and updated by our development team.
        </AlertDescription>
      </Alert>

      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="space-y-4">
          {knownIssues.map((issue) => (
            <Card key={issue.id}>
              <CardHeader className="space-y-0 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground font-mono text-sm">
                      {issue.id}
                    </span>
                    {getCategoryIcon(issue.category)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(issue.status)}>
                      {issue.status === "resolved" && <Check className="mr-1 h-3 w-3" />}
                      {issue.status}
                    </Badge>
                    <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </Badge>
                  </div>
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
          ))}
        </div>
      </ScrollArea>
    </PageLayout>
  );
}
