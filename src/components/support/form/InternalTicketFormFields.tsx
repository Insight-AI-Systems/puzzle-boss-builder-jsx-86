
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupportTicket, TicketPriority } from '@/types/supportTicketTypes';

interface InternalTicketFormFieldsProps {
  ticket: Partial<SupportTicket>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const InternalTicketFormFields = ({
  ticket,
  handleInputChange,
  handleSelectChange
}: InternalTicketFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Briefly describe the internal issue"
          value={ticket.title}
          onChange={handleInputChange}
          required
          className="bg-puzzle-black/40 border-puzzle-aqua/20"
        />
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
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Provide detailed information about the internal issue"
          value={ticket.description}
          onChange={handleInputChange}
          required
          className="min-h-[200px] bg-puzzle-black/40 border-puzzle-aqua/20"
        />
      </div>
    </div>
  );
};
