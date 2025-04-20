
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HandshakeIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  name: string;
  email: string;
  company: string;
  position: string;
  interest: string;
  budget: string;
  message: string;
}

const PartnershipForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    position: '',
    interest: '',
    budget: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('handle-partnership', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Partnership inquiry submitted!",
        description: "Thank you for your interest. We'll be in touch soon!",
      });

      setFormData({
        name: '',
        email: '',
        company: '',
        position: '',
        interest: '',
        budget: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting partnership form:', error);
      toast({
        title: "Error submitting form",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="border-puzzle-aqua/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <HandshakeIcon className="h-5 w-5 mr-2 text-puzzle-aqua" />
          Partner with Us
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">Your Name</label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="block text-sm font-medium">Company Name</label>
              <Input 
                id="company" 
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Your company"
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="position" className="block text-sm font-medium">Your Position</label>
              <Input 
                id="position" 
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="e.g. Marketing Director"
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="interest" className="block text-sm font-medium">Partnership Interest</label>
            <Select value={formData.interest} onValueChange={(value) => handleInputChange('interest', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your partnership interest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prize">Prize Sponsorship</SelectItem>
                <SelectItem value="branded">Branded Puzzles</SelectItem>
                <SelectItem value="category">Category Sponsorship</SelectItem>
                <SelectItem value="promotional">Promotional Events</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-medium">Estimated Budget Range</label>
            <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-5k">$0 - $5,000</SelectItem>
                <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                <SelectItem value="50k+">$50,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium">Partnership Details</label>
            <Textarea 
              id="message" 
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Please describe your partnership proposal or inquiry..."
              rows={5}
              required
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Partnership Inquiry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PartnershipForm;
