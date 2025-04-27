
import { ShieldAlert } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface TicketFormHeaderProps {
  isInternal: boolean;
}

export const TicketFormHeader = ({ isInternal }: TicketFormHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>
          {isInternal ? (
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <span>Create Internal Issue</span>
            </div>
          ) : (
            <span>Create Support Ticket</span>
          )}
        </CardTitle>
      </div>
    </CardHeader>
  );
};
