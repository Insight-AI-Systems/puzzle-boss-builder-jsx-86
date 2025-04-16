
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  CreditCard, 
  AlertCircle, 
  Loader2, 
  Star,
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { MembershipTier } from '@/components/admin/email/types';

const Membership = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUserId, profile } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipTier | null>(null);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  
  // Example pricing plans
  const pricingPlans: MembershipTier[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Basic access to puzzle competitions',
      price: 0,
      interval: 'month',
      credits: 10,
      features: [
        'Access to free puzzles', 
        '10 credits per month',
        'Public leaderboards',
        'Basic account features',
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Enhanced access with more features',
      price: billingInterval === 'month' ? 9.99 : 99.99,
      interval: billingInterval,
      credits: 50,
      is_popular: true,
      features: [
        'All Free features',
        '50 credits per month',
        'Access to Premium puzzles',
        'Exclusive competitions',
        'Priority customer support',
      ]
    },
    {
      id: 'elite',
      name: 'Elite',
      description: 'Maximum access to all features',
      price: billingInterval === 'month' ? 19.99 : 199.99,
      interval: billingInterval,
      credits: 100,
      features: [
        'All Premium features',
        '100 credits per month',
        'Early access to new puzzles',
        'VIP competitions with higher value prizes',
        'Dedicated account manager',
        'No ads anywhere',
      ]
    }
  ];

  const handleSelectPlan = (plan: MembershipTier) => {
    if (!currentUserId) {
      toast({
        title: "Login Required",
        description: "Please sign in to select a membership plan.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    if (plan.price === 0) {
      // Free plan doesn't need payment
      setIsLoading(true);
      
      // Simulate API call for free tier
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Free Plan Activated",
          description: "You're now on the Free plan with 10 credits.",
        });
      }, 1000);
      
      return;
    }
    
    setSelectedPlan(plan);
    setShowDialog(true);
  };

  const handlePurchase = async () => {
    if (!selectedPlan) return;
    
    setIsLoading(true);
    
    try {
      // Call Supabase Edge Function to create Stripe checkout
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          priceId: selectedPlan.stripe_price_id || 'price_mock_id',
          interval: billingInterval
        }
      });
      
      if (error) throw error;
      
      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-puzzle-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-puzzle-aqua">
            Membership Plans
          </h1>
          <p className="text-puzzle-white/70 max-w-2xl mx-auto">
            Choose the perfect membership plan that fits your puzzle-solving ambitions. 
            Upgrade anytime to unlock more puzzles, earn additional credits, and win bigger prizes.
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <Tabs 
            defaultValue="month" 
            value={billingInterval}
            onValueChange={(v) => setBillingInterval(v as 'month' | 'year')}
            className="w-full max-w-xs"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="month">Monthly</TabsTrigger>
              <TabsTrigger value="year">
                Yearly 
                <Badge variant="outline" className="ml-2 bg-puzzle-gold/20 text-puzzle-gold">
                  Save 15%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`border ${plan.is_popular ? 'border-puzzle-gold' : 'border-puzzle-aqua/20'} bg-puzzle-black/50 relative overflow-hidden`}
            >
              {plan.is_popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-puzzle-gold text-puzzle-black px-3 py-1 transform rotate-45 translate-x-6 translate-y-3">
                    <span className="text-xs font-bold flex items-center">
                      <Star className="w-3 h-3 mr-1" /> Popular
                    </span>
                  </div>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl text-puzzle-white">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-puzzle-aqua">
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-puzzle-white/70 ml-2">
                      /{plan.interval}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-t border-puzzle-white/10 pt-4">
                  <h4 className="font-medium mb-2 text-puzzle-white">Features</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-puzzle-gold flex-shrink-0 mr-2" />
                        <span className="text-puzzle-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t border-puzzle-white/10 pt-4">
                  <h4 className="font-medium mb-2 text-puzzle-white">Credits</h4>
                  <div className="flex items-center">
                    <div className="h-3 bg-puzzle-gold rounded-full" style={{ width: `${Math.min(plan.credits, 100)}%` }}></div>
                    <span className="ml-2 text-puzzle-white/80">{plan.credits} credits</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSelectPlan(plan)} 
                  className={`w-full ${plan.is_popular ? 'bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90' : ''}`}
                  disabled={isLoading || (profile?.role === 'player' && profile?.id === currentUserId)}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : plan.price === 0 ? (
                    'Get Started'
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Subscribe Now
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="bg-puzzle-aqua/5 p-6 rounded-lg border border-puzzle-aqua/20 mt-12">
          <h2 className="text-xl font-bold text-puzzle-white mb-4">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How do credits work?",
                answer: "Credits are used to play puzzles. Different puzzles require different amounts of credits. Free members get 10 credits per month, Premium members get 50, and Elite members get 100."
              },
              {
                question: "Can I upgrade my plan later?",
                answer: "Yes, you can upgrade your plan at any time. Your new benefits will be applied immediately, and you'll be charged the prorated amount for the remainder of your billing cycle."
              },
              {
                question: "Is there a refund policy?",
                answer: "We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team within 7 days of your purchase for a full refund."
              },
              {
                question: "How do I cancel my subscription?",
                answer: "You can cancel your subscription at any time from your account settings. You'll continue to have access to your benefits until the end of your current billing period."
              }
            ].map((faq, i) => (
              <div key={i} className="space-y-2">
                <h3 className="font-medium text-puzzle-white">{faq.question}</h3>
                <p className="text-puzzle-white/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscribe to {selectedPlan?.name}</DialogTitle>
            <DialogDescription>
              You're about to subscribe to the {selectedPlan?.name} plan for ${selectedPlan?.price}/{selectedPlan?.interval}.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/20">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Billing</span>
                  <span className="font-medium">{billingInterval === 'month' ? 'Monthly' : 'Yearly'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">${selectedPlan.price}/{selectedPlan.interval}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credits</span>
                  <span className="font-medium">{selectedPlan.credits} credits</span>
                </div>
              </div>
              
              <div className="flex items-start">
                <AlertCircle className="text-yellow-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  By subscribing, you agree to our Terms of Service and authorize us to charge your payment method until you cancel.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePurchase} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscribe Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Membership;
