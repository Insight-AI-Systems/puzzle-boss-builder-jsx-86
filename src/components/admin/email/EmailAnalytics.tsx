
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { useEmailAnalytics } from "@/hooks/admin/useEmailAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

import { AnalyticsHeader } from "./analytics/AnalyticsHeader";
import { StatsCards } from "./analytics/StatsCards";
import { EngagementTab } from "./analytics/EngagementTab";
import { ClicksTab } from "./analytics/ClicksTab";
import { DevicesTab } from "./analytics/DevicesTab";

export const EmailAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [campaign, setCampaign] = useState<string>("all");
  
  const {
    deliveryStats,
    engagementStats,
    clickRates,
    campaignsList,
    isLoading,
    error,
    exportData,
    refetch
  } = useEmailAnalytics(dateRange, campaign);

  // Loading state
  if (isLoading) {
    return <EmailAnalyticsLoadingState />;
  }
  
  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error loading email analytics</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "An unknown error occurred while loading analytics data"}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button 
            variant="outline"
            onClick={() => refetch()}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry Loading Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnalyticsHeader 
        dateRange={dateRange}
        campaign={campaign}
        campaignsList={campaignsList}
        onDateRangeChange={setDateRange}
        onCampaignChange={setCampaign}
        onExport={exportData}
      />
      
      <StatsCards deliveryStats={deliveryStats} />

      <Tabs defaultValue="engagement" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="clicks">Click Analytics</TabsTrigger>
          <TabsTrigger value="devices">Devices & Platforms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="engagement">
          <EngagementTab engagementStats={engagementStats} />
        </TabsContent>
        
        <TabsContent value="clicks">
          <ClicksTab clickRates={clickRates} />
        </TabsContent>
        
        <TabsContent value="devices">
          <DevicesTab deliveryStats={deliveryStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmailAnalyticsLoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Email Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Loading analytics data...
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[100px] w-full" />
        ))}
      </div>
      
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
};
