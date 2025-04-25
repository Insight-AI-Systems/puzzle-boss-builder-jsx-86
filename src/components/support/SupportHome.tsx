
import React from 'react';
import { Button } from '@/components/ui/button';
import { SupportFAQ } from './SupportFAQ';
import { SupportContact } from './SupportContact';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const SupportHome = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  return (
    <div className="space-y-8">
      <SupportFAQ />
      <SupportContact />
    </div>
  );
};
