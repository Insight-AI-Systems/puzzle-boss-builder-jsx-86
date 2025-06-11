
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Loader2, User, Star, Trophy, Clock, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccountDashboard: React.FC = () => {
  const { profile, isLoading, currentUserId } = useUserProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
          <p className="text-puzzle-white">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <div className="text-center text-puzzle-white">
          <h2 className="text-xl font-semibold mb-2">Account Not Found</h2>
          <p className="text-puzzle-white/70">Please sign in to view your account.</p>
        </div>
      </div>
    );
  }

  // Convert ClerkProfile to UserProfile-like structure for display
  const displayProfile = {
    display_name: profile.display_name || profile.username || 'Anonymous User',
    email: profile.email || '',
    role: profile.role || 'player',
    country: '',
    categories_played: [],
    credits: 0,
    tokens: 0,
    achievements: [],
    referral_code: null,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    last_sign_in: null
  };

  return (
    <div className="min-h-screen bg-puzzle-black text-white">
      <div className="container mx-auto p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-puzzle-aqua/20 pb-6">
            <div>
              <h1 className="text-3xl font-game text-puzzle-aqua">Account Dashboard</h1>
              <p className="text-puzzle-white/70 mt-2">
                Welcome back, {displayProfile.display_name}
              </p>
            </div>
            <Link to="/profile">
              <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-puzzle-gray border-puzzle-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-puzzle-white">Credits</CardTitle>
                <CreditCard className="h-4 w-4 text-puzzle-aqua" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-puzzle-aqua">{displayProfile.credits}</div>
                <p className="text-xs text-puzzle-white/60">Available to use</p>
              </CardContent>
            </Card>

            <Card className="bg-puzzle-gray border-puzzle-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-puzzle-white">Puzzles Played</CardTitle>
                <Trophy className="h-4 w-4 text-puzzle-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-puzzle-gold">{displayProfile.categories_played.length}</div>
                <p className="text-xs text-puzzle-white/60">Categories explored</p>
              </CardContent>
            </Card>

            <Card className="bg-puzzle-gray border-puzzle-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-puzzle-white">Achievements</CardTitle>
                <Star className="h-4 w-4 text-puzzle-aqua" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-puzzle-aqua">{displayProfile.achievements.length}</div>
                <p className="text-xs text-puzzle-white/60">Unlocked rewards</p>
              </CardContent>
            </Card>

            <Card className="bg-puzzle-gray border-puzzle-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-puzzle-white">Member Since</CardTitle>
                <Clock className="h-4 w-4 text-puzzle-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-puzzle-gold">
                  {new Date(displayProfile.created_at).getFullYear()}
                </div>
                <p className="text-xs text-puzzle-white/60">Year joined</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-puzzle-gray border-puzzle-border">
            <CardHeader>
              <CardTitle className="text-puzzle-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-puzzle-white">No recent activity</h3>
                <p className="text-puzzle-white/60">Start playing puzzles to see your activity here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
