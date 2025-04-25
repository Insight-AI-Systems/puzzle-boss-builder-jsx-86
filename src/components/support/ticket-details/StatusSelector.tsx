
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '../badges/StatusBadge';
import { TicketStatus } from '@/types/ticketTypes';

interface StatusSelectorProps {
  status: TicketStatus;
  isStaff: boolean;
  onStatusChange: (status: string) => void;
  isPending: boolean;
}

export const StatusSelector = ({ status, isStaff, onStatusChange, isPending }: StatusSelectorProps) => {
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
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <StatusBadge status={status} />
      )}
    </div>
  );
};
