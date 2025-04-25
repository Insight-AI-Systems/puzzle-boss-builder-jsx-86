
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, PhoneCall } from 'lucide-react';

export const SupportContact = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Our Support Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center p-4 border border-puzzle-aqua/20 rounded-lg">
                <Mail className="h-8 w-8 text-puzzle-aqua mb-2" />
                <h3 className="text-lg font-medium mb-1">Email Support</h3>
                <p className="text-center text-muted-foreground text-sm">
                  Get a response within 24 hours
                </p>
                <a href="mailto:support@puzzleboss.com" className="text-puzzle-aqua hover:underline mt-2">
                  support@puzzleboss.com
                </a>
              </div>
              
              <div className="flex flex-col items-center p-4 border border-puzzle-aqua/20 rounded-lg">
                <MessageSquare className="h-8 w-8 text-puzzle-aqua mb-2" />
                <h3 className="text-lg font-medium mb-1">Live Chat</h3>
                <p className="text-center text-muted-foreground text-sm">
                  Available 9am-5pm EST, Mon-Fri
                </p>
                <Button variant="link" className="text-puzzle-aqua mt-2">
                  Start Chat
                </Button>
              </div>
              
              <div className="flex flex-col items-center p-4 border border-puzzle-aqua/20 rounded-lg">
                <PhoneCall className="h-8 w-8 text-puzzle-aqua mb-2" />
                <h3 className="text-lg font-medium mb-1">Phone Support</h3>
                <p className="text-center text-muted-foreground text-sm">
                  Premium members only
                </p>
                <span className="text-puzzle-aqua mt-2">1-800-PUZZLES</span>
              </div>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Your Name
                  </label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address
                  </label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium">
                  Subject
                </label>
                <Input id="subject" placeholder="What is your inquiry about?" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  placeholder="Please describe your issue in detail..."
                  rows={6}
                />
              </div>
              
              <Button className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80">
                Send Message
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportContact;
