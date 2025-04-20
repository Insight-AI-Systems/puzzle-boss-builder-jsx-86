
import React from 'react';
import { Pencil } from 'lucide-react';  // Changed from 'pencil' to 'Pencil'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ticket } from '@/hooks/useTickets';

interface EditTicketDialogProps {
  ticket: Ticket;
  onSave: (id: string, updates: Partial<Ticket>) => void;
}

export function EditTicketDialog({ ticket, onSave }: EditTicketDialogProps) {
  const [heading, setHeading] = React.useState(ticket.heading);
  const [description, setDescription] = React.useState(ticket.description);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSave = () => {
    onSave(ticket.id, {
      heading,
      description,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />  {/* Changed from pencil to Pencil */}
          <span className="sr-only">Edit ticket</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Issue</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="heading">
              Heading
            </label>
            <Input
              id="heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
