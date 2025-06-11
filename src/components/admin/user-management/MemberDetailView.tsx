
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  CreditCard, 
  Gamepad2, 
  Coins, 
  History,
  Plus,
  Minus,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';
import { UserProfile, TokenTransaction } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface MemberDetailViewProps {
  member: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MemberDetailView: React.FC<MemberDetailViewProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  const [tokenAmount, setTokenAmount] = useState('');
  const [tokenNote, setTokenNote] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch token transactions for this member
  const { data: tokenTransactions } = useQuery({
    queryKey: ['token-transactions', member?.id],
    queryFn: async () => {
      if (!member?.id) return [];
      
      const { data, error } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', member.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as TokenTransaction[];
    },
    enabled: !!member?.id && isOpen,
  });

  // Fetch financial transactions
  const { data: financialTransactions } = useQuery({
    queryKey: ['financial-transactions', member?.id],
    queryFn: async () => {
      if (!member?.id) return [];
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', member.id)
        .order('transaction_date', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    enabled: !!member?.id && isOpen,
  });

  // Fetch puzzle completions
  const { data: puzzleCompletions } = useQuery({
    queryKey: ['puzzle-completions', member?.id],
    queryFn: async () => {
      if (!member?.id) return [];
      
      const { data, error } = await supabase
        .from('puzzle_completions')
        .select(`
          *,
          puzzle:puzzles(title, image_url, difficulty_level)
        `)
        .eq('user_id', member.id)
        .order('completed_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    enabled: !!member?.id && isOpen,
  });

  // Award tokens mutation
  const awardTokensMutation = useMutation({
    mutationFn: async ({ amount, note }: { amount: number; note: string }) => {
      if (!member?.id) throw new Error('No member selected');
      
      const { error } = await supabase.rpc('award_tokens', {
        target_user_id: member.id,
        tokens_to_add: amount,
        admin_note: note || null
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Tokens awarded successfully",
        description: `${tokenAmount} tokens have been awarded to ${member?.display_name}`,
      });
      setTokenAmount('');
      setTokenNote('');
      queryClient.invalidateQueries({ queryKey: ['token-transactions', member?.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error awarding tokens",
        description: error.message || "Failed to award tokens",
        variant: "destructive",
      });
    },
  });

  const handleAwardTokens = () => {
    const amount = parseInt(tokenAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }
    
    awardTokensMutation.mutate({ amount, note: tokenNote });
  };

  const handleDeductTokens = () => {
    const amount = parseInt(tokenAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }
    
    awardTokensMutation.mutate({ amount: -amount, note: tokenNote || 'Tokens deducted by admin' });
  };

  if (!member) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Member Details: {member.display_name || member.username || 'Anonymous User'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="games">Game Stats</TabsTrigger>
            <TabsTrigger value="profile">Full Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Credits</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{member.credits}</div>
                  <p className="text-xs text-muted-foreground">Real money credits</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tokens</CardTitle>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{member.tokens}</div>
                  <p className="text-xs text-muted-foreground">Promotional tokens</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Role</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{member.role}</Badge>
                  <p className="text-xs text-muted-foreground mt-2">Member since {formatDate(member.created_at)}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Member Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Display Name</Label>
                    <p>{member.display_name || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Username</Label>
                    <p>{member.username || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Country</Label>
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {member.country || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Last Sign In</Label>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {member.last_sign_in ? formatDate(member.last_sign_in) : 'Never'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="token-amount">Award/Deduct Tokens</Label>
                    <div className="flex gap-2">
                      <Input
                        id="token-amount"
                        type="number"
                        placeholder="Amount"
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={handleAwardTokens}
                        disabled={awardTokensMutation.isPending}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Award
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleDeductTokens}
                        disabled={awardTokensMutation.isPending}
                        className="flex items-center gap-1"
                      >
                        <Minus className="h-3 w-3" />
                        Deduct
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Note (optional)"
                      value={tokenNote}
                      onChange={(e) => setTokenNote(e.target.value)}
                      className="text-sm"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Financial Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {financialTransactions?.length ? (
                    financialTransactions.map((transaction: any) => (
                      <div key={transaction.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{transaction.transaction_type}</p>
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(transaction.transaction_date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(transaction.amount)}</p>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No financial transactions found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Token Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tokenTransactions?.length ? (
                    tokenTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{transaction.transaction_type}</p>
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(transaction.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} tokens
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No token transactions found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4" />
                  Puzzle Completions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {puzzleCompletions?.length ? (
                    puzzleCompletions.map((completion: any) => (
                      <div key={completion.id} className="flex justify-between items-center p-3 border rounded">
                        <div className="flex items-center gap-3">
                          {completion.puzzle?.image_url && (
                            <img 
                              src={completion.puzzle.image_url} 
                              alt={completion.puzzle.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{completion.puzzle?.title || 'Unknown Puzzle'}</p>
                            <p className="text-sm text-muted-foreground">
                              Difficulty: {completion.puzzle?.difficulty_level}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(completion.completed_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{completion.completion_time}s</p>
                          <p className="text-sm text-muted-foreground">{completion.moves_count} moves</p>
                          {completion.is_winner && (
                            <Badge className="bg-green-100 text-green-800">Winner</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No puzzle completions found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Complete Member Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Member ID</Label>
                      <p className="text-sm font-mono bg-muted p-2 rounded">{member.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Display Name</Label>
                      <p>{member.display_name || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Username</Label>
                      <p>{member.username || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Bio</Label>
                      <p>{member.bio || 'No bio provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Gender</Label>
                      <p>{member.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Age Group</Label>
                      <p>{member.age_group || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Country</Label>
                      <p>{member.country || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Categories Played</Label>
                      <div className="flex flex-wrap gap-1">
                        {member.categories_played?.length ? (
                          member.categories_played.map((category, index) => (
                            <Badge key={index} variant="outline">{category}</Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No categories played yet</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Achievements</Label>
                      <div className="flex flex-wrap gap-1">
                        {member.achievements?.length ? (
                          member.achievements.map((achievement, index) => (
                            <Badge key={index} variant="secondary">{achievement}</Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No achievements yet</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Referral Code</Label>
                      <p>{member.referral_code || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Updated</Label>
                      <p>{formatDate(member.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
