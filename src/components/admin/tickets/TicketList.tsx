
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Ticket } from '@/hooks/useTickets';

interface TicketListProps {
  tickets: Ticket[];
  onUpdateStatus: (id: string, status: 'WIP' | 'Completed') => void;
}

export function TicketList({ tickets, onUpdateStatus }: TicketListProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Ticket>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filteredTickets = tickets.filter(ticket =>
    ticket.heading.toLowerCase().includes(search.toLowerCase()) ||
    ticket.description.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    return sortDirection === "asc" 
      ? aVal > bVal ? 1 : -1
      : aVal < bVal ? 1 : -1;
  });

  const toggleSort = (field: keyof Ticket) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search tickets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => toggleSort("heading")}
              >
                Heading
              </Button>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => toggleSort("status")}
              >
                Status
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => toggleSort("created_at")}
              >
                Created At
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.heading}</TableCell>
              <TableCell className="max-w-md truncate">{ticket.description}</TableCell>
              <TableCell>
                <Switch
                  checked={ticket.status === 'Completed'}
                  onCheckedChange={(checked) => 
                    onUpdateStatus(ticket.id, checked ? 'Completed' : 'WIP')
                  }
                />
              </TableCell>
              <TableCell>
                {new Date(ticket.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
