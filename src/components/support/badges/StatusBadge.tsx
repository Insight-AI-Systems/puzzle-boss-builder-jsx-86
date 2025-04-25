
import { Badge } from '@/components/ui/badge';
import { TicketStatus } from '@/types/supportTicketTypes';

interface StatusBadgeProps {
  status: TicketStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const badgeVariant = 
    status === 'open' ? 'default' :
    status === 'in-progress' ? 'outline' :
    status === 'resolved' ? 'secondary' : 'destructive';

  return (
    <Badge variant={badgeVariant}>{status}</Badge>
  );
};
