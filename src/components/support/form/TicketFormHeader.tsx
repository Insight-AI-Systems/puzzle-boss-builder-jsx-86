
import { ShieldAlert } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

export const TicketFormHeader = () => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <span>Create Internal Issue</span>
          </div>
        </CardTitle>
      </div>
    </CardHeader>
  );
};
