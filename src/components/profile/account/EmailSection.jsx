
import React, { useState } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const EmailSection = ({ user, loading, setLoading }) => {
  const { toast } = useToast();
  const [currentEmail, setCurrentEmail] = useState(user.email);
  const [newEmail, setNewEmail] = useState("");
  
  const handleEmailChange = async (e) => {
    e.preventDefault();
    
    if (!newEmail) {
      toast({
        title: "Error",
        description: "Please enter a new email address",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // This would be implemented with Supabase auth in a real application
    setTimeout(() => {
      toast({
        title: "Verification email sent",
        description: "Please check your inbox to verify your new email address"
      });
      setLoading(false);
      setNewEmail("");
    }, 1000);
  };
  
  return (
    <AccordionItem value="email" className="border-puzzle-aqua/20">
      <AccordionTrigger className="text-puzzle-white">
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-puzzle-aqua" />
          Change Email
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <form onSubmit={handleEmailChange} className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">Current Email</label>
            <Input
              type="email"
              value={currentEmail}
              disabled
              className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white/70"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">New Email</label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
            />
          </div>
          <Button 
            type="submit"
            className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/80"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Verification"}
          </Button>
        </form>
      </AccordionContent>
    </AccordionItem>
  );
};

export default EmailSection;
