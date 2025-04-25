
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, MessageSquare, Ticket } from 'lucide-react';
import SupportFAQ from './SupportFAQ';
import SupportContact from './SupportContact';
import SupportTickets from './SupportTickets';

const SupportHome = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="faq" className="flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Us
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center">
            <Ticket className="h-4 w-4 mr-2" />
            My Tickets
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq">
          <SupportFAQ />
        </TabsContent>
        
        <TabsContent value="contact">
          <SupportContact />
        </TabsContent>
        
        <TabsContent value="tickets">
          <SupportTickets />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportHome;
