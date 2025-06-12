import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Puzzle, Clock, Trophy } from 'lucide-react';
import JigsawPuzzle from '@/components/games/unity/JigsawPuzzle';
import { useToast } from '@/hooks/use-toast';
const UnityJigsawPuzzle: React.FC = () => {
  const {
    toast
  } = useToast();
  const handlePuzzleComplete = (completionData: any) => {
    console.log('Puzzle completed:', completionData);
    toast({
      title: "🎉 Puzzle Completed!",
      description: `Great job! You completed the puzzle in ${completionData.completionTime} seconds with a score of ${completionData.score}.`
    });
  };
  const handlePaymentRequired = (paymentData: any) => {
    console.log('Payment required:', paymentData);
    toast({
      title: "Payment Required",
      description: `This puzzle costs $${paymentData.price}. Payment integration coming soon!`
    });
  };
  return <div className="min-h-screen bg-puzzle-black p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Game Header */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Puzzle className="h-6 w-6 text-puzzle-aqua" />
              Unity Jigsaw Puzzle
            </CardTitle>
            <p className="text-gray-400">We are in beta testing our premium jigsaw puzzle game.  It will load slowing and may have errors.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-puzzle-white">
                <Clock className="h-4 w-4 text-puzzle-gold" />
                <span>Timed Gameplay</span>
              </div>
              <div className="flex items-center gap-2 text-puzzle-white">
                <Trophy className="h-4 w-4 text-puzzle-gold" />
                <span>Leaderboard Scoring</span>
              </div>
              <div className="flex items-center gap-2 text-puzzle-white">
                <Puzzle className="h-4 w-4 text-puzzle-gold" />
                <span>Advanced Physics</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Container */}
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-6">
            <JigsawPuzzle puzzleId="unity-jigsaw-001" puzzlePrice={2.99} isPaid={true} // Set to false to test payment flow
          onComplete={handlePuzzleComplete} onPaymentRequired={handlePaymentRequired} />
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default UnityJigsawPuzzle;