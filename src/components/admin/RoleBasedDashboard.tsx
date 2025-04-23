
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PuzzleManagement } from './PuzzleManagement';
import HeroPuzzleManager from './HeroPuzzleManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const RoleBasedDashboard: React.FC = () => {
  const { hasRole } = useAuth();
  const isSuperAdmin = hasRole('super_admin');
  const isAdmin = isSuperAdmin || hasRole('admin');

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-game text-puzzle-aqua">Content Management</h2>

      {(isAdmin || isSuperAdmin) && (
        <Tabs defaultValue="puzzles">
          <TabsList className="border-b border-puzzle-aqua/20 w-full justify-start">
            <TabsTrigger value="puzzles">Puzzles</TabsTrigger>
            <TabsTrigger value="hero-puzzle">Hero Puzzle</TabsTrigger>
          </TabsList>
          
          <TabsContent value="puzzles" className="pt-4">
            <PuzzleManagement />
          </TabsContent>
          
          <TabsContent value="hero-puzzle" className="pt-4">
            <HeroPuzzleManager />
          </TabsContent>
        </Tabs>
      )}

      {/* Category Management Section */}
      {(hasRole('category_manager') || isSuperAdmin) && (
        <div className="mt-8">
          <h3 className="text-lg font-game text-puzzle-gold mb-4">Category Management</h3>
          <p className="text-muted-foreground">
            As a Category Manager, you can create and manage puzzle categories.
          </p>
          {/* Category management tools would go here */}
        </div>
      )}

      {/* Social Media Section */}
      {(hasRole('social_media_manager') || isSuperAdmin) && (
        <div className="mt-8">
          <h3 className="text-lg font-game text-puzzle-gold mb-4">Social Media Management</h3>
          <p className="text-muted-foreground">
            As a Social Media Manager, you can schedule posts and manage social campaigns.
          </p>
          {/* Social media tools would go here */}
        </div>
      )}

      {/* Partner Management Section */}
      {(hasRole('partner_manager') || isSuperAdmin) && (
        <div className="mt-8">
          <h3 className="text-lg font-game text-puzzle-gold mb-4">Partner Management</h3>
          <p className="text-muted-foreground">
            As a Partner Manager, you can manage brand partnerships and sponsorships.
          </p>
          {/* Partner management tools would go here */}
        </div>
      )}

      {/* Financial Section */}
      {(hasRole('cfo') || isSuperAdmin) && (
        <div className="mt-8">
          <h3 className="text-lg font-game text-puzzle-gold mb-4">Financial Dashboard</h3>
          <p className="text-muted-foreground">
            As a CFO, you have access to financial reports and revenue analytics.
          </p>
          {/* Financial tools would go here */}
        </div>
      )}
    </div>
  );
};
