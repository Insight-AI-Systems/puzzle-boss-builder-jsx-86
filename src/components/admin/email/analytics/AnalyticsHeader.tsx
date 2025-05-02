
import React from 'react';
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
}

interface AnalyticsHeaderProps {
  dateRange: DateRange | undefined;
  campaign: string;
  campaignsList: Campaign[];
  onDateRangeChange: (range: DateRange | undefined) => void;
  onCampaignChange: (value: string) => void;
  onExport: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  dateRange,
  campaign,
  campaignsList,
  onDateRangeChange,
  onCampaignChange,
  onExport
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h3 className="text-lg font-medium">Email Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Track email performance and engagement metrics
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <DateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          align="end"
        />
        <Select value={campaign} onValueChange={onCampaignChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Campaigns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaignsList && campaignsList.length > 0 ? (
              campaignsList.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>No campaigns available</SelectItem>
            )}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};
