
import * as React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import DevDashboard from "./pages/DevDashboard";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Membership from "./pages/Membership";
import AccountDashboard from "./pages/AccountDashboard";
import InitialTestRunner from "@/components/InitialTestRunner";
import Puzzles from "./pages/Puzzles";
import Prizes from "./pages/Prizes";
import HowItWorks from "./pages/HowItWorks";
import Settings from "./pages/Settings";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import CookiePolicy from "./pages/legal/CookiePolicy";
import ContestRules from "./pages/legal/ContestRules";
import Support from "./pages/Support";
import Partnerships from "./pages/Partnerships";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import PuzzleDemo from './pages/PuzzleDemo';

// Guide Pages
import GettingStartedGuide from "./pages/guides/GettingStartedGuide";
import PuzzleTechniques from "./pages/guides/PuzzleTechniques";
import PrizeClaimProcess from "./pages/guides/PrizeClaimProcess";
import AccountManagement from "./pages/guides/AccountManagement";

// Create a new QueryClient instance at the module level to avoid recreation on renders
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Toaster />
          <Sonner />
          <InitialTestRunner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/dev-dashboard" element={<DevDashboard />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/account" element={<AccountDashboard />} />
              <Route path="/puzzles" element={<Puzzles />} />
              <Route path="/prizes" element={<Prizes />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/puzzle-demo" element={<PuzzleDemo />} />
              
              {/* New Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              
              {/* Legal Pages */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/contest-rules" element={<ContestRules />} />
              
              {/* Support & Company Pages */}
              <Route path="/support" element={<Support />} />
              <Route path="/partnerships" element={<Partnerships />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />
              
              {/* Guide Pages */}
              <Route path="/guides/getting-started-guide" element={<GettingStartedGuide />} />
              <Route path="/guides/puzzle-techniques" element={<PuzzleTechniques />} />
              <Route path="/guides/prize-claim-process" element={<PrizeClaimProcess />} />
              <Route path="/guides/account-management" element={<AccountManagement />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
