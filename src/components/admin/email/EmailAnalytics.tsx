
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { useEmailAnalytics } from "@/hooks/admin/useEmailAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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
    exportData
  } = useEmailAnalytics(dateRange, campaign);
  
  const handleExportData = () => {
    exportData();
  };

  // Loading state
  if (isLoading) {
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
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-4 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-[150px]" />
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
      </div>
    );
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            onChange={setDateRange}
            align="end"
          />
          <Select value={campaign} onValueChange={setCampaign}>
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
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{deliveryStats.delivery_rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {deliveryStats.delivered} delivered out of {deliveryStats.sent} sent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{deliveryStats.open_rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {deliveryStats.opened} opened out of {deliveryStats.delivered} delivered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{deliveryStats.click_rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {deliveryStats.clicked} clicks out of {deliveryStats.opened} opened
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="engagement" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="clicks">Click Analytics</TabsTrigger>
          <TabsTrigger value="devices">Devices & Platforms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Email Engagement Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {engagementStats && engagementStats.length > 0 ? (
                <LineChart
                  data={engagementStats}
                  xAxis="date"
                  series={['sent', 'opened', 'clicked']}
                  colors={['#94a3b8', '#0ea5e9', '#10b981']}
                  height={300}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <p className="text-muted-foreground mb-2">No engagement data available for this period</p>
                  <p className="text-sm text-muted-foreground">
                    Try selecting a different date range or campaign
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clicks">
          <Card>
            <CardHeader>
              <CardTitle>Link Click Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {clickRates && clickRates.length > 0 ? (
                <BarChart
                  data={clickRates}
                  xAxis="link"
                  yAxis="clicks"
                  height={300}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <p className="text-muted-foreground mb-2">No click data available for this period</p>
                  <p className="text-sm text-muted-foreground">
                    Try selecting a different date range or campaign
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Email Client Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-[300px] h-[300px]">
                {deliveryStats.mobile_pct > 0 || deliveryStats.desktop_pct > 0 ? (
                  <PieChart 
                    data={[
                      { name: "Mobile", value: deliveryStats.mobile_pct },
                      { name: "Desktop", value: deliveryStats.desktop_pct },
                      { name: "Webmail", value: deliveryStats.webmail_pct },
                      { name: "Other", value: deliveryStats.other_pct }
                    ]}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-muted-foreground mb-2">No device data available</p>
                    <p className="text-sm text-muted-foreground">
                      Device information will appear here once emails are sent and tracked
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
