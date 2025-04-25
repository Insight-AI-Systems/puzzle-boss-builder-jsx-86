
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { TicketStatus } from '@/types/supportTicketTypes';

export const TicketStatusBadge = ({ status }: { status: TicketStatus }) => {
  switch (status) {
    case 'open':
      return (
        <div className="flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-2 py-1 text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>Open</span>
        </div>
      );
    case 'in-progress':
      return (
        <div className="flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 px-2 py-1 text-xs">
          <Clock className="h-3 w-3" />
          <span>In Progress</span>
        </div>
      );
    case 'resolved':
    case 'closed':
      return (
        <div className="flex items-center gap-1 rounded-full bg-green-100 text-green-800 px-2 py-1 text-xs">
          <CheckCircle className="h-3 w-3" />
          <span>Resolved</span>
        </div>
      );
    case 'pending':
      return (
        <div className="flex items-center gap-1 rounded-full bg-orange-100 text-orange-800 px-2 py-1 text-xs">
          <Clock className="h-3 w-3" />
          <span>Pending</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1 rounded-full bg-gray-100 text-gray-800 px-2 py-1 text-xs">
          <span>Unknown</span>
        </div>
      );
  }
};
