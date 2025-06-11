
import { useState } from 'react';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
  updated_at: string;
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createTicket = async (title: string, description: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Creating ticket:', { title, description });
      
      // Mock ticket creation
      const newTicket: Ticket = {
        id: crypto.randomUUID(),
        title,
        description,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setTickets(prev => [newTicket, ...prev]);
      return true;
    } catch (error) {
      console.error('Error creating ticket:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tickets,
    isLoading,
    createTicket
  };
};
