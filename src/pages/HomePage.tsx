
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Hero } from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
// FeaturedPuzzles removed - CodeCanyon system will be added
import Categories from '@/components/Categories';
import Benefits from '@/components/Benefits';
import Testimonials from '@/components/Testimonials';
import ConceptSection from '@/components/ConceptSection';
import RegistrationCTA from '@/components/RegistrationCTA';
import { Link } from 'react-router-dom';
import { PageDebugger } from '@/components/debug/PageDebugger';
import { useClerkAuth } from '@/hooks/useClerkAuth';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showingConfirmation, setShowingConfirmation] = useState<boolean>(false);
  const confirmedAdmin = useRef<boolean | null>(null);
  const [hasProcessedRedirect, setHasProcessedRedirect] = useState<boolean>(false);
  
  const { isAuthenticated, isLoading, userRole } = useClerkAuth();
  
  console.log("HomePage rendering", { 
    userRole,
    isLoading,
    isAuthenticated,
    showingConfirmation,
    navigatedFrom: location.state?.from,
    skipRedirect: location.state?.skipAdminRedirect
  });
  
  // Admin redirect logic - DISABLED for home button navigation
  // Home button should always take users to home page regardless of role

  useEffect(() => {
    // Debug message to verify component mounting
    console.log('HomePage mounted', {
      pathname: window.location.pathname,
      localStorage: window.localStorage.getItem('redirect_to_admin'),
      state: location.state,
      sessionStorage: sessionStorage.getItem('temp_disable_admin_redirect')
    });
    
    // Allow testing by clearing localStorage when adding a query parameter
    if (window.location.search.includes('reset_admin_pref')) {
      console.log('Resetting admin preference in localStorage');
      window.localStorage.removeItem('redirect_to_admin');
      sessionStorage.removeItem('temp_disable_admin_redirect');
    }
  }, [location]);

  // Show loading while auth is initializing
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-puzzle-aqua border-t-transparent mx-auto"></div>
          <p>Loading application...</p>
          <p className="text-sm text-gray-500">Initializing authentication...</p>
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
      
      {/* Show a notification if user came from admin and can return */}
      {location.state?.skipAdminRedirect && userRole === 'super_admin' && (
        <div className="bg-puzzle-aqua/10 border-l-4 border-puzzle-aqua p-4 m-4 rounded">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              You're viewing the home page. 
              <Link to="/admin" className="ml-2 underline hover:no-underline">
                Return to Admin Dashboard
              </Link>
            </p>
            <button 
              onClick={() => {
                sessionStorage.removeItem('temp_disable_admin_redirect');
                window.history.replaceState(null, '', window.location.pathname);
              }}
              className="text-xs bg-puzzle-aqua text-puzzle-black px-2 py-1 rounded hover:bg-puzzle-aqua/80"
            >
              Enable Auto-Redirect
            </button>
          </div>
        </div>
      )}
      
      <Hero />
      <ConceptSection />
      <HowItWorks />
      {/* FeaturedPuzzles removed - CodeCanyon system will be added */}
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
      <PageDebugger componentName="HomePage" />
    </main>
  );
}

export default HomePage;
