
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, User } from 'lucide-react';
import { TicketStatusBadge } from './TicketStatusBadge';
import { SupportTicket } from '@/types/supportTicketTypes';

interface TicketTableProps {
  tickets: SupportTicket[];
  isSuperAdmin: boolean;
  onTicketClick: (ticketId: string) => void;
  onDeleteTicket: (ticketId: string) => void;
}

export const TicketTable = ({ 
  tickets, 
  isSuperAdmin, 
  onTicketClick, 
  onDeleteTicket 
}: TicketTableProps) => {
  const formatTicketId = (id: string) => {
    return `#${id.slice(0, 8)}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-puzzle-aqua/20">
          <TableHead className="text-puzzle-aqua">Ticket ID</TableHead>
          <TableHead className="text-puzzle-aqua">Subject</TableHead>
          <TableHead className="text-puzzle-aqua">Created By</TableHead>
          <TableHead className="text-puzzle-aqua">Status</TableHead>
          <TableHead className="text-puzzle-aqua">Created</TableHead>
          <TableHead className="text-puzzle-aqua">Last Update</TableHead>
          {isSuperAdmin && <TableHead className="text-puzzle-aqua">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow 
            key={ticket.id} 
            className="border-puzzle-aqua/20 hover:bg-puzzle-aqua/5 cursor-pointer"
          >
            <TableCell 
              onClick={() => onTicketClick(ticket.id)}
              className="font-medium"
            >
              {formatTicketId(ticket.id)}
            </TableCell>
            <TableCell 
              onClick={() => onTicketClick(ticket.id)}
            >
              <div>
                <div className="text-puzzle-white">{ticket.title}</div>
                <div className="text-sm text-puzzle-white/60 truncate max-w-[300px]">
                  {ticket.description.split('\n')[0]}
                </div>
              </div>
            </TableCell>
            <TableCell onClick={() => onTicketClick(ticket.id)}>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-puzzle-aqua/60" />
                <span>{ticket.created_by || 'Unknown'}</span>
              </div>
            </TableCell>
            <TableCell onClick={() => onTicketClick(ticket.id)}>
              <TicketStatusBadge status={ticket.status} />
            </TableCell>
            <TableCell onClick={() => onTicketClick(ticket.id)}>
              {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'N/A'}
            </TableCell>
            <TableCell onClick={() => onTicketClick(ticket.id)}>
              {ticket.updated_at ? new Date(ticket.updated_at).toLocaleDateString() : 'N/A'}
            </TableCell>
            {isSuperAdmin && (
              <TableCell className="w-[100px]">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTicket(ticket.id);
                  }}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
