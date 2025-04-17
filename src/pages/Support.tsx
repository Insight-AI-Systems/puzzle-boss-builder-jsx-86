
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, MessageSquare, FileText, PhoneCall, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const Support = () => {
  return (
    <PageLayout 
      title="Support Center" 
      subtitle="Get help with your account, puzzles, and prizes"
    >
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
          <TabsTrigger value="guides" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Help Guides
          </TabsTrigger>
        </TabsList>
        
        {/* FAQ Tab */}
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
                Can't find what you're looking for? Contact our support team.
              </p>
              <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Contact Us Tab */}
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
        
        {/* Help Guides Tab */}
        <TabsContent value="guides">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Help Guides & Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-puzzle-aqua/20 rounded-lg overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-puzzle-aqua/20 to-puzzle-aqua/5 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-puzzle-aqua" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-2">Getting Started Guide</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Learn the basics of The Puzzle Boss platform, from creating your account to winning your first prize.
                      </p>
                      <Link to="/guides/getting-started-guide">
                        <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                          Read Guide
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border border-puzzle-aqua/20 rounded-lg overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-puzzle-aqua/20 to-puzzle-aqua/5 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-puzzle-aqua" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-2">Puzzle Techniques</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Advanced strategies and techniques to improve your puzzle-solving speed and efficiency.
                      </p>
                      <Link to="/guides/puzzle-techniques">
                        <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                          Read Guide
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border border-puzzle-aqua/20 rounded-lg overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-puzzle-aqua/20 to-puzzle-aqua/5 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-puzzle-aqua" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-2">Prize Claim Process</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Step-by-step instructions for claiming and receiving your prizes after winning a contest.
                      </p>
                      <Link to="/guides/prize-claim-process">
                        <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                          Read Guide
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border border-puzzle-aqua/20 rounded-lg overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-puzzle-aqua/20 to-puzzle-aqua/5 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-puzzle-aqua" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-2">Account Management</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Learn how to manage your profile, subscriptions, payment methods, and security settings.
                      </p>
                      <Link to="/guides/account-management">
                        <Button variant="outline" className="w-full border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                          Read Guide
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Support;
