
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import MainHeader from '@/components/header';

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen bg-puzzle-black">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-puzzle-gold">Terms of Service</h1>
          
          <div className="space-y-6 text-card-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">1. Acceptance of Terms</h2>
              <p>
                By accessing or using The Puzzle Boss platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. In accordance with New Zealand's Consumer Guarantees Act 1993, we provide guarantees regarding the quality and fitness of our services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">2. Eligibility</h2>
              <p>
                You must be at least 18 years old to participate in puzzle competitions with prizes. Users between 13-17 years old may use the platform with parental consent but are not eligible to win prizes. In compliance with New Zealand's Gambling Act 2003, our skill-based competitions are designed to avoid classification as gambling activities.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">3. Account Registration</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and complete information during registration and to update such information as needed. In accordance with New Zealand's Privacy Act 2020, we are committed to protecting your personal information.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">4. Credits and Payments</h2>
              <p>
                Credits purchased on The Puzzle Boss are non-refundable except where required by law. Subscription plans auto-renew until canceled. Pricing is displayed in New Zealand Dollars (NZD) and includes GST as required by New Zealand's Goods and Services Tax Act 1985.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">5. Puzzle Competitions</h2>
              <p>
                All puzzles have specific time limits and rules. The Puzzle Boss reserves the right to disqualify users suspected of cheating or fraudulent activity. Prize fulfillment may take up to 30 days after verification of winner. Our competitions comply with New Zealand's Fair Trading Act 1986, ensuring that all contests are conducted fairly and transparently.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">6. Code of Conduct</h2>
              <p>
                Users agree not to engage in harassment, cheating, or disruptive behavior. The Puzzle Boss reserves the right to terminate accounts that violate our code of conduct without refund. We maintain a zero-tolerance policy for harmful digital communications in accordance with New Zealand's Harmful Digital Communications Act 2015.
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
                We may modify these terms at any time. Your continued use of the platform after changes constitutes acceptance of the modified terms. Notice of significant changes will be provided in accordance with New Zealand consumer protection laws.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">9. Governing Law</h2>
              <p>
                These terms are governed by the laws of New Zealand, and any disputes shall be resolved in the courts of New Zealand. Users agree to submit to the jurisdiction of New Zealand courts for any legal proceedings related to these terms or use of the platform.
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
