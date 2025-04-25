
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SUPPORT_SYSTEM_CONFIG } from '@/services/openSupportsConfig';
import { 
  MessageSquare, 
  Search, 
  BookOpen, 
  Clock,
  PlusCircle
} from 'lucide-react';

export const SupportHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const supportCategories = SUPPORT_SYSTEM_CONFIG.TICKET_CATEGORIES;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
          <CardHeader>
            <CardTitle className="text-puzzle-aqua">My Support Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-puzzle-white/80">
              {user 
                ? "View and manage your existing support tickets." 
                : "Sign in to view your support tickets."}
            </p>
            <Button 
              onClick={() => navigate('/support/tickets')}
              className="w-full"
              variant="outline"
              disabled={!user}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              View My Tickets
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
          <CardHeader>
            <CardTitle className="text-puzzle-aqua">Create New Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-puzzle-white/80">
              {user 
                ? "Need help? Submit a new support ticket." 
                : "Sign in to create a new support ticket."}
            </p>
            <Button 
              onClick={() => navigate('/support/new-ticket')}
              className="w-full"
              disabled={!user}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Support Ticket
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-puzzle-white">Help Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {supportCategories.map((category) => (
            <Card 
              key={category.id} 
              className="bg-puzzle-black/20 border-puzzle-aqua/10 hover:border-puzzle-aqua/30 cursor-pointer transition-all"
              onClick={() => navigate('/support/new-ticket', { state: { category: category.id } })}
            >
              <CardContent className="pt-6">
                <h3 className="text-puzzle-aqua font-medium">{category.name}</h3>
                <p className="text-sm text-puzzle-white/70 mt-1">
                  Get help with {category.name.toLowerCase()} issues
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-puzzle-white">Common Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-puzzle-black/20 border-puzzle-aqua/10">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-puzzle-aqua/10 p-3 rounded-full">
                <Search className="h-5 w-5 text-puzzle-aqua" />
              </div>
              <div>
                <h3 className="font-medium">Search FAQ</h3>
                <p className="text-sm text-puzzle-white/70">
                  Find answers to frequently asked questions
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-puzzle-black/20 border-puzzle-aqua/10">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-puzzle-aqua/10 p-3 rounded-full">
                <BookOpen className="h-5 w-5 text-puzzle-aqua" />
              </div>
              <div>
                <h3 className="font-medium">User Guide</h3>
                <p className="text-sm text-puzzle-white/70">
                  Learn how to play puzzles and win prizes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
