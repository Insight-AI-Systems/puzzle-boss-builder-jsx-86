
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PuzzleIcon, Trophy, UserCheck, DollarSign, Star, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Create Your Account',
    description: 'Sign up for free and complete your profile to start your puzzle journey.',
    icon: UserCheck,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Choose a Puzzle',
    description: 'Browse available puzzles across various categories and difficulty levels.',
    icon: PuzzleIcon,
    color: 'bg-purple-500'
  },
  {
    id: 3,
    title: 'Purchase Credits',
    description: 'Buy credits to enter puzzles. Credits cost varies based on the prize value.',
    icon: DollarSign,
    color: 'bg-green-500'
  },
  {
    id: 4,
    title: 'Complete the Puzzle',
    description: 'Solve the puzzle as quickly as possible to compete for the prize.',
    icon: Star,
    color: 'bg-amber-500'
  },
  {
    id: 5,
    title: 'Win Prizes',
    description: 'If you have the fastest valid completion time, you win the prize!',
    icon: Trophy,
    color: 'bg-puzzle-gold'
  }
];

const faqs = [
  {
    question: "How do I know the puzzles are fair?",
    answer: "All puzzles on The Puzzle Boss are skill-based and designed for fair competition. Our advanced anti-cheating systems ensure a level playing field for all participants. Each puzzle is tested extensively before being released to ensure it works properly and has a clear solution."
  },
  {
    question: "Are the prizes real and authentic?",
    answer: "Yes, all prizes are 100% authentic and brand new. We source our prizes directly from authorized retailers or manufacturers. When you win, you receive the exact prize as advertised - no substitutions or knockoffs."
  },
  {
    question: "How long do I have to complete a puzzle?",
    answer: "Each puzzle has its own time window, typically ranging from 1 day to 1 week. The remaining time is clearly displayed on each puzzle listing. Once you start a puzzle, your completion time begins and continues until you submit your solution."
  },
  {
    question: "How do I claim my prize if I win?",
    answer: "Winners are notified via email and in their account dashboard. You'll need to complete an identity verification process to confirm your win. Once verified, we'll arrange for the prize to be shipped directly to your registered address."
  },
  {
    question: "What happens if there's a tie?",
    answer: "In the rare event of a tie (identical completion times down to the millisecond), both winners will receive the prize. Our system uses high-precision timing to minimize the possibility of ties."
  },
  {
    question: "Can I get a refund for my credits?",
    answer: "Credits are non-refundable once purchased. However, if a puzzle is cancelled for any reason, the credits used to enter that puzzle will be returned to your account automatically."
  },
  {
    question: "How do you prevent cheating?",
    answer: "We employ multiple layers of security and monitoring to detect and prevent cheating. This includes browser monitoring, solution verification algorithms, and manual reviews of suspicious activities. Anyone caught cheating is permanently banned from the platform."
  }
];

const HowItWorks = () => {
  return (
    <PageLayout 
      title="How It Works" 
      subtitle="Learn how to play and win premium prizes on The Puzzle Boss"
    >
      {/* Steps section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-puzzle-aqua mb-8 text-center">5 Simple Steps to Win</h2>
        
        <div className="relative">
          {/* Progress line connecting the steps */}
          <div className="absolute top-12 left-10 w-[1px] h-[calc(100%-100px)] bg-puzzle-aqua/30 hidden md:block" />
          
          <div className="space-y-12">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col md:flex-row gap-6 items-start relative">
                <div className={`flex items-center justify-center w-20 h-20 rounded-full ${step.color} text-white shrink-0 z-10`}>
                  <step.icon size={32} />
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-puzzle-white mb-2">
                    Step {step.id}: {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Competitive advantage section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-puzzle-aqua mb-8 text-center">Why Choose The Puzzle Boss</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
            <CardHeader>
              <CardTitle className="flex items-center text-puzzle-white">
                <CheckCircle2 className="h-5 w-5 mr-2 text-puzzle-aqua" />
                Fair Competition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our platform is designed to ensure all players have an equal opportunity to win based on their skills, not luck.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
            <CardHeader>
              <CardTitle className="flex items-center text-puzzle-white">
                <CheckCircle2 className="h-5 w-5 mr-2 text-puzzle-aqua" />
                Authentic Prizes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Every prize is 100% authentic and brand new, sourced directly from authorized retailers or manufacturers.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black/50 border-puzzle-aqua/20">
            <CardHeader>
              <CardTitle className="flex items-center text-puzzle-white">
                <CheckCircle2 className="h-5 w-5 mr-2 text-puzzle-aqua" />
                Secure Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                State-of-the-art security measures protect your personal information and ensure the integrity of competitions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* FAQ section */}
      <section>
        <h2 className="text-2xl font-bold text-puzzle-aqua mb-8 text-center">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-puzzle-white hover:text-puzzle-aqua hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-10 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to start solving puzzles and winning prizes?
          </p>
          <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
            Get Started Now
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default HowItWorks;
