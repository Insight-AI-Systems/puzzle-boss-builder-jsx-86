
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import MainHeader from '@/components/header';

const ContestRules = () => {
  return (
    <div className="flex flex-col min-h-screen bg-puzzle-black">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-puzzle-gold">Contest Rules</h1>
          
          <div className="space-y-6 text-card-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">1. Eligibility</h2>
              <p>
                All contests on The Puzzle Boss are open to registered users who are at least 18 years of age at the time of entry. 
                Employees of The Puzzle Boss and their immediate family members are not eligible to participate in contests.
                Eligibility restrictions may vary by country due to local laws and regulations.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">2. How to Enter</h2>
              <p>
                To participate in a puzzle contest, users must:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Have a registered account on The Puzzle Boss</li>
                <li>Have sufficient credits in their account for the specific contest</li>
                <li>Complete the puzzle within the specified time limit</li>
                <li>Adhere to all platform rules and fair play guidelines</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">3. Contest Structure</h2>
              <p>
                Each puzzle contest has a defined structure with specific:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Start and end times</li>
                <li>Entry fee (in credits)</li>
                <li>Maximum number of participants</li>
                <li>Prize details</li>
                <li>Puzzle difficulty level</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">4. Winner Determination</h2>
              <p>
                Winners are determined based on:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Completion time (fastest time wins)</li>
                <li>Accuracy of puzzle completion</li>
                <li>Adherence to all contest rules</li>
              </ul>
              <p className="mt-2">
                In the event of a tie, the user who started the puzzle first will be declared the winner.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">5. Prizes and Fulfillment</h2>
              <p>
                Prize details are specified for each contest. Winners must complete identity verification within 7 days of winning.
                Prizes will be shipped to the verified address within 30 days of verification.
                The Puzzle Boss is not responsible for lost, stolen, or damaged prizes after shipping.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">6. Fair Play Policy</h2>
              <p>
                The Puzzle Boss maintains a strict fair play policy. Any user found to be:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Using automated tools or bots</li>
                <li>Creating multiple accounts</li>
                <li>Manipulating the system in any way</li>
                <li>Sharing solutions or collaborating during a contest</li>
              </ul>
              <p className="mt-2">
                Will be immediately disqualified and may have their account suspended or terminated without refund.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">7. Dispute Resolution</h2>
              <p>
                All decisions made by The Puzzle Boss regarding contest winners, rule violations, or prize fulfillment are final.
                If you believe there has been an error, please contact our support team within 48 hours of the contest end.
              </p>
            </section>
          </div>
          
          <div className="mt-10 flex justify-center">
            <Link to="/">
              <Button className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContestRules;
