
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PageLayout from '@/components/layouts/PageLayout';
import SupportHome from '@/components/support/SupportHome';
import TicketList from '@/components/support/TicketList';
import TicketDetails from '@/components/support/TicketDetails';
import NewTicketForm from '@/components/support/NewTicketForm';

const Support = () => {
  const location = useLocation();
  
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
    >
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
