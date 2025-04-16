
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Star, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MembershipOverviewProps {
  subscriptionData: {
    active: boolean;
    plan: string;
    renewalDate?: string;
    credits: number;
    maxCredits: number;
  };
  isLoadingPortal: boolean;
  isCheckingSubscription: boolean;
  onCheckSubscription: () => void;
  onOpenCustomerPortal: () => void;
}

export const MembershipOverview: React.FC<MembershipOverviewProps> = ({
  subscriptionData,
  isLoadingPortal,
  isCheckingSubscription,
  onCheckSubscription,
  onOpenCustomerPortal,
}) => {
  return (
    <Card className="border-puzzle-aqua/30 bg-puzzle-black/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-puzzle-white">Current Membership</CardTitle>
            <CardDescription>Your subscription details and credits</CardDescription>
          </div>
          <div className="flex items-center">
            <div className={`rounded-full px-3 py-1 text-xs font-medium ${
              subscriptionData.active 
                ? 'bg-green-500/20 text-green-500' 
                : 'bg-yellow-500/20 text-yellow-500'
            }`}>
              {subscriptionData.active ? 'Active' : 'Free Tier'}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-puzzle-aqua/5 rounded-lg border border-puzzle-aqua/20">
            <div className="text-sm text-puzzle-white/70 mb-1">Current Plan</div>
            <div className="text-xl font-semibold text-puzzle-white flex items-center">
              {subscriptionData.plan}
              {subscriptionData.plan !== 'Free' && (
                <Star className="ml-1 h-4 w-4 text-puzzle-gold" />
              )}
            </div>
          </div>
          
          <div className="p-4 bg-puzzle-aqua/5 rounded-lg border border-puzzle-aqua/20">
            <div className="text-sm text-puzzle-white/70 mb-1">Next Renewal</div>
            <div className="text-xl font-semibold text-puzzle-white">
              {subscriptionData.renewalDate 
                ? new Date(subscriptionData.renewalDate).toLocaleDateString() 
                : 'N/A'}
            </div>
          </div>
          
          <div className="p-4 bg-puzzle-aqua/5 rounded-lg border border-puzzle-aqua/20">
            <div className="text-sm text-puzzle-white/70 mb-1">Available Credits</div>
            <div className="text-xl font-semibold text-puzzle-white">
              {subscriptionData.credits} / {subscriptionData.maxCredits}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={(subscriptionData.credits / subscriptionData.maxCredits) * 100} 
            className="h-2 bg-puzzle-aqua/20" 
          />
          <p className="text-sm text-puzzle-white/70">
            Credits refresh on your next billing date. Use them to play premium puzzles and enter competitions.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onOpenCustomerPortal} 
          disabled={isLoadingPortal || !subscriptionData.active}
          variant={subscriptionData.active ? "default" : "outline"}
          className={`${subscriptionData.active ? '' : 'border-puzzle-aqua/50 hover:bg-puzzle-aqua/10'}`}
        >
          {isLoadingPortal ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Settings className="mr-2 h-4 w-4" />
          )}
          Manage Subscription
        </Button>
        
        <Button 
          variant={subscriptionData.active ? "outline" : "default"}
          className={`${subscriptionData.active ? 'border-puzzle-aqua/50 hover:bg-puzzle-aqua/10' : ''}`}
          asChild
        >
          <Link to="/membership">
            {subscriptionData.active ? 'Change Plan' : 'Upgrade Plan'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
