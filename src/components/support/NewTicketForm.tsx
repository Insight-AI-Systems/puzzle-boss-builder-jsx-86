
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupportTickets } from '@/hooks/support/useSupportTickets';
import { SupportTicket, TicketCategory, TicketPriority } from '@/types/supportTicketTypes';
import { useAuth } from '@/contexts/AuthContext';
import { AuthCheck } from './form/AuthCheck';
import { TicketFormHeader } from './form/TicketFormHeader';
import { InternalTicketFormFields } from './form/InternalTicketFormFields';

export const NewTicketForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addTicket } = useSupportTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [ticket, setTicket] = useState<Partial<SupportTicket>>({
    title: '',
    description: '',
    category: 'internal' as TicketCategory,
    priority: 'medium' as TicketPriority,
    id: crypto.randomUUID()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    const success = await addTicket(ticket);
    
    if (success) {
      navigate(`/support/tickets?view=internal`);
    }
    setIsSubmitting(false);
  };

  if (!user) {
    return <AuthCheck />;
  }

  return (
    <div>
      <Button 
        variant="outline" 
        onClick={() => navigate('/support')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Support
      </Button>

      <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
        <TicketFormHeader />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <InternalTicketFormFields
              ticket={ticket}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
            />
            
            <CardFooter className="px-0 pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting || !ticket.title || !ticket.description}
                className="ml-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Issue'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
