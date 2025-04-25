
import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ExternalLink, PlusCircle, ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layouts/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { SUPPORT_SYSTEM_CONFIG } from '@/services/openSupportsConfig';
import { SupportHome } from '@/components/support/SupportHome';
import { TicketList } from '@/components/support/TicketList';
import { TicketDetails } from '@/components/support/ticket-details/TicketDetails';
import { NewTicketForm } from '@/components/support/NewTicketForm';
import { migrateKnownIssuesToSupport } from '@/utils/issueMigration';
import { useToast } from '@/hooks/use-toast';

const Support = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasRole, user } = useAuth();
  const { toast } = useToast();
  const isAdmin = hasRole('super_admin') || hasRole('admin');
  const [isMigrating, setIsMigrating] = useState(false);
  
  let subtitle = "Get help with your account, puzzles, and prizes";
  if (location.pathname.includes('/tickets')) {
    subtitle = "View and manage your support tickets";
  } else if (location.pathname.includes('/new-ticket')) {
    subtitle = "Create a new support ticket";
  }

  // Run migration when an admin visits the support center
  useEffect(() => {
    if (isAdmin && user) {
      // Check if migration has been run before
      const migrationCompleted = localStorage.getItem('support-migration-completed');
      
      if (!migrationCompleted) {
        setIsMigrating(true);
        // Run the migration
        migrateKnownIssuesToSupport(user.id)
          .then(success => {
            if (success) {
              localStorage.setItem('support-migration-completed', 'true');
              toast({
                title: "Migration Complete",
                description: "Previous issues have been migrated to the new support system.",
              });
            }
          })
          .catch(error => {
            console.error("Migration failed:", error);
            toast({
              title: "Migration Error",
              description: "There was an error migrating issues. Check the console for details.",
              variant: "destructive",
            });
          })
          .finally(() => {
            setIsMigrating(false);
          });
      }
    }
  }, [isAdmin, user, toast]);

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
      {isMigrating && (
        <div className="absolute inset-0 bg-puzzle-black/50 flex items-center justify-center z-10">
          <div className="bg-puzzle-black border border-puzzle-aqua/40 p-6 rounded-lg flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
            <p className="text-puzzle-white">Migrating old issues...</p>
          </div>
        </div>
      )}
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
