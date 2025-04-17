
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, MessageSquare, PhoneCall, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <PageLayout 
      title="Contact Us" 
      subtitle="Have questions or feedback? Reach out to our team"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card className="border-puzzle-aqua/20">
          <CardHeader>
            <CardTitle className="text-puzzle-aqua flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Send Us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="support">Customer Support</SelectItem>
                    <SelectItem value="billing">Billing Issue</SelectItem>
                    <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Your Message
                </label>
                <Textarea 
                  id="message" 
                  placeholder="Please describe your inquiry in detail..."
                  rows={6}
                />
              </div>
              
              <Button className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Contact Information */}
        <div className="space-y-8">
          <Card className="border-puzzle-aqua/20">
            <CardHeader>
              <CardTitle className="text-puzzle-aqua flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-puzzle-aqua/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-puzzle-aqua" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email Us</h3>
                  <a href="mailto:contact@puzzleboss.com" className="text-puzzle-aqua hover:underline">
                    contact@puzzleboss.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-puzzle-aqua/20 flex items-center justify-center flex-shrink-0">
                  <PhoneCall className="h-5 w-5 text-puzzle-aqua" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Call Us</h3>
                  <p className="text-puzzle-white">+1 (555) 123-4567</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monday-Friday, 9am-5pm EST
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-puzzle-aqua/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-puzzle-aqua" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Office Address</h3>
                  <p className="text-puzzle-white">
                    123 Puzzle Street, Suite 456<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-puzzle-aqua/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-puzzle-aqua" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Business Hours</h3>
                  <div className="grid grid-cols-2 gap-x-4 text-sm">
                    <p>Monday - Friday</p>
                    <p>9:00 AM - 5:00 PM</p>
                    <p>Saturday</p>
                    <p>10:00 AM - 2:00 PM</p>
                    <p>Sunday</p>
                    <p>Closed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-puzzle-aqua/20">
            <CardContent className="p-6">
              <div className="h-64 bg-puzzle-black/50 flex items-center justify-center rounded border border-puzzle-aqua/20">
                <MapPin className="h-12 w-12 text-puzzle-aqua/50" />
                <span className="absolute">PLACEHOLDER: Interactive Map</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
