
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import FeaturedPuzzles from '@/components/FeaturedPuzzles';
import Categories from '@/components/Categories';
import Benefits from '@/components/Benefits';
import Testimonials from '@/components/Testimonials';
import ConceptSection from '@/components/ConceptSection';
import RegistrationCTA from '@/components/RegistrationCTA';
import Footer from '@/components/Footer';
import { useUserProfile } from '@/hooks/useUserProfile';

function Index() {
  const { isAdmin, profile, isLoading } = useUserProfile();
  const navigate = useNavigate();
  
  // If the user is a super_admin, offer to redirect to admin dashboard
  useEffect(() => {
    if (!isLoading && profile?.role === 'super_admin') {
      const userWantsAdmin = window.localStorage.getItem('redirect_to_admin') === 'true';
      
      if (userWantsAdmin) {
        navigate('/admin-dashboard');
      } else if (userWantsAdmin === null) {
        // Ask only once
        const shouldRedirect = window.confirm('As a Super Admin, would you like to go directly to the Admin Dashboard?');
        window.localStorage.setItem('redirect_to_admin', shouldRedirect ? 'true' : 'false');
        
        if (shouldRedirect) {
          navigate('/admin-dashboard');
        }
      }
    }
  }, [isLoading, profile, navigate]);

  return (
    <div className="min-h-screen bg-puzzle-black text-white">
      <Navbar />
      <main>
        <Hero />
        <ConceptSection />
        <HowItWorks />
        <FeaturedPuzzles />
        <Categories />
        <Benefits />
        <Testimonials />
        <RegistrationCTA />
      </main>
      <Footer />
    </div>
  );
}

export default Index;
