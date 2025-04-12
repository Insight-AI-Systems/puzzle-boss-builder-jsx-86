
import React from 'react';
import { Calendar, Users, CreditCard, Award } from 'lucide-react';

/**
 * Component that displays the user's profile statistics
 */
const ProfileStats = ({ profile }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4 text-puzzle-aqua" />
        <div>
          <span className="font-semibold">Member since:</span> {new Date(profile.created_at).toLocaleDateString()}
        </div>
      </div>
      
      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
        <Users className="h-4 w-4 text-puzzle-gold" />
        <div>
          <span className="font-semibold">Role:</span> {profile.role}
        </div>
      </div>
      
      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
        <CreditCard className="h-4 w-4 text-puzzle-gold" />
        <div>
          <span className="font-semibold">Credits:</span> {profile.credits || 0}
          <a href="#credit-history" className="ml-2 text-puzzle-aqua hover:underline text-xs">History</a>
        </div>
      </div>
      
      <div className="pt-4 border-t border-puzzle-aqua/20">
        <h4 className="text-sm font-semibold mb-3 flex items-center text-puzzle-white">
          <Award className="h-4 w-4 text-puzzle-gold mr-2" />
          Quick Stats
        </h4>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-puzzle-black/50 rounded p-2 border border-puzzle-aqua/20">
            <div className="text-lg font-bold text-puzzle-aqua">0</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="bg-puzzle-black/50 rounded p-2 border border-puzzle-aqua/20">
            <div className="text-lg font-bold text-puzzle-gold">--</div>
            <div className="text-xs text-muted-foreground">Best Time</div>
          </div>
          <div className="bg-puzzle-black/50 rounded p-2 border border-puzzle-aqua/20">
            <div className="text-lg font-bold text-puzzle-burgundy">--</div>
            <div className="text-xs text-muted-foreground">Rank</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
