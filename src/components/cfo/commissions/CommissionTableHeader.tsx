
import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentStatus } from '@/types/financeTypes';

interface CommissionTableHeaderProps {
  filterManager: string;
  setFilterManager: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
}

export const CommissionTableHeader: React.FC<CommissionTableHeaderProps> = ({
  filterManager,
  setFilterManager,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
}) => {
  return (
    <div className="mb-4 flex gap-4">
      <Input
        placeholder="Filter by manager..."
        value={filterManager}
        onChange={(e) => setFilterManager(e.target.value)}
        className="max-w-xs"
      />
      <Input
        placeholder="Filter by category..."
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="max-w-xs"
      />
      <Select
        value={filterStatus}
        onValueChange={setFilterStatus}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Statuses</SelectItem>
          {Object.values(PaymentStatus).map((status) => (
            <SelectItem key={status} value={status}>{status}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
