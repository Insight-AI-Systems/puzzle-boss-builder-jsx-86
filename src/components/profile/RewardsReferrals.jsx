
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Share2, Gift, Copy, Check, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

/**
 * Component that displays user's rewards and referral information
 */
const RewardsReferrals = ({ user, profile }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("referrals");
  
  // Generate a mock referral code based on user ID and username
  const referralCode = `PUZZLE${user.id.substring(0, 6)}${profile.username ? profile.username.substring(0, 4).toUpperCase() : ''}`;
  
  // Placeholder data - would be fetched from backend in a real implementation
  const referralStats = {
    totalReferrals: 0,
    pendingReferrals: 0,
    creditsEarned: 0
  };
  
  const rewards = [
    {
      id: 1,
      title: "Welcome Bonus",
      description: "New player welcome gift",
      credits: 5,
      status: "Claimed", 
      expiryDate: "N/A"
    },
    {
      id: 2,
      title: "Refer 3 Friends",
      description: "Get 15 credits when 3 friends sign up using your code",
      credits: 15,
      status: "Incomplete", 
      expiryDate: "None"
    },
    {
      id: 3,
      title: "Weekend Special",
      description: "Double credits for puzzle completions",
      credits: "2x",
      status: "Active", 
      expiryDate: "Apr 14, 2025"
    }
  ];
  
  const referralHistory = [];
  
  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    
    toast({
      title: "Referral code copied!",
      description: "Share this code with friends to earn rewards."
    });
    
    setTimeout(() => setCopied(false), 3000);
  };
  
  const handleSocialShare = (platform) => {
    const message = `Join me on The Puzzle Boss and win amazing prizes! Use my referral code: ${referralCode}`;
    const url = "https://thepuzzleboss.com";
    
    let shareUrl;
    
    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    toast({
      title: `Sharing to ${platform}`,
      description: "Thanks for spreading the word!"
    });
  };
  
  return (
    <Card className="bg-puzzle-black border-puzzle-aqua/30">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center">
          <Gift className="mr-2 h-5 w-5 text-puzzle-gold" />
          Rewards & Referrals
        </CardTitle>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 bg-puzzle-black border border-puzzle-aqua/30">
            <TabsTrigger value="referrals" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
              Referrals
            </TabsTrigger>
            <TabsTrigger value="rewards" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
              Rewards
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="referrals" className="mt-0">
          <div className="bg-puzzle-black/50 border border-puzzle-aqua/30 rounded-md p-4 mb-4">
            <h3 className="text-puzzle-white font-semibold mb-2">Your Referral Code</h3>
            <div className="flex">
              <div className="flex-1 bg-puzzle-black border border-puzzle-aqua/50 rounded-l-md p-2 font-mono text-puzzle-aqua">
                {referralCode}
              </div>
              <Button 
                onClick={handleCopyReferralCode}
                className="rounded-l-none bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/80"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Share this code with friends. When they sign up, you'll both receive bonus credits!
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-puzzle-white font-semibold mb-3">Share on Social Media</h3>
            <div className="flex space-x-3">
              <Button 
                onClick={() => handleSocialShare("facebook")}
                variant="outline"
                className="flex-1 border-puzzle-aqua/30 text-puzzle-white hover:bg-puzzle-aqua/20"
              >
                <Facebook className="h-4 w-4 mr-2 text-blue-500" />
                Facebook
              </Button>
              <Button 
                onClick={() => handleSocialShare("twitter")}
                variant="outline"
                className="flex-1 border-puzzle-aqua/30 text-puzzle-white hover:bg-puzzle-aqua/20"
              >
                <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                Twitter
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="border border-puzzle-aqua/30 rounded-md p-3 text-center">
              <div className="text-xl font-bold text-puzzle-aqua">
                {referralStats.totalReferrals}
              </div>
              <div className="text-xs text-muted-foreground">Total Referrals</div>
            </div>
            <div className="border border-puzzle-aqua/30 rounded-md p-3 text-center">
              <div className="text-xl font-bold text-puzzle-aqua">
                {referralStats.pendingReferrals}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="border border-puzzle-aqua/30 rounded-md p-3 text-center">
              <div className="text-xl font-bold text-puzzle-gold">
                {referralStats.creditsEarned}
              </div>
              <div className="text-xs text-muted-foreground">Credits Earned</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-puzzle-white font-semibold mb-3 flex items-center">
              <Share2 className="h-4 w-4 text-puzzle-gold mr-2" />
              Referral History
            </h3>
            
            {referralHistory.length > 0 ? (
              <div className="space-y-3">
                {referralHistory.map((referral, index) => (
                  <div key={index} className="border border-puzzle-aqua/20 rounded-md p-3">
                    <div>Referral history would appear here</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center border border-puzzle-aqua/20 rounded-md">
                <Users className="h-12 w-12 text-puzzle-aqua/40 mx-auto mb-3" />
                <p className="text-muted-foreground">No referrals yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Share your code to start earning rewards!
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="rewards" className="mt-0">
          <div className="space-y-4">
            {rewards.map((reward) => (
              <div key={reward.id} className="border border-puzzle-aqua/30 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-puzzle-white font-semibold">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{reward.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-puzzle-gold font-bold">{reward.credits}</div>
                    <div className="text-xs text-muted-foreground">credits</div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-3 pt-3 border-t border-puzzle-aqua/20 text-xs">
                  <div>
                    <span className="text-muted-foreground">Status: </span>
                    <span className={`font-medium ${
                      reward.status === 'Active' ? 'text-puzzle-aqua' : 
                      reward.status === 'Claimed' ? 'text-green-500' : 
                      'text-puzzle-white'
                    }`}>
                      {reward.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expires: </span>
                    <span className="text-puzzle-white">{reward.expiryDate}</span>
                  </div>
                </div>
                
                {reward.status === 'Active' && (
                  <Button className="w-full mt-3 bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/80">
                    Claim Reward
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default RewardsReferrals;
