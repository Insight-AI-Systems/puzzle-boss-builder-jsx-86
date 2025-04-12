
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
import MainMenu from '@/components/MainMenu';

const Index = () => {
  return (
    <div className="min-h-screen bg-puzzle-black">
      <Navbar />
      <MainMenu />
      
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
