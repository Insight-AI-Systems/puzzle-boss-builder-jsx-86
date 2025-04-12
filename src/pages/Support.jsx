
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import MainHeader from '@/components/header';

const Support = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to a backend
    toast.success("Support request submitted successfully! Our team will get back to you shortly.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-puzzle-black">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-puzzle-gold">Support Center</h1>
          <p className="text-muted-foreground mb-8">We're here to help you with any questions or issues you may have.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-card p-6 rounded-lg shadow-lg text-center">
              <div className="w-12 h-12 bg-puzzle-aqua/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-puzzle-aqua" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-card-foreground mb-4">For general inquiries and non-urgent issues.</p>
              <a href="mailto:support@puzzleboss.com" className="text-puzzle-aqua hover:underline">support@puzzleboss.com</a>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-lg text-center">
              <div className="w-12 h-12 bg-puzzle-aqua/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-puzzle-aqua" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
              <p className="text-card-foreground mb-4">Available 24/7 for immediate assistance.</p>
              <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                Start Chat
              </Button>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-lg text-center">
              <div className="w-12 h-12 bg-puzzle-aqua/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-puzzle-aqua" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Knowledge Base</h3>
              <p className="text-card-foreground mb-4">Browse our help docs and tutorials.</p>
              <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                View Articles
              </Button>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-puzzle-gold">Contact Us</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Your Name
                  </label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address
                  </label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="issueType" className="block text-sm font-medium">
                  Issue Type
                </label>
                <Select defaultValue="general">
                  <SelectTrigger>
                    <SelectValue placeholder="Select an issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="prize">Prize Fulfillment</SelectItem>
                    <SelectItem value="account">Account Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Your Message
                </label>
                <Textarea 
                  id="message" 
                  placeholder="Please describe your issue in detail..."
                  rows={6}
                  required
                />
              </div>
              
              <div>
                <Button type="submit" className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black">
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4 text-puzzle-aqua">Frequently Asked Questions</h3>
            <div className="space-y-4 text-left max-w-3xl mx-auto">
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-semibold mb-2">How do I purchase credits?</h4>
                <p className="text-card-foreground">You can purchase credits from your account dashboard. We accept various payment methods including credit cards and PayPal.</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What happens if I don't complete a puzzle?</h4>
                <p className="text-card-foreground">If you don't complete a puzzle within the time limit, your entry fee is not refunded. You can always try again in another contest.</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-semibold mb-2">How do I claim my prize?</h4>
                <p className="text-card-foreground">When you win a contest, you'll receive instructions via email on how to verify your identity and provide shipping information.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Support;
