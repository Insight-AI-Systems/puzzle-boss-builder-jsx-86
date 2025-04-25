
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '../badges/StatusBadge';
import { TicketStatus } from '@/types/supportTicketTypes';

interface StatusSelectorProps {
  status: string;
  isStaff: boolean;
  onStatusChange: (status: string) => void;
  isPending: boolean;
}

export const StatusSelector = ({ status, isStaff, onStatusChange, isPending }: StatusSelectorProps) => {
  // Map external status to our internal status type
  const mapStatus = (externalStatus: string): TicketStatus => {
    switch (externalStatus) {
      case 'pending': return 'pending';
      case 'closed': return 'closed';
      case 'resolved': return 'resolved';
      case 'in-progress': return 'in-progress';
      case 'open':
      default: return 'open';
    }
  };
  
  const mappedStatus = mapStatus(status);

  return (
    <div className="flex items-center">
      <span className="text-sm mr-2">Status:</span>
      {isStaff ? (
        <Select
          defaultValue={status}
          onValueChange={onStatusChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <StatusBadge status={mappedStatus} />
      )}
    </div>
  );
};
