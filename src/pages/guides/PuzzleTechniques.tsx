
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Zap, Clock, PuzzlePiece, Brain, Award, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const PuzzleTechniques = () => {
  return (
    <PageLayout
      title="Puzzle Techniques"
      subtitle="Advanced strategies to improve your puzzle-solving speed and efficiency"
      className="prose prose-invert prose-headings:text-puzzle-white prose-a:text-puzzle-aqua max-w-4xl"
    >
      <div className="flex items-center text-muted-foreground text-sm mb-6">
        <Link to="/" className="hover:text-puzzle-aqua">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/support" className="hover:text-puzzle-aqua">Support</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-puzzle-aqua">Puzzle Techniques</span>
      </div>

      <div className="mb-8">
        <Card className="bg-puzzle-black/30 border-puzzle-aqua/20 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 text-puzzle-aqua mb-4">
              <Brain className="h-8 w-8" />
              <h2 className="text-2xl font-bold m-0">Master the Art of Puzzle Solving</h2>
            </div>
            <p className="text-muted-foreground">
              Whether you're a beginner looking to improve or an experienced puzzler aiming for the top of the leaderboard, 
              these techniques will help you solve puzzles faster and more efficiently.
            </p>
          </CardContent>
        </Card>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Fundamental Techniques</h2>
        <p className="text-muted-foreground mb-4">
          These basic techniques form the foundation of efficient puzzle solving:
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <PuzzlePiece className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Edge First Approach</h3>
              <p className="text-muted-foreground">
                Always start by identifying and connecting all edge pieces. The straight edges make these 
                pieces easier to identify, and completing the border gives you a frame of reference for the rest of the puzzle.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <PuzzlePiece className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Color Sorting</h3>
              <p className="text-muted-foreground">
                Group pieces by color or pattern. This makes it easier to find pieces that belong together 
                when you're working on a specific section of the puzzle.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <PuzzlePiece className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Shape Recognition</h3>
              <p className="text-muted-foreground">
                Pay attention to the shape of each piece's tabs and blanks. Even without looking at the image, 
                you can often determine if pieces fit together based on their complementary shapes.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-puzzle-aqua/10 p-6 rounded-lg mb-8">
          <h3 className="text-puzzle-white text-xl font-bold mb-2">Pro Tip: The Grid Method</h3>
          <p className="text-muted-foreground">
            For digital puzzles, use a mental grid system. Divide the image into sections (like a 3×3 grid) and focus on completing one section at a time. This reduces overwhelm and creates manageable goals.
          </p>
        </div>

        <Separator className="my-8" />

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Advanced Speed Techniques</h2>
        <p className="text-muted-foreground mb-4">
          Once you've mastered the basics, these advanced techniques will help you shave precious seconds off your solve time:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-puzzle-aqua mb-2">
                <Clock className="h-5 w-5" />
                <h3 className="text-lg font-bold m-0">Two-Pass Sorting</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                On your first pass, quickly sort pieces into basic categories (edges, colors, patterns). On your second pass, create more specific subgroups that will form identifiable sections of the puzzle.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-puzzle-aqua mb-2">
                <Zap className="h-5 w-5" />
                <h3 className="text-lg font-bold m-0">Hotkey Mastery</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Learn and use keyboard shortcuts for rotating pieces (typically the R key), zooming in/out (ctrl/cmd + scroll), and other common actions to reduce mouse movement and save time.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-puzzle-aqua mb-2">
                <Target className="h-5 w-5" />
                <h3 className="text-lg font-bold m-0">Pattern Recognition</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Train yourself to recognize patterns in the puzzle image. Your brain will naturally begin to identify which pieces belong where based on these patterns, even before you consciously process it.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-puzzle-aqua mb-2">
                <Award className="h-5 w-5" />
                <h3 className="text-lg font-bold m-0">Piece Prediction</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                After placing a piece, immediately look for the next piece that would connect to it. This forward-thinking approach maintains momentum and reduces the time spent searching for pieces.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Competition-Specific Strategies</h2>
        <p className="text-muted-foreground mb-4">
          When competing for prizes on The Puzzle Boss, these strategies can give you a competitive edge:
        </p>
        
        <ol className="space-y-4 mb-8">
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Preview Analysis (5-10 seconds):</span> Before starting, take a few seconds to analyze the puzzle image. Identify key features, color patterns, and potential starting points.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Prioritize Distinctive Features:</span> Start with the most distinctive elements of the image (faces, logos, text, bright colors) as these pieces are easier to place correctly.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Build Islands:</span> Don't feel compelled to build outward from a single starting point. Create multiple "islands" of connected pieces that you can join together later.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Skip Difficult Areas:</span> If you're struggling with a particular section, move on and come back to it later. Focus on making progress where you can.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">End-Game Strategy:</span> As you near completion, scan the remaining pieces more methodically to avoid overlooking the final few pieces.
          </li>
        </ol>

        <div className="bg-puzzle-aqua/10 p-6 rounded-lg mb-8">
          <h3 className="text-puzzle-white text-xl font-bold mb-2">Mental Preparation</h3>
          <p className="text-muted-foreground">
            Before high-stakes competitions, take a minute to clear your mind and focus. Mental clarity is just as important as technical skill when competing under time pressure.
          </p>
        </div>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Practice Exercises</h2>
        <p className="text-muted-foreground mb-4">
          Incorporate these exercises into your practice routine to improve specific puzzle-solving skills:
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <Brain className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Timed Edge Sort</h3>
              <p className="text-muted-foreground">
                Practice identifying and sorting all edge pieces as quickly as possible. Time yourself and try to beat your personal record.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <Brain className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Blind Assembly</h3>
              <p className="text-muted-foreground">
                Try connecting pieces without looking at the reference image. This improves your ability to recognize piece shapes and fit.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <Brain className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Memory Challenge</h3>
              <p className="text-muted-foreground">
                Look at the puzzle image for 30 seconds, then try to recall as many details as possible. This strengthens your visual memory, which is crucial for fast puzzle solving.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Common Mistakes to Avoid</h2>
        <ul className="space-y-4 mb-8">
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Forcing Pieces:</span> Never force pieces together. If they don't fit easily, they don't belong together.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Neglecting Organization:</span> Disorganized pieces lead to wasted time searching. Invest time in sorting at the beginning.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Tunnel Vision:</span> Don't fixate on one difficult section. Keep a flexible approach and work where progress is possible.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Ignoring Piece Orientation:</span> Consistently check if pieces need to be rotated. In digital puzzles, using the rotation hotkey is faster than trying to fit incorrectly oriented pieces.
          </li>
        </ul>

        <Separator className="my-8" />

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Next Steps</h2>
        <p className="text-muted-foreground mb-4">
          Ready to put these techniques into practice? Here's how to continue improving:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/puzzles" className="no-underline">
            <Card className="bg-puzzle-black/30 border-puzzle-aqua/20 h-full hover:border-puzzle-aqua transition-colors duration-300">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold text-puzzle-white mb-2">Practice with Free Puzzles</h3>
                <p className="text-muted-foreground text-sm">
                  Use our free practice puzzles to refine your techniques without using credits.
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/support" className="no-underline">
            <Card className="bg-puzzle-black/30 border-puzzle-aqua/20 h-full hover:border-puzzle-aqua transition-colors duration-300">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold text-puzzle-white mb-2">Join Our Community</h3>
                <p className="text-muted-foreground text-sm">
                  Connect with other puzzle enthusiasts to share strategies and tips.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default PuzzleTechniques;
