
import React from 'react';
import { Ticket } from '@/hooks/useTickets';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditTicketDialog } from './EditTicketDialog';
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
  onUpdateStatus: (id: string, status: 'WIP' | 'Completed') => void;
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
                <Badge variant={ticket.status === 'WIP' ? 'outline' : 'default'}>
                  {ticket.status === 'WIP' ? 'In Progress' : 'Completed'}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(ticket.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <EditTicketDialog ticket={ticket} onSave={onUpdateTicket} />
                  {ticket.status === 'WIP' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus(ticket.id, 'Completed')}
                    >
                      Mark Complete
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus(ticket.id, 'WIP')}
                    >
                      Reopen
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
