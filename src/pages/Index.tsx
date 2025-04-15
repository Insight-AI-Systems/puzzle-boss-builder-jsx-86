
import React from 'react';
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
  return (
    <div className="min-h-screen bg-puzzle-black">
      <Navbar />
      
      <main>
        <Hero />
        <ConceptSection />
        <FeaturedPuzzles />
        <Categories />
        <HowItWorks />
        <Testimonials />
        <Benefits />
        <RegistrationCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
