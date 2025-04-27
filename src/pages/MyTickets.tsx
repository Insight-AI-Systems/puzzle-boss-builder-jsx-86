
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTickets } from '@/hooks/useTickets';
import { CreateTicketDialog } from '@/components/tickets/CreateTicketDialog';
import { TicketList } from '@/components/tickets/TicketList';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function MyTickets() {
  const { tickets, isLoading, createTicket } = useTickets();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Support Tickets</CardTitle>
          <CreateTicketDialog onCreateTicket={createTicket} />
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              You haven't created any tickets yet.
            </p>
          ) : (
            <TicketList tickets={tickets} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
