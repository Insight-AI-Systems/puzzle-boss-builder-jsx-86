
import React, { useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageSquare, FileText, Ticket, Mail, PhoneCall } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import TicketList from '@/components/support/TicketList';
import TicketDetails from '@/components/support/TicketDetails';
import NewTicketForm from '@/components/support/NewTicketForm';

const commonQuestions = [
  {
    question: "How do I reset my password?",
    answer: "To reset your password, click the 'Forgot Password' link on the sign-in page. Enter your email address, and we'll send you instructions to reset your password."
  },
  {
    question: "When will I receive my prize?",
    answer: "After winning and completing the verification process, physical prizes are typically shipped within 5-7 business days. Delivery times vary based on your location, usually between 1-3 weeks. You can track your prize status in your account dashboard."
  },
  {
    question: "How do I purchase credits?",
    answer: "To purchase credits, go to your account dashboard and click on 'Buy Credits'. Choose your desired credit package, select your payment method, and follow the instructions to complete your purchase."
  },
  {
    question: "Why was my puzzle solution not accepted?",
    answer: "Puzzle solutions may not be accepted if they were incomplete, incorrect, or if our system detected unusual activity. If you believe there was an error, please contact our support team with details of the puzzle and your submission."
  },
  {
    question: "Can I get a refund for unused credits?",
    answer: "Credits are non-refundable once purchased. However, they never expire and can be used for any eligible puzzle on the platform."
  },
  {
    question: "How do I verify my identity to claim a prize?",
    answer: "After winning a prize, you'll be prompted to complete identity verification in your account. This typically requires uploading a government-issued ID and confirming your address. This process helps ensure fair play and proper prize delivery."
  },
  {
    question: "What happens if a puzzle has technical issues?",
    answer: "If you encounter technical issues during a puzzle, please take a screenshot and contact support immediately. If we confirm a technical issue affected the contest, we'll provide appropriate compensation such as credit refunds or entry into a similar contest."
  }
];

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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {commonQuestions.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-puzzle-white hover:text-puzzle-aqua hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
            
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Submit a support ticket.
              </p>
              <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80" asChild>
                <Link to="/support/new-ticket">
                  <Ticket className="h-4 w-4 mr-2" />
                  Create Support Ticket
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="contact">
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
        </TabsContent>
        
        <TabsContent value="tickets">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Ticket className="h-16 w-16 mx-auto mb-4 text-puzzle-aqua opacity-50" />
                  <h3 className="text-xl font-medium mb-2">View and Manage Your Support Tickets</h3>
                  <p className="text-muted-foreground mb-6">
                    Track the status of your support requests and communicate with our team.
                  </p>
                  <Button asChild>
                    <Link to="/support/tickets">
                      View My Tickets
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Support = () => {
  const location = useLocation();
  
  let subtitle = "Get help with your account, puzzles, and prizes";
  if (location.pathname.includes('/tickets')) {
    subtitle = "View and manage your support tickets";
  } else if (location.pathname.includes('/new-ticket')) {
    subtitle = "Create a new support ticket";
  }

  return (
    <PageLayout 
      title="Support Center" 
      subtitle={subtitle}
    >
      <Routes>
        <Route path="/" element={<SupportHome />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/:ticketId" element={<TicketDetails />} />
        <Route path="/new-ticket" element={<NewTicketForm />} />
      </Routes>
    </PageLayout>
  );
};

export default Support;
