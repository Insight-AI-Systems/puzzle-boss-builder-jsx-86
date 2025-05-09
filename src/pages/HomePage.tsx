
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
import { isProtectedAdmin } from '@/constants/securityConfig';

function HomePage() {
  const { isAdmin, profile, isLoading: profileLoading } = useUserProfile();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  
  console.log("HomePage rendering", { 
    isAdmin, 
    hasProfile: !!profile, 
    profileRole: profile?.role,
    isLoading: profileLoading,
    authLoading,
    isAuthenticated,
    userEmail: user?.email
  });
  
  useEffect(() => {
    // Debug message to verify component rendering
    console.log('HomePage mounted');
    
    // Only proceed if authentication and profile loading are complete
    if (authLoading || profileLoading) {
      return;
    }

    // Check if user is a super admin either via profile role or protected admin email
    const isSuperAdmin = (profile?.role === 'super_admin') || 
                         isProtectedAdmin(user?.email);
    
    if (isSuperAdmin) {
      // Get stored preference from localStorage
      const adminPreference = window.localStorage.getItem('redirect_to_admin');
      
      console.log('Admin redirect check:', { 
        isSuperAdmin, 
        adminPreference,
        profileRole: profile?.role,
        userEmail: user?.email
      });
      
      // If preference exists and is 'true', redirect to admin
      if (adminPreference === 'true') {
        console.log('Auto-redirecting admin to dashboard based on saved preference');
        navigate('/admin-dashboard');
      } 
      // If no preference is set (null), show confirmation dialog
      else if (adminPreference === null) {
        console.log('Showing admin redirect confirmation dialog');
        const shouldRedirect = window.confirm('As a Super Admin, would you like to go directly to the Admin Dashboard?');
        
        // Save preference to localStorage
        window.localStorage.setItem('redirect_to_admin', shouldRedirect ? 'true' : 'false');
        console.log('Saved admin preference:', shouldRedirect);
        
        // If confirmed, navigate to admin dashboard
        if (shouldRedirect) {
          navigate('/admin-dashboard');
        }
      }
    }
  }, [profileLoading, authLoading, profile, navigate, user]);

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
      <PageDebugger componentName="HomePage" />
    </main>
  );
}

export default HomePage;
