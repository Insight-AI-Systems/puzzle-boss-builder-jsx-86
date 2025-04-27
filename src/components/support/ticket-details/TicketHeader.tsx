
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface TicketHeaderProps {
  ticketId: string;
  refetch: () => void;
}

export const TicketHeader = ({ ticketId }: TicketHeaderProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isInternalView = searchParams.get('view') === 'internal';

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/support/tickets${isInternalView ? '?view=internal' : ''}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tickets
        </Button>
        <div className="text-lg font-medium">
          Ticket <span className="text-puzzle-aqua">#{ticketId.slice(0, 8)}</span>
        </div>
      </div>
    </div>
  );
};
