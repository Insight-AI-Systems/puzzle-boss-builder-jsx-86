
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface TicketHeaderProps {
  ticketId: string;
  refetch: () => void;
}

export const TicketHeader = ({ ticketId, refetch }: TicketHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/support/tickets')}
        className="mr-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to tickets
      </Button>
      
      <h2 className="text-xl font-bold flex-1">Ticket #{ticketId}</h2>
      
      <Button onClick={refetch} variant="outline" size="icon">
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
