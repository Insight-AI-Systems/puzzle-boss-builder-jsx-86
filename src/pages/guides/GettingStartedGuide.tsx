
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Home, Trophy, CreditCard, Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const GettingStartedGuide = () => {
  return (
    <PageLayout
      title="Getting Started Guide"
      subtitle="Everything you need to know to begin your puzzle journey"
      className="prose prose-invert prose-headings:text-puzzle-white prose-a:text-puzzle-aqua max-w-4xl"
    >
      <div className="flex items-center text-muted-foreground text-sm mb-6">
        <Link to="/" className="hover:text-puzzle-aqua">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/support" className="hover:text-puzzle-aqua">Support</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-puzzle-aqua">Getting Started Guide</span>
      </div>

      <div className="mb-8">
        <Card className="bg-puzzle-black/30 border-puzzle-aqua/20 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 text-puzzle-aqua mb-4">
              <Home className="h-8 w-8" />
              <h2 className="text-2xl font-bold m-0">Welcome to The Puzzle Boss</h2>
            </div>
            <p className="text-muted-foreground">
              This guide will walk you through everything you need to know to get started with The Puzzle Boss platform.
              From creating your account to claiming your first prize, we've got you covered.
            </p>
          </CardContent>
        </Card>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Creating Your Account</h2>
        <p className="text-muted-foreground mb-4">
          Getting started with The Puzzle Boss is simple. Here's how to create and set up your account:
        </p>
        <ol className="space-y-4 mb-8">
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Sign Up:</span> Click the "Sign Up" button in the top right corner of the website and enter your email address.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Verify Your Email:</span> Check your inbox for a verification email and click the link to confirm your account.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Complete Your Profile:</span> Add your display name, profile picture, and update your account preferences.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Add Payment Method:</span> To purchase credits, add a secure payment method to your account.
          </li>
        </ol>

        <div className="bg-puzzle-aqua/10 p-6 rounded-lg mb-8">
          <h3 className="text-puzzle-white text-xl font-bold mb-2">Pro Tip</h3>
          <p className="text-muted-foreground">
            Setting up your profile with a unique display name and avatar will help other players recognize you on the leaderboards!
          </p>
        </div>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Understanding Credits</h2>
        <p className="text-muted-foreground mb-4">
          Credits are the currency used on The Puzzle Boss platform. Here's what you need to know:
        </p>
        <ul className="space-y-4 mb-8">
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Purchasing Credits:</span> Buy credits in bundles to enter puzzle competitions. Larger bundles offer better value.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Credit Usage:</span> Different puzzles require different numbers of credits to enter, based on prize value and competition type.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Free Credits:</span> You can earn free credits by referring friends, completing daily challenges, and participating in promotional events.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Credit Expiration:</span> Credits never expire, so you can use them anytime.
          </li>
        </ul>

        <Separator className="my-8" />

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Finding Your First Puzzle</h2>
        <p className="text-muted-foreground mb-4">
          Ready to start your first puzzle? Here's how to find the perfect one:
        </p>
        <ol className="space-y-4 mb-8">
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Browse Categories:</span> Explore different prize categories on the Puzzles page to find competitions that interest you.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Check Difficulty:</span> Each puzzle has a difficulty rating. Start with Easy or Medium puzzles if you're new.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Review Prize Details:</span> Click on a puzzle to see the prize description, value, and competition rules.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Enter the Competition:</span> Use your credits to enter the puzzle competition when you're ready.
          </li>
        </ol>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-puzzle-aqua mb-2">
                <Trophy className="h-5 w-5" />
                <h3 className="text-lg font-bold m-0">Puzzle Competitions</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Compete against other players to solve puzzles in the fastest time. Winners are determined based on completion speed and accuracy.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-puzzle-aqua mb-2">
                <CreditCard className="h-5 w-5" />
                <h3 className="text-lg font-bold m-0">Membership Benefits</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Upgrade to a membership tier to receive monthly credit allocations, exclusive puzzles, and priority prize shipping.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Completing Your First Puzzle</h2>
        <p className="text-muted-foreground mb-4">
          Here's what to expect when you start a puzzle competition:
        </p>
        <ol className="space-y-4 mb-6">
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Puzzle Interface:</span> The puzzle grid will appear with pieces scattered around. Use your mouse or touchscreen to move and rotate pieces.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Timer:</span> A timer starts as soon as the puzzle loads. This tracks your completion time for the competition.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Saving Progress:</span> Most puzzles allow you to save your progress and return later, but the timer may continue running depending on the competition rules.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Completion:</span> When you place the final piece, your time is recorded and your position on the leaderboard is determined.
          </li>
        </ol>

        <div className="bg-puzzle-aqua/10 p-6 rounded-lg mb-8">
          <h3 className="text-puzzle-white text-xl font-bold mb-2">Beginner Strategy</h3>
          <p className="text-muted-foreground">
            Start by completing the edges of the puzzle first, then work your way inward. Look for distinctive colors or patterns to group similar pieces together.
          </p>
        </div>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Next Steps</h2>
        <p className="text-muted-foreground mb-4">
          Once you've completed your first puzzle, here are some ways to enhance your experience:
        </p>
        <ul className="space-y-4 mb-8">
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Explore Different Categories:</span> Try puzzles from various categories to discover your preferences.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Join the Community:</span> Connect with other puzzle enthusiasts in our forum and social media channels.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Check the Leaderboards:</span> See how you rank against other players and set goals to improve your times.
          </li>
          <li className="text-muted-foreground">
            <span className="text-puzzle-white font-medium">Refer Friends:</span> Invite friends to join and earn bonus credits when they sign up.
          </li>
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-puzzle-aqua mb-2">
                <Settings className="h-5 w-5" />
                <h3 className="text-lg font-bold m-0">Account Settings</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Customize your experience by updating your profile and notification preferences.
              </p>
              <Link to="/settings" className="text-puzzle-aqua hover:underline text-sm mt-2 inline-block">
                Go to Settings
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-puzzle-aqua mb-2">
                <HelpCircle className="h-5 w-5" />
                <h3 className="text-lg font-bold m-0">Help & Support</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Find answers to common questions or contact our support team for assistance.
              </p>
              <Link to="/support" className="text-puzzle-aqua hover:underline text-sm mt-2 inline-block">
                Get Help
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-puzzle-aqua mb-2">
                <Trophy className="h-5 w-5" />
                <h3 className="text-lg font-bold m-0">Prize Claims</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Learn about the verification process and how to claim your prizes when you win.
              </p>
              <Link to="/guides/prize-claim-process" className="text-puzzle-aqua hover:underline text-sm mt-2 inline-block">
                Prize Guide
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default GettingStartedGuide;
