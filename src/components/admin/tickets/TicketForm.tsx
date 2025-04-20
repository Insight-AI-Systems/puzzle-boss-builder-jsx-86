
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TicketFormProps {
  onSubmit: (values: { heading: string; description: string; status: 'WIP' | 'Completed' }) => void;
}

export function TicketForm({ onSubmit }: TicketFormProps) {
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'WIP' | 'Completed'>('WIP');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!heading.trim()) {
      alert('Please enter a heading');
      return;
    }
    
    onSubmit({ heading, description, status });
    
    // Reset form
    setHeading('');
    setDescription('');
    setStatus('WIP');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-card">
      <div className="space-y-2">
        <Label htmlFor="heading">Issue Heading</Label>
        <Input
          id="heading"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="Enter issue heading"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value: 'WIP' | 'Completed') => setStatus(value)}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WIP">Work In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full">Submit Issue</Button>
    </form>
  );
}
