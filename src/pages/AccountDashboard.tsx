
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  Calendar, 
  Users, 
  Settings, 
  Zap, 
  LogOut, 
  Edit, 
  Star, 
  RefreshCw, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { MembershipTier } from '@/components/admin/email/types';

const AccountDashboard = () => {
  const { toast } = useToast();
  const { currentUserId, profile, isLoading: profileLoading } = useUserProfile();
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<{
    active: boolean;
    plan: string;
    renewalDate?: string;
    credits: number;
    maxCredits: number;
  }>({
    active: false,
    plan: 'Free',
    credits: 10,
    maxCredits: 100
  });
  
  const [referralData, setReferralData] = useState({
    code: profile?.referral_code || `PUZZLER${Math.floor(Math.random() * 10000)}`,
    referred: 0,
    bonusEarned: 0
  });
  
  // Mock data for recent activity
  const recentActivity = [
    { id: 1, action: 'Completed puzzle', name: 'Ocean Treasures', date: '2 hours ago', reward: '+5 credits' },
    { id: 2, action: 'Friend joined', name: 'User184290', date: '1 day ago', reward: '+10 credits' },
    { id: 3, action: 'Subscription renewed', name: 'Premium Plan', date: '5 days ago', reward: '' },
    { id: 4, action: 'Won competition', name: 'Weekly Challenge', date: '1 week ago', reward: 'Prize Pending' },
  ];
  
  // Redirect to auth if not logged in
  if (!profileLoading && !currentUserId) {
    return <Navigate to="/auth" replace />;
  }
  
  const checkSubscription = async () => {
    setIsCheckingSubscription(true);
    
    try {
      // Call Supabase Edge Function to check subscription status
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      if (data) {
        // Update subscription data based on response
        setSubscriptionData({
          active: data.subscribed || false,
          plan: data.subscription_tier || 'Free',
          renewalDate: data.subscription_end,
          credits: data.subscribed ? 50 : 10, // Mock values based on tier
          maxCredits: 100
        });
        
        toast({
          title: "Subscription Status Updated",
          description: "Your membership information has been refreshed.",
        });
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast({
        title: "Update Failed",
        description: "Unable to refresh your membership status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingSubscription(false);
    }
  };
  
  const openCustomerPortal = async () => {
    setIsLoadingPortal(true);
    
    try {
      // Call Supabase Edge Function to get customer portal URL
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      // Redirect to Stripe Customer Portal
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast({
        title: "Portal Access Failed",
        description: "Unable to access subscription management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPortal(false);
    }
  };
  
  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralData.code);
    toast({
      title: "Referral Code Copied",
      description: "Share it with friends to earn bonus credits!",
    });
  };
  
  useEffect(() => {
    if (currentUserId) {
      // Check subscription status on load
      checkSubscription();
    }
  }, [currentUserId]);
  
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-puzzle-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-puzzle-aqua">
              Account Dashboard
            </h1>
            <p className="text-puzzle-white/70">Manage your membership and profile</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={checkSubscription} 
              disabled={isCheckingSubscription}
              className="border-puzzle-aqua/50 hover:bg-puzzle-aqua/10"
            >
              {isCheckingSubscription ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh Status
            </Button>
            <Button 
              variant="outline" 
              onClick={() => supabase.auth.signOut()}
              className="border-puzzle-aqua/50 hover:bg-puzzle-aqua/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="membership" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-8 bg-puzzle-black border border-puzzle-aqua/30">
                <TabsTrigger value="membership">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Membership
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Calendar className="mr-2 h-4 w-4" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="referrals">
                  <Users className="mr-2 h-4 w-4" />
                  Referrals
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="membership" className="space-y-6">
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
                        <div className="text-sm text-puzzle-white/70 mb-1">Member Since</div>
                        <div className="text-xl font-semibold text-puzzle-white">
                          {profile?.created_at 
                            ? new Date(profile.created_at).toLocaleDateString() 
                            : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-puzzle-white">Available Credits</span>
                        <span className="text-puzzle-gold font-medium">
                          {subscriptionData.credits} / {subscriptionData.maxCredits}
                        </span>
                      </div>
                      <Progress value={(subscriptionData.credits / subscriptionData.maxCredits) * 100} 
                        className="h-2 bg-puzzle-aqua/20" 
                      />
                      <p className="text-sm text-puzzle-white/70">
                        Credits refresh on your next billing date. Use them to play premium puzzles and enter competitions.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={openCustomerPortal} 
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
                
                <Card className="border-puzzle-aqua/30 bg-puzzle-black/50">
                  <CardHeader>
                    <CardTitle className="text-puzzle-white">Legal Information</CardTitle>
                    <CardDescription>Terms, privacy, and refund policies</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { title: "Terms of Service", description: "Our terms and conditions" },
                        { title: "Privacy Policy", description: "How we handle your data" },
                        { title: "Refund Policy", description: "Our money-back guarantee" }
                      ].map((item, i) => (
                        <div key={i} className="p-4 bg-puzzle-aqua/5 rounded-lg border border-puzzle-aqua/20">
                          <h3 className="font-medium text-puzzle-white">{item.title}</h3>
                          <p className="text-sm text-puzzle-white/70 mt-1">{item.description}</p>
                          <Button variant="link" className="text-puzzle-aqua p-0 h-auto mt-2">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-6">
                <Card className="border-puzzle-aqua/30 bg-puzzle-black/50">
                  <CardHeader>
                    <CardTitle className="text-puzzle-white">Recent Activity</CardTitle>
                    <CardDescription>Your puzzle solving and membership activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div 
                          key={activity.id} 
                          className="flex justify-between items-center p-3 border-b border-puzzle-aqua/10 last:border-0"
                        >
                          <div className="flex flex-col">
                            <span className="text-puzzle-white font-medium">{activity.action}</span>
                            <span className="text-sm text-puzzle-white/70">{activity.name}</span>
                            <span className="text-xs text-puzzle-white/50">{activity.date}</span>
                          </div>
                          {activity.reward && (
                            <span className="text-puzzle-gold font-medium">{activity.reward}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-puzzle-aqua/50 hover:bg-puzzle-aqua/10">
                      View All Activity
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="referrals" className="space-y-6">
                <Card className="border-puzzle-aqua/30 bg-puzzle-black/50">
                  <CardHeader>
                    <CardTitle className="text-puzzle-white">Referral Program</CardTitle>
                    <CardDescription>Invite friends and earn bonus credits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-puzzle-aqua/5 p-4 rounded-lg border border-puzzle-aqua/20">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h3 className="font-medium text-puzzle-white">Your Referral Code</h3>
                          <p className="text-sm text-puzzle-white/70 mb-2">
                            Share this code with friends to earn 10 credits for each new member
                          </p>
                          <div className="flex items-center">
                            <code className="bg-puzzle-black p-2 rounded border border-puzzle-aqua/30 text-puzzle-gold font-mono">
                              {referralData.code}
                            </code>
                            <Button 
                              onClick={copyReferralCode} 
                              variant="ghost" 
                              size="sm" 
                              className="ml-2"
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                        <Button className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90 whitespace-nowrap">
                          <Users className="mr-2 h-4 w-4" />
                          Invite Friends
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-puzzle-aqua/5 p-4 rounded-lg border border-puzzle-aqua/20">
                        <h3 className="font-medium text-puzzle-white">Friends Referred</h3>
                        <div className="flex items-end mt-2">
                          <span className="text-3xl font-bold text-puzzle-aqua">{referralData.referred}</span>
                          <span className="text-sm text-puzzle-white/70 ml-2 mb-1">people</span>
                        </div>
                      </div>
                      
                      <div className="bg-puzzle-aqua/5 p-4 rounded-lg border border-puzzle-aqua/20">
                        <h3 className="font-medium text-puzzle-white">Bonus Credits Earned</h3>
                        <div className="flex items-end mt-2">
                          <span className="text-3xl font-bold text-puzzle-gold">{referralData.bonusEarned}</span>
                          <span className="text-sm text-puzzle-white/70 ml-2 mb-1">credits</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card className="border-puzzle-aqua/30 bg-puzzle-black/50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-puzzle-white">Your Profile</CardTitle>
                  <Link to="/profile">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-puzzle-aqua/20 flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-puzzle-aqua" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-puzzle-white">
                      {profile?.display_name || 'Puzzle Enthusiast'}
                    </h3>
                    <p className="text-sm text-puzzle-white/70">{profile?.role || 'player'}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-puzzle-aqua/10">
                  <Link to="/profile">
                    <Button variant="outline" className="w-full border-puzzle-aqua/50 hover:bg-puzzle-aqua/10">
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-puzzle-aqua/30 bg-puzzle-black/50">
              <CardHeader>
                <CardTitle className="text-puzzle-white">Recommended For You</CardTitle>
                <CardDescription>Based on your membership</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Weekly Challenge", type: "Competition", deadline: "2 days left" },
                  { title: "Space Explorer", type: "Premium Puzzle", credits: "5 credits" },
                  { title: "Summer Season", type: "New Collection", status: "Coming soon" }
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="p-3 bg-puzzle-aqua/5 rounded-lg border border-puzzle-aqua/20 hover:border-puzzle-aqua/50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-puzzle-white">{item.title}</h3>
                        <p className="text-sm text-puzzle-white/70">{item.type}</p>
                      </div>
                      <div className="text-xs text-right">
                        {item.deadline && <p className="text-red-400">{item.deadline}</p>}
                        {item.credits && <p className="text-puzzle-gold">{item.credits}</p>}
                        {item.status && <p className="text-puzzle-aqua">{item.status}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-puzzle-aqua/50 hover:bg-puzzle-aqua/10">
                  Browse All Puzzles
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
