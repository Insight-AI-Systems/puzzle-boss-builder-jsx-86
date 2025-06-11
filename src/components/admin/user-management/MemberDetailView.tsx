
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, MapPin, CreditCard, Coins, Gift, User, Building, Phone } from "lucide-react";
import { UserProfile } from '@/types/userTypes';
import { useMemberDetails } from '@/hooks/useMemberDetails';
import { useTokenManagement } from '@/hooks/useTokenManagement';
import { TokenTransactionHistory } from './TokenTransactionHistory';

interface MemberDetailViewProps {
  member: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MemberDetailView({ member, isOpen, onClose }: MemberDetailViewProps) {
  const [tokensToAward, setTokensToAward] = useState<number>(10);
  const [adminNote, setAdminNote] = useState<string>('');
  const { fetchMemberDetails } = useMemberDetails();
  const { awardTokens } = useTokenManagement();
  const [memberDetails, setMemberDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch detailed member information when dialog opens
  React.useEffect(() => {
    if (isOpen && member?.id) {
      setIsLoadingDetails(true);
      fetchMemberDetails(member.id).then((details) => {
        setMemberDetails(details);
        setIsLoadingDetails(false);
      }).catch(() => {
        setIsLoadingDetails(false);
      });
    }
  }, [isOpen, member?.id, fetchMemberDetails]);

  const handleAwardTokens = async () => {
    if (!member?.id || tokensToAward <= 0) return;

    try {
      await awardTokens.mutateAsync({
        targetUserId: member.id,
        tokens: tokensToAward,
        adminNote: adminNote || undefined
      });
      
      // Reset form and refresh member details
      setTokensToAward(10);
      setAdminNote('');
      
      // Refresh member details
      const refreshedDetails = await fetchMemberDetails(member.id);
      setMemberDetails(refreshedDetails);
      
    } catch (error) {
      console.error('Failed to award tokens:', error);
    }
  };

  if (!member) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Member Details - {member.display_name || 'Anonymous User'}
          </DialogTitle>
          <DialogDescription>
            Complete member profile and financial information
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetails ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.email || 'No email'}</span>
                </div>
                {memberDetails?.full_name && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{memberDetails.full_name}</span>
                  </div>
                )}
                {memberDetails?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{memberDetails.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined {formatDate(member.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">{member.role}</Badge>
                </div>
                {member.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{member.country}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Account Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Credits:</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {memberDetails?.credits || member.credits || 0} credits
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tokens:</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {memberDetails?.tokens || member.tokens || 0} tokens
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Award Tokens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Award Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tokens">Number of Tokens</Label>
                  <Input
                    id="tokens"
                    type="number"
                    min="1"
                    value={tokensToAward}
                    onChange={(e) => setTokensToAward(Number(e.target.value))}
                    placeholder="Enter tokens to award"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Admin Note (Optional)</Label>
                  <Textarea
                    id="note"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Reason for awarding tokens..."
                    rows={2}
                  />
                </div>
                <Button
                  onClick={handleAwardTokens}
                  disabled={tokensToAward <= 0 || awardTokens.isPending}
                  className="w-full"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  {awardTokens.isPending ? 'Awarding...' : `Award ${tokensToAward} Tokens`}
                </Button>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            {memberDetails?.financial_summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Spend:</span>
                    <span className="font-medium">${memberDetails.financial_summary.total_spend}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Prizes:</span>
                    <span className="font-medium">${memberDetails.financial_summary.total_prizes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Lifetime Value:</span>
                    <span className="font-medium">${memberDetails.financial_summary.lifetime_value}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm">Membership Status:</span>
                    <Badge variant="outline">
                      {memberDetails.financial_summary.membership_status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Token Transaction History - Full width at bottom */}
        {member?.id && (
          <div className="mt-6">
            <TokenTransactionHistory userId={member.id} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
