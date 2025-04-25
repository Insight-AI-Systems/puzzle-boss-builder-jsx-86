
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SupportTickets = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>My Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Ticket className="h-16 w-16 mx-auto mb-4 text-puzzle-aqua opacity-50" />
            <h3 className="text-xl font-medium mb-2">View and Manage Your Support Tickets</h3>
            <p className="text-muted-foreground mb-6">
              Track the status of your support requests and communicate with our team.
            </p>
            <Button asChild>
              <Link to="/support/tickets">
                View My Tickets
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTickets;
