
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import ConceptSection from '@/components/ConceptSection';
import FeaturedPuzzles from '@/components/FeaturedPuzzles';
import Categories from '@/components/Categories';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Benefits from '@/components/Benefits';
import RegistrationCTA from '@/components/RegistrationCTA';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

const Index = () => {
  // Add debug log to verify component mounting
  useEffect(() => {
    console.log('Index page mounted');
    
    // Log any potential issues with required components
    const componentsToCheck = [
      { name: 'Hero', component: Hero },
      { name: 'ConceptSection', component: ConceptSection },
      { name: 'FeaturedPuzzles', component: FeaturedPuzzles },
      { name: 'Categories', component: Categories },
      { name: 'HowItWorks', component: HowItWorks },
      { name: 'Testimonials', component: Testimonials },
      { name: 'Benefits', component: Benefits },
      { name: 'RegistrationCTA', component: RegistrationCTA },
      { name: 'Footer', component: Footer }
    ];
    
    componentsToCheck.forEach(({ name, component }) => {
      if (!component) {
        console.error(`Missing component: ${name}`);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
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
    </div>
  );
};

export default Index;
