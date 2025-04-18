import React from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, DollarSign, Trophy, ShieldCheck } from 'lucide-react';

// FAQ categories with their questions
const faqCategories = [
  {
    id: 'general',
    label: 'General',
    icon: Search,
    questions: [
      {
        question: "What is The Puzzle Boss?",
        answer: "The Puzzle Boss is a global, skill-based jigsaw puzzle platform where players race to complete puzzles to win premium brand-name prizes. Our platform emphasizes fair play, authenticity, and secure gameplay, providing an exciting and rewarding experience for puzzle enthusiasts."
      },
      {
        question: "How do I create an account?",
        answer: "Creating an account is simple! Click the 'Sign Up' button in the top right corner of our website, enter your email address, create a password, and complete the registration form. You can also sign up using your Google or Apple account for faster registration."
      },
      {
        question: "Is The Puzzle Boss available worldwide?",
        answer: "Yes, The Puzzle Boss is available to players worldwide. However, prize eligibility may vary based on your location due to different regulations and shipping restrictions. Please check the specific contest rules for each puzzle to confirm eligibility in your region."
      },
      {
        question: "What types of puzzles do you offer?",
        answer: "We currently focus on digital jigsaw puzzles of varying difficulties and piece counts. We plan to expand to other puzzle types in the future based on user feedback and platform growth."
      },
      {
        question: "How can I contact customer support?",
        answer: "You can reach our customer support team through our Contact page, by emailing support@puzzleboss.com, or through the live chat feature available on our website during business hours (9am-5pm EST, Monday-Friday)."
      }
    ]
  },
  {
    id: 'gameplay',
    label: 'Gameplay',
    icon: Trophy,
    questions: [
      {
        question: "How do the puzzle competitions work?",
        answer: "Players enter competitions by using credits to join a specific puzzle challenge. Once entered, you compete to complete the puzzle in the fastest time. Winners are determined based on completion time and accuracy. Some puzzles may have multiple prize winners depending on the contest structure."
      },
      {
        question: "Can I pause a puzzle once I've started?",
        answer: "Yes, most puzzles allow limited pausing functionality. However, competitive puzzles may have restrictions on pause duration or frequency to ensure fair play. The specific pause rules will be clearly displayed before you begin each puzzle."
      },
      {
        question: "What happens if I lose internet connection during a puzzle?",
        answer: "Our system automatically saves your progress at regular intervals. If you lose connection, you can resume from your last saved point when you reconnect. For competitive puzzles, the timer continues running during disconnection to ensure fairness."
      },
      {
        question: "Are there different difficulty levels?",
        answer: "Yes, we offer puzzles in various difficulty levels from Easy to Expert. Difficulty is determined by the number of pieces, image complexity, and time limits. You can filter puzzles by difficulty level to find challenges that match your skill level."
      },
      {
        question: "Can I practice before entering a competition?",
        answer: "Absolutely! We offer free practice puzzles that allow you to hone your skills without using credits. These puzzles do not offer prizes but are great for improving your speed and technique."
      }
    ]
  },
  {
    id: 'prizes',
    label: 'Prizes',
    icon: DollarSign,
    questions: [
      {
        question: "How do I claim a prize after winning?",
        answer: "When you win a prize, you'll receive a notification and email with instructions. You'll need to verify your identity and provide shipping information through your account dashboard. Once verified, prizes are typically shipped within 5-7 business days."
      },
      {
        question: "Are the prizes brand new and authentic?",
        answer: "Yes, all prizes on The Puzzle Boss are 100% authentic and brand new. We source our prizes directly from authorized retailers or manufacturers to ensure you receive genuine, high-quality items."
      },
      {
        question: "What happens if a prize is out of stock?",
        answer: "In the rare event that a prize becomes unavailable after a competition ends, we will offer you an equivalent or higher value alternative, or the option to receive the cash value of the prize instead."
      },
      {
        question: "Do I have to pay for shipping if I win?",
        answer: "No, shipping costs are covered by The Puzzle Boss for standard delivery. Expedited shipping options may be available at an additional cost. Import duties or taxes may apply for international shipments depending on your country's regulations."
      },
      {
        question: "How long does it take to receive my prize?",
        answer: "After completing the verification process, domestic prizes typically arrive within 7-14 days, while international shipments may take 2-4 weeks depending on your location and customs processing."
      }
    ]
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: ShieldCheck,
    questions: [
      {
        question: "How do I purchase credits?",
        answer: "Credits can be purchased through your account dashboard. We accept major credit cards, PayPal, and various local payment methods. Credits are available in different bundle sizes, with bonus credits offered for larger purchases."
      },
      {
        question: "Are there subscription options available?",
        answer: "Yes, we offer membership tiers that provide monthly credit allocations, discounted credit rates, exclusive puzzles, and other benefits. You can view and manage subscriptions from your account dashboard."
      },
      {
        question: "Can I get a refund for unused credits?",
        answer: "Credits are non-refundable once purchased. However, they never expire and can be used for any eligible puzzle on the platform."
      },
      {
        question: "Is my payment information secure?",
        answer: "Absolutely. We use industry-standard encryption and secure payment processors. We never store your complete credit card information on our servers, ensuring your financial data remains protected."
      },
      {
        question: "Do you offer any free ways to earn credits?",
        answer: "Yes! You can earn free credits by referring friends, participating in special promotions, completing daily challenges, and through our loyalty program that rewards regular platform engagement."
      }
    ]
  }
];

const FAQ = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-game text-puzzle-aqua mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to the most common questions about The Puzzle Boss
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search the FAQ..." 
              className="pl-10 bg-puzzle-black/30 border-puzzle-aqua/30 focus:border-puzzle-aqua"
            />
          </div>
        </div>
        
        {/* FAQ Tabs and Content */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full flex justify-center mb-8 bg-puzzle-black/50 border border-puzzle-aqua/20 p-1">
            {faqCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center data-[state=active]:bg-puzzle-aqua/20"
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {faqCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-puzzle-aqua/20">
                    <AccordionTrigger className="text-lg font-medium text-puzzle-white hover:text-puzzle-aqua hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Contact Section */}
        <div className="mt-16 p-8 bg-gradient-to-r from-puzzle-black/80 to-puzzle-aqua/10 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-puzzle-white mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            If you couldn't find the answer to your question in our FAQ, please don't hesitate to reach out to our support team.
          </p>
          <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQ;
