
import React, { useEffect } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ConceptSection from '@/components/ConceptSection';
import FeaturedPuzzles from '@/components/FeaturedPuzzles';
import Categories from '@/components/Categories';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Benefits from '@/components/Benefits';
import RegistrationCTA from '@/components/RegistrationCTA';
import Footer from '@/components/Footer';

const Index = () => {
  // Add debug log to verify component mounting
  useEffect(() => {
    console.log('Index page mounted');
  }, []);

  return (
    <div className="min-h-screen bg-puzzle-black">
      <ErrorBoundary>
        <Navbar />
        
        <main>
          <ErrorBoundary>
            <Hero />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <ConceptSection />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <FeaturedPuzzles />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <Categories />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <HowItWorks />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <Testimonials />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <Benefits />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <RegistrationCTA />
          </ErrorBoundary>
        </main>
        
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </ErrorBoundary>
    </div>
  );
};

export default Index;
