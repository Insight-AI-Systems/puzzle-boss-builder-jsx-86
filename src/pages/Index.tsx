
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const { isAuthenticated, isLoading: authLoading, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showingConfirmation, setShowingConfirmation] = useState<boolean>(false);
  const confirmedAdmin = useRef<boolean | null>(null);
  
  console.log("Index page rendering", { 
    userRole,
    isLoading: authLoading,
    isAuthenticated,
    showingConfirmation,
    navigatedFrom: location.state?.from,
    skipRedirect: location.state?.skipAdminRedirect
  });
  
  // Use separate useEffect for redirect logic to ensure it runs correctly
  useEffect(() => {
    // Skip this effect if we're already showing the confirmation or still loading
    if (showingConfirmation || authLoading) return;
    
    // Check if we're coming directly from an admin page - if so, don't redirect
    const comingFromAdmin = location.state?.from?.startsWith('/admin');
    
    // Check for skipAdminRedirect flag - this is set when clicking Home from admin pages
    const skipRedirect = location.state?.skipAdminRedirect === true;
    
    console.log('Index page admin redirect check', {
      authLoading,
      userRole,
      hasConfirmedAdmin: confirmedAdmin.current !== null,
      confirmedAdminValue: confirmedAdmin.current,
      comingFromAdmin,
      skipRedirect
    });
    
    // Only proceed if loading is done, there's no skip flag, and we're not coming from admin pages
    if (!authLoading && userRole === 'super_admin' && !skipRedirect && !comingFromAdmin) {
      // Check localStorage for user preference
      const userWantsAdmin = window.localStorage.getItem('redirect_to_admin');
      
      console.log('Admin redirect check', {
        userWantsAdmin,
        isNull: userWantsAdmin === null,
        comingFromAdmin,
        skipRedirect
      });
      
      if (userWantsAdmin === 'true') {
        console.log('Auto-redirecting super_admin to dashboard based on localStorage preference');
        navigate('/admin-dashboard');
      } else if (userWantsAdmin === null) {
        console.log('Showing confirmation dialog for super_admin');
        setShowingConfirmation(true);
        
        // Use setTimeout to ensure this runs after state update
        setTimeout(() => {
          const shouldRedirect = window.confirm('As a Super Admin, would you like to go directly to the Admin Dashboard?');
          confirmedAdmin.current = shouldRedirect;
          window.localStorage.setItem('redirect_to_admin', shouldRedirect ? 'true' : 'false');
          
          if (shouldRedirect) {
            navigate('/admin-dashboard');
          }
          setShowingConfirmation(false);
        }, 0);
      }
    }
  }, [authLoading, userRole, navigate, showingConfirmation, location.state]);

  useEffect(() => {
    // Debug message to verify component mounting
    console.log('Index page mounted', {
      pathname: window.location.pathname,
      localStorage: window.localStorage.getItem('redirect_to_admin'),
      state: location.state
    });
    
    // Allow testing by clearing localStorage when adding a query parameter
    if (window.location.search.includes('reset_admin_pref')) {
      console.log('Resetting admin preference in localStorage');
      window.localStorage.removeItem('redirect_to_admin');
    }
  }, [location]);

  // Add fallback rendering state for debugging
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-puzzle-aqua border-t-transparent mx-auto"></div>
          <p>Loading application data...</p>
          <p className="text-sm text-gray-500">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Don't render content while showing confirmation to prevent any race conditions
  if (showingConfirmation) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-puzzle-aqua border-t-transparent mx-auto"></div>
          <p>Preparing your experience...</p>
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
          Try Our FREE Puzzle Demo
        </Link>
      </div>
      <PageDebugger componentName="Index" />
    </main>
  );
}

export default Index;
