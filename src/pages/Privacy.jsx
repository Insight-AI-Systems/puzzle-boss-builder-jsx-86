
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import MainHeader from '@/components/header';

const Privacy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-puzzle-black">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-puzzle-gold">Privacy Policy</h1>
          
          <div className="space-y-6 text-card-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">1. Information We Collect</h2>
              <p>
                We collect personal information such as name, email address, and payment information when you register and use our services. We also collect usage data including puzzle completion times, scores, and interaction patterns. All data collection complies with New Zealand's Privacy Act 2020.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">2. How We Use Your Information</h2>
              <p>
                We use your information to provide and improve our services, process payments, verify winners, communicate about contests and updates, and ensure fair play on our platform. In accordance with New Zealand privacy principles, we only use your information for the purposes for which it was collected.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">3. Data Storage and Security</h2>
              <p>
                Your data is stored securely on our servers with industry-standard encryption. We implement appropriate security measures to protect against unauthorized access or alteration of your personal information. We comply with New Zealand's Privacy Act 2020 requirements for data security.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">4. Sharing Your Information</h2>
              <p>
                We do not sell your personal information to third parties. We may share data with service providers who help us operate our platform, process payments, or fulfill prizes. We may disclose information when required by New Zealand law, including to the Privacy Commissioner if necessary.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">5. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and store certain preferences. You can manage cookie settings through your browser. Our cookie usage complies with the guidance from New Zealand's Privacy Commissioner.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">6. Your Rights</h2>
              <p>
                Under New Zealand's Privacy Act 2020, you have the right to access, correct, and in some cases, delete your personal data. You can request a copy of the information we hold about you, and we will respond within 20 working days as required by law.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">7. Children's Privacy</h2>
              <p>
                Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If we learn we have collected information from a child under 13, we will delete that information promptly in accordance with New Zealand law.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than New Zealand. We ensure appropriate safeguards are in place to protect your information in compliance with New Zealand's Privacy Act 2020, including when transferring data overseas.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website or via email, in accordance with New Zealand privacy law requirements.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact our Privacy Officer at privacy@puzzleboss.com. You also have the right to lodge a complaint with New Zealand's Privacy Commissioner if you believe we have violated your privacy rights.
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

export default Privacy;
