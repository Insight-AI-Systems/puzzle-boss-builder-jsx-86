
import { TableCell, TableRow } from '@/components/ui/table';
import { StatusBadge } from '../badges/StatusBadge';
import { PriorityBadge } from '../badges/PriorityBadge';
import { Ticket } from '@/types/ticketTypes';

interface TicketTableRowProps {
  ticket: Ticket;
  onClick: (id: string) => void;
}

export const TicketTableRow = ({ ticket, onClick }: TicketTableRowProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <TableRow 
      key={ticket.id}
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onClick(ticket.id)}
    >
      <TableCell className="font-medium">{ticket.id}</TableCell>
      <TableCell>{ticket.title}</TableCell>
      <TableCell>
        <StatusBadge status={ticket.status} />
      </TableCell>
      <TableCell>
        <PriorityBadge priority={ticket.priority} />
      </TableCell>
      <TableCell>{formatDate(ticket.date)}</TableCell>
    </TableRow>
  );
};
