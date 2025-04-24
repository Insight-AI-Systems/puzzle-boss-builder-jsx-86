
import { Badge } from "@/components/ui/badge";
import { IssueType } from "@/types/issueTypes";

interface IssueBadgesProps {
  status: IssueType['status'];
  category?: IssueType['category'];
}

export function IssueBadges({ status, category }: IssueBadgesProps) {
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

  const getCategoryBadge = () => {
    if (!category) return null;
    
    switch(category) {
      case 'bug':
        return <Badge variant="outline" className="border-red-700 text-red-700">Bug</Badge>;
      case 'performance':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Performance</Badge>;
      case 'security':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Security</Badge>;
      case 'ui':
        return <Badge variant="outline" className="border-teal-500 text-teal-500">UI/UX</Badge>;
      case 'feature':
        return <Badge variant="outline" className="border-indigo-500 text-indigo-500">Feature</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  return (
    <div className="flex gap-2">
      {getStatusBadge()}
      {category && getCategoryBadge()}
    </div>
  );
}
