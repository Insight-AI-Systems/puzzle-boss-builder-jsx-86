
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MainMenu from '@/components/MainMenu';

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen bg-puzzle-black">
      <Navbar />
      <MainMenu />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-puzzle-gold">Terms of Service</h1>
          
          <div className="space-y-6 text-card-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">1. Acceptance of Terms</h2>
              <p>
                By accessing or using The Puzzle Boss platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">2. Eligibility</h2>
              <p>
                You must be at least 18 years old to participate in puzzle competitions with prizes. Users between 13-17 years old may use the platform with parental consent but are not eligible to win prizes. Eligibility for specific contests may vary by country due to local regulations.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">3. Account Registration</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and complete information during registration and to update such information as needed.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">4. Credits and Payments</h2>
              <p>
                Credits purchased on The Puzzle Boss are non-refundable except where required by law. Subscription plans auto-renew until canceled. Pricing may vary by region and is subject to change with notice.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">5. Puzzle Competitions</h2>
              <p>
                All puzzles have specific time limits and rules. The Puzzle Boss reserves the right to disqualify users suspected of cheating or fraudulent activity. Prize fulfillment may take up to 30 days after verification of winner.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">6. Code of Conduct</h2>
              <p>
                Users agree not to engage in harassment, cheating, or disruptive behavior. The Puzzle Boss reserves the right to terminate accounts that violate our code of conduct without refund.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">7. Termination</h2>
              <p>
                The Puzzle Boss reserves the right to terminate or suspend any account at its sole discretion, with or without notice, for conduct that violates these terms or impairs the rights of others.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">8. Modifications to Terms</h2>
              <p>
                We may modify these terms at any time. Your continued use of the platform after changes constitutes acceptance of the modified terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">9. Governing Law</h2>
              <p>
                These terms are governed by the laws of the jurisdiction in which The Puzzle Boss is registered, without regard to its conflict of law provisions.
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

export default Terms;
