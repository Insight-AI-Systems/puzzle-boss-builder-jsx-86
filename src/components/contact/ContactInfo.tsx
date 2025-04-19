import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, PhoneCall, MapPin, Clock } from 'lucide-react';
const ContactInfo = () => {
  return <div className="space-y-8">
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
              <a href="mailto:contact@puzzleboss.com" className="text-puzzle-aqua hover:underline">admin@thepuzzleboss.com</a>
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
                <p>24 hours</p>
                <p>Saturday</p>
                <p>24 Hours</p>
                <p>Sunday</p>
                <p>24 Hours</p>
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
    </div>;
};
export default ContactInfo;