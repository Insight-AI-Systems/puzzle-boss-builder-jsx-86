
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSupportTickets } from '@/hooks/support/useSupportTickets';
import { SupportTicket, TicketCategory, TicketPriority } from '@/types/supportTicketTypes';
import { SUPPORT_SYSTEM_CONFIG } from '@/services/openSupportsConfig';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const NewTicketForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addTicket } = useSupportTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get initial category from location state if provided
  const initialCategory = location.state?.category || 'tech';
  
  const [ticket, setTicket] = useState<Partial<SupportTicket>>({
    title: '',
    description: '',
    category: initialCategory as TicketCategory,
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
      navigate('/support/tickets');
    }
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-puzzle-aqua mb-4" />
            <h3 className="text-xl font-medium mb-2">Authentication Required</h3>
            <p className="text-puzzle-white/70 mb-6">
              Please log in to create a support ticket.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
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
        <CardHeader>
          <CardTitle>Create New Support Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Ticket Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Briefly describe your issue"
                  value={ticket.title}
                  onChange={handleInputChange}
                  required
                  className="bg-puzzle-black/40 border-puzzle-aqua/20"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={ticket.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger id="category" className="bg-puzzle-black/40 border-puzzle-aqua/20">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORT_SYSTEM_CONFIG.TICKET_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={ticket.priority} 
                    onValueChange={(value) => handleSelectChange('priority', value)}
                  >
                    <SelectTrigger id="priority" className="bg-puzzle-black/40 border-puzzle-aqua/20">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please provide detailed information about your issue"
                  value={ticket.description}
                  onChange={handleInputChange}
                  required
                  className="min-h-[200px] bg-puzzle-black/40 border-puzzle-aqua/20"
                />
              </div>
            </div>
            
            <CardFooter className="px-0 pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting || !ticket.title || !ticket.description}
                className="ml-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
