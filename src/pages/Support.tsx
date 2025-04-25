
import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ExternalLink, PlusCircle, ShieldAlert } from 'lucide-react';
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
  const navigate = useNavigate();
  const { hasRole, user } = useAuth();
  const isAdmin = hasRole('super_admin') || hasRole('admin');
  
  let subtitle = "Get help with your account, puzzles, and prizes";
  if (location.pathname.includes('/tickets')) {
    subtitle = "View and manage your support tickets";
  } else if (location.pathname.includes('/new-ticket')) {
    subtitle = "Create a new support ticket";
  }

  const handleAdminPanelClick = () => {
    window.open(SUPPORT_SYSTEM_CONFIG.ADMIN_PANEL_URL, '_blank');
  };

  const handleInternalIssuesClick = () => {
    navigate('/support/tickets?view=internal');
  };

  const handleNewTicketClick = () => {
    navigate('/support/new-ticket');
  };

  return (
    <PageLayout 
      title={isAdmin ? "Admin Support Center" : "Support Center"} 
      subtitle={subtitle}
      className={isAdmin ? "relative" : ""}
    >
      <div className="flex justify-between items-center mb-6">
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
              onClick={handleAdminPanelClick}
            >
              <span>Admin Panel</span>
              <ExternalLink size={16} />
            </Button>
            
            <Button 
              variant="destructive"
              className="flex items-center gap-2"
              onClick={handleInternalIssuesClick}
            >
              <ShieldAlert size={16} />
              <span>Internal Issues</span>
            </Button>
          </div>
        )}
        
        {user && (
          <Button 
            className="flex items-center gap-2 ml-auto"
            onClick={handleNewTicketClick}
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
