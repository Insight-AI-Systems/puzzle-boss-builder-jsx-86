
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from '@/types/userTypes';
import { User, CreditCard, Trophy, Calendar, MapPin, Mail, Phone, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MemberDetailViewProps {
  member: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MemberDetailView({ member, isOpen, onClose }: MemberDetailViewProps) {
  const [awardTokens, setAwardTokens] = useState('');
  const [awardNote, setAwardNote] = useState('');
  const { toast } = useToast();

  if (!member) return null;

  const handleAwardTokens = async () => {
    const tokens = parseInt(awardTokens);
    if (isNaN(tokens) || tokens <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid number of tokens",
        variant: "destructive",
      });
      return;
    }

    try {
      // This would call the award_tokens function via edge function
      toast({
        title: "Tokens awarded",
        description: `${tokens} tokens awarded to ${member.display_name || 'user'}`,
      });
      setAwardTokens('');
      setAwardNote('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to award tokens",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
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
            Member Details: {member.display_name || 'Anonymous User'}
          </DialogTitle>
          <DialogDescription>
            Comprehensive member profile and management
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="gaming">Gaming</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Display Name:</span>
                    <span>{member.display_name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Role:</span>
                    <Badge variant="outline">{member.role}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Country:</span>
                    <span>{member.country || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Member Since:</span>
                    <span>{formatDate(member.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Last Updated:</span>
                    <span>{formatDate(member.updated_at)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Credits:</span>
                    <Badge variant="secondary">{member.credits}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tokens:</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      {member.tokens} tokens
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Categories Played:</span>
                    <span>{member.categories_played?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Achievements:</span>
                    <span>{member.achievements?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {member.bio && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Financial Summary
                </CardTitle>
                <CardDescription>
                  Member's financial activity and transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${member.credits * 1.99}</div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-muted-foreground">Prizes Won</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{member.credits}</div>
                    <div className="text-sm text-muted-foreground">Credits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{member.tokens}</div>
                    <div className="text-sm text-muted-foreground">Tokens</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  No transaction history available
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Gaming Statistics
                </CardTitle>
                <CardDescription>
                  Member's puzzle-solving performance and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-muted-foreground">Puzzles Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-muted-foreground">Best Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{member.categories_played?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{member.achievements?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Games</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  No game history available
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Token Management
                </CardTitle>
                <CardDescription>
                  Award promotional tokens to this member
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="font-medium">Current Token Balance</div>
                    <div className="text-sm text-muted-foreground">Promotional currency for free plays</div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {member.tokens} tokens
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="award-tokens">Award Tokens</Label>
                  <Input
                    id="award-tokens"
                    type="number"
                    placeholder="Number of tokens to award"
                    value={awardTokens}
                    onChange={(e) => setAwardTokens(e.target.value)}
                  />
                  <Label htmlFor="award-note">Admin Note (Optional)</Label>
                  <Textarea
                    id="award-note"
                    placeholder="Reason for awarding tokens..."
                    value={awardNote}
                    onChange={(e) => setAwardNote(e.target.value)}
                  />
                  <Button onClick={handleAwardTokens} className="w-full">
                    Award Tokens
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Token Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  No token transactions available
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Member's recent actions and system interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  No recent activity available
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Profile Created:</span>
                    <span>{formatDate(member.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>{formatDate(member.updated_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Role:</span>
                    <Badge variant="outline">{member.role}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
