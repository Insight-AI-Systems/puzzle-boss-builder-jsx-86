
import { Badge } from "@/components/ui/badge";
import { IssueType } from "@/types/issueTypes";

interface IssueBadgesProps {
  status: IssueType['status'];
}

export function IssueBadges({ status }: IssueBadgesProps) {
  const getStatusBadge = () => {
    switch(status) {
      case 'open':
        return <Badge variant="outline" className="border-red-500 text-red-500">Open</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="border-green-500 text-green-500">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="flex gap-2">
      {getStatusBadge()}
    </div>
  );
}
