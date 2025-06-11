
import React from 'react';
import { SupportFAQ } from './SupportFAQ';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { useToast } from '@/hooks/use-toast';

export const SupportHome = () => {
  const { user, isAdmin } = useClerkAuth();
  const { toast } = useToast();

  return (
    <div className="space-y-8">
      <SupportFAQ />
    </div>
  );
};
