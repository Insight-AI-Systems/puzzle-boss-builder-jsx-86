
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import DevDashboard from "./pages/DevDashboard";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import InitialTestRunner from "@/components/InitialTestRunner";

// Create a new QueryClient instance at the module level to avoid recreation on renders
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
