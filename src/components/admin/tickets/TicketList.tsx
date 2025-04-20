
import React from 'react';
import { Ticket } from '@/hooks/useTickets';
import { Badge } from "@/components/ui/badge";
import { EditTicketDialog } from './EditTicketDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export interface TicketListProps {
  tickets: Ticket[];
  isLoading: boolean;
  onUpdateStatus: (id: string, status: 'WIP' | 'Completed' | 'In Review') => void;
  onUpdateTicket: (id: string, updates: Partial<Ticket>) => void;
}

export function TicketList({ tickets, isLoading, onUpdateStatus, onUpdateTicket }: TicketListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No issues found.
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'In Review':
        return 'warning';
      case 'WIP':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Issue</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map(ticket => (
            <TableRow key={ticket.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{ticket.heading}</div>
                  {ticket.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {ticket.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {ticket.createdByUser?.username || 'Unknown'}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(ticket.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <EditTicketDialog ticket={ticket} onSave={onUpdateTicket} />
                  <Select
                    defaultValue={ticket.status}
                    onValueChange={(value) => onUpdateStatus(ticket.id, value as 'WIP' | 'Completed' | 'In Review')}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WIP">In Progress</SelectItem>
                      <SelectItem value="In Review">In Review</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
