
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import MainHeader from '@/components/header';

const CookiePolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-puzzle-black">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-puzzle-gold">Cookie Policy</h1>
          
          <div className="space-y-6 text-card-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">1. What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">2. How We Use Cookies</h2>
              <p>
                The Puzzle Boss uses cookies to enhance your experience on our platform, analyze site usage, and assist in our marketing efforts. 
                We use both session cookies, which expire when you close your browser, and persistent cookies, which stay on your device until deleted.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">3. Types of Cookies We Use</h2>
              <p>
                <strong>Essential cookies:</strong> These are necessary for the website to function properly and cannot be switched off.
              </p>
              <p>
                <strong>Performance cookies:</strong> These help us understand how visitors interact with our website, such as which pages are visited most often.
              </p>
              <p>
                <strong>Functionality cookies:</strong> These remember choices you make to improve your experience, such as your username or language preference.
              </p>
              <p>
                <strong>Targeting cookies:</strong> These may be set through our site by our advertising partners to build a profile of your interests.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">4. Managing Cookies</h2>
              <p>
                Most web browsers allow some control of cookies through browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage or delete them, visit <a href="https://www.allaboutcookies.org" className="text-puzzle-aqua hover:underline">www.allaboutcookies.org</a>.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">5. Third-Party Cookies</h2>
              <p>
                We may use third-party services that use cookies, such as Google Analytics, payment processors, and social media platforms. These third parties may use cookies, web beacons, and similar technologies to collect information about your use of our website.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-puzzle-aqua">6. Changes to Our Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. We encourage you to periodically review this page for the latest information on our cookie practices.
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

export default CookiePolicy;
