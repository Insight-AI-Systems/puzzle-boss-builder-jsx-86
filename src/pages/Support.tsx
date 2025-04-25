
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layouts/PageLayout';
import SupportHome from '@/components/support/SupportHome';
import TicketList from '@/components/support/TicketList';
import TicketDetails from '@/components/support/TicketDetails';
import NewTicketForm from '@/components/support/NewTicketForm';
import { useAuth } from '@/contexts/AuthContext';
import { OPEN_SUPPORTS_CONFIG } from '@/services/openSupportsConfig';

const Support = () => {
  const location = useLocation();
  const { hasRole } = useAuth();
  const isAdmin = hasRole('super_admin') || hasRole('admin');
  
  let subtitle = "Get help with your account, puzzles, and prizes";
  if (location.pathname.includes('/tickets')) {
    subtitle = "View and manage your support tickets";
  } else if (location.pathname.includes('/new-ticket')) {
    subtitle = "Create a new support ticket";
  }

  return (
    <PageLayout 
      title="Support Center" 
      subtitle={subtitle}
      className={isAdmin ? "relative" : ""}
    >
      {isAdmin && (
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
            onClick={() => window.open(OPEN_SUPPORTS_CONFIG.ADMIN_PANEL_URL, '_blank')}
          >
            <span>Admin Panel</span>
            <ExternalLink size={16} />
          </Button>
        </div>
      )}
      
      <Routes>
        <Route path="/" element={<SupportHome />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/:ticketId" element={<TicketDetails />} />
        <Route path="/new-ticket" element={<NewTicketForm />} />
      </Routes>
    </PageLayout>
  );
};

export default Support;
