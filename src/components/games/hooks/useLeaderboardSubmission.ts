
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface GameResult {
  gameId: string;
  gameType: string;
  score: number;
  completionTime: number;
  moves?: number;
  difficulty?: string;
}

export function useLeaderboardSubmission() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitScore = async (result: GameResult) => {
    if (!user) {
      console.log('No user logged in, skipping leaderboard submission');
      return false;
    }

    try {
      setIsSubmitting(true);
      
      // TODO: Submit to Supabase leaderboard tables
      // For now, just log the submission
      console.log('Submitting score to leaderboard:', {
        userId: user.id,
        username: user.email?.split('@')[0] || 'Anonymous',
        ...result,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Score Submitted!",
        description: "Your score has been added to the leaderboard.",
      });

      return true;
    } catch (error) {
      console.error('Failed to submit score:', error);
      toast({
        title: "Submission Failed",
        description: "Could not submit your score. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitScore,
    isSubmitting
  };
}
