
import { Badge } from '@/components/ui/badge';
import { TicketPriority } from '@/types/ticketTypes';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const badgeVariant = 
    priority === 'low' ? 'outline' :
    priority === 'medium' ? 'default' :
    priority === 'high' ? 'secondary' : 'destructive';

  return (
    <Badge variant={badgeVariant}>{priority}</Badge>
  );
};
