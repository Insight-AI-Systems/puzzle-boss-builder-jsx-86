
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ExternalLink, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layouts/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { SUPPORT_SYSTEM_CONFIG } from '@/services/openSupportsConfig';
import { SupportHome } from '@/components/support/SupportHome';
import { TicketList } from '@/components/support/TicketList';
import { TicketDetails } from '@/components/support/TicketDetails';
import { NewTicketForm } from '@/components/support/NewTicketForm';

const Support = () => {
  const location = useLocation();
  const { hasRole, user } = useAuth();
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
      <div className="flex justify-between items-center mb-6">
        {isAdmin && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
            onClick={() => window.open(SUPPORT_SYSTEM_CONFIG.ADMIN_PANEL_URL, '_blank')}
          >
            <span>Admin Panel</span>
            <ExternalLink size={16} />
          </Button>
        )}
        
        {user && (
          <Button 
            className="flex items-center gap-2"
            onClick={() => window.location.href = '/support/new-ticket'}
          >
            <PlusCircle size={16} />
            <span>New Support Ticket</span>
          </Button>
        )}
      </div>
      
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
