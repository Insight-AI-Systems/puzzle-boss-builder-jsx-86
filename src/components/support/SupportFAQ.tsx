
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';
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

export const SupportFAQ = () => {
  return (
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
  );
};

export default SupportFAQ;
