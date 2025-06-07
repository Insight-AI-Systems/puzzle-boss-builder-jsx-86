
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Coins, Wallet, Plus, Gift } from 'lucide-react';
import { MemberDetailedProfile } from '@/types/memberTypes';
import { UserWallet } from '@/hooks/useMemberProfile';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UseMutationResult } from '@tanstack/react-query';

interface CreditBalanceCardProps {
  profile: MemberDetailedProfile & { wallet?: UserWallet };
  awardCredits: UseMutationResult<boolean, Error, { targetUserId: string; credits: number; adminNote?: string }, unknown>;
}

export function CreditBalanceCard({ profile, awardCredits }: CreditBalanceCardProps) {
  const { isAdmin } = useUserProfile();
  const [creditAmount, setCreditAmount] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [isAwardDialogOpen, setIsAwardDialogOpen] = useState(false);

  const handleAwardCredits = async () => {
    const credits = parseInt(creditAmount);
    if (credits > 0) {
      console.log('Submitting credit award:', { targetUserId: profile.id, credits, adminNote });
      
      try {
        await awardCredits.mutateAsync({
          targetUserId: profile.id,
          credits,
          adminNote: adminNote || undefined
        });
        
        // Reset form and close dialog only on success
        setCreditAmount('');
        setAdminNote('');
        setIsAwardDialogOpen(false);
        
        console.log('Credit award completed successfully');
      } catch (error) {
        console.error('Credit award failed:', error);
        // Don't close dialog on error so user can retry
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  console.log('CreditBalanceCard rendering with profile credits:', profile.credits);

  return (
    <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Coins className="h-5 w-5 text-puzzle-gold" />
          Credits & Balance
        </CardTitle>
        <CardDescription className="text-puzzle-white/70">
          Your game credits and account balance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Free Credits Display */}
        <div className="flex items-center justify-between p-4 bg-puzzle-aqua/10 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-puzzle-gold/20 rounded-full">
              <Gift className="h-5 w-5 text-puzzle-gold" />
            </div>
            <div>
              <p className="font-medium text-puzzle-white">Free Credits</p>
              <p className="text-sm text-puzzle-white/70">Available free game plays</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-puzzle-gold">{profile.credits || 0}</p>
            <p className="text-xs text-puzzle-white/60">credits</p>
          </div>
        </div>

        {/* Account Balance Display */}
        <div className="flex items-center justify-between p-4 bg-puzzle-aqua/10 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-puzzle-aqua/20 rounded-full">
              <Wallet className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <p className="font-medium text-puzzle-white">Account Balance</p>
              <p className="text-sm text-puzzle-white/70">Deposited funds available</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-puzzle-aqua">
              {formatCurrency(profile.wallet?.balance || 0)}
            </p>
            <p className="text-xs text-puzzle-white/60">{profile.wallet?.currency || 'USD'}</p>
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="pt-4 border-t border-puzzle-aqua/20">
            <Dialog open={isAwardDialogOpen} onOpenChange={setIsAwardDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold hover:text-puzzle-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Award Free Credits
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-puzzle-black border-puzzle-aqua/30">
                <DialogHeader>
                  <DialogTitle className="text-puzzle-white">Award Free Credits</DialogTitle>
                  <DialogDescription className="text-puzzle-white/70">
                    Grant free game credits to {profile.display_name}. This does not affect their account balance.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="credits" className="text-puzzle-white">Number of Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      min="1"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      placeholder="Enter number of credits"
                      className="bg-gray-800 border-gray-600 text-puzzle-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="note" className="text-puzzle-white">Admin Note (Optional)</Label>
                    <Textarea
                      id="note"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Reason for awarding credits..."
                      className="bg-gray-800 border-gray-600 text-puzzle-white resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAwardCredits}
                      disabled={!creditAmount || parseInt(creditAmount) <= 0 || awardCredits.isPending}
                      className="flex-1 bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
                    >
                      {awardCredits.isPending ? 'Awarding...' : 'Award Credits'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAwardDialogOpen(false)}
                      className="border-puzzle-aqua/50 text-puzzle-white hover:bg-puzzle-aqua/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Information Note */}
        <div className="text-xs text-puzzle-white/50 bg-puzzle-black/30 p-3 rounded-lg">
          <p>• Free credits are awarded by administrators and can be used to play games without charge</p>
          <p>• Account balance represents deposited funds that can be used for paid games and purchases</p>
          <p>• Only deposited funds affect your account balance - free credits do not</p>
        </div>
      </CardContent>
    </Card>
  );
}
