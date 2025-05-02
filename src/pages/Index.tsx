
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import FeaturedPuzzles from '@/components/FeaturedPuzzles';
import Categories from '@/components/Categories';
import Benefits from '@/components/Benefits';
import Testimonials from '@/components/Testimonials';
import ConceptSection from '@/components/ConceptSection';
import RegistrationCTA from '@/components/RegistrationCTA';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Link } from 'react-router-dom';
import { PageDebugger } from '@/components/debug/PageDebugger';
import { useAuth } from '@/contexts/AuthContext';

function Index() {
  const { isAdmin, profile, isLoading: profileLoading } = useUserProfile();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  console.log("Index page rendering", { 
    isAdmin, 
    hasProfile: !!profile, 
    profileRole: profile?.role,
    isLoading: profileLoading,
    authLoading,
    isAuthenticated
  });
  
  useEffect(() => {
    // Debug message to verify component rendering
    console.log('Index page mounted');
    
    if (!profileLoading && profile?.role === 'super_admin') {
      const userWantsAdmin = window.localStorage.getItem('redirect_to_admin') === 'true';
      
      if (userWantsAdmin) {
        navigate('/admin-dashboard');
      } else if (userWantsAdmin === null) {
        const shouldRedirect = window.confirm('As a Super Admin, would you like to go directly to the Admin Dashboard?');
        window.localStorage.setItem('redirect_to_admin', shouldRedirect ? 'true' : 'false');
        
        if (shouldRedirect) {
          navigate('/admin-dashboard');
        }
      }
    }
  }, [profileLoading, profile, navigate]);

  // Add fallback rendering state for debugging
  if (authLoading || profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-puzzle-aqua border-t-transparent mx-auto"></div>
          <p>Loading application data...</p>
          <p className="text-sm text-gray-500">
            {authLoading ? 'Authenticating...' : ''}
            {profileLoading ? 'Loading profile...' : ''}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <h1 className="sr-only">The Puzzle Boss - Home</h1>
      <Hero />
      <ConceptSection />
      <HowItWorks />
      <FeaturedPuzzles />
      <Categories />
      <Benefits />
      <Testimonials />
      <RegistrationCTA />
      <div className="mt-6 container mx-auto px-4 text-center">
        <Link 
          to="/puzzle-demo" 
          className="inline-flex items-center px-4 py-2 bg-puzzle-aqua text-puzzle-black rounded-md hover:bg-puzzle-aqua/80 transition-colors"
        >
          Try Our Puzzle Demo
        </Link>
      </div>
      <PageDebugger componentName="Index" />
    </main>
  );
}

export default Index;
